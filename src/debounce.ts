export default function debounce<T, Args extends any[]>(ms: number, fn: (this: T, ...args: Args) => void): (this: T, ...args: Args) => void {
  let timeout: number = 0;

  const run = (t: T, a: Args) => fn.apply(t, a);

  return function (this: T) {
    clearTimeout(timeout);
    timeout = setTimeout(run, ms, this, arguments);
  };
}