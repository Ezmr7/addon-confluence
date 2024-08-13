// make it work with --isolatedModules
require("dotenv").config();

const CONFLUENCE_AUTHORIZATION = btoa(process.env.CONFLUENCE_EMAIL + ":" + process.env.CONFLUENCE_TOKEN);

const fetchPage = async (auth:string, url:string) => {
    const results = await fetch(url, {method: "GET", headers: {"Access-Control-Allow-Origin": "*", "Authorization": `Basic ${auth}`, "Content-Type": "application/json"}, mode: "cors"});
    return results;
  }
  
const getConfluencePage = async (req:any, res:any, next:any) => {
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
        // console.log('Error: In getConfluencePage middleware', error);
        if (res) {
            res.locals.page = "<p>No Confluence page found.</p>"
        }
        return next();
    }
  }

export const confluenceMiddleware = (router:any) => {
    router.get("/confluence", getConfluencePage, (req:any, res:any) => {
        return res.status(200).json(res.locals.page);
    });
};
