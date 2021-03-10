export type DirectionType = "horizontal" | "vertical";
export function directionSetterValue<T>(params: {
  horizontalValue: T;
  verticalValue: T;
  direction: DirectionType;
}) {
  if (params.direction === "horizontal") return params.horizontalValue;
  else if (params.direction === "vertical") return params.verticalValue;
  else return undefined;
}
