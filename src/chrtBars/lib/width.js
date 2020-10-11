export default function width(value) {
  if(!value) {
    return this.barRatioWidth;
  }

  if (typeof value === 'function') {
    // something will go here
  } else {
    this.barRatioWidth = value;
  }
  return this;
}
