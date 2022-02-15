export default function autobind(target: any, key: string, descriptor: PropertyDescriptor) {
  const { value: fn } = descriptor

  return {
    get: function (this: any) {
      const value = fn.bind(this)
      Object.defineProperty(this, key, { value })
      return value
    }
  }
}