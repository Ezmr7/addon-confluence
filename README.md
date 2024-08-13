# Storybook Addon confluence-addon
An addon to implement Confluence documentation in Storybook.

## Getting started

### 1. Install

```sh
npm install -D addon-confluence

yarn add -D addon-confluence

pnpm add -D addon-confluence
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
CONFLUENCE_TOKEN = YourTokenHere
```

### 4. Add a middleware.js file to your .storybook folder, and copy this code to it.

#### The file name must be "middleware.js". This is an undocumented method for injecting routes into the Storybook Express.js server. This step is necessary to prevent CORS issues due to the browser trying to access different origins from local host.

```middleware.js
// middleware.js is the necessary file name for accessing the backend of Storybook, which gives the ability to proxy requests and avoid CORS blocking.

require("dotenv").config();

const CONFLUENCE_AUTHORIZATION = btoa(process.env.CONFLUENCE_EMAIL + ":" + process.env.CONFLUENCE_TOKEN);

const fetchPage = async (auth, url) => {
    const results = await fetch(url, {method: "GET", headers: {"Access-Control-Allow-Origin": "*", "Authorization": `Basic ${auth}`, "Content-Type": "application/json"}, mode: "cors"});
    return results;
  }
  
const getConfluencePage = async (req, res, next) => {
    try{
        const {id, domain} = req.query;
        const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`
        const response = await fetchPage(CONFLUENCE_AUTHORIZATION, url);
        const data = await response.json();
        res.locals.page = data.body.view.value;
        return next();
    } catch (error) {
        // console.log('Error: In getConfluencePage middleware', error);
        res.locals.page = "<p>No Confluence page found.</p>"
        return next();
    }
  }

module.exports = function expressMiddleware(router) {
	router.get("/confluence", getConfluencePage, (req, res) => {
        return res.status(200).json(res.locals.page);
    });
};
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
