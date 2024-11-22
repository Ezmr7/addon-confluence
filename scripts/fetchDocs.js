#!/usr/bin/env node

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const CONFLUENCE_AUTHORIZATION = Buffer.from(
  `${process.env.STORYBOOK_CONFLUENCE_EMAIL}:${process.env.STORYBOOK_CONFLUENCE_TOKEN}`,
).toString("base64");

const fetchPageMetadata = async (domain, id) => {
  const url = `https://${domain}.atlassian.net/wiki/api/v2/pages/${id}?body-format=view`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${CONFLUENCE_AUTHORIZATION}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch metadata for page ${id}: ${response.statusText}`,
    );
  }

  const data = await response.json();
  return {
    createdAt: data?.version?.createdAt,
    body: data.body?.view?.value || "<p>No content found.</p>",
  };
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

    try {
      const { createdAt, body } = await fetchPageMetadata(domain, id);

      let shouldFetch = false;
      let storedData = {};

      if (fs.existsSync(outputFilePath)) {
        try {
          const fileContent = fs.readFileSync(outputFilePath, "utf-8");
          storedData = JSON.parse(fileContent);
          const storedCreatedAt = storedData.createdAt;

          if (
            !storedCreatedAt ||
            new Date(createdAt) > new Date(storedCreatedAt)
          ) {
            shouldFetch = true;
            console.info(`Page ${id} has been updated. Fetching new content.`);
          } else {
            console.info(`Page ${id} is up-to-date. Skipping fetch.`);
          }
        } catch (readError) {
          console.warn(
            `Failed to read or parse ${outputFilePath}. Refetching page ${id}.`,
          );
          shouldFetch = true;
        }
      } else {
        shouldFetch = true;
        console.info(`Page ${id} does not exist locally. Fetching content.`);
      }

      if (shouldFetch) {
        // If the page needs to be fetched (new or updated)
        fs.mkdirSync(outputDir, { recursive: true });
        const dataToStore = {
          createdAt,
          content: body,
        };
        fs.writeFileSync(outputFilePath, JSON.stringify(dataToStore, null, 2));
        console.info(`Fetched and saved page ${id} from domain ${domain}`);
      }
    } catch (error) {
      console.error(
        `Error processing page ${id} from domain ${domain}:`,
        error,
      );
    }
  }
};

main();
