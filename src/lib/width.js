export default function width(value) {
  return this.attr('barRatioWidth', value, (value) => Math.max(0, Math.min(value, 1)));
}
