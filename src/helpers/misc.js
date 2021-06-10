import {COMPONENTS_W_DATA} from '~/constants';

export function isNull(value) {
  return value === null || value == null || typeof value === 'undefined';
}

export function hasData(obj) {
  return !isNull(obj.type) && COMPONENTS_W_DATA.indexOf(obj.type) > -1
}

export function isInfinity(value) {
  return !isFinite(value);
}
