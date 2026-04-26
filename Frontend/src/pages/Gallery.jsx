import React from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section";
import BeforeAfterCarousel from "../components/BeforeAfterCarousel";

const imgs = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517524206127-48bbd363f3a7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80"
];

export default function Gallery() {
  const { t } = useTranslation();

  return (
    <div>
      <Section title={t("gallery.title")} subtitle={t("gallery.subtitle")}>
        <BeforeAfterCarousel />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imgs.map((src, i) => (
            <div key={i} className="card overflow-hidden">
              <img src={src} alt={`gallery ${i}`} className="h-56 w-full object-cover" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
