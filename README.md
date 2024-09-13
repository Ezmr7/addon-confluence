# Storybook Addon confluence-addon

An addon to implement Confluence documentation in Storybook.

## Getting started

### 1. Install

```sh
npm install -D addon-confluence

yarn add -D addon-confluence

pnpm add -D addon-confluence
```

### 2. Register the addon in `.storybook/main.js"

```js
export default {
  addons: ["addon-confluence"],
};
```

### 3. Create a token for Confluence!

#### Go to this [link](https://id.atlassian.com/manage-profile/security/api-tokens) and create an API Token for your account. Then add it along with the email for your account to a .env file as so.

```env
STORYBOOK_CONFLUENCE_EMAIL=youremail@example.com
STORYBOOK_CONFLUENCE_TOKEN=YourTokenHere!
```

### 4. Add a middleware.js file to your .storybook folder, and copy this code to it

#### The file name must be "middleware.js". This is an undocumented method for injecting routes into the Storybook Express.js server. This step is necessary to prevent CORS issues due to the browser trying to access different origins from local host. Ensure the file name is correct, or else Storybook will not recognize it.

```js
module.exports = require("addon-confluence");
```

### 5. Set Default Domain Globally (Optional)

### You can set the default Confluence domain at the top level in your preview.(js|ts) file, so you don’t need to specify it for every story. You can still override it at the story level if needed.

```js
const preview: Preview = {
  parameters: {
    confluence: {
      domain: "your-domain",
    },
    backgrounds: {
      default: "light",
    },
  },
};

export default preview;
```

### 6. Add it to a story!

#### Now, the only needed information is the unique domain name and the numeric page id. You can find these within the url while viewing the desired Confluence page.

#### For example: https://**_<YOUR_DOMAIN>_**.atlassian.net/wiki//pages/**_<YOUR_PAGE_ID>_**/Example_Page_Name

Then simply add "confluence" as an object to your story. And then add the domain and id as its properties:

```js
export default {
  title: "My stories",
  component: Button,
};

export const myStory = {
  parameters: {
    confluence: {
      id: 12345,
      domain: "your-domain", // Optional if set globally
    },
  },
};
```

### 7. Injecting Environment Variables in GitHub Actions

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
