import * as chrt from 'chrt';
import chrtBars from '~/chrtBars/chrtBars'

const subset = [10,25, 35]
const data = new Array(50).fill(1).map((d,i) => ({x: i + 10, y: i})).filter((d,i) => subset.indexOf(i) > -1);

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({domain:[0,50]})
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
        .binwidth(10)
    );
}
