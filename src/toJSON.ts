export function toJSON<T = any>(o: any): T {
  if (!o || typeof o !== "object") {
    return o
  }

  if (typeof o.toJSON === "function") {
    return toJSON(o.toJSON())
  }

  if (o instanceof Array) {
    return (o as any).map(toJSON)
  }

  const obj = {} as any
  
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      const v = toJSON(o[key])

      if (v !== undefined) {
        obj[key] = v
      }
    }
  }

  return obj
}