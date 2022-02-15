export default function pick<O, K extends keyof O>(o: O[], key: K): Array<O[K]> {
  return o.map<O[K]>(item => item[key]);
}