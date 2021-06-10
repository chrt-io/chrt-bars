import * as chrt from 'chrt';
import chrtColumns from '~/chrtBars/chrtColumns'

const data = new Array(100).fill(1).map((d,i) => ({x: i, y: i}));

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .add(chrt.xAxis(10))
    .add(chrt.yAxis())
    .add(
      chrtColumns()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(1)
    );
}
