import { isNull, isInfinity } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fill, width } from './lib';
import chrtGeneric from 'chrt-object';

const DEFAULT_STROKE_WIDTH = 0;
const DEAULT_LINE_COLOR = '#000';
const DEAULT_FILL_COLOR = '#ddd';
const DEFAULT_BAR_WIDTH = 3;
const DEFAULT_BAR_RADIO_WIDTH = 1;

function chrtColumns() {
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
      // _barWidth = _data.reduce((acc, d, i, arr) => {
      //   const next = arr[i + 1];
      //
      //   if(!isNull(d) && !isNull(d[this.fields.x]) && !isNull(next) && !isNull(next[this.fields.x])) {
      //     const x1 = _scaleX(d[this.fields.x]);
      //     const x2 = _scaleX(next[this.fields.x]);
      //     const delta = Math.abs(x2 - x1);
      //     console.log('!!!!--->',x2,'-',x1,'=',delta, acc)
      //     // acc = delta < acc ? delta : acc;
      //     acc = Math.min(delta,acc)
      //   }
      //   console.log('acc', acc)
      //   return acc;
      // }, _scaleX.barwidth);
      const padding = this.parentNode.padding();
      //const rangeWidth = Math.abs((_scaleX.range[1] + padding.right) - (_scaleX.range[0] - padding.left)) - (_margins.left + _margins.right);
      const rangeWidth = Math.abs((_scaleX.range[1] - _scaleX.range[0]) - (_margins.left+_margins.right));
      // console.log('rangeWidth', rangeWidth);
      //_barWidth = Math.abs(_scaleX.range[1] - _scaleX.range[0]) / ((_data.length) || 1);
      _barWidth = rangeWidth / ((_data.length - (_scaleX.transformation === 'ordinal' ? 0 : 1)) || 1);
      // console.log('_barWidth', _barWidth)
      // console.log('_scaleX.barwidth', _scaleX.barwidth)
      const flooredBarWidth = Math.floor(_barWidth);
      let barWidth = (flooredBarWidth || _barWidth) || 0;
      if(isNaN(barWidth) || isInfinity(barWidth)) {
        barWidth = 1;
      }
      // console.log('calculating barwidth!', barWidth,' * ',(this._group ? this._group.width() : 1))
      barWidth = barWidth * (this._group ? this._group.width() : 1);
      // console.log('GROUP WIDTH', this._group ? this._group.width() : 1)
      // this.parentNode.padding({left: 100, right: 100})
      const _grouped = this._stacked ? this._stacked._grouped : this._grouped || this._grouped;
      const _groupIndex = this._stacked ? this._stacked._groupIndex : this._groupIndex || this._groupIndex;
      _barWidth = barWidth / (_grouped);
      const deltaX = barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2;
      this.g.setAttribute('transform', `translate(${deltaX}, 0)`)

      const xAxis = this.parentNode.getAxis('x');
      const axisLineWidth = xAxis ? xAxis.width() : 0;
      // console.log('BARWIDTH', _barWidth, this.attr('barRatioWidth')())
      // console.log('_scaleX.barwidth', _scaleX.barwidth)
      if(_data.length) {
        // console.log('range', _scaleX.range)

        // const firstX = _scaleX(_data[0][this.fields.x]) - _barWidth / 2;
        /// const firstX = _scaleX.range[0] - _barWidth / 2;
        // const deltaX = Math.floor(Math.abs((_scaleX.range[0] + _margins.left) - _barWidth / 2));
        const w = (_scaleX.range[1] - _scaleX.range[0]) - (_margins.left + _margins.right);
        const bw = w / _data.length;
        const deltaX = (_scaleX.range[0] - _barWidth / 2);
        // console.log(deltaX, '<', padding.left)
        if(!this.parentNode.originalPadding && _scaleX.transformation !== 'ordinal' && deltaX < padding.left) {
          const padding = this.parentNode.padding();
          // console.log('DELTAX IS',deltaX,'bw',bw)
          const newPadding = Object.assign({}, padding, {left: bw/2 + padding.left, right: bw/2 + padding.right})
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
        const x = _scaleX(d[this.fields.x]) - _barWidth / 2;
        //const x = _scaleX(d[this.fields.x]) - (_barWidth * this.attr('barRatioWidth')()) / 2;
        if(isNaN(x)) {
          return;
        }
        const y = _scaleY(d[this._stacked ? `stacked_${this.fields.y}` : this.fields.y]);
        // const y0 = _scaleY(0);
        let y0 = !isNull(d[this.fields.y0]) ? _scaleY(d[this.fields.y0]) : null;
        if(isNull(y0)) {
          y0 = _scaleY.isLog() ? (_scaleY.range[0] - _margins.bottom) : _scaleY(0);
          // y0 = _scaleY.isLog() ? (_scaleY.range[0] - _margins.bottom) : _scaleY(_scaleY.domain[0]);
        }
        // console.log('--->', d, y,'>',y0,'domain',_scaleY.domain)
        // console.log('x',x)
        rect.setAttribute('x', x + _barWidth/2 * (1 - this.attr('barRatioWidth')()));
        rect.setAttribute('y', y > y0 ? y0 : y);
        rect.setAttribute('width', _barWidth * this.attr('barRatioWidth')());
        rect.setAttribute('height', Math.max(Math.abs(y - y0), Math.abs(y - y0) - axisLineWidth / 2));
        rect.setAttribute('fill', this.attr('fill')(d, i, arr));
        rect.setAttribute('stroke', this.attr('stroke')(d, i, arr));
        rect.setAttribute('stroke-width', this.attr('strokeWidth')(d, i, arr));
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
  strokeWidth: lineWidth,
  color: lineColor,
  fill,
});

export default function() {
  return new chrtColumns();
}
