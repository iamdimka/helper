import thrtl from "../throttle"

export default function debounce(timeout: number) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const { value } = descriptor

    if (typeof value !== "function") {
      throw new Error(`cant debounce property ${key}. should be a function`)
    }

    descriptor.value = thrtl(timeout, value)
  }
}
