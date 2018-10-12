
export function tempToColor(temp: number): Array<number> {
  const color = Math.round(temp) / 256;
  return [color, color, color, 1.0];
}

export function executeAndMeasure(name: string, f: () => void, obj): number {
  const before = performance.now();
  f.apply(obj);
  const after = performance.now();
  const duration = (after - before);
  console.log(name + ' took: ' + duration);
  return duration;
}
