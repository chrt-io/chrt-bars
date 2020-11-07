export default function lineWidth(value) {
  return this.attr('strokeWidth', value, (value) => Math.max(0, value));
}
