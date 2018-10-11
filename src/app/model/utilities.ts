
export function tempToColor(temp: number): string {
  const roundedTemp = Math.round(temp);
  return `rgb(${roundedTemp},${roundedTemp},${roundedTemp})`;
}

export function executeAndMeasure(name: string, f: () => void, obj): number {
  const before = performance.now();
  f.apply(obj);
  const after = performance.now();
  const duration = (after - before);
  console.log(name + ' took: ' + duration);
  return duration;
}
