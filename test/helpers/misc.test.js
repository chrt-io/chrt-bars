import { isNull } from '~/helpers';

describe('Testing misc functions', () => {
  test('null is null', () => {
    expect(isNull(null)).toBe(true);
  });
});
