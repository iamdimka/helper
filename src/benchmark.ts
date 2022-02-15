export default async function benchmark(benchmarks: Record<string, (i: number) => any>, timeout = 1000) {
  const result: { name: string; sec: number; ops: number; "op/s": number; }[] = [];

  for (const key in benchmarks) {
    const fn = benchmarks[key];
    let i = 0;
    let diff = 0;
    let end = Date.now() + timeout;

    while (true) {
      diff = end - Date.now();
      if (diff <= 0) {
        const sec = (timeout - diff) / 1000;
        result.push({
          name: key,
          sec,
          ops: i,
          "op/s": i / sec
        });
        break;
      }

      await fn(++i);
    }
  }

  console.table(result);
}
