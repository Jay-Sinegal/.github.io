name: Deploy Astro Site to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Detect Package Manager
        id: detect-package-manager
        run: |
          if [ -f "${{ github.workspace }}/pnpm-lock.yaml" ]; then
            echo "manager=pnpm" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=pnpm" >> $GITHUB_OUTPUT
          elif [ -f "${{ github.workspace }}/yarn.lock" ]; then
            echo "manager=yarn" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=yarn" >> $GITHUB_OUTPUT
          elif [ -f "${{ github.workspace }}/bun.lockb" ] || [ -f "${{ github.workspace }}/bun.lock" ]; then
            echo "manager=bun" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=bun" >> $GITHUB_OUTPUT
          elif [ -f "${{ github.workspace }}/package.json" ]; then
            echo "manager=npm" >> $GITHUB_OUTPUT
            echo "command=ci" >> $GITHUB_OUTPUT
            echo "runner=npx --no-install" >> $GITHUB_OUTPUT
          else
            echo "Unable to determine package manager"
            exit 1
          fi

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: ${{ steps.detect-package-manager.outputs.manager != 'bun' && steps.detect-package-manager.outputs.manager || '' }}

      - name: Setup Bun
        if: steps.detect-package-manager.outputs.manager == 'bun'
        uses: oven-sh/setup-bun@v2

      - name: Setup pnpm
        if: steps.detect-package-manager.outputs.manager == 'pnpm'
        uses: pnpm/action-setup@v3

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install Dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}

      - name: Build with Astro
        run: ${{ steps.detect-package-manager.outputs.runner }} astro build --site "${{ steps.pages.outputs.origin }}" --base "${{ steps.pages.outputs.base_path }}"

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
