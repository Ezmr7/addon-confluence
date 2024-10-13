import React, { useEffect, useState } from "react";
import { useParameter } from "@storybook/manager-api";

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
        // Adjust the path based on the location of PanelContent.tsx
        const contentModule = await import(
          `../../../confluence-pages/${domain}/${id}.json`
        );
        const content = contentModule.default.content;
        setData(content);
      } catch (error) {
        console.error("Error loading content:", error);
        setData("<p>Error loading content.</p>");
      }
    };

    loadContent();
  }, [page]);

  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};
