export const addLeftZero = (value: number): string => {
  return value >= 10 ? `${value}` : `0${value}`;
};
