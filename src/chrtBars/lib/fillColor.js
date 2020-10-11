export default function fillColor(value) {
  if(!value) {
    return this.fillColor;
  }

  if (typeof value === 'function') {
    // something will go here
  } else {
    this.fillColor = value;
  }
  return this;
}
