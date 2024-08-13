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
CONFLUENCE_EMAIL = youremail@example.com
CONFLUENCE_TOKEN = YourTokenHere
```

### 4. Add a middleware.js file to your .storybook folder, and copy this code to it

#### The file name must be "middleware.js". This is an undocumented method for injecting routes into the Storybook Express.js server. This step is necessary to prevent CORS issues due to the browser trying to access different origins from local host. Ensure the file name is correct, or else Storybook will not recognize it.

```js
module.exports = require("addon-confluence");
```

### 5. Add it to a story!

####  Now, the only needed information is the unique domain name and the numeric page id. You can find these within the url while viewing the desired Confluence page.
#### For example: https://***<YOUR_DOMAIN>***.atlassian.net/wiki//pages/***<YOUR_PAGE_ID>***/Example_Page_Name
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
      domain: "your-username",
    },
  },
};
```
