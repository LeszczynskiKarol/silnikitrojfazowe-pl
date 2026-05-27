import sharp from "sharp";
import { readFileSync } from "node:fs";
const svg = readFileSync("public/og-default.svg");
await sharp(svg, { density: 144 }).resize(1200, 630).png({ quality: 90 }).toFile("public/og-default.png");
console.log("og-default.png OK");
