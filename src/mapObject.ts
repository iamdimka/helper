export default function mapObject<T extends {}, R extends { [K in keyof T]: any }>(obj: T, mapper: <K extends keyof T>(value: T[K], key: K, obj: T) => R[K]): R {
  const res = {} as R;

  for (const key in obj) {
    res[key] = mapper(obj[key], key, obj);
  }

  return res;
}