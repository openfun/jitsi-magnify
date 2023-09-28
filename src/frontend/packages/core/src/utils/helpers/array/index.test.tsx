import { ArrayHelper } from './index';

describe('ArrayHelper', () => {
  const testingArrayNumber: number[] = [1, 2, 3, 4, 5];
  const testingArrayString: string[] = ['a', 'b', 'c'];
  const testingArrayBool: boolean[] = [true, false];
  it('finds index with findElementIndex', async () => {
    testingArrayNumber.forEach((item, index) => {
      expect(ArrayHelper.findElementIndex(testingArrayNumber, item)).toEqual(index);
    });
    testingArrayString.forEach((item, index) => {
      expect(ArrayHelper.findElementIndex(testingArrayString, item)).toEqual(index);
    });
    testingArrayBool.forEach((item, index) => {
      expect(ArrayHelper.findElementIndex(testingArrayBool, item)).toEqual(index);
    });
  });

  it("doesn't find index with findElementIndex", async () => {
    expect(ArrayHelper.findElementIndex(testingArrayNumber, 99)).toBe(null);
    expect(ArrayHelper.findElementIndex(testingArrayString, 'fdfd')).toBe(null);
  });

  it('successfully removeItem on number type', async () => {
    let newArray = [...testingArrayNumber];
    newArray = ArrayHelper.removeItem(newArray, 1);
    expect(newArray.length).toEqual(testingArrayNumber.length - 1);
    newArray = ArrayHelper.removeItem(newArray, 99);
    expect(newArray.length).toEqual(testingArrayNumber.length - 1);
  });

  it('successfully removeItem on string type', async () => {
    let newArray = [...testingArrayString];
    newArray = ArrayHelper.removeItem(newArray, 'a');
    expect(newArray.length).toEqual(testingArrayString.length - 1);
    newArray = ArrayHelper.removeItem(newArray, 'ff');
    expect(newArray.length).toEqual(testingArrayString.length - 1);
  });

  it('successfully removeItem boolean type', async () => {
    let newArray = [...testingArrayBool];
    newArray = ArrayHelper.removeItem(newArray, false);
    expect(newArray.length).toEqual(testingArrayBool.length - 1);
    newArray = ArrayHelper.removeItem(newArray, false);
    expect(newArray.length).toEqual(testingArrayBool.length - 1);
  });
});
