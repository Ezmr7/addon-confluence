import React, { useEffect, useState } from "react";
import { useParameter } from "@storybook/manager-api";

interface IConfluencePage {
  content: string;
}

export const PanelContent = () => {
  const [data, setData] = useState("<p>Loading...</p>");
  const page = useParameter("confluence", null);

  useEffect(() => {
    if (!page) {
      setData("<p>No Confluence page specified.</p>");
      return;
    }

    const { id, domain } = page;

    if (!id || !domain) {
      setData("<p>Missing Confluence id or domain.</p>");
      return;
    }

    const loadContent = async () => {
      try {
        // Use import.meta.glob to import all JSON files under confluence-pages
        const modules = import.meta.glob("@confluence-pages/**/*.json");

        // Construct the relative path
        const path = `/confluence-pages/${domain}/${id}.json`;

        if (modules[path]) {
          // Import the specific module
          const contentModule = await modules[path]();
          // @ts-ignore
          const content = contentModule.content;
          setData(content);
        } else {
          setData("<p>Content not found.</p>");
        }
      } catch (error) {
        console.error("Error loading content:", error);
        setData("<p>Error loading content.</p>");
      }
    };

    loadContent();
  }, [page]);

  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};
