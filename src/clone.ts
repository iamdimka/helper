export default function clone<T = any>(o: T): T {
  if (!o || typeof o !== "object") {
    return o;
  }

  if (o instanceof Array) {
    return o.map(clone) as any;
  }

  const c = {} as T;
  for (const key in o) {
    c[key] = clone(o[key]);
  }
  return c;
}