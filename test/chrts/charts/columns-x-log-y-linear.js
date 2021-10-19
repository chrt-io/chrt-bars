import * as chrt from 'chrt';
import chrtColumns from '../../../src/chrtColumns'

const data = new Array(5).fill(1).map((d,i) => ({x: Math.pow(10, i), y: i+5})).filter((d,i) => i !== 2);

export default async function(container) {
  const chart = chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({scale: 'log'})
    //.y({domain: [0, 20]})
    .add(chrt.xAxis(10))
    .add(chrt.yAxis())
    .add(
      chrtColumns()
        .data(data, d => ({
          x: d.x, // Math.log10(d.x || NaN),
          y: d.y,
        }))
        .width(1)
        .inset(2)
    );

  // console.log(chart)
  return chart
}
