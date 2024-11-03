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

    const { id } = page;

    if (!id) {
      setData("<p>Missing Confluence id in story config.</p>");
      return;
    }

    const loadContent = async () => {
      try {
        const fetchUrl = `/confluence-pages/${id}.json`;

        const response = await fetch(fetchUrl);
        if (!response.ok) {
          console.error(`Failed to fetch ${fetchUrl}: ${response.statusText}`);
          setData("<p>Content not found.</p>");
          return;
        }
        const json: IConfluencePage = await response.json();
        setData(`
          <style>
            .confluence-embedded-image.image-center {
              max-width: 100%;
              height: auto;
            }
            a {
              color: #2575ED;
            }
            .pageFrame-content {
              padding: 16px;
            }
          </style>
          <div style="color: inherit; background-color: inherit; font-size: 125%; padding: 16px;" class="confluence-embedded-image image-center">
            ${json.content}
          </div>
        `);
      } catch (error) {
        console.error("Error loading content:", error);
        setData("<p>Error loading content.</p>");
      }
    };

    loadContent();
  }, [page]);

  return (
    <div
      id="pageFrame"
      className="pageFrame-content"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
};
