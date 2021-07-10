export default function lineWidth(value) {
  return this.attr('strokeWidth', value);
  // , (value) => {
  //   console.log('strokeWidth', value)
  //   console.log(value())
  //   return value
  //   //return Math.max(0, value)
  // });
}
