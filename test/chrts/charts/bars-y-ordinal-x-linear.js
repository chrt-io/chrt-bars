import * as chrt from 'chrt';
import chrtBars from '~/chrtBars/chrtBars'

const data = [
  {
    y: 'a',
    x: 10
  },
  {
    y: 'b',
    x: 14
  },
  {
    y: 'c',
    x: 14
  },
  {
    y: 'd',
    x: 22
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .y({scale:'ordinal'})
    .x({domain:[0,null], scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis().hideAxis())
    .add(chrt.yAxis())
    .add(
      chrtBars()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(0.5)
        .stroke('#333')
        .strokeWidth(2)
        .strokeOpacity(0.8)
        .fill('#ff6600')
        .fillOpacity(0.5)
    );
}
