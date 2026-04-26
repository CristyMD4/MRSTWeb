import React from "react";

export function Icon({ name, className = "w-5 h-5" }) {
  switch (name) {
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2z" />
          <path d="M5 14l.7 3L9 18l-3.3 1-.7 3-.7-3L1.9 18l3.4-1 .7-3z" />
        </svg>
      );
    case "drop":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
        </svg>
      );
    case "wand":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21l9-9" />
          <path d="M14 2l8 8" />
          <path d="M8 6l2 2" />
          <path d="M16 10l2 2" />
          <path d="M10 4l1-1" />
          <path d="M20 14l1-1" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l8 4v6c0 6-3.5 9.5-8 10-4.5-.5-8-4-8-10V6l8-4z" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M8.5 14.5 7 22l5-3 5 3-1.5-7.5" />
        </svg>
      );
    case "thumb":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 10V5a3 3 0 0 0-6 0v5" />
          <path d="M7 10h12l-1 10H8L7 10z" />
          <path d="M5 10v10H3V10h2z" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2.1z" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v16H4z" />
          <path d="M22 6 12 13 2 6" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 22c1.5-5 6-8 8-8s6.5 3 8 8" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5h18v16H3z" />
          <path d="M7 3v4M17 3v4M3 9h18" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      );
    default:
      return null;
  }
}
