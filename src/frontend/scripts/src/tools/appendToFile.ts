import fs from "fs";
import path from "path";
import searchInFile from "./searchInFile";

export default function appendToFile(
  filePath: string,
  line: string,
  stringToFind?: string,
  after?: boolean
) {
  try {
    if (!stringToFind) {
      fs.appendFileSync(filePath, line);
      console.log(`Appended line in ${path.basename(filePath)}`);
      return;
    }

    let data = fs.readFileSync(filePath).toString().split("\n");

    const lineToFindIndex = searchInFile(data, stringToFind);
    if (lineToFindIndex < 0) {
      throw new Error(
        `Could not find ${stringToFind} in ${path.basename(filePath)}`
      );
    }

    const addLineIndex = after ? lineToFindIndex + 1 : lineToFindIndex;
    data.splice(addLineIndex, 0, line);
    const text = data.join("\n");

    fs.writeFile(filePath, text, function (err) {
      if (err) throw err;
    });
    console.log(`Added line in ${path.basename(filePath)}`);
  } catch (error) {
    console.log(`Failed to add line in ${path.basename(filePath)}`);
    console.error(error);
  }
}
