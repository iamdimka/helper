export default function range(to: number): number[]
export default function range(start: number, to?: number, step?: number): number[] {
  const result: number[] = []

  if (arguments.length === 1) {
    to = start
    start = 0
  }

  step = step || 1

  if ((start > to!) === (step > 0)) {
    step = -step
  }

  if (step < 0) {
    while (start > to!) {
      result.push(start)
      start += step
    }
  } else {
    while (start < to!) {
      result.push(start)
      start += step
    }
  }

  return result
}