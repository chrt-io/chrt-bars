import * as chrt from 'chrt';
import chrtBars from '../../../src/chrtBars'
// import { yAxis, xAxis } from 'chrt-axis';
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
    .add(
      chrtBars()
        .data(data, d => ({
          x: d.y,
          y: d.x,
        }))
        .width(0.75)

    )
    .add(chrt.xAxis())
    .add(chrt.yAxis().zero(0))
}
