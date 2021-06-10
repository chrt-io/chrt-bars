import { isNull, isInfinity } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, fill, fillOpacity, strokeOpacity, width } from './lib';
import chrtGeneric from 'chrt-object';

const DEFAULT_STROKE_WIDTH = 0;
const DEAULT_LINE_COLOR = '#000';
const DEAULT_FILL_COLOR = '#ddd';
const DEFAULT_STROKE_OPACITY = 1;
const DEFAULT_FILL_OPACITY = 1;
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
      _barWidth = _data.reduce((acc, d, i, arr) => {
        const next = arr[i + 1];
        if(!isNull(d) && !isNull(d[this.fields.y]) && !isNull(next) && !isNull(next[this.fields.y])) {
          const y1 = _scaleY(d[this.fields.y]);
          const y2 = _scaleY(next[this.fields.y]);
          const delta = Math.abs(y2 - y1);
          acc = delta < acc ? delta : acc;
        }
        return acc;
      }, Math.abs(_scaleY.barwidth));
      // console.log('_barWidth', _barWidth)
      const flooredBarWidth = Math.floor(_barWidth);
      let barWidth = (flooredBarWidth || _barWidth) || 0;
      if(isNaN(barWidth) || isInfinity(barWidth)) {
        barWidth = 1;
      }
      barWidth = barWidth * (this._group ? this._group.width() : 1);
      //console.log('GROUP WIDTH', this._group ? this._group.width() : 1)

      const _grouped = this._stacked ? this._stacked._grouped : this._grouped || this._grouped;
      const _groupIndex = this._stacked ? this._stacked._groupIndex : this._groupIndex || this._groupIndex;
      _barWidth = barWidth / (_grouped) * this.attr('barRatioWidth')();
      // this.g.setAttribute('transform', `translate(${barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2}, 0)`)
      this.g.setAttribute('transform', `translate(0, ${barWidth / _grouped * _groupIndex + (barWidth/_grouped)/2 - barWidth/2})`)
      // console.log(barWidth, _grouped, _groupIndex)

      const yAxis = this.parentNode.getAxis('y');
      const axisLineWidth = yAxis ? yAxis.width() : 0;

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
          x0 = _scaleX.isLog() ? (_scaleX.range[0] + _margins.left) : _scaleX(0);
        }

        x0 = !isNull(d[this.fields.x0]) ? _scaleX(d[this.fields.x0]) : _scaleX(_scaleX.domain[0]);

        const _barLength = !isNaN(x) ? Math.max(Math.abs(x - x0), Math.abs(x - x0) - axisLineWidth / 2) : 0;

        rect.setAttribute('x', x0);// > x0 ? x0 : x);
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
  stroke: lineColor,
  fill,
  fillOpacity,
  strokeOpacity
});

// export default chrtBars;
export default function() {
  return new chrtBars();
}
