import fs from "fs";
import path from "path";

/**
 *
 * @param data
 * @param stringToFind
 * @returns the line index of the stringToFind in data, or -1 if not found
 */
export default function appendToFile(
  data: string[],
  stringToFind: string
): number {
  let lineToFindIndex = -1;

  stringToFind = stringToFind.trim();

  for (let i = 0; i < data.length; i++) {
    if (data[i].includes(stringToFind)) {
      lineToFindIndex = i;
      break;
    }
  }

  return lineToFindIndex;
}
