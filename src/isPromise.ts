export default function isPromise(t: any): t is Promise<any> {
  return t && typeof t.then === "function" && typeof t.catch === "function"
}