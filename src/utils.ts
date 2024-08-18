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

export function fillTemplate(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) =>
    key in values ? values[key].toString() : `\${${key}}`
  );
}

export function extractAllCaptureGroups(re: RegExp, str: string): string[][] {
  const result: string[][] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(str)) !== null) {
    result.push(match.slice(1));
  }
  return result;
}
