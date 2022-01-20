import * as chrt from 'chrt';
import chrtHistograms from '../../../src/chrtHistograms'

const data = [
  {
    x0: 0,
    x1: 10,
    y: 0.2,
  },
  {
    x0: 10,
    x1: 15,
    y: 0.18,
  },
  {
    x0: 15,
    x1: 20,
    y: 0.20,
  },
  {
    x0: 20,
    x1: 30,
    y: 0.10,
  },
  {
    x0: 30,
    x1: 40,
    y: 0.40,
  },
]

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    //.x({domain:[0,1]})
    .add(chrt.xAxis().format(d => d.toFixed(2)))
    .add(chrt.yAxis(4))
    .add(
      chrtHistograms()
        .data(data, d => ({
          x: d.x0,
          y: d.y,
        }))
        .inset(1)
        // .width(1)
        .fill('#c93f55')
        .fillOpacity(d => d.y)
    );
}
