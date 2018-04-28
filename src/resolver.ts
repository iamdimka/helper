import constant from "./constant"

export default function resolver<E, T>(promise: Promise<T>): Promise<T | E>
export default function resolver<T>(promise: Promise<T>): Promise<T | Error> {
  return promise.catch(constant)
}