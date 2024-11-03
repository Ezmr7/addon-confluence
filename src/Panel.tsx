import React from "react";
import { useChannel } from "@storybook/manager-api";
import { AddonPanel } from "@storybook/components";
import { PanelContent } from "./components/PanelContent";
interface IPanelProps {
  active: boolean;
}

export const Panel: React.FC<IPanelProps> = (props) => {
  // https://storybook.js.org/docs/react/addons/addons-api#useaddonstate
  if (!props.active) {
    return null;
  }
  // https://storybook.js.org/docs/react/addons/addons-api#usechannel

  return (
    <AddonPanel {...props}>
      <PanelContent />
    </AddonPanel>
  );
};
