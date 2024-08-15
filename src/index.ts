import { Request, Response, NextFunction } from "express";
require("dotenv").config();

const CONFLUENCE_AUTHORIZATION = btoa(
  process.env.CONFLUENCE_EMAIL + ":" + process.env.CONFLUENCE_TOKEN,
);

const fetchPage = async (auth: string, url: string) => {
  const results = await fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  return results;
};

const getConfluencePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, domain } = req.query;
    const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`;
    const response = await fetchPage(CONFLUENCE_AUTHORIZATION, url);
    const data = await response.json();
    if (res) {
      res.locals.page = data.body.view.value;
      return next();
    }
  } catch (error) {
    console.error("Error: In getConfluencePage middleware", error);
    if (res) {
      res.locals.page = "<p>No Confluence page found.</p>";
    }
    return next();
  }
};

const confluenceMiddleware = (router: any): void => {
  router.get(
    "/confluence",
    getConfluencePage,
    (req: Request, res: Response) => {
      return res.status(200).json(res.locals.page);
    },
  );
};

export default confluenceMiddleware;
