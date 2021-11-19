import { lineWidth, lineColor, fill, fillOpacity, strokeOpacity, width, inset, binwidth } from './lib';
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
} from './constants';
import chrtObject, { utils } from 'chrt-object';
const { isNull, isInfinity, createSVG: create } = utils;

function chrtBars() {
  chrtObject.call(this);
  this.type = 'series';

  this._stacked = null;
  this._grouped = 1;
  this._groupIndex = 0;

  //this.strokeWidth = DEFAULT_STROKE_WIDTH;
  let _barWidth = DEFAULT_BAR_WIDTH;
  this.attr('barRatioWidth', DEFAULT_BAR_RADIO_WIDTH);
  this.attr('inset', DEFAULT_BAR_INSET);
  this.attr('stroke', DEAULT_LINE_COLOR);
  this.attr('fill', DEAULT_FILL_COLOR);
  this.attr('fillOpacity', DEFAULT_FILL_OPACITY);
  this.attr('strokeWidth', DEFAULT_STROKE_WIDTH);
  this.attr('strokeOpacity', DEFAULT_STROKE_OPACITY);


  this._classNames = ['chrt-bars'];

  this.getXScale = () => {
    if(isNull(this.fields.x)) {
      this.fields.x = this.parentNode?.scales.x[this.scales.x].field;
    }
    return this.parentNode?.scales.x[this.scales.x];
  }

  this.barWidth = () => _barWidth;

  this.draw = () => {
    if(!this.parentNode) {
      return this;
    }
    const { _margins, scales } = this.parentNode;

    this.g.classList.remove(...this.g.classList)
    this.g.classList.add(...this._classNames);

    if(isNull(this.fields.y)) {
      this.fields.y = scales.y[this.scales.y].field;
    }
    if(isNull(this.fields.x)) {
      this.fields.x = scales.x[this.scales.x].field;
    }
    if(isNull(this.fields.x0)) {
      this.fields.x0 = `${scales.x[this.scales.x].field}0`;
    }

    const _scaleX = scales.x[this.scales.x];
    const _scaleY = scales.y[this.scales.y];

    const _data = this._data.length ? this._data : this.parentNode._data;
    if(!isNull(_data)) {
      const padding = this.parentNode.padding();
      const rangeWidth = Math.abs((_scaleY.range[1] - _scaleY.range[0])) - (_margins.top+_margins.bottom);

      if(_scaleY.transformation === 'ordinal') {
        _barWidth = rangeWidth / (_data.length || 1);
      } else {
        const n = Math.max(_scaleY.ticks().length, _data.length);
        _barWidth = rangeWidth / ((_scaleY.ticks(n).filter(d => _scaleY.isLog() ? !d.isMinor : true).length - 1) || 1);
      }

      const getBarModifier = () => {
        const barWidthModifier = _data.reduce((overlap,d,i,arr) => {
          if(d && arr[i + 1]) {
            const field0 = _scaleY(d[this.fields.y]);
            const field1 = _scaleY(arr[i + 1][this.fields.y]);
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
      // _barWidth = Math.max(_barWidth - (this.attr('inset')()), MIN_BAR_SIZE);

      const deltaY = barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2;
      this.g.setAttribute('transform', `translate(0, ${deltaY})`)

      const yAxis = this.parentNode.getAxis('y');
      const axisLineWidth = yAxis ? yAxis.width()() : 0;

      // redefine padding to accomodate bars withing the chart area
      if(_data.length && _scaleY.barwidth > 0) {
        const w = Math.abs(_scaleY.range[1] - _scaleY.range[0]) - (_margins.top + _margins.bottom);

        const bw = _scaleY.transformation === 'ordinal' ? w / _data.length : w / _scaleY.ticks().length;
        const deltaY = (_scaleY.range[1] - _barWidth / 2);

        if(!this.parentNode.originalPadding && _scaleY.transformation !== 'ordinal' && (deltaY < (padding?.bottom ?? 0) || (deltaY > (padding?.top ?? 0)))) {
          const padding = this.parentNode.padding();
          const newPadding = Object.assign({}, padding, {bottom: bw/2 + padding.bottom, top: bw/2 + padding.top})
          // console.log('newPadding', newPadding)
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
        const y = _scaleY(d[this.fields.y]); // - _barWidth / 2;
        if(isNaN(y)) {
          return;
        }
        const x = _scaleX(d[this._stacked ? `stacked_${this.fields.x}` : this.fields.x]);
        let x0 = !isNull(d[this.fields.x0]) ? (_scaleX.isLog() ? _scaleX.range[0] + _margins.left : _scaleX(d[this.fields.x0])) : null;
        if(isNull(x0)) {
          x0 = _scaleX.isLog() ? (_scaleX.range[0] - _margins.left) : _scaleX(_scaleX.domain[0] || 0);
          if((_scaleX.domain[0] || 0) * (_scaleX.domain[1] || 0) < 0) {
            x0 = _scaleX.isLog() ? (_scaleX.range[0] - _margins.left) : _scaleX(0);
          }
        }

        const _barLength = !isNaN(x) ? Math.max(Math.abs(x - x0), Math.abs(x - x0) - axisLineWidth / 2) : 0;
        const _barX = x > x0 ? x0 : x;

        if(typeof this.binwidth()() !== 'undefined') {
          _barWidth = Math.abs(_scaleY(d[this.fields.y] + this.binwidth()(d, i, arr)) - _scaleY(d[this.fields.y]));
        }


        const strokeWidth = this.attr('strokeWidth')(d, i, arr);

        const anchorPoints = {};
        anchorPoints.x = (isNaN(_barX) || isInfinity(_barX) ? _scaleX.range[0] : _barX) + strokeWidth * 0.5;

        // console.log('--------->', x,' > ',x0)
        anchorPoints.directions = {
          x: x > x0 ? 1 : 0,
          y: 1,
        };

        anchorPoints.y = (y - _barWidth/2) + _barWidth/2 * (1 - this.attr('barRatioWidth')(d, i, arr)) + strokeWidth * 0.5 + this.attr('inset')(d, i, arr) * 0.5;
        anchorPoints.width = Math.max(0, _barLength - strokeWidth);
        anchorPoints.height = Math.max(0, _barWidth * this.attr('barRatioWidth')(d, i, arr) - strokeWidth - this.attr('inset')(d, i, arr));

        anchorPoints.left = anchorPoints.x;
        anchorPoints.top = anchorPoints.y;
        anchorPoints.right = anchorPoints.x + anchorPoints.width;
        anchorPoints.bottom = anchorPoints.y + anchorPoints.height;

        anchorPoints.relativePosition = [1, 0.5];

        d.anchorPoints = anchorPoints;

        rect.setAttribute('x', anchorPoints.x);
        rect.setAttribute('y', anchorPoints.y);
        rect.setAttribute('width', anchorPoints.width);
        rect.setAttribute('height', anchorPoints.height);
        rect.setAttribute('fill', this.attr('fill')(d, i, arr));
        rect.setAttribute('fill-opacity', this.attr('fillOpacity')(d, i, arr));
        rect.setAttribute('stroke', this.attr('stroke')(d, i, arr));
        rect.setAttribute('stroke-width', strokeWidth);
        rect.setAttribute('stroke-opacity', this.attr('strokeOpacity')(d, i, arr));
      });
    }

    this.objects.forEach((obj) => obj.draw());

    return this;
  };
}

chrtBars.prototype = Object.create(chrtObject.prototype);
chrtBars.prototype.constructor = chrtBars;
chrtBars.parent = chrtObject.prototype;

chrtBars.prototype = Object.assign(chrtBars.prototype, {
  width,
  inset,
  strokeWidth: lineWidth,
  color: lineColor,
  stroke: lineColor,
  fill,
  fillOpacity,
  strokeOpacity,
  binwidth
});

export default function() {
  return new chrtBars();
}
