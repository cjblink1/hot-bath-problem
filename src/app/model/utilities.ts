
const cold = [0 / 255, 0 / 255, 60 / 255];
const hot = [235 / 255, 245 / 255, 251 / 255];
const slopes = hot.map((_, i) => (hot[i] - cold[i]) / 255);


export function tempToColor(temp: number): Array<number> {
  const result = slopes.map((slope, i) => cold[i] + slope * temp).concat([1.0]);
  return result;
}

export function executeAndMeasure(name: string, f: () => void, obj): number {
  const before = performance.now();
  f.apply(obj);
  const after = performance.now();
  const duration = (after - before);
  console.log(name + ' took: ' + duration);
  return duration;
}
