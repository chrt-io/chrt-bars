import * as chrt from 'chrt';
import chrtColumns from '../../../src/chrtColumns'

const data = [
  {
    x: 'a',
    y: 1000
  },
  {
    x: 'b',
    y: 14
  },
  {
    x: 'c',
    y: 140
  },
  {
    x: 'd',
    y: 22
  }
];

export default async function(container) {
  const chart = chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'ordinal'})
    .y({scale:'log'})
    .add(
      chrtColumns()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(1)
        .inset(5)
    )
    .add(chrt.xAxis())
    .add(chrt.yAxis())

  return chart;
}
