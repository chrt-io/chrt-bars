import * as chrt from 'chrt';
import chrtColumns from '../../../src/chrtColumns'

const data = [0,3,5,3,7,9,2,5];

export default async function(container) {
  const chart = chrt.Chrt()
    .node(container)
    .data(data)
    .size(600, 200)
    .add(chrt.xAxis(8))
    .add(chrt.yAxis())
    .add(
      chrtColumns().data(data)
    );
  return chart
}
