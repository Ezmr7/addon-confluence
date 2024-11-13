#!/usr/bin/env node

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const CONFLUENCE_AUTHORIZATION = Buffer.from(
  `${process.env.STORYBOOK_CONFLUENCE_EMAIL}:${process.env.STORYBOOK_CONFLUENCE_TOKEN}`,
).toString("base64");

const fetchPageContent = async (domain, id) => {
  const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${CONFLUENCE_AUTHORIZATION}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${id}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.body?.view?.value || "<p>No content found.</p>";
};

const main = async () => {
  // Resolve the path to your project's confluence.js file
  const confluenceConfigPath = path.join(
    process.cwd(),
    ".storybook",
    "confluence.js",
  );
  let pages;

  try {
    // Use dynamic import to load the configuration
    const configModule = await import(`file://${confluenceConfigPath}`);

    // Access the default export or the module exports
    pages = configModule.default || configModule;
  } catch (error) {
    console.error(
      `Error loading confluence configuration from ${confluenceConfigPath}:`,
      error,
    );
    process.exit(1);
  }

  for (const { domain, id } of pages) {
    const outputDir = path.join(
      process.cwd(),
      ".storybook",
      "public",
      "confluence-pages",
    );
    const outputFilePath = path.join(outputDir, `${id}.json`);

    // Check if the JSON file already exists
    if (fs.existsSync(outputFilePath)) {
      console.log(
        `Documentation for page ${id} already exists. Skipping fetch.`,
      );
      continue; // Skip fetching this page
    }

    try {
      const content = await fetchPageContent(domain, id);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputFilePath, JSON.stringify({ content }, null, 2));
      console.log(`Fetched and saved page ${id} from domain ${domain}`);
    } catch (error) {
      console.error(`Error fetching page ${id} from domain ${domain}:`, error);
    }
  }
};

main();
