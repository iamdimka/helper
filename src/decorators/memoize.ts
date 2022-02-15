export default function memoize(target: any, key: string, descriptor: PropertyDescriptor) {
  const { value, get, set } = descriptor

  if (descriptor.get) {
    descriptor.get = function (this: any) {
      const memo = get!.call(this)

      Object.defineProperty(this, key, {
        get: () => memo,
        set
      })

      return memo
    }

    return
  }

  if (typeof value === "function") {
    const memo = Object.create(null) as Record<string, any>

    descriptor.value = function (this: any, ...args: any[]) {
      const key = JSON.stringify(args)
      if (key in memo) {
        return memo[key]
      }

      return memo[key] = value.apply(this, args)
    }
  }
}
