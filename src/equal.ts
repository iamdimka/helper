const { hasOwnProperty } = Object.prototype;

export default function equal(a: any, b: any, depth = Infinity): boolean {
  const typeofA = typeof a;

  if (typeof b !== typeofA) {
    return false;
  }

  if (typeofA !== "object" || a === null || b === null) {
    return a === b;
  }

  const isArray = Array.isArray(a);

  if (depth <= 0) {
    return true;
  }

  depth -= 1;

  if (Array.isArray(b) !== isArray) {
    return false;
  }

  if (isArray) {
    const l = a.length;
    if (l !== b.length) {
      return false;
    }

    for (let i = 0; i < l; i++) {
      if (!equal(a[i], b[i], depth)) {
        return false;
      }
    }

    return true;
  }

  for (const key in a) {
    if (hasOwnProperty.call(a, key)) {
      if (!hasOwnProperty.call(b, key)) {
        return false;
      }

      if (!equal(a[key], b[key], depth)) {
        return false;
      }
    }
  }

  for (const key in b) {
    if (hasOwnProperty.call(b, key)) {
      if (!hasOwnProperty.call(a, key)) {
        return false;
      }
    }
  }

  return true;
}