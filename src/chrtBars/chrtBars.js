import { isNull } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fillColor, width } from './lib';
import { chrtGeneric } from 'chrt-core';

const DEFAULT_STROKE_WIDTH = 0;
const DEAULT_LINE_COLOR = '#000';
const DEAULT_FILL_COLOR = '#ddd';
const DEFAULT_BAR_WIDTH = 3;
const DEFAULT_BAR_RADIO_WIDTH = 1;

function chrtBars() {
  chrtGeneric.call(this);
  this.type = 'series';

  this.strokeWidth = DEFAULT_STROKE_WIDTH;
  this.stroke = DEAULT_LINE_COLOR;
  this.barWidth = DEFAULT_BAR_WIDTH;
  this.barRatioWidth = DEFAULT_BAR_RADIO_WIDTH;
  this.fillColor = DEAULT_FILL_COLOR;

  this.fields.y0 = 'y0';

  this.draw = () => {
    const { _margins, scales } = this.parentNode;
    const _data = this._data.length ? this._data : this.parentNode._data;
    if(!isNull(_data)) {
      this.barWidth = _data.reduce((acc, d, i, arr) => {
        const next = arr[i + 1];
        if(!isNull(d) && !isNull(d[this.fields.x]) && !isNull(next) && !isNull(next[this.fields.x])) {
          const x1 = scales['x'](d[this.fields.x]);
          const x2 = scales['x'](next[this.fields.x]);
          const delta = Math.abs(x2 - x1);
          acc = delta < acc ? delta : acc;
        }
        return acc;
      }, scales['x'].barwidth);
      const flooredBarWidth = Math.floor(this.barWidth);
      this.barWidth = (flooredBarWidth || this.barWidth) * this.barRatioWidth;

      const xAxis = this.parentNode.getAxis('x');
      const axisLineWidth = xAxis ? xAxis.width() : 0;

      _data.forEach((d, i) => {
        // const point = points.find(p => )
        let rect = this.g.querySelector(`[data-id='rect-${name}-${i}']`);
        if (!rect) {
          rect = create('rect');
          rect.setAttribute('data-id', `rect-${name}-${i}`);
          this.g.appendChild(rect);
        }
        const x = scales['x'](d[this.fields.x]) - this.barWidth / 2;
        if(isNaN(x)) {
          return;
        }
        const y = scales['y'](d[this.fields.y]);
        // const y0 = scales['y'](0);
        let y0 = !isNull(this.fields.y0) ? scales['y'](d[this.fields.y0]) : null;
        if(isNull(y0)) {
          y0 = scales['y'].isLog() ? (scales['y'].range[0] - _margins.bottom) : scales['y'](0);
        }
        // console.log('--->', d, this.fields)
        rect.setAttribute('x', x);
        rect.setAttribute('y', y > y0 ? y0 : y);
        rect.setAttribute('width', this.barWidth);
        rect.setAttribute('height', Math.max(Math.abs(y - y0), Math.abs(y - y0) - axisLineWidth / 2));
        rect.setAttribute('fill', this.fillColor);
        rect.setAttribute('stroke', this.stroke);
        rect.setAttribute('stroke-width', this.strokeWidth);
      });

      // // // console.log('points', points);
    }
    return this.parentNode;
  };
}

chrtBars.prototype = Object.create(chrtGeneric.prototype);
chrtBars.prototype.constructor = chrtBars;
chrtBars.parent = chrtGeneric.prototype;

chrtBars.prototype = Object.assign(chrtBars.prototype, {
  width,
  strokeWidth: lineWidth,
  color: lineColor,
  fill: fillColor,
});

export default chrtBars;
