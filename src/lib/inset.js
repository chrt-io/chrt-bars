export default function inset(value) {
  return this.attr('inset', value, (value) => Math.max(0, value));
}
