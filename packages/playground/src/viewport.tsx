import React from "react";

export const Viewport = React.createContext<HTMLDivElement>(
  document.createElement("div")
);

// temporary variable - ideally this is computed
export const VISIBLE_WIDTH = 600;
