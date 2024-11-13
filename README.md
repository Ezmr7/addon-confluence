# Storybook Addon confluence-addon

An addon to implement Confluence documentation in Storybook.

## Getting started

## 1. Install

```sh
npm install -D addon-confluence

yarn add -D addon-confluence

pnpm add -D addon-confluence
```

## 2. Register the addon in `.storybook/main.js"

```js
export default {
  addons: ["addon-confluence"],
};
```

## 3. Create a token for Confluence!

#### Go to this [link](https://id.atlassian.com/manage-profile/security/api-tokens) and create an API Token for your account. Then add it along with the email for your account to a .env file as so.

```env
STORYBOOK_CONFLUENCE_EMAIL=youremail@example.com
STORYBOOK_CONFLUENCE_TOKEN=YourTokenHere!
```

## 4. Add a confluence ID to your story!

#### Next, we need add a page id to the story. You can find this within the url while viewing the desired Confluence page. We only need the `id` for this step but we will need `your_domain` for the next step.

#### For example: https://**_<your_domain>_**.atlassian.net/wiki//pages/**_<your_page_id>_**/Example_Page_Name

Then simply add "confluence" as an object to your story. And then add the `id` as its property:

```js
export default {
  title: "My stories",
  component: Button,
};

export const myStory = {
  parameters: {
    confluence: {
      id: 12345678,
    },
  },
};
```

## 5. Add a confluence.js file to your .storybook directory.

#### The file name must be "confluence.js". This will be the target for the script that fetches the documentation at build time. The default export must be an array of objects with `domain` and `id` keys.

```js
const domain = "your-domain";

const confluence = [
  // Add your (domain, id) pairs here
  { domain: domain, id: "4166582285" },
  { domain: domain, id: "4166844417" },
  { domain: "different-domain", id: "4166844418" },
];
// This can be named anything but it must be a default export of an array of objects with `domain` and `id` keys.
export default confluence;
```

## 6. Add Scripts to package.json

#### To ensure that the fetchDocs script runs automatically before building Storybook, you need to update your project’s package.json by adding the prestorybook:build script and ensuring that cross-env is installed. Follow these steps:

### Open your project’s package.json file and add the following scripts under the "scripts" section:

```js
{
  "scripts": {
    // ... other scripts
   "prebuild-storybook": "fetchDocs", .// Add this line
    "storybook:build": "cross-env NODE_OPTIONS=--openssl-legacy-provider storybook build",
    // ... other scripts
  }
}
```

### If you have a different build script, prerfix `pre` to your build script. and set the value to `fetchDocs` as shown above.

## 7. Configure Storybook to Serve Static Files

### To ensure that the Confluence documentation is accessible to your Storybook application, you need to configure Storybook to serve the public directory where the fetched documentation is stored.

### Add the staticDirs configuration to your .storybook/main.js file:

```js
// .storybook/main.js

module.exports = {
  // ... other Storybook configurations
  addons: ["addon-confluence"],
  staticDirs: ["public"], // Add this line to serve the 'public' directory
};
```

## 8. Injecting Environment Variables in GitHub Actions

Start by adding a new secret to your GitHub repository. Navigate to your repository on GitHub, click on the "Settings" tab, and then click on "Secrets" in the left-hand sidebar. Click on the "New repository secret" button, and add the following secrets:

- `STORYBOOK_CONFLUENCE_EMAIL`: The email address associated with your Confluence account.
- `STORYBOOK_CONFLUENCE_TOKEN`: The API token generated for your Confluence account.

If you are using Chromatic for deployment and need to inject environment variables into your hosted Storybook, update your .github/workflows/chromatic.yml file as follows:

```yml
.github/workflows/chromatic.yml
jobs:
  chromatic:
    steps:
      # ... other steps

      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
        env:
          # 👇 Sets the environment variable
          STORYBOOK_CONFLUENCE_EMAIL: ${{ secrets.STORYBOOK_CONFLUENCE_EMAIL }}
          STORYBOOK_CONFLUENCE_TOKEN: ${{ secrets.STORYBOOK_CONFLUENCE_TOKEN }}
```

By adding this configuration, your Storybook environment variables will be correctly injected during the Chromatic deployment process.

![Example Image - Storybook - Confluence-addon](https://github.com/user-attachments/assets/b261b398-4eee-4b1b-8cb9-6713109fe116)
