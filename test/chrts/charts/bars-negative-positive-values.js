import * as chrt from 'chrt';
import chrtBars from '~/chrtBars/chrtBars'

const data = [
  {
    x: 'a',
    y: -10
  },
  {
    x: 'b',
    y: 14
  },
  {
    x: 'c',
    y: -14
  },
  {
    x: 'd',
    y: 22
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .y({scale:'ordinal'})
    .x({domain:[-20,20],scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis())
    .add(chrt.yAxis().zero(0))
    .add(
      chrtBars()
        .data(data, d => ({
          x: d.y,
          y: d.x,
        }))
        .width(0.5)

    );
}
