import * as chrt from 'chrt';
import chrtHistograms from '../../../src/chrtHistograms'

const data = new Array(10).fill(1).map((d,i) => ({x0: i * 10, x1: (i+1) * 10, y: i / 10}));

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    //.x({domain:[0,1]})
    // .y({domain: [0,null]})
    .add(chrt.xAxis().format(d => d.toFixed(2)))
    .add(chrt.yAxis(4))
    .add(
      chrtHistograms()
        .data(data, d => ({
          x: d.x0,
          y: d.y,
        }))
        .inset(0)
        // .width(1)
        .fill('#000')
        .fillOpacity(d => d.y)
    );
}
