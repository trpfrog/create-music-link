// [Apple, Banana, Cherry] => Apple, Banana and Cherry
export function joinWithAnd(arr: string[]) {
  switch (arr.length) {
    case 0:
      return "";
    case 1:
      return arr[0];
    default:
      return `${arr.slice(0, -1).join(", ")} and ${arr.at(-1)}`;
  }
}
