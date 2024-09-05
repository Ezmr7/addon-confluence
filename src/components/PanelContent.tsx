import React, { useEffect, useState } from "react";
import { IConfluencePageInfo } from "src/config";
import { useParameter } from "@storybook/manager-api";

export const PanelContent = ({
  id = null,
  domain = null,
}: IConfluencePageInfo) => {
  const [data, setData] = useState(
    '<p style="color: inherit; font-size: 125%;">Loading...</p>',
  );
  const page = useParameter("confluence", { id: id, domain: domain });

  useEffect(() => {
    if (!page) return null;
    const loadPageData = async () => {
      if (!page.id || !page.domain) {
        setData(
          '<div style="color: inherit; font-size: 125%;"><p>Missing Confluence id or domain parameters. Please refer to the <a href="https://storybook.js.org/addons/addon-confluence">documentation</a>.</p></div>',
        );
        return;
      }

      try {
        const response = await fetch(
          `/confluence?id=${page.id}&domain=${page.domain}`,
        );
        const content = await response.json();
        setData(`
          <style>
            .confluence-embedded-image.image-center {
              max-width: 100%;
              height: auto;
            }
            a {
              color: #2575ed;
            }
            .pageFrame-content {
              padding: 16px;
            }
          </style>
          <div style="color: inherit; background-color: inherit; font-size: 125%; padding: 16px;" class="confluence-embedded-image image-center">
            ${content}
          </div>
        `);
      } catch (error) {
        setData(
          '<p style="color: red; font-size: 125%;">Failed to load content.</p>',
        );
      }
    };

    loadPageData();
  }, [page?.id, page?.domain]);

  return (
    <div
      id="pageFrame"
      className="pageFrame-content"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
};
