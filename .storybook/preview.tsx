import type { Preview } from "@storybook/react";
import { DocsContainer } from "@storybook/addon-docs";
import * as React from "react";
import { PanelContent } from "../src/components/PanelContent";
import { useParameter } from "@storybook/manager-api";

const CustomDocsContainer: React.FC<any> = ({ children, ...rest }) => {
  console.log(
    "CustomDocsContainer",
    rest.context?.componentStoriesValue[0]?.parameters?.confluence,
  );
  const page = useParameter("confluence", { id: null, domain: null });
  return (
    <React.Fragment>
      <DocsContainer {...rest}>{children}</DocsContainer>
      <div style={{ marginTop: "20px" }}>
        {rest.context &&
          rest.context?.componentStoriesValue[0]?.parameters?.confluence && (
            <PanelContent /> // Render only if confluence parameters are present
          )}
      </div>
    </React.Fragment>
  );
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      container: CustomDocsContainer,
    },
  },
};

export default preview;
