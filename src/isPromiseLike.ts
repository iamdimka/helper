export default function isPromiseLike(t: any): t is PromiseLike<any> {
  return t && typeof t.then === "function";
}