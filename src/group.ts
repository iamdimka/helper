export default function group<O, K extends keyof O>(o: O[], key: K): { [key: string]: O[]; } {
  const data: { [key: string]: O[]; } = {};

  for (const item of o) {
    const scope = data[item[key] as any];
    if (Array.isArray(scope)) {
      scope.push(item);
      continue;
    }

    data[item[key] as any] = [item];
  }

  return data;
}