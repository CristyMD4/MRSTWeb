import React from "react";
import { Outlet } from "react-router-dom";

export default function ClientRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
