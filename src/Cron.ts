import range from "./range";
import unique from "./unique";

export default class Cron {
  protected readonly m: number[] = [];
  protected readonly h: number = 0;
  protected readonly dom: number = 0;
  protected readonly mon: number = 0;
  protected readonly dow: number = 0;

  constructor(schedule: string) {
    if (schedule[0] === "@") {
      switch (schedule) {
        case "@yearly":
        case "@annually":
          schedule = "0 0 1 1 *";
          break;

        case "@monthly":
          schedule = "0 0 1 * *";
          break;

        case "@weekly":
          schedule = "0 0 * * 0";
          break;

        case "@daily":
          schedule = "0 0 * * *";
          break;

        case "@hourly":
          schedule = "0 * * * *";
          break;

        default:
          return;
      }
    }

    const chunks = schedule.split(/\s+/);
    if (chunks.length != 5) {
      return;
    }

    parse(this.m, chunks[0], 0, 59);
    sortUnique(this.m);
    this.h = parseMask(chunks[1], 0, 24);
    this.dom = parseMask(chunks[2], 1, 31);
    this.mon = parseMask(chunks[3], 1, 12);
    this.dow = parseMask(chunks[4], 0, 6);
  }

  isValid() {
    return this.m.length > 0 && this.h > 0 && this.dom > 0 && this.mon > 0 && this.dow > 0;
  }

  satisfies(date: Date): boolean {
    return this.m.includes(date.getUTCMinutes())
      && hasBit(this.h, date.getUTCHours())
      && hasBit(this.dom, date.getUTCDate())
      && hasBit(this.mon, date.getUTCMonth() + 1)
      && hasBit(this.dow, date.getDay() % 7);
  }

  next(from: Date | number = Date.now()): Date {
    const date = new Date(from);

    for (let i = 0; i < 527040; i++) {
      date.setUTCHours(24, 0, 0, 0);

      if (this.satisfies(date)) {
        return date;
      }
    }

    throw new Error("invalid");
  }

  prev(from: Date | number = Date.now()): Date {
    const date = new Date(from);

    for (let i = 0; i < 527040; i++) {
      date.setUTCHours(-24, 0, 0, 0);

      if (this.satisfies(date)) {
        return date;
      }
    }

    throw new Error("invalid");
  }
}

function hasBit(num: number, bit: number): boolean {
  return (num & (1 << bit)) != 0;
}

function parseMask(value: string, min: number, max: number): number {
  if (value === "*") {
    return 2 ** (max + 1) - 1;
  }

  if (value.includes(",")) {
    return value.split(",").reduce((mask, item) => mask | parseMask(item, min, max), 0);
  }

  let mask = 0;
  let step = 0;
  let idx = value.indexOf("/");
  if (idx >= 0) {
    step = guard(value.substring(idx + 1), 1, max);
    value = value.substring(0, idx);
  }

  idx = value.indexOf("-");
  if (idx >= 0) {
    min = guard(value.substring(0, idx), min, max);
    max = guard(value.substring(idx + 1), min, max);
  } else {
    min = guard(value, min, max);
  }

  if (step === 0) {
    return 1 << min;
  }

  while (min <= max) {
    mask |= (1 << min);
    min += step;
  }

  return mask;
}

function parse(values: number[], value: string | number, min: number, max: number): void {
  if (typeof value === "number") {
    if (value < min || value > max) {
      throw new Error(`value ${value} is out of range [${min}, ${max}]`);
    }

    if (Number.isNaN(value)) {
      throw new Error("invalid value");
    }

    values.push(value);
    return;
  }

  if (/^\d+$/.test(value)) {
    return parse(values, parseInt(value, 10), min, max);
  }

  if (value.includes(",")) {
    for (const chunk of value.split(",")) {
      parse(values, chunk, min, max);
    }

    return;
  }

  let every = 1;
  let idx = -1;

  if ((idx = value.indexOf("/")) >= 0) {
    every = parseInt(value.substring(idx + 1), 10);
    value = value.substring(0, idx);
  }

  if ((idx = value.indexOf("-")) >= 0) {
    min = guard(value.substring(0, idx), min, max);
    max = guard(value.substring(idx + 1), min, max);
  }

  if (min > max) {
    [min, max] = [max, min];
  }

  values.push(...range(min, max + 1, every));
}

function guard(value: string, min: number, max: number): number {
  const num = parseInt(value, 10);

  if (num >= min && num <= max) {
    return num;
  }

  throw new Error(`value ${value} is out of range [${min}, ${max}]`);
}

function sortUnique(nums: number[]) {
  nums.push(...unique(nums.splice(0, nums.length)));
  nums.sort((a, b) => a - b);
}

export function cron(schedule: string): Cron {
  const cron = new Cron(schedule);
  if (!cron.isValid()) {
    throw new Error(`could not parse cron ${schedule}`);
  }

  return cron;
}