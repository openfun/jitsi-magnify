import path from 'path';

import { pathToComponents } from './componentPath';
import {
  exportTemplate,
  iconTemplate,
  indexTemplate,
  lineToFindInStories,
  storyTemplate,
} from './generateIcon.templates';
import appendToFile from './tools/appendToFile';
import createDirectory from './tools/createDirectory';
import writeFile from './tools/writeFile';

const iconName = process.argv[2];
if (!iconName)
  throw new Error('No icon name provided. You should provide an icon name as an argument.');

const fullPath = path.join(pathToComponents, `/design-system/svg-icons/${iconName}`);

createDirectory(fullPath);

// INDEX.TS
writeFile(path.join(fullPath, 'index.tsx'), indexTemplate(iconName));

// ICONNAME.TSX
writeFile(path.join(fullPath, `${iconName}.tsx`), iconTemplate(iconName));

// EXPORT IN ICONS' INDEX.TS
appendToFile(path.join(fullPath, '../index.tsx'), exportTemplate(iconName));

// ADD ICON IN STORY
appendToFile(
  path.join(fullPath, '../SVGIcon.stories.tsx'),
  storyTemplate(iconName),
  lineToFindInStories,
  false,
);
