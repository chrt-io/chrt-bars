import { isNull, isInfinity } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fill, width, fillOpacity, strokeOpacity, inset, binwidth } from './lib';
import {
  DEFAULT_STROKE_WIDTH,
  DEAULT_LINE_COLOR,
  DEAULT_FILL_COLOR,
  DEFAULT_STROKE_OPACITY,
  DEFAULT_FILL_OPACITY,
  DEFAULT_BAR_WIDTH,
  DEFAULT_BAR_RADIO_WIDTH,
  DEFAULT_BAR_INSET,
  MIN_BAR_SIZE,
  ROUND
} from '~/constants';
import chrtGeneric from 'chrt-object';

function chrtColumns() {
  chrtGeneric.call(this);
  this.type = 'series';

  this._stacked = null;
  this._grouped = 1;
  this._groupIndex = 0;

  let _barWidth = DEFAULT_BAR_WIDTH;
  this.attr('barRatioWidth', DEFAULT_BAR_RADIO_WIDTH);
  this.attr('inset', DEFAULT_BAR_INSET);
  this.attr('stroke', DEAULT_LINE_COLOR);
  this.attr('fill', DEAULT_FILL_COLOR);
  this.attr('fillOpacity', DEFAULT_FILL_OPACITY);
  this.attr('strokeWidth', DEFAULT_STROKE_WIDTH);
  this.attr('strokeOpacity', DEFAULT_STROKE_OPACITY);
  // this.attr('binwidth', null);

  this._classNames = ['chrt-columns'];

  this.getXScale = () => {
    if(isNull(this.fields.x)) {
      this.fields.x = this.parentNode?.scales.x[this.scales.x].field;
    }
    return this.parentNode?.scales.x[this.scales.x];
  }

  this.draw = () => {
    if(!this.parentNode) {
      return this;
    }
    const { _margins, scales } = this.parentNode;

    this._classNames.forEach((d) => this.g.classList.add(d));

    if(isNull(this.fields.x)) {
      this.fields.x = scales.x[this.scales.x].field;
    }
    if(isNull(this.fields.y)) {
      this.fields.y = scales.y[this.scales.y].field;
    }
    if(isNull(this.fields.y0)) {
      this.fields.y0 = `${scales.y[this.scales.y].field}0`;
    }

    const _scaleX = scales.x[this.scales.x];
    const _scaleY = scales.y[this.scales.y];
    const _data = this._data.length ? this._data : this.parentNode._data;

    if(!isNull(_data)) {
      const padding = this.parentNode.padding();

      const rangeWidth = Math.abs((_scaleX.range[1] - _scaleX.range[0])) - (_margins.left+_margins.right);

      if(_scaleX.transformation === 'ordinal') {
        _barWidth = rangeWidth / (_data.length || 1);
      } else {
        const n = Math.max(_scaleX.ticks().length, _data.length);
        _barWidth = rangeWidth / ((_scaleX.ticks(n).filter(d => _scaleX.isLog() ? !d.isMinor : true).length - 1) || 1);
      }

      const getBarModifier = () => {
        const barWidthModifier = _data.reduce((overlap,d,i,arr) => {
          if(d && arr[i + 1]) {
            const field0 = _scaleX(d[this.fields.x]);
            const field1 = _scaleX(arr[i + 1][this.fields.x]);
            overlap = Math.abs(field1 - field0) / _barWidth;
          }
          return Math.min(1, overlap);
        }, 1)
        return barWidthModifier;
      }

      _barWidth = _barWidth * getBarModifier.call(this);

      const flooredBarWidth = Math.floor(_barWidth);
      let barWidth = (ROUND ? flooredBarWidth : _barWidth) || MIN_BAR_SIZE;
      if(isNaN(barWidth) || isInfinity(barWidth)) {
        barWidth = MIN_BAR_SIZE;
      }

      barWidth = barWidth * (this._group ? this._group.width() : 1);

      const _grouped = this._stacked ? this._stacked._grouped : this._grouped || this._grouped;
      const _groupIndex = this._stacked ? this._stacked._groupIndex : this._groupIndex || this._groupIndex;

      _barWidth = barWidth / (_grouped);

      const deltaX = barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2;
      this.g.setAttribute('transform', `translate(${deltaX}, 0)`)

      const xAxis = this.parentNode.getAxis('x');
      const axisLineWidth = xAxis ? xAxis.lineWidth()() : 0;

      // redefine padding to accomodate bars withing the chart area
      if(_data.length && _scaleX.barwidth > 0) {
        const w = (_scaleX.range[1] - _scaleX.range[0]) - (_margins.left + _margins.right);
        const bw = _scaleX.transformation === 'ordinal' ? w / _data.length : w / _scaleX.ticks().length;
        const deltaX = (_scaleX.range[0] - _barWidth / 2);

        if(!this.parentNode.originalPadding && _scaleX.transformation !== 'ordinal' && (deltaX < (padding?.left ?? 0) || (deltaX > (padding?.right ?? 0)))) {
          const padding = this.parentNode.padding();
          const newPadding = Object.assign({}, padding, {left: bw/2 + padding.left, right: bw/2 + padding.right})
          return this.parentNode.padding(newPadding, true);
        }
      }

      _data.forEach((d, i, arr) => {
        let rect = this.g.querySelector(`[data-id='rect-${name}-${i}']`);
        if (!rect) {
          rect = create('rect');
          rect.setAttribute('data-id', `rect-${name}-${i}`);
          rect.setAttribute('shape-rendering', 'crispEdges');
          this.g.appendChild(rect);
        }
        const x = _scaleX(d[this.fields.x]); // - _barWidth / 2;
        if(isNaN(x)) {
          return;
        }
        const y = _scaleY(d[this._stacked ? `stacked_${this.fields.y}` : this.fields.y]);
        let y0 = !isNull(d[this.fields.y0]) ? _scaleY(d[this.fields.y0]) : null;

        if(isNull(y0)) {
          y0 = _scaleY.isLog() ? (_scaleY.range[0] - _margins.bottom) : _scaleY(_scaleY.domain[0] || 0);
          if((_scaleY.domain[0] || 0) * (_scaleY.domain[1] || 0) < 0) {
            y0 = _scaleY.isLog() ? (_scaleY.range[0] - _margins.bottom) : _scaleY(0);
          }
        }

        const _barLength = !isNaN(y) ? Math.max(Math.abs(y - y0), Math.abs(y - y0) - axisLineWidth / 2) : 0;
        const _barY = y > y0 ? y0 : y;

        if(typeof this.binwidth()() !== 'undefined') {
          _barWidth = Math.abs(_scaleX(d[this.fields.x] + this.binwidth()(d, i, arr)) - _scaleX(d[this.fields.x]));
        }

        // _barWidth = Math.max(_barWidth - (this.attr('inset')()), MIN_BAR_SIZE);

        const strokeWidth = this.attr('strokeWidth')(d, i, arr);
        rect.setAttribute('x', (x - _barWidth/2) + _barWidth/2 * (1 - this.attr('barRatioWidth')(d, i, arr)) + strokeWidth * 0.5 + this.attr('inset')(d, i, arr)/2);
        rect.setAttribute('y', (isNaN(_barY) || isInfinity(_barY) ? _scaleY.range[0] : _barY) + strokeWidth * 0.5);
        rect.setAttribute('width', Math.max(0, _barWidth * this.attr('barRatioWidth')(d, i, arr) - strokeWidth - this.attr('inset')(d, i, arr)));
        rect.setAttribute('height', Math.max(0, isNaN(_barLength) ? 0 : (_barLength - strokeWidth)));
        rect.setAttribute('fill', this.attr('fill')(d, i, arr));
        rect.setAttribute('fill-opacity', this.attr('fillOpacity')(d, i, arr));
        rect.setAttribute('stroke', this.attr('stroke')(d, i, arr));
        rect.setAttribute('stroke-width', strokeWidth);
        rect.setAttribute('stroke-opacity', this.attr('strokeOpacity')(d, i, arr));
        // rect.setAttribute('stroke-linecap', 'square');
      });
    }

    this.objects.forEach((obj) => obj.draw());

    return this.parentNode;
  };
}

chrtColumns.prototype = Object.create(chrtGeneric.prototype);
chrtColumns.prototype.constructor = chrtColumns;
chrtColumns.parent = chrtGeneric.prototype;

chrtColumns.prototype = Object.assign(chrtColumns.prototype, {
  width,
  inset,
  strokeWidth: lineWidth,
  color: lineColor,
  stroke: lineColor,
  fill,
  fillOpacity,
  strokeOpacity,
  binwidth,
});

export default function() {
  return new chrtColumns();
}
