import React from "react";
import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
