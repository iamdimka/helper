export default function throttle<T, Args extends any[]>(ms: number, fn: (this: T, ...args: Args) => void): (this: T, ...args: Args) => void {
  let throttled: boolean | [ths: T, args: Args] = false;

  function run() {
    if (!throttled || throttled === true) {
      throttled = false;
      return;
    }

    fn.apply(throttled[0], throttled[1]);
    throttled = true;
    setTimeout(run, ms);
  }

  return function (this: T) {
    if (throttled) {
      throttled = [this, arguments as any];
      return;
    }

    throttled = true;
    fn.apply(this, arguments as any);
    setTimeout(run, ms);
  };
}