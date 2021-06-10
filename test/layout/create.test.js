import { create, createSVG } from '~/layout';

describe('Testing layout functions', () => {
  test('Test create', () => {
    const mockElement = create('div');
    expect(mockElement instanceof HTMLDivElement).toBe(true);
  });

  test('Test createSVG', () => {
    const mockPath = createSVG('path');
    expect(mockPath instanceof SVGElement).toBe(true);
  });
});
