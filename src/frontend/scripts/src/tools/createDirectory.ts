import fs from "fs";

export default function createDirectory(fullPath: string) {
  const d = fs.mkdirSync(fullPath, { recursive: true });
  if (d) console.log(`Created directory: ${d}`);
  else throw new Error(`Directory ${fullPath} already exists`);
}
