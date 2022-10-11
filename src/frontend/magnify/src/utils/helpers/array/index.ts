export class ArrayHelper {
  public static findElementIndex<T extends number | string | boolean>(
    array: T[],
    element: T,
  ): number | null {
    const index = array.findIndex((arrayElement: T) => {
      return arrayElement === element;
    });
    return index >= 0 ? index : null;
  }

  public static removeItem<T extends number | string | boolean>(array: T[], element: T): any {
    const newArray = [...array];
    const index = ArrayHelper.findElementIndex(newArray, element);
    if (index != null) {
      newArray.splice(index, 1);
    }
    return newArray;
  }
}
