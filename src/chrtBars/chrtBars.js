import { isNull } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fill, width } from './lib';
import { chrtGeneric } from 'chrt-core';

const DEFAULT_STROKE_WIDTH = 0;
const DEAULT_LINE_COLOR = '#000';
const DEAULT_FILL_COLOR = '#ddd';
const DEFAULT_BAR_WIDTH = 3;
const DEFAULT_BAR_RADIO_WIDTH = 1;

function chrtBars() {
  chrtGeneric.call(this);
  this.type = 'series';

  this._stacked = null;
  this._grouped = 1;
  this._groupIndex = 0;

  //this.strokeWidth = DEFAULT_STROKE_WIDTH;
  let _barWidth = DEFAULT_BAR_WIDTH;
  this.attr('barRatioWidth', DEFAULT_BAR_RADIO_WIDTH);
  this.attr('stroke', DEAULT_LINE_COLOR);
  this.attr('fill', DEAULT_FILL_COLOR);
  this.attr('strokeWidth', DEFAULT_STROKE_WIDTH);
  this.fields.y0 = 'y0';

  this.draw = () => {
    const { _margins, scales } = this.parentNode;
    const _data = this._data.length ? this._data : this.parentNode._data;
    if(!isNull(_data)) {
      _barWidth = _data.reduce((acc, d, i, arr) => {
        const next = arr[i + 1];
        if(!isNull(d) && !isNull(d[this.fields.x]) && !isNull(next) && !isNull(next[this.fields.x])) {
          const x1 = scales['x'](d[this.fields.x]);
          const x2 = scales['x'](next[this.fields.x]);
          const delta = Math.abs(x2 - x1);
          acc = delta < acc ? delta : acc;
        }
        return acc;
      }, scales['x'].barwidth);
      const flooredBarWidth = Math.floor(_barWidth);
      const barWidth = (flooredBarWidth || _barWidth) || 0;
      const _grouped = this._stacked ? this._stacked._grouped : this._grouped || this._grouped;
      const _groupIndex = this._stacked ? this._stacked._groupIndex : this._groupIndex || this._groupIndex;
      _barWidth = barWidth / (_grouped) * this.attr('barRatioWidth')();
      this.g.setAttribute('transform', `translate(${barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2}, 0)`)

      const xAxis = this.parentNode.getAxis('x');
      const axisLineWidth = xAxis ? xAxis.width() : 0;

      _data.forEach((d, i, arr) => {
        // const point = points.find(p => )
        let rect = this.g.querySelector(`[data-id='rect-${name}-${i}']`);
        if (!rect) {
          rect = create('rect');
          rect.setAttribute('data-id', `rect-${name}-${i}`);
          // rect.setAttribute('shape-rendering', 'crispEdges');
          this.g.appendChild(rect);
        }
        const x = scales['x'](d[this.fields.x]) - _barWidth / 2;
        if(isNaN(x)) {
          return;
        }
        const y = scales['y'](d[this._stacked ? `stacked_${this.fields.y}` : this.fields.y]);
        // const y0 = scales['y'](0);
        let y0 = !isNull(d[this.fields.y0]) ? scales['y'](d[this.fields.y0]) : null;
        if(isNull(y0)) {
          y0 = scales['y'].isLog() ? (scales['y'].range[0] - _margins.bottom) : scales['y'](0);
        }
        // console.log('--->', d, y0)
        rect.setAttribute('x', x);
        rect.setAttribute('y', y > y0 ? y0 : y);
        rect.setAttribute('width', _barWidth);
        rect.setAttribute('height', Math.max(Math.abs(y - y0), Math.abs(y - y0) - axisLineWidth / 2));
        rect.setAttribute('fill', this.attr('fill')(d, i, arr));
        rect.setAttribute('stroke', this.attr('stroke')(d, i, arr));
        rect.setAttribute('stroke-width', this.attr('strokeWidth')(d, i, arr));
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
  fill,
});

// export default chrtBars;
export default function() {
  return new chrtBars();
}
