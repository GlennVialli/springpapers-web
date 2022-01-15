export type OrientationType = "horizontal" | "vertical";
export function orientationSetterValue<T>(params: {
  horizontalValue: T;
  verticalValue: T;
  orientation: OrientationType;
}) {
  if (params.orientation === "horizontal") return params.horizontalValue;
  else if (params.orientation === "vertical") return params.verticalValue;
  else return undefined;
}
