import * as chrt from 'chrt';
import chrtBars from '../../../src/chrtBars'

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
    .margins({top:0,bottom:0})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrtBars()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(1)
        .stroke('#333')
        .strokeWidth(1)
        .strokeOpacity(0.8)
        .fill('#ff6600')
        .fillOpacity(0.5)
    );
}
