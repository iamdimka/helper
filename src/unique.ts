function filterUnique<T>(value: T, i: number, array: T[]) {
  return array.indexOf(value) === i;
}

export default function unique<T>(arr: T[]): T[] {
  return arr.filter(filterUnique);
}