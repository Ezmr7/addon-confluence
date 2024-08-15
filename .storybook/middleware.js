// This file is not part of addon-conflunce. Its purpose for efficient development and testing. Finished and tested code should be added to src/index.ts.
// middleware.js is the necessary file name for accessing the backend of Storybook, which gives the ability to proxy requests and avoid CORS blocking

const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const CONFLUENCE_AUTHORIZATION = Buffer.from(
  `${process.env.CONFLUENCE_EMAIL}:${process.env.CONFLUENCE_TOKEN}`,
).toString("base64");

const fetchPage = async (auth, url) => {
  
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

const getConfluencePage = async (req, res, next) => {

  try {

    const { id, domain } = req.query;
    const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`;

    const response = await fetchPage(CONFLUENCE_AUTHORIZATION, url);
    const data = await response.json();

    res.locals.page = data.body.view.value || "<p>No content found.</p>"

    next();

  } 
  
  catch (error) {

    console.error("Error: In getConfluencePage middleware", error);
    
    res.locals.page = "<p>No Confluence page found. Ensure parameters are input correctly.</p>";

    next();
  }
};

module.exports = function expressMiddleware(router) {
  router.get("/confluence", getConfluencePage, (req, res) => {
    res.status(200).json(res.locals.page);
  });
};

module.exports.getConfluencePage = getConfluencePage;
