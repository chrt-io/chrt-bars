import * as chrt from 'chrt';
import chrtColumns from '../../../src/chrtColumns'

const data = [
  {
    x: 'a',
    y: 10
  },
  {
    x: 'b',
    y: 14
  },
  {
    x: 'c',
    y: 14
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
    .y({scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrtColumns()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(1)
        .strokeWidth(10)
    );
    
  return chart;
}
