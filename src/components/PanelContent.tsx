import React, { useEffect, useState } from "react";
import { useParameter } from "@storybook/manager-api";

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/code/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent = ({}) => {
  const [data, setData] = useState(
    '<p style="color: white; font-size: 125%;">Loading...</p>',
  );

  const page = useParameter("confluence", { id: null, domain: null });

  useEffect(() => {

    if (!page.id || !page.domain) {
      setData(
        '<div style="color: white; font-size: 125%;"><p>Missing Confluence id or domain parameters. Please refer to the <a href="https://storybook.js.org/addons/addon-confluence">documentation</a>.</p></div>'
      )
      return;
    }

    const getData = async () => {
      const response = await fetch(
        `/confluence?id=${page.id}&domain=${page.domain}`,
      );

      setData(
        '<div style="color: white; font-size: 125%;">' +
          (await response.json()) +
          '</div>',
      );
    };

    getData();

  }, [page.id, page.domain]);

  return <div id="pageFrame" dangerouslySetInnerHTML={{ __html: data }}></div>;
};

// Old method for displaying addon data -> <iframe id="iframe" loading="lazy" height="100vh" width="100%" frameBorder="0"style={{overflow:"hidden", height:"100vh", width:"100%"}} srcDoc={data} title="Confluence Docs"></iframe>
