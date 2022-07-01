import fs from "fs";
import path from "path";

import { pathToComponents } from "./componentPath";
import {
  componentTemplate,
  defaultAsTemplate,
  exportAllTemplate,
  indexTemplate,
  storiesTemplate,
  testTemplate,
} from "./generateComponent.templates";
import appendToFile from "./tools/appendToFile";
import createDirectory from "./tools/createDirectory";
import { folderName } from "./tools/nameFormatting";
import searchInFile from "./tools/searchInFile";
import writeFile from "./tools/writeFile";

if (!process.argv[2])
  throw new Error(
    "No component name or path provided. You should provide a component name as an argument."
  );
if (process.argv[3])
  throw new Error(
    "You provided a second argument, but it is not supported. If you want to genereate a component inside a folder, you should use '<Group>/<ComponentName>' as argument."
  );

const givenComponentDirs = process.argv[2].split("/").filter((x) => x != "");
const componentName = givenComponentDirs[givenComponentDirs.length - 1];

const notInCamelCase = givenComponentDirs.filter(
  (folder) =>
    folder[0] !== folder[0].toUpperCase() ||
    folder !== folder.replace(/[^a-zA-Z0-9]/g, "")
);
if (notInCamelCase.length > 0)
  throw new Error(
    `Component name and groups should be in CamelCase. You should use 'FooBar' instead of 'fooBar' or 'foo-bar.
Invalid folders/components:${notInCamelCase.join(", ")}\n`
  );

const componentDirsNames = givenComponentDirs.map((folder, index) =>
  index !== givenComponentDirs.length - 1 ? folderName(folder) : folder
);

const pathToComponentFolderInComponents = path.join(
  pathToComponents,
  ...componentDirsNames
);

// CREATE FOLDER
createDirectory(pathToComponentFolderInComponents);

// CREATE INDEX
writeFile(
  path.join(pathToComponentFolderInComponents, "index.ts"),
  indexTemplate(componentName)
);

// CREATE COMPONENT
writeFile(
  path.join(pathToComponentFolderInComponents, `${componentName}.tsx`),
  componentTemplate(componentName)
);

// CREATE STORIES
writeFile(
  path.join(pathToComponentFolderInComponents, `${componentName}.stories.tsx`),
  storiesTemplate(componentName, givenComponentDirs)
);

// CREATE TEST
writeFile(
  path.join(pathToComponentFolderInComponents, `${componentName}.test.tsx`),
  testTemplate(componentName)
);

// CREATE INDEX.TS RECURSIVELY

// Get [..., .../ComponentGroup, .../ComponentGroup/Component]
let indexesFolder = [pathToComponents];
for (let i = 0; i < componentDirsNames.length - 1; i++) {
  indexesFolder.push(path.join(indexesFolder[i], componentDirsNames[i]));
}

// Append 'default as' export to last index file
appendToFile(
  path.join(indexesFolder[indexesFolder.length - 1], "index.ts"),
  defaultAsTemplate(componentName)
);

// Append 'export all' export to others
for (let i = 0; i < indexesFolder.length - 1; i++) {
  const indexPath = path.join(indexesFolder[i], "index.ts");
  const exportAll = exportAllTemplate(componentDirsNames[i]);
  let findExportAll = -1;

  try {
    const data = fs.readFileSync(indexPath).toString().split("\n");
    findExportAll = searchInFile(data, exportAll);
  } catch (error: any) {
    console.log(
      `Could not search for ${exportAll} in ${indexPath}: ${error.message}`
    );
  }

  if (findExportAll < 0) {
    appendToFile(indexPath, exportAll);
  }
}
