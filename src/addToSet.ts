export default function addToSet<T>(arr: T[], value: T): T[] {
  if (arr.includes(value)) {
    return arr;
  }

  arr.push(value);
  return arr;
}