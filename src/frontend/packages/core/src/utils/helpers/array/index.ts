export class ArrayHelper {
  static findElementIndex<T extends number | string | boolean>(
    array: T[],
    element: T,
  ): number | null {
    const index = array.findIndex((arrayElement: T) => {
      return arrayElement === element;
    });
    return index >= 0 ? index : null;
  }

  static removeItem<T extends number | string | boolean>(array: T[], element: T): any {
    const newArray = [...array];
    const index = ArrayHelper.findElementIndex(newArray, element);
    if (index != null) {
      newArray.splice(index, 1);
    }
    return newArray;
  }

  static async resolveAll<T>(array: Array<T>, callback: (item: T, index: number) => Promise<void>) {
    await Promise.all(array.map(callback));
  }
}
