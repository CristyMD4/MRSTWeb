import React from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "ro", label: "RO" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const value = (i18n.language || "en").split("-")[0];

  const onChange = (e) => {
    const next = e.target.value;
    i18n.changeLanguage(next);
    localStorage.setItem("sw_lang", next);
  };

  return (
    <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 transition hover:bg-slate-200">
      <select
        value={value}
        onChange={onChange}
        className="
          rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm
          outline-none ring-0 transition
          hover:bg-slate-50 hover:shadow-md
          focus:bg-white focus:shadow-md focus:ring-2 focus:ring-sky-200
        "
        aria-label="Select language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
