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
    .x({scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis().hideAxis())
    .add(chrt.yAxis().zero(0))
    .add(
      chrt.chrtStack()
        .orientation('left')
        .add(
          chrt.chrtBars()
            .data(data, d => ({
              x: d.x,
              y: d.y,
            }))
            .width(0.5)
            .stroke('#333')
            .strokeWidth(1)
            .strokeOpacity(0.8)
            .fill('#f00')
            .fillOpacity(0.5)
        )
        .add(
          chrt.chrtBars()
            .data(data, d => ({
              x: d.x,
              y: d.y,
            }))
            .width(0.5)
            .stroke('#333')
            .strokeWidth(1)
            .strokeOpacity(0.8)
            .fill('#0f0')
            .fillOpacity(0.5)
        )
        .add(
          chrt.chrtBars()
            .data(data, d => ({
              x: -d.x,
              y: d.y,
            }))
            .width(0.5)
            .stroke('#333')
            .strokeWidth(1)
            .strokeOpacity(0.8)
            .fill('#00f')
            .fillOpacity(0.5)
        )
        .add(
          chrt.chrtBars()
            .data(data, d => ({
              x: -d.x/2,
              y: d.y,
            }))
            .width(0.5)
            .stroke('#333')
            .strokeWidth(1)
            .strokeOpacity(0.8)
            .fill('#0ff')
            .fillOpacity(0.5)
        )
    );
}
