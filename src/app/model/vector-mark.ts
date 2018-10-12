export const vectorMarkCode =
`
import { Line } from P2D;

mark FlowVector(
  baseVector: Vector2,
  center: Vector2,
  width: float,
  height: float,
  minStrength: float,
  maxStrength: float
) {
  let u = normalize(baseVector);
  let uScaled = Vector2(0.8*u.x*(width/2), 0.8*u.y*(height/2));
  let strength = length(baseVector);
  let alpha = (strength - minStrength) / (maxStrength - minStrength);
  Line(uScaled + center, -uScaled + center, 1, Color(1, 0, 0, alpha));
}
`;
