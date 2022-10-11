export class ArrayHelper {
  public static findElementIndex<T>(array: T[], element: T): number | null {
    const index = array.findIndex((arrayElement: T) => {
      return arrayElement == element;
    });
    return index >= 0 ? index : null;
  }

  public static removeItem<T>(array: T[], element: T): T[] {
    const index = ArrayHelper.findElementIndex(array, element);
    if (index != null) {
      array.splice(index, 1);
    } else {
      console.error('ArrayHelper -- removerItem : element not in array');
    }
    return array;
  }
}
