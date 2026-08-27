import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const siteUrl = (process.env.VITE_SITE_URL || "https://riricars.co.ke").replace(
  /\/$/,
  "",
);
const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/cars", changefreq: "daily", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
];

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const readEnvValue = async (name) => {
  try {
    const env = await readFile(".env", "utf8");
    const match = env.match(new RegExp(`^${name}=(.*)$`, "m"));
    return match?.[1]?.trim().replace(/^['"]|['"]$/g, "");
  } catch {
    return undefined;
  }
};

const apiBaseUrl = (
  process.env.VITE_API_BASE_URL ||
  (await readEnvValue("VITE_API_BASE_URL")) ||
  ""
).replace(/\/$/, "");
const urls = [...staticRoutes];

if (apiBaseUrl) {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/vehicles?page=1&pageSize=1000`,
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const vehicles = Array.isArray(payload) ? payload : payload.data || [];

    for (const vehicle of vehicles) {
      if (!vehicle?.id) continue;
      urls.push({
        path: `/cars/${vehicle.id}`,
        lastmod: vehicle.updatedAt || vehicle.createdAt,
        changefreq: "weekly",
        priority: "0.8",
      });
    }
  } catch (error) {
    console.warn(
      `Sitemap: vehicle URLs unavailable (${error.message}); using static routes only.`,
    );
  }
}

const entries = urls
  .map(
    ({ path, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>${
      lastmod
        ? `
    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>`
        : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

await mkdir("dist", { recursive: true });
await writeFile(join("dist", "sitemap.xml"), sitemap);
console.log(`Sitemap: wrote ${urls.length} URLs to dist/sitemap.xml`);
