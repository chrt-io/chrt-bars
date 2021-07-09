import { isNull, isInfinity } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fill, fillOpacity, strokeOpacity, width, inset } from './lib';
import chrtGeneric from 'chrt-object';

const DEFAULT_STROKE_WIDTH = 0;
const DEAULT_LINE_COLOR = '#000';
const DEAULT_FILL_COLOR = '#ddd';
const DEFAULT_STROKE_OPACITY = 1;
const DEFAULT_FILL_OPACITY = 1;
const DEFAULT_BAR_WIDTH = 3;
const DEFAULT_BAR_RADIO_WIDTH = 1;
const DEFAULT_BAR_INSET = 1;
const ROUND = false;

const MIN_BAR_SIZE = 1;

function chrtBars() {
  chrtGeneric.call(this);
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
      this.fields.x = this.parentNode.scales.x[this.scales.x].field;
    }
    return this.parentNode.scales.x[this.scales.x];
  }

  this.barWidth = () => _barWidth;

  this.draw = () => {
    const { _margins, scales } = this.parentNode;

    this._classNames.forEach((d) => this.g.classList.add(d));

    if(isNull(this.fields.y)) {
      this.fields.y = scales.y[this.scales.y].field;
    }
    if(isNull(this.fields.x)) {
      //console.log('this.scales', this.scales)
      //console.log('this.parentNode.scales', this.parentNode.scales)
      this.fields.x = scales.x[this.scales.x].field;
    }
    if(isNull(this.fields.x0)) {
      this.fields.x0 = `${scales.x[this.scales.x].field}0`;
    }

    const _scaleX = scales.x[this.scales.x];
    const _scaleY = scales.y[this.scales.y];
    // console.log('_scaleY.barwidth', _scaleY.barwidth)
    const _data = this._data.length ? this._data : this.parentNode._data;
    if(!isNull(_data)) {
      const padding = this.parentNode.padding();
      const rangeWidth = Math.abs((_scaleY.range[1] - _scaleY.range[0])) - (_margins.top+_margins.bottom);

      // _barWidth = rangeWidth / ((_data.length - (_scaleY.transformation === 'ordinal' ? 0 : 1)) || 1);
      // _barWidth = rangeWidth / ((_scaleY.ticks().filter(d => _scaleY.isLog() ? !d.isMinor : true).length - (_scaleY.transformation === 'ordinal' ? 0 : 1)) || 1);

      if(_scaleY.transformation === 'ordinal') {
        _barWidth = rangeWidth / ((_data.length - (_scaleX.transformation === 'ordinal' ? 0 : 1)) || 1);
      } else {
        // const k = Math.ceil(Math.log2(_data.length) + 1);
        // console.log('Sturges', k)
        //
        // console.log('_data.length', _data.length)
        // console.log('_scaleY.ticks().length', _scaleY.ticks().length)
        // console.log(_scaleX)

        const n = Math.max(_scaleY.ticks().length, _data.length);
        _barWidth = rangeWidth / ((_scaleY.ticks(n).filter(d => _scaleY.isLog() ? !d.isMinor : true).length - (_scaleY.transformation === 'ordinal' ? 0 : 1)) || 1);
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

        // console.log('barWidthModifier', barWidthModifier)
        return barWidthModifier;
      }

      _barWidth = _barWidth * getBarModifier.call(this);

      const flooredBarWidth = Math.floor(_barWidth);
      let barWidth = (ROUND ? flooredBarWidth : _barWidth) || MIN_BAR_SIZE;
      if(isNaN(barWidth) || isInfinity(barWidth)) {
        barWidth = MIN_BAR_SIZE;
      }
      barWidth = barWidth * (this._group ? this._group.width() : 1);
      //console.log('GROUP WIDTH', this._group ? this._group.width() : 1)

      const _grouped = this._stacked ? this._stacked._grouped : this._grouped || this._grouped;
      const _groupIndex = this._stacked ? this._stacked._groupIndex : this._groupIndex || this._groupIndex;
      // _barWidth = barWidth / (_grouped) * this.attr('barRatioWidth')();
      // this.g.setAttribute('transform', `translate(0, ${barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2})`)

      _barWidth = barWidth / (_grouped);
      _barWidth = Math.max(_barWidth - (this.attr('inset')()), MIN_BAR_SIZE);

      const deltaY = barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2;
      this.g.setAttribute('transform', `translate(0, ${deltaY})`)

      const yAxis = this.parentNode.getAxis('y');
      const axisLineWidth = yAxis ? yAxis.width()() : 0;
      //console.log(_scaleY)
      // redefine padding to accomodate bars withing the chart area
      //console.log('_data.length', _data.length, '_scaleY.barwidth', _scaleY.barwidth)
      if(_data.length && _scaleY.barwidth > 0) {
        // console.log('range', _scaleY.range)
        const w = Math.abs(_scaleY.range[1] - _scaleY.range[0]) - (_margins.top + _margins.bottom);
        // const bw = w / _data.length;
        const bw = _scaleY.transformation === 'ordinal' ? w / _data.length : w / _scaleY.ticks().length;
        const deltaY = (_scaleY.range[1] - _barWidth / 2);
        // console.log(deltaY, '<', padding.top)
        // if(!this.parentNode.originalPadding && _scaleY.transformation !== 'ordinal' && deltaY < padding.bottom) {
        if(!this.parentNode.originalPadding && _scaleY.transformation !== 'ordinal' && (deltaY < (padding?.bottom ?? 0) || (deltaY > (padding?.top ?? 0)))) {
          const padding = this.parentNode.padding();
          // console.log('DELTAY IS',deltaY,'bw',bw)
          const newPadding = Object.assign({}, padding, {bottom: bw/2 + padding.bottom, top: bw/2 + padding.top})
          // console.log('newPadding', newPadding)
          // this.parentNode.originalPadding = this.parentNode.originalPadding || padding;
          return this.parentNode.padding(newPadding, true);
        }
      }

      _data.forEach((d, i, arr) => {
        // const point = points.find(p => )
        let rect = this.g.querySelector(`[data-id='rect-${name}-${i}']`);
        if (!rect) {
          rect = create('rect');
          rect.setAttribute('data-id', `rect-${name}-${i}`);
          // rect.setAttribute('shape-rendering', 'crispEdges');
          this.g.appendChild(rect);
        }
        const y = _scaleY(d[this.fields.y]) - _barWidth / 2;
        if(isNaN(y)) {
          return;
        }
        const x = _scaleX(d[this._stacked ? `stacked_${this.fields.x}` : this.fields.x]);
        // console.log('--->',this.fields.x, d[this._stacked ? `stacked_${this.fields.x}` : this.fields.x], x)
        // const y0 = _scaleY(0);
        let x0 = !isNull(d[this.fields.x0]) ? (_scaleX.isLog() ? _scaleX.range[0] + _margins.left : _scaleX(d[this.fields.x0])) : null;
        if(isNull(x0)) {
          // x0 = _scaleX.isLog() ? (_scaleX.range[0] + _margins.left) : _scaleX(0);

          x0 = _scaleX.isLog() ? (_scaleX.range[0] - _margins.left) : _scaleX(_scaleX.domain[0] || 0);
          if((_scaleX.domain[0] || 0) * (_scaleX.domain[1] || 0) < 0) {
            x0 = _scaleX.isLog() ? (_scaleX.range[0] - _margins.left) : _scaleX(0);
          }
        }

        // x0 = !isNull(d[this.fields.x0]) ? _scaleX(d[this.fields.x0]) : _scaleX(_scaleX.domain[0]);

        const _barLength = !isNaN(x) ? Math.max(Math.abs(x - x0), Math.abs(x - x0) - axisLineWidth / 2) : 0;
        const _barX = x > x0 ? x0 : x;

        // rect.setAttribute('x', x0);
        rect.setAttribute('x', isNaN(_barX) || isInfinity(_barX) ? _scaleX.range[0] : _barX);
        rect.setAttribute('y', y);
        rect.setAttribute('width', _barLength);
        rect.setAttribute('height', _barWidth);
        rect.setAttribute('fill', this.attr('fill')(d, i, arr));
        rect.setAttribute('fill-opacity', this.attr('fillOpacity')(d, i, arr));
        rect.setAttribute('stroke', this.attr('stroke')(d, i, arr));
        rect.setAttribute('stroke-width', this.attr('strokeWidth')(d, i, arr));
        rect.setAttribute('stroke-opacity', this.attr('strokeOpacity')(d, i, arr));
      });

      // // // console.log('points', points);
    }

    this.objects.forEach((obj) => obj.draw());

    return this;
  };
}

chrtBars.prototype = Object.create(chrtGeneric.prototype);
chrtBars.prototype.constructor = chrtBars;
chrtBars.parent = chrtGeneric.prototype;

chrtBars.prototype = Object.assign(chrtBars.prototype, {
  width,
  inset,
  strokeWidth: lineWidth,
  color: lineColor,
  stroke: lineColor,
  fill,
  fillOpacity,
  strokeOpacity
});

// export default chrtBars;
export default function() {
  return new chrtBars();
}
