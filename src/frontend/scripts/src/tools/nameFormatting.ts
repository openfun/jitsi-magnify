export function folderName(FolderString: string) {
  // Expecting Folder to be in FooBar format

  let output = FolderString[0].toLowerCase();
  for (let i = 1; i < FolderString.length; i++) {
    if (FolderString[i] === FolderString[i].toUpperCase()) {
      output += "-" + FolderString[i].toLowerCase();
    } else {
      output += FolderString[i];
    }
  }
  return output;
}
