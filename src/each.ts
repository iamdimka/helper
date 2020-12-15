function each<T extends {}>(item: T, fn: <K extends keyof T>(item: T[K], key: K, source: T) => void): void;
function each<T>(item: T[], fn: (item: T, key: number, source: T[]) => void): void;
function each(item: any, fn: (item: any, key: any, source: any) => void): void {
  if (Array.isArray(item)) {
    item.forEach(fn);
  } else {
    for (const key in item) {
      fn(item[key], key, item);
    }
  }
}

export default each;