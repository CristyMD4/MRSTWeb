import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getClientSession } from "../lib/clientAuth";

export default function ClientRoute() {
  const session = getClientSession();

  if (!session?.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}