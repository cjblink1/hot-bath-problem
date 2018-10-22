
const cold = [0 / 255, 0 / 255, 60 / 255];
const hot = [235 / 255, 245 / 255, 251 / 255];
const slopes = hot.map((_, i) => (hot[i] - cold[i]) / 30);


export function tempToColor(temp: number): Array<number> {
  const result = slopes.map((slope, i) => cold[i] + slope * (temp - 75)).concat([1.0]);
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

export function scaleVectorToLength(vector: [number, number], length: number): [number, number] {
  const proportion = length / Math.sqrt(vector.reduce((accumulator, element) => accumulator + Math.pow(element, 2), 0));
  if (Number.isNaN(proportion) || !Number.isFinite(proportion)) {
    return vector;
  }
  return [proportion * vector[0], proportion * vector[1]];
}
