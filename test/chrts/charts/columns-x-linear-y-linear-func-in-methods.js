import * as chrt from 'chrt';
import chrtColumns from '../../../src/chrtColumns'

const data = new Array(5).fill(1).map((d,i) => ({x: i, y: i})).filter((d,i) => i < 35 || i > 40);
// const data = new Array(2).fill(1).map((d,i) => ({x: i, y: i}));

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    //.x({domain:[0,1]})
    .add(chrt.xAxis().format(d => d.toFixed(2)))
    .add(chrt.yAxis())
    .add(
      chrtColumns()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        //.inset(0)
        //.width(1)
        .fill((d,i) => {
          return i%2 ? '#f00' : '#0f0'
        })
        .fillOpacity(0.15)
        .strokeWidth((d,i) => {
          return i > 20 ? 2 : 5
        })
    );
}
