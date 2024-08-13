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
        if (res) {
          res.locals.page = data.body.view.value;
          return next();
        }
    } catch (error) {
        console.log('Error: In getConfluencePage middleware', error);
        if (res.locals) {
          res.locals.page = "<p>No Confluence page found.</p>"
          return next();
        }
    }
  }

module.exports = function expressMiddleware(router) {
	router.get("/confluence", getConfluencePage, (req, res) => {
        return res.status(200).json(res.locals.page);
    });
};

module.exports = getConfluencePage