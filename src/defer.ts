export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (data: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

export default function defer<T>(executor?: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
  const dfd: Partial<Deferred<T>> = {};
  dfd.promise = new Promise<T>((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
    if (executor) {
      executor(resolve, reject);
    }
  });
  return dfd as Deferred<T>;
}