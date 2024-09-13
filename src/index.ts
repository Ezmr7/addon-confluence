import { Request, Response, NextFunction } from "express";
require("dotenv").config();

const CONFLUENCE_AUTHORIZATION = Buffer.from(
  `${process.env.STORYBOOK_CONFLUENCE_EMAIL}:${process.env.STORYBOOK_CONFLUENCE_TOKEN}`,
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
    const CONFLUENCE_EMAIL =
      process.env.STORYBOOK_CONFLUENCE_EMAIL || process.env.CONFLUENCE_EMAIL;

    const CONFLUENCE_TOKEN =
      process.env.STORYBOOK_CONFLUENCE_TOKEN || process.env.CONFLUENCE_TOKEN;

    // Missing authorization handling
    if (!CONFLUENCE_EMAIL || !CONFLUENCE_TOKEN) {
      res.locals.page =
        !CONFLUENCE_EMAIL && !CONFLUENCE_TOKEN
          ? `<p>Error: Missing or invalid email and token. Ensure you are using valid credentials.</p>`
          : !CONFLUENCE_EMAIL
            ? `<p>Error: Missing or invalid confluence email. Ensure you are using a valid email.</p>`
            : `<p>Error: Missing or invalid confluence token. Ensure you are using a valid API token.</p>`;
      return next();
    }

    const { id, domain } = req.query;
    const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`;

    const response = await fetchPage(CONFLUENCE_AUTHORIZATION, url);
    const data = await response.json();

    res.locals.page = data.body?.view?.value || "<p>No content found.</p>";

    next();
  } catch (error) {
    console.error("Error: In getConfluencePage middleware", error);
    res.locals.page =
      "<p>No Confluence page found. Ensure parameters are correct.</p>";

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
