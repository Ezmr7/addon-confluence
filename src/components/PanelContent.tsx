import React, { useEffect, useState } from "react";
import { useParameter } from "@storybook/manager-api"
import { styled } from "@storybook/theming";
import { Button } from "@storybook/components";

export const RequestDataButton = styled(Button)({
  marginTop: "1rem",
});


/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/code/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent = ({}) => {
  
  const [data, setData]= useState("<p style=\"color: white; font-size: 125%;\">Loading...</p>")

  const page = useParameter('confluence', {id: '0', domain: 'none'});

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`/confluence?id=${page.id}&domain=${page.domain}`);
      setData("<div style=\"color: white; font-size: 125%;\">" + await response.json() + "</div>");
      console.log(typeof data);
    }
    getData();
  }, [page])

  return (
    <div id="pageFrame">
      <iframe id="iframe" loading="lazy" height="100%" width="100%" frameBorder="0"style={{overflow:"hidden", height:"1000px", width:"100%"}} srcDoc={data} title="Confluence Docs"></iframe>
    </div>
  );
}
