import { format } from "util";

let writeStream: NodeJS.WriteStream = process.stderr;
let v = 1;

const scope: Record<string, boolean> = Object.create(null);
const flags: Record<string, boolean> = Object.create(null);

const sep = new Set([":", ".", "/"]);

export const enum Colorize {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  Black = "\x1b[30m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m"
}

const colors = [Colorize.Red, Colorize.Green, Colorize.Yellow, Colorize.Blue, Colorize.Blue, Colorize.Magenta, Colorize.Cyan];

export function setWriteStream(stream: NodeJS.WriteStream) {
  writeStream = stream;
}

export function isDebugging(namespace: string) {
  if (namespace in scope) {
    return scope[namespace];
  }

  let enabled = scope["*"] ?? false;
  const last = namespace.length - 1;

  for (let i = 0; i < last; i++) {
    if (sep.has(namespace[i])) {
      const val = scope[namespace.substring(0, i + 1) + "*"];

      if (typeof val === "boolean") {
        enabled = val;
      }
    }
  }

  return enabled;
}

export function configure(config: string) {
  const params = config.split(",");
  for (const param of params) {
    if (param[0] === "-") {
      scope[param.substring(1)] = false;
      continue;
    }

    if (param[0] === ":") {
      flags[param.substring(1)] = true;
    }

    scope[param] = true;
  }

  ++v;
}

configure(process.env.DEBUG || "");

function color(namespace: string): string {
  if (!flags.colors) {
    return "";
  }

  let hash = 5381;

  for (let i = 0; i < namespace.length; i++) {
    hash += (hash << 5) + namespace.charCodeAt(i);
  }

  return colors[Math.abs(hash | 0) % colors.length];
}

export function debug(namespace: string = "") {
  let c = 0;
  let enabled = false;
  let clr = color(namespace);
  let scope = clr ? (clr + namespace + Colorize.Reset) : namespace;

  function log(...args: any[]): void {
    if (v !== c) {
      c = v;
      clr = color(namespace);
      enabled = isDebugging(namespace);
    }

    if (!enabled) {
      return;
    }

    if (!args.length) {
      writeStream.write(scope + "\n");
      return;
    }

    if (typeof args[0] === "string") {
      args[0] = `${scope} ${args[0]}`;
      writeStream.write(format(...args) + "\n");
      return;
    }

    writeStream.write(format(scope, ...args) + "\n");
  }

  return log;
}

export default Object.assign(debug, {
  setWriteStream,

  log: (namespace: string, ...log: any[]) => {
    if (!log.length) {
      return debug("")(namespace);
    }

    debug(namespace)(...log);
  }
});