import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const mode = process.argv.includes("--write") ? "write" : "check";
const root = process.cwd();

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sql",
  ".toml",
  ".txt",
  ".webmanifest",
  ".yml",
  ".yaml"
]);

function extensionOf(file) {
  const match = file.match(/(\.[^.\/\\]+)$/);
  return match?.[1] ?? "";
}

const ignoredDirectories = new Set([
  ".git",
  ".idea",
  "dist",
  "node_modules",
  "outputs",
  "tmp"
]);

async function collectFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const collected = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name) || relativePath === "supabase/.temp") continue;
      collected.push(...await collectFiles(join(directory, entry.name), relativePath));
      continue;
    }
    if (entry.isFile() && textExtensions.has(extensionOf(entry.name))) {
      collected.push(relativePath);
    }
  }

  return collected;
}

const files = (await collectFiles(root)).filter((file) =>
  file === ".env.example"
  || file === ".gitignore"
  || file === "package.json"
  || file === "README.md"
  || file === "supabase/config.toml"
  || file === "docs/arquitetura.md"
  || file === "docs/configuracao-supabase.md"
  || file === "docs/guia-supabase.md"
  || file.startsWith("docs/legacy/")
  || file.startsWith("scripts/")
  || file.startsWith("supabase/migrations/20260716")
);

const changed = [];

for (const file of files) {
  const absolutePath = join(root, file);
  if (!existsSync(absolutePath)) continue;
  const original = await readFile(absolutePath, "utf8");
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  const normalized = original
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/u, ""))
    .join("\n")
    .replace(/\n*$/u, "\n")
    .replace(/\n/g, eol);

  if (normalized !== original) {
    changed.push(file);
    if (mode === "write") await writeFile(absolutePath, normalized, "utf8");
  }
}

if (changed.length && mode === "check") {
  console.error("Arquivos fora do formato:");
  for (const file of changed) console.error(`- ${file}`);
  console.error("Rode npm run format.");
  process.exit(1);
}

console.log(mode === "write" ? "Formatacao aplicada." : "Formatacao conferida.");
