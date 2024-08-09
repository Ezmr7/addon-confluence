# Storybook Addon confluence-addon
An addon to implement Confluence documentation in Storybook.

## Getting started

### 1. Install

```sh
npm install -D @storybook/addon-confluence

yarn add -D @storybook/addon-confluence

pnpm add -D @storybook/addon-confluence
```

### 2. Register the addon in `main.js`

```js
export default {
  addons: ["@storybook/addon-confluence"],
};
```
### 3. Create a token for Confluence!

#### Go to this [link](https://id.atlassian.com/manage-profile/security/api-tokens) and create an API Token for your account. Then add it along with the email for your account to a .env file as so.

```env
CONFLUENCE_EMAIL = youremail@example.com
CONFLUENCE_TOKEN = yOuRtOkEnHeRe
```

### 4. Add it to a story!

```js
export default {
  title: "My stories",
  component: Button,
};

export const myStory = {
  parameters: {
    confluence: {
      id: 12345,
      domain: "your-username",
    },
  },
};
```