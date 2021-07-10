import { isNull, isInfinity } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fill, width, fillOpacity, strokeOpacity, inset } from './lib';
import chrtGeneric from 'chrt-object';

const DEFAULT_STROKE_WIDTH = 0;
const DEAULT_LINE_COLOR = '#000';
const DEAULT_FILL_COLOR = '#ddd';
const DEFAULT_FILL_OPACITY = 1;
const DEFAULT_STROKE_OPACITY = 1;
const DEFAULT_BAR_WIDTH = 3;
const DEFAULT_BAR_RADIO_WIDTH = 1;
const DEFAULT_BAR_INSET = 1;
const MIN_BAR_SIZE = 1;
const ROUND = false;

function chrtColumns() {
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

  this._classNames = ['chrt-columns'];

  this.getXScale = () => {
    if(isNull(this.fields.x)) {
      this.fields.x = this.parentNode.scales.x[this.scales.x].field;
    }
    return this.parentNode.scales.x[this.scales.x];
  }

  this.draw = () => {
    const { _margins, scales } = this.parentNode;

    this._classNames.forEach((d) => this.g.classList.add(d));

    if(isNull(this.fields.x)) {
      this.fields.x = scales.x[this.scales.x].field;
    }
    if(isNull(this.fields.y)) {
      //console.log('this.scales', this.scales)
      //console.log('this.parentNode.scales', this.parentNode.scales)
      this.fields.y = scales.y[this.scales.y].field;
    }
    if(isNull(this.fields.y0)) {
      this.fields.y0 = `${scales.y[this.scales.y].field}0`;
    }

    const _scaleX = scales.x[this.scales.x];
    const _scaleY = scales.y[this.scales.y];
    const _data = this._data.length ? this._data : this.parentNode._data;
    // console.log(_data,this._data,this.parentNode._data)
    if(!isNull(_data)) {
      const padding = this.parentNode.padding();

      const rangeWidth = Math.abs((_scaleX.range[1] - _scaleX.range[0])) - (_margins.left+_margins.right);


      // if(_scaleX.transformation === 'ordinal') {
      //   _barWidth = rangeWidth / ((_data.length - (_scaleX.transformation === 'ordinal' ? 0 : 1)) || 1);
      // } else {
      //
      // }
      // console.log('TICKS', _scaleX.ticks())
      //_barWidth = rangeWidth / ((_scaleX.ticks().filter(d => _scaleX.isLog() ? !d.isMinor : true).length - (_scaleX.transformation === 'ordinal' ? 0 : 1)) || 1);
      if(_scaleX.transformation === 'ordinal') {
        _barWidth = rangeWidth / ((_data.length - (_scaleX.transformation === 'ordinal' ? 0 : 1)) || 1);
      } else {
        // const k = Math.ceil(Math.log2(_data.length) + 1);
        // console.log('Sturges', k)
        //
        // console.log('_data.length', _data.length)
        // console.log('_scaleX.ticks().length', _scaleX.ticks().length)
        // console.log(_scaleX)

        const n = Math.max(_scaleX.ticks().length, _data.length);
        _barWidth = rangeWidth / ((_scaleX.ticks(n).filter(d => _scaleX.isLog() ? !d.isMinor : true).length - (_scaleX.transformation === 'ordinal' ? 0 : 1)) || 1);
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

        // console.log('barWidthModifier', barWidthModifier)
        return barWidthModifier;
      }

      _barWidth = _barWidth * getBarModifier.call(this);

      const flooredBarWidth = Math.floor(_barWidth);
      let barWidth = (ROUND ? flooredBarWidth : _barWidth) || MIN_BAR_SIZE;
      if(isNaN(barWidth) || isInfinity(barWidth)) {
        barWidth = MIN_BAR_SIZE;
      }
      // console.log('calculating barwidth!', barWidth,' * ',(this._group ? this._group.width() : 1))
      barWidth = barWidth * (this._group ? this._group.width() : 1);
      // console.log('GROUP WIDTH', this._group ? this._group.width() : 1)
      // this.parentNode.padding({left: 100, right: 100})
      const _grouped = this._stacked ? this._stacked._grouped : this._grouped || this._grouped;
      const _groupIndex = this._stacked ? this._stacked._groupIndex : this._groupIndex || this._groupIndex;

      _barWidth = barWidth / (_grouped);
      _barWidth = Math.max(_barWidth - (this.attr('inset')()), MIN_BAR_SIZE);

      const deltaX = barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2;
      this.g.setAttribute('transform', `translate(${deltaX}, 0)`)

      const xAxis = this.parentNode.getAxis('x');
      // console.log('xAxis.width()', xAxis.width(), xAxis.width()())
      // console.log('xAxis.width()', xAxis.width(), xAxis.width()())
      const axisLineWidth = xAxis ? xAxis.width()() : 0;
      // console.log('axisLineWidth', axisLineWidth(), xAxis)
      // console.log('BARWIDTH', _barWidth, this.attr('barRatioWidth')())
      // console.log('_scaleX.barwidth', _scaleX.barwidth)
      // console.log('_data.length', _data.length)

      // redefine padding to accomodate bars withing the chart area
      if(_data.length && _scaleX.barwidth > 0) {
        // console.log('range', _scaleX.range)

        // const firstX = _scaleX(_data[0][this.fields.x]) - _barWidth / 2;
        /// const firstX = _scaleX.range[0] - _barWidth / 2;
        // const deltaX = Math.floor(Math.abs((_scaleX.range[0] + _margins.left) - _barWidth / 2));
        const w = (_scaleX.range[1] - _scaleX.range[0]) - (_margins.left + _margins.right);
        const bw = _scaleX.transformation === 'ordinal' ? w / _data.length : w / _scaleX.ticks().length;
        const deltaX = (_scaleX.range[0] - _barWidth / 2);
        // console.log(deltaX, '<', padding.left )
        if(!this.parentNode.originalPadding && _scaleX.transformation !== 'ordinal' && (deltaX < (padding?.left ?? 0) || (deltaX > (padding?.right ?? 0)))) {
          // console.log('deltaX', deltaX, padding)
          const padding = this.parentNode.padding();
          // console.log('range', _scaleX.range)
          // console.log('DELTAX IS',deltaX,'bw',bw)
          const newPadding = Object.assign({}, padding, {left: bw/2 + padding.left, right: bw/2 + padding.right})
          // console.log('newPadding', newPadding)
          // this.parentNode.originalPadding = this.parentNode.originalPadding || padding;
          return this.parentNode.padding(newPadding, true);
        }
      }
      // console.log('_data', _data)
      _data.forEach((d, i, arr) => {
        // const point = points.find(p => )
        let rect = this.g.querySelector(`[data-id='rect-${name}-${i}']`);
        if (!rect) {
          rect = create('rect');
          rect.setAttribute('data-id', `rect-${name}-${i}`);
          // rect.setAttribute('shape-rendering', 'crispEdges');
          this.g.appendChild(rect);
        }
        const x = _scaleX(d[this.fields.x]) - _barWidth / 2;
        //const x = _scaleX(d[this.fields.x]) - (_barWidth * this.attr('barRatioWidth')()) / 2;
        if(isNaN(x)) {
          return;
        }
        const y = _scaleY(d[this._stacked ? `stacked_${this.fields.y}` : this.fields.y]);
        // const y0 = _scaleY(0);
        let y0 = !isNull(d[this.fields.y0]) ? _scaleY(d[this.fields.y0]) : null;

        if(isNull(y0)) {
          y0 = _scaleY.isLog() ? (_scaleY.range[0] - _margins.bottom) : _scaleY(_scaleY.domain[0] || 0);
          if((_scaleY.domain[0] || 0) * (_scaleY.domain[1] || 0) < 0) {
            y0 = _scaleY.isLog() ? (_scaleY.range[0] - _margins.bottom) : _scaleY(0);
          }
        }
        // if(_scaleX.isLog()) {
        //   console.log(i, d[this.fields.x])
        //   console.log(i - 1, arr[i - 1]?.[this.fields.x])
        //   console.log(i + 1, arr[i + 1]?.[this.fields.x])
        //   _barWidth = Math.abs(_scaleX(d[this.fields.x]) - _scaleX(arr[i > 0 ? i - 1 : i + 1][this.fields.x]))
        //   console.log('_barWidth --->', i, i > 0 ? i - 1 : i + 1, _barWidth)
        //   console.log('---')
        // }
        // console.log('--->', d, y,'>',y0,'domain',_scaleY.domain)
        // console.log('x',x)
        const _barLength = !isNaN(y) ? Math.max(Math.abs(y - y0), Math.abs(y - y0) - axisLineWidth / 2) : 0;
        const _barY = y > y0 ? y0 : y;
        //console.log(i,d,_barLength,axisLineWidth
        // _barWidth = _barWidth - this.attr('strokeWidth')(d, i, arr) * 2;
        const strokeWidth = this.attr('strokeWidth')(d, i, arr);
        // console.log(_barWidth,  strokeWidth * 2)
        rect.setAttribute('x', x + _barWidth/2 * (1 - this.attr('barRatioWidth')()) + strokeWidth * 0.5);
        rect.setAttribute('y', (isNaN(_barY) || isInfinity(_barY) ? _scaleY.range[0] : _barY) + strokeWidth * 0.5);
        rect.setAttribute('width', Math.max(0, _barWidth * this.attr('barRatioWidth')() - strokeWidth));
        rect.setAttribute('height', Math.max(0, isNaN(_barLength) ? 0 : (_barLength - strokeWidth)));
        rect.setAttribute('fill', this.attr('fill')(d, i, arr));
        rect.setAttribute('fill-opacity', this.attr('fillOpacity')(d, i, arr));
        rect.setAttribute('stroke', this.attr('stroke')(d, i, arr));
        rect.setAttribute('stroke-width', this.attr('strokeWidth')(d, i, arr));
        rect.setAttribute('stroke-opacity', this.attr('strokeOpacity')(d, i, arr));
        // rect.setAttribute('stroke-linecap', 'square');
      });

      // // // console.log('points', points);
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
});

export default function() {
  return new chrtColumns();
}
