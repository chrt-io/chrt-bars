export default function fillColor(value) {
  if(!value) {
    return this.getFillColor();
  }

  if (typeof value === 'function') {
    // something will go here
    this.getFillColor = value;
  } else {
    this.getFillColor = () => value;
  }
  return this;
}
