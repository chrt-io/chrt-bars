export default function binwidth(value) {
  return this.attr('binwidth', value, (value) => Math.max(0, value));
}
