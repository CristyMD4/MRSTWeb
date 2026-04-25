import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminLogin() {
  return <Navigate to="/login?role=admin" replace />;
}
