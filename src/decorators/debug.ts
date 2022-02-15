export default function debug(target: any, key: string, descriptor: PropertyDescriptor) {
  const { value } = descriptor

  descriptor.value = function (this: any, ...args: any[]) {
    console.log(`[debug] call: ${this.constructor.name}:${key}(${JSON.stringify(args).slice(1, -1)})`)
    const at = Date.now()
    try {
      const result = value.apply(this, args)
      if (result && typeof result.then === "function") {
        console.log(`[debug] ${this.constructor.name}:${key} returns Promise (${Date.now() - at}ms)`)

        result.then((result: any) => {
          console.log(`[debug] promise resolved ${this.constructor.name}:${key} returns ${typeof result === "object" ? JSON.stringify(result) : result} (${Date.now() - at}ms)`)
        }, (err: any) => {
          console.error(`[debug] promise rejected ${this.constructor.name}:${key} with exception (${Date.now() - at}ms)`, err)
        })
        return result
      } else {
        console.log(`[debug] ${this.constructor.name}:${key} returns ${typeof result === "object" ? JSON.stringify(result) : result} (${Date.now() - at}ms)`)
      }
    } catch (e) {
      console.error(`[debug] failed ${this.constructor.name}:${key} with exception (${Date.now() - at}ms)`, e)
      throw e
    }
  }
}
