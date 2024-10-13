// fetchDocs.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const pages = [
    // Add your (domain, id) pairs here
    { domain: "thetower", id: "4166582285" },
    // Add more entries as needed
  ];

  for (const { domain, id } of pages) {
    try {
      const content = await fetchPageContent(domain, id);
      const dir = path.join(__dirname, "..", "confluence-pages", domain);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, `${id}.json`),
        JSON.stringify({ content }),
      );
      console.log(`Fetched and saved page ${id} from domain ${domain}`);
    } catch (error) {
      console.error(`Error fetching page ${id} from domain ${domain}:`, error);
    }
  }
};

main();
