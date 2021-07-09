import * as chrt from 'chrt';
import chrtColumns from '~/chrtBars/chrtColumns'

const data = new Array(50).fill(1).map((d,i) => ({x: new Date(2021,0,i), y: i})).filter((d,i) => i < 25 || i > 30);

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'time'})
    .add(chrt.xAxis().interval('week').format(d => new Intl.DateTimeFormat('en-US', {day: 'numeric'}).format(d)))
    .add(chrt.yAxis())
    .add(
      chrtColumns()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        //.inset(0)
        //.width(1)
        .fill('#000')
        .fillOpacity(0.15)
    );
}
