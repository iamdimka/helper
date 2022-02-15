export default function chunkify<T>(arr: T[], chunkLength: number): T[][] {
  const chunks: T[][] = [];
  const length = arr.length;
  let i = 0;

  while (i < length) {
    chunks.push(arr.slice(i, i + chunkLength));
    i += chunkLength;
  }

  return chunks;
}