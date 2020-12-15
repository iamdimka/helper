import noop from "./noop";

async function waitForSignal<T extends NodeJS.Signals>(signal: T, ...other: T[]): Promise<T>;
async function waitForSignal(...signals: NodeJS.Signals[]): Promise<NodeJS.Signals> {
  if (!signals.length) {
    throw new TypeError("Expected at least 1 argument");
  }

  return new Promise<NodeJS.Signals>(resolve => {
    //set interval 'cause nodejs goes away if nothing happened
    let interval = setInterval(noop, 1e9);
    const listener = (signal: NodeJS.Signals) => {
      clearInterval(interval);
      signals.forEach(signal => process.off(signal, listener));
      resolve(signal);
    };

    signals.forEach(signal => process.on(signal, listener));
  });
}

export default waitForSignal;