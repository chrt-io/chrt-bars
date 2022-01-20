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
} from './constants';
import chrtObject, { utils, cssDisplay } from 'chrt-object';
const { isNull, isInfinity, createSVG: create } = utils;

function chrtHistograms() {
  chrtObject.call(this);
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

    cssDisplay.call(this, this.attr('display')());

    this.g.classList.remove(...this.g.classList)
    this.g.classList.add(...this._classNames);

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
      if(!_data.some(d => d.x0)) {
        console.warn('chrtHistograms expects data points to contain x0 and x1 fields')
        return this;
      }
      if(!_data.some(d => d.x1)) {
        console.warn('chrtHistograms expects data points to contain x0 and x1 fields')
        return this;
      }

      const binsData = [..._data.map(d => d.x0), ..._data.map(d => d.x1)];
      const binsExtents = [Math.min(...binsData), Math.max(...binsData)];

      if(_scaleX.domain[0] > binsExtents[0] || _scaleX.domain[1] < binsExtents[1]) {
        this.parentNode.x({domain: binsExtents});
      }

      if(_scaleY.domain[0] > 0) {
        this.parentNode.y({domain: [
          0,
          _scaleY.domain[1],
        ]});
      }

      const xAxis = this.parentNode.getAxis('x');
      const axisLineWidth = xAxis ? xAxis.lineWidth()() : 0;

      _data.forEach((d, i, arr) => {
        let rect = this.g.querySelector(`[data-id='rect-${name}-${i}']`);
        if (!rect) {
          rect = create('rect');
          rect.setAttribute('data-id', `rect-${name}-${i}`);
          rect.setAttribute('shape-rendering', 'crispEdges');
          this.g.appendChild(rect);
        }
        const x0 = _scaleX(d[`${this.fields.x}0`]);
        if(isNaN(x0)) {
          return;
        }
        const x1 = _scaleX(d[`${this.fields.x}1`]);
        if(isNaN(x1)) {
          return;
        }

        _barWidth = Math.abs(x1 - x0);

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

        const strokeWidth = this.attr('strokeWidth')(d, i, arr);

        const anchorPoints = {};

        anchorPoints.x = x0; //(x0 - _barWidth/2) + _barWidth/2 * (1 - this.attr('barRatioWidth')(d, i, arr)) + strokeWidth * 0.5 + this.attr('inset')(d, i, arr)/2;
        anchorPoints.y = (isNaN(_barY) || isInfinity(_barY) ? _scaleY.range[0] : _barY) + strokeWidth * 0.5

        anchorPoints.directions = {
          x: 1,
          y: y > y0 ? 0 : 1,
        };

        const barWidthRatio = this.attr('barRatioWidth')(d, i, arr);
        const barWidthMargins = strokeWidth + this.attr('inset')(d, i, arr);

        anchorPoints.width = Math.max(0, _barWidth * barWidthRatio - barWidthMargins);

        anchorPoints.height = Math.max(0, isNaN(_barLength) ? 0 : (_barLength - strokeWidth));
        anchorPoints.x = anchorPoints.x + (_barWidth - anchorPoints.width)/2;

        anchorPoints.left = anchorPoints.x;
        anchorPoints.right = anchorPoints.x + anchorPoints.width;
        anchorPoints.top = anchorPoints.y;
        anchorPoints.bottom = anchorPoints.y - anchorPoints.height;

        anchorPoints.relativePosition = [0.5, 0];
        anchorPoints.alignment = {
          horizontal: 'middle',
          vertical: 'top',
        }

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
        // rect.setAttribute('stroke-linecap', 'square');
      });
    }

    this.objects.forEach((obj) => obj.draw());

    return this.parentNode;
  };

}

chrtHistograms.prototype = Object.create(chrtObject.prototype);
chrtHistograms.prototype.constructor = chrtHistograms;
chrtHistograms.parent = chrtObject.prototype;

chrtHistograms.prototype = Object.assign(chrtHistograms.prototype, {
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
  return new chrtHistograms();
}
