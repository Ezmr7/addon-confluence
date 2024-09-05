import { Request, Response, NextFunction } from "express";
require("dotenv").config();

const CONFLUENCE_AUTHORIZATION = Buffer.from(
  `${process.env.CONFLUENCE_EMAIL}:${process.env.CONFLUENCE_TOKEN}`,
).toString("base64");

const fetchPage = async (auth: string, url: string) => {

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.statusText}`);
  }

  return response;

};

const getConfluencePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {

  try {

    // Missing authorization handling.
    if (!process.env.CONFLUENCE_EMAIL || !process.env.CONFLUENCE_TOKEN){
      console.error("addon-confluence Error: Missing authorization.")
      res.locals.page = "<p>Error: Missing authorization. Ensure you are using a valid email and token.</p>"

      return next();
    }

    const { id, domain } = req.query;
    const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`;

    const response = await fetchPage(CONFLUENCE_AUTHORIZATION, url);
    const data = await response.json();

    res.locals.page = data.body.view.value || "<p>No content found.</p>"

    next();

  } 
  
  catch (error) {

    console.error("Error: In getConfluencePage middleware", error);
    res.locals.page = "<p>No Confluence page found. Ensure parameters are correct.</p>";

    next();

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