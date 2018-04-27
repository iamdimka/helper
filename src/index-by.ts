export default function index<O, K extends keyof O>(o: O[], key: K): { [key: string]: O } {
  const data: { [key: string]: O } = {}

  for (const item of o) {
    data[item[key] as any] = item
  }

  return data
}