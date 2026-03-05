# Deploying to GitHub Pages

To deploy this Next.js application to GitHub Pages, follow these steps. GitHub Pages is a great way to host static sites for free.

## Prerequisites

1.  A GitHub account.
2.  Git installed on your local machine.
3.  Node.js and npm installed.

## Step 1: Update `next.config.ts`

GitHub Pages requires a static export. You also need to set a `basePath` if your site is hosted at `username.github.io/repo-name`.

1.  Open `next.config.ts`.
2.  Change `output: 'standalone'` to `output: 'export'`.
3.  Add `basePath` and `assetPrefix` if you are not using a custom domain.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/your-repo-name', // Replace with your repository name
  images: {
    unoptimized: true, // Required for static export
  },
  // ... other config
};
```

## Step 2: Push to GitHub

1.  Create a new repository on GitHub.
2.  Initialize git in your project folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
3.  Add the remote and push:
    ```bash
    git remote add origin https://github.com/your-username/your-repo-name.git
    git branch -M main
    git push -u origin main
    ```

## Step 3: Configure GitHub Actions

The easiest way to deploy is using GitHub Actions.

1.  In your GitHub repository, go to **Settings** > **Pages**.
2.  Under **Build and deployment** > **Source**, select **GitHub Actions**.
3.  GitHub will suggest a "Next.js" workflow. Click **Configure**.
4.  Review the `.github/workflows/nextjs.yml` file and click **Commit changes**.

GitHub will now automatically build and deploy your site every time you push to the `main` branch.

## Important Notes

### Geolocation
GitHub Pages serves sites over HTTPS, so the **Current Location** feature will work. However, users must grant permission in their browser.

### Client-Side Routing
Since this is a Single Page Application (SPA) with static export, if you add more pages later, you might need to handle 404s on refresh by using a `404.html` hack or switching to a HashRouter (though Next.js App Router handles most things via client-side transitions).

### Images
The Next.js `<Image>` component requires `unoptimized: true` in `next.config.ts` for static exports unless you use a third-party image optimization service.
