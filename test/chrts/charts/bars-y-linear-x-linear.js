import * as chrt from 'chrt';
import chrtBars from '../../../src/chrtBars'

const data = new Array(3).fill(1).map((d,i) => ({x: i || 4, y: i}));

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .add(chrt.xAxis(3))
    .add(chrt.yAxis())
    .add(
      chrtBars()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(1)
        .stroke('#000')
        .strokeWidth(3)
        .strokeOpacity(1)
        .fill('#ff6600')
        .fillOpacity(0.5)
    );
}
