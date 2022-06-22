import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconName = process.argv[2]

const toMagnifyPath = "../../"
const inMagnifyPath = `magnify/src/components/design-system/svgIcons/${iconName}`
const fullPath = path.join(__dirname, toMagnifyPath + inMagnifyPath);

const d = fs.mkdirSync(fullPath, { recursive: true })
if (d) console.log(`Created directory: ${d}`)

const iconTemplate = (iconName: string) => `import React from 'react';
import SVGIcon, { SvgProps } from '../SVGIcon';

export default function ${iconName}(svgProps: SvgProps) {
  return (
    <SVGIcon viewBox={{ x: 0, y: 0, width: 24, height: 24 }} {...svgProps}>
      {
      // Change width and height depending on viewBox in .svg file
      // Then paste here the outer <g/> tag
      }
    </SVGIcon>
  );
}
`;
const indexTemplate = (iconName: string) => `export { default as ${iconName} } from './${iconName}';\n`;
const lineToFindInStories = '} as Record'
const storyTemplate = (iconName: string) => `${iconName}: icons.${iconName},`;

// INDEX.TS
try {
fs.writeFileSync(path.join(fullPath, "index.ts"), indexTemplate(iconName));
console.log('Created index.ts')
} catch (error) {
  console.log(`Failed to create index.ts`)
  console.error(error);
}

// ICONNAME.TSX
try {
fs.writeFileSync(path.join(fullPath, `${iconName}.tsx`), iconTemplate(iconName));
console.log(`Created ${iconName}.tsx`)
} catch (error) {
  console.log(`Failed to create ${iconName}.tsx`);
  console.error(error);
}

// EXPORT IN ICONS' INDEX.TS
try {
  fs.appendFileSync(path.join(fullPath, "../index.ts"), `export { ${iconName} } from "./${iconName}";\n`);
console.log(`Added export in icons index.ts`)
} catch (error) {
  console.log(`Failed to add export in icons index.ts`);
  console.error(error);
}

// ADD ICON IN STORY
try {
  const storiesPath = path.join(fullPath, "../SVGIcon.stories.tsx")
  var data = fs.readFileSync(storiesPath).toString().split("\n");
  
  const addLineIndex = (() => {
    for (var i = 0; i < data.length; i++) {
      if (data[i].includes(lineToFindInStories)) return i;
    }
  })()
  if (!addLineIndex) throw new Error(`Couldn't find string ${lineToFindInStories} in SVGIcon.stories.tsx`);
data.splice(addLineIndex, 0, storyTemplate(iconName));
var text = data.join("\n");

fs.writeFile(storiesPath, text, function (err) {
  if (err) throw err;
});
  console.log("Added icon in stories")
} catch (error) {
  console.log("Failed to add icon in stories")
  console.error(error)
}
