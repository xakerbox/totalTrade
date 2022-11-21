export const roundValue = (value: string | number, decimals: number): number => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }

  const result =
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

  return result;
};
