export default function equal(a: any, b: any): boolean {
  const typeofA = typeof a

  if (typeof b !== typeofA) {
    return false
  }

  if (typeofA !== "object" || a === null || b === null) {
    return a === b
  }

  const isArray = a instanceof Array

  if ((b instanceof Array) !== isArray) {
    return false
  }

  if (isArray) {
    const l = a.length
    if (l !== b.length) {
      return false
    }

    for (let i = 0; i < l; i++) {
      if (!equal(a[i], b[i])) {
        return false
      }
    }

    return true
  }

  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      if (!b.hasOwnProperty(key)) {
        return false
      }

      if (!equal(a[key], b[key])) {
        return false
      }
    }
  }

  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      if (!a.hasOwnProperty(key)) {
        return false
      }
    }
  }

  return true
}