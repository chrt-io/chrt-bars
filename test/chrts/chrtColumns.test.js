import * as chrt from 'chrt';
import chrtColumns from '~/chrtColumns'

describe('Testing chrtColumns', () => {
  test('Test getXScale', () => {
    const chart = chrt.Chrt()
                    .data([0,1,2,3,4,5])
    let columns;
    chart.add(columns = chrtColumns())

    const scale = columns.getXScale();

    expect(scale).toBeDefined();
    expect(scale.getName()).toBeDefined();
    expect(scale.getName()).toBe('x');

  });
});
