// export default function width(value) {
//   if(!value) {
//     return this.barRatioWidth;
//   }
//
//   if (typeof value === 'function') {
//     // something will go here
//   } else {
//     this.barRatioWidth = value;
//   }
//   return this;
// }
export default function width(value) {
  return this.attr('barRatioWidth', value, (value) => Math.max(0, Math.min(value, 1)));
}
