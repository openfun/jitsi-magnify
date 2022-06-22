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
import searchInFile from "./tools/searchInFile";
import writeFile from "./tools/writeFile";

const pathToComponentFolderInComponents = path.join(
  pathToComponents,
  process.argv[2]
);
const componentDirs = process.argv[2].split("/").filter((x) => x != "");
const componentName = componentDirs[componentDirs.length - 1];

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
  storiesTemplate(componentName, componentDirs)
);

// CREATE TEST
writeFile(
  path.join(pathToComponentFolderInComponents, `${componentName}.tests.tsx`),
  testTemplate(componentName)
);

// CREATE INDEX.TS RECURSIVELY

// Get [..., .../ComponentGroup, .../ComponentGroup/Component]
let indexesFolder = [pathToComponents];
for (let i = 0; i < componentDirs.length - 1; i++) {
  indexesFolder.push(path.join(indexesFolder[i], componentDirs[i]));
}

// Append 'default as' export to last index file
appendToFile(
  path.join(indexesFolder[indexesFolder.length - 1], "index.ts"),
  defaultAsTemplate(componentName)
);

// Append 'export all' export to others
for (let i = 0; i < indexesFolder.length - 1; i++) {
  const indexPath = path.join(indexesFolder[i], "index.ts");
  const exportAll = exportAllTemplate(componentDirs[i]);
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
