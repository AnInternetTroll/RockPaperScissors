#!/usr/bin/env -S deno run --allow-read --allow-write --unstable --no-check
export function simpleJSMinify(code: string) {
  return code.split("\n").map((l) =>
    l.trim()
      .replace(/\s*([,:=|+]{1,2})\s+/g, "$1")
      .replaceAll(") {", "){")
  ).join("");
}
const thisFolder = new URL(`${import.meta.url}/..`).pathname;

const fsWatcher = Deno.watchFs(`${thisFolder}View.tsx`)

for await (const change of fsWatcher) {
  if (change.kind === "modify") {
    for (let path in change.paths) {
      const { files } = await Deno.emit(change.paths[path], {
        compilerOptions: {
        inlineSourceMap: true,
      },
      bundle: "module",
    });
      for (let file in files) {
        if (file.includes("View.tsx")) await Deno.writeFile(new URL(`${file}../../../view.js`), new TextEncoder().encode(files[file]));
      }
    }
  }
}