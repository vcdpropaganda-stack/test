import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const logoPath = path.join(projectRoot, "public/brands/logo-vcd.svg");
const outputDir = path.join(projectRoot, "public/service-thumbs");

const services = [
  { slug: "cartao-de-visita-vcd", title: "Cartão de visita", category: "Design" },
  { slug: "cartao-de-visita-digital-vcd", title: "Cartão de visita digital", category: "Design" },
  { slug: "marca-vcd", title: "Marca", category: "Design" },
  { slug: "identidade-visual-vcd", title: "Identidade visual", category: "Design" },
  { slug: "onepage-vcd", title: "Onepage", category: "Webdesign" },
  { slug: "landing-page-vcd", title: "Landing page", category: "Webdesign" },
  { slug: "site-full-vcd", title: "Site full", category: "Webdesign" },
  { slug: "ecommerce-vcd", title: "Ecommerce", category: "Webdesign" },
  { slug: "gestao-de-trafego-vcd", title: "Gestão de tráfego", category: "Gestão de tráfego" },
  { slug: "social-media-vcd", title: "Social media", category: "Social media" },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function main() {
  const logo = await fs.readFile(logoPath, "utf8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

  await fs.mkdir(outputDir, { recursive: true });

  await Promise.all(
    services.map(async (service, index) => {
      const accent = index % 2 === 0 ? "#4F46E5" : "#0F172A";
      const accentSoft = index % 2 === 0 ? "#EEF2FF" : "#E2E8F0";
      const category = escapeXml(service.category.toUpperCase());
      const title = escapeXml(service.title);

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" fill="none">
  <rect width="1600" height="1200" rx="80" fill="#F8FAFC"/>
  <rect x="40" y="40" width="1520" height="1120" rx="64" fill="url(#panel)"/>
  <circle cx="1360" cy="220" r="180" fill="${accentSoft}" opacity="0.95"/>
  <circle cx="1180" cy="1030" r="220" fill="#FFFFFF" opacity="0.82"/>
  <rect x="88" y="88" width="1424" height="1024" rx="52" fill="#FFFFFF" fill-opacity="0.72" stroke="#CBD5E1"/>
  <text x="140" y="200" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" letter-spacing="8">${category}</text>
  <text x="140" y="340" fill="#0F172A" font-family="Arial, Helvetica, sans-serif" font-size="112" font-weight="800">${title}</text>
  <text x="140" y="425" fill="#475569" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="500">Você Digital Propaganda</text>
  <text x="140" y="980" fill="#334155" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500">Produto cadastrado na vitrine VL Serviços</text>
  <rect x="140" y="765" width="410" height="110" rx="55" fill="${accent}"/>
  <text x="206" y="835" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700">Saiba mais</text>
  <image href="${logoDataUri}" x="940" y="455" width="430" height="126" preserveAspectRatio="xMidYMid meet"/>
  <defs>
    <linearGradient id="panel" x1="40" y1="40" x2="1560" y2="1160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/>
      <stop offset="0.58" stop-color="#EEF2FF"/>
      <stop offset="1" stop-color="#E0EAFF"/>
    </linearGradient>
  </defs>
</svg>`;

      await fs.writeFile(path.join(outputDir, `${service.slug}.svg`), svg, "utf8");
    })
  );

  console.log(`Generated ${services.length} VCD thumbs in public/service-thumbs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
