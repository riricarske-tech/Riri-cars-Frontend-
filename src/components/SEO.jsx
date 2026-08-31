import { useEffect } from "react";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "../lib/seo";

// Upserts head tags in place (never duplicates the static tags shipped in
// index.html), so every route exposes exactly one title, description,
// canonical, and Open Graph / Twitter card set to crawlers.

const upsertMeta = (attr, key, content) => {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Per-page SEO tags + JSON-LD structured data.
 *
 * @param {string}   title       Full document title (unique per page)
 * @param {string}   description Meta description (unique per page)
 * @param {string}   path        Canonical path, e.g. "/cars" (query strings excluded)
 * @param {string}   [image]     Absolute Open Graph image URL
 * @param {string}   [imageAlt]  Accessible description for the social image
 * @param {string}   [type]      og:type — "website" | "article" | "product"
 * @param {boolean}  [noindex]   Set true on error/not-found states
 * @param {object[]} [jsonLd]    schema.org objects rendered as JSON-LD
 */
export default function SEO({
  title,
  description,
  path = "/",
  image,
  imageAlt = "Riri Cars showroom and vehicles in Nairobi",
  type = "website",
  noindex = false,
  jsonLd = [],
}) {
  const jsonLdString = JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd);

  useEffect(() => {
    const canonical = absoluteUrl(path);
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "en_KE");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image || DEFAULT_OG_IMAGE);
    upsertMeta("property", "og:image:alt", imageAlt);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image || DEFAULT_OG_IMAGE);
    upsertMeta("name", "twitter:image:alt", imageAlt);
  }, [title, description, path, image, imageAlt, type, noindex]);

  useEffect(() => {
    let el = document.getElementById("page-jsonld");
    if (jsonLd.length === 0) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "page-jsonld";
      document.head.appendChild(el);
    }
    el.textContent = jsonLdString;
  }, [jsonLdString, jsonLd.length]);

  return null;
}
