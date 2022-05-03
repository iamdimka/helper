export default function timestamp(date?: string | number | Date | null | undefined, sec?: boolean): number | undefined {
  if (!date) {
    return undefined;
  }

  if (typeof date !== "object") {
    date = new Date(date);
  }

  date = date.getTime();
  return sec ? Math.trunc(date / 1000) : date;
}