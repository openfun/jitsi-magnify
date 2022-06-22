import fs from "fs";
import path from "path";

export default function writeFile(fullPath: string, content: string) {
  try {
    fs.writeFileSync(fullPath, content);
    console.log(`Created ${path.basename(fullPath)}`);
  } catch (error) {
    console.log(`Failed to create ${path.basename(fullPath)}`);
    console.error(error);
  }
}
