import * as chrt from 'chrt';
import chrtBars from '../../../src/chrtBars'

const data = [
  {
    y: 'a',
    x: 1000
  },
  {
    y: 'b',
    x: 14
  },
  {
    y: 'c',
    x: 120
  },
  {
    y: 'd',
    x: 500
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .y({scale:'ordinal'})
    .x({scale:'log'})
    .margins({top:0,bottom:40})
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
    )
    .add(chrt.xAxis())
    .add(chrt.yAxis())
}
