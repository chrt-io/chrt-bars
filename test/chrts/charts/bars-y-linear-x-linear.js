import * as chrt from 'chrt';
import chrtBars from '~/chrtBars/chrtBars'

const data = new Array(100).fill(1).map((d,i) => ({x: i, y: i}));

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrtBars()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(1)
        .stroke('#fff')
        .strokeWidth(0.5)
        .strokeOpacity(1)
        .fill('#ff6600')
        .fillOpacity(0.5)
    );
}
