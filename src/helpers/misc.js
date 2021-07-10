export function isNull(value) {
  return value === null || value == null || typeof value === 'undefined';
}

export function isInfinity(value) {
  return !isFinite(value);
}
