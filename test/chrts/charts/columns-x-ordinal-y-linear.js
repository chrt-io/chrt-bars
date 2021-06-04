import * as chrt from 'chrt';
import Chrt from 'chrt-core'
import chrtColumns from '~/chrtBars/chrtColumns'

const data = [
  {
    x: '0',
    y: 10
  },
  {
    x: '1',
    y: 14
  },
  {
    x: '2',
    y: 14
  },
  {
    x: '3',
    y: 22
  }
];

export default async function(container) {
  return Chrt()
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
        .width(0.5)
    );
}
