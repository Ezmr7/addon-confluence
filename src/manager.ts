import { addons, types } from "@storybook/manager-api";
import { ADDON_ID, TOOL_ID, PANEL_ID, TAB_ID } from "./constants";
import { Panel } from "./Panel";

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

  // Register the panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Confluence",
    match: ({ viewMode }) => viewMode === "story",
    render: Panel,
  });
