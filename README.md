# chrt-bars

Component for the creation of Bar charts, Column charts (or Vertical Bar Charts), and Histograms in chrt. Bar charts are used to display a visual presentation of categorical data, with categories positioned along the vertical axis and bar length showing the value. In Column charts, categories appear along the horizontal axis with column height corresponding to value. Histograms display the distribution of numerical data using bars of varying widths to represent data bins and heights to show frequency or density.

The component provides three main types of charts:

- Bar Charts (`chrtBars`) - horizontal bars
- Column Charts (`chrtColumns`) - vertical bars
- Histograms (`chrtHistograms`) - distribution charts with variable-width bins

### Observable Examples and Documentation:

- [Chrt Bars - Observable](https://observablehq.com/d/87e22e4f72fb6575)
- [Chrt Histograms - Observable](https://observablehq.com/d/228dce87eba194ea?collection=@chrt/chrt)
- [Introducing Chrt - Observable](https://observablehq.com/@chrt/introducing-chrt?collection=@chrt/chrt)

## Installing

For use with Webpack, Rollup, or other Node-based bundlers, `chrt-bars` can be installed as a standalone module via a package manager such as Yarn or npm.

```bash
npm install chrt-bars chrt-core
```

`chrt-bars` can be used as part of the `chrt` package:

```bash
npm install chrt
```

`chrt-bars` is distributed as an ES module; see [Sindre Sorhus's guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) for more information.

## Usage

### ES6 / Bundlers (Webpack, Rollup, etc.)

```js
import Chrt from "chrt-core";
import { chrtBars, chrtColumns, chrtHistograms } from "chrt-bars";

// Create a bar chart
Chrt().data([2, 0, 3, 10, 4, 2, 1]).add(chrtBars());

// Create a column chart
Chrt().data([2, 0, 3, 10, 4, 2, 1]).add(chrtColumns());

// Create a histogram
Chrt().add(
  chrtHistograms().data([
    { x0: 0, x1: 10, y: 5 },
    { x0: 10, x1: 20, y: 8 },
  ]),
);
```

### Vanilla HTML

In vanilla HTML, `chrt-bars` can be imported as an ES module:

```html
<div id="chart"></div>

<script type="module">
  import Chrt from "https://cdn.skypack.dev/chrt-core";
  import { chrtBars } from "https://cdn.skypack.dev/chrt-bars";

  const chart = Chrt().data([2, 0, 3, 10, 4, 2, 1]).add(chrtBars());

  document.querySelector("#chart").appendChild(chart.node());
</script>
```

### Script Tag

For legacy environments, you can load the `chrt` UMD bundle from an npm-based CDN:

```html
<div id="chart"></div>
<script src="https://cdn.jsdelivr.net/npm/chrt@latest/dist/chrt.min.js"></script>
<script>
  chrt
    .Chrt()
    .node(document.getElementById("chart"))
    .data([2, 0, 3, 10, 4, 2, 1])
    .add(chrt.chrtBars());
</script>
```

## API Reference

- [chrtBars](#chrtbars)
- [chrtColumns](#chrtcolumns)
- [chrtHistograms](#chrthistograms)
- [Common Methods](#common-methods)

### chrtBars

The `chrtBars` component creates horizontal bar charts. Each bar represents a data point with the bar length representing the value.

#### `chrtBars()`

Creates a new horizontal bar chart component.

```js
// Basic bar chart
Chrt().data([2, 0, 3, 10, 4, 2, 1]).add(chrtBars());

// Bar chart with custom data mapping
Chrt().add(
  chrtBars().data(data, (d) => ({
    x: d.value, // length of bar
    y: d.category, // position on y-axis
  })),
);
```

### chrtColumns

The `chrtColumns` component creates vertical bar charts (column charts). Each column represents a data point with the column height representing the value.

#### `chrtColumns()`

Creates a new column chart component.

```js
// Basic column chart
Chrt().data([2, 0, 3, 10, 4, 2, 1]).add(chrtColumns());

// Column chart with custom data mapping
Chrt().add(
  chrtColumns().data(data, (d) => ({
    x: d.category, // position on x-axis
    y: d.value, // height of column
  })),
);
```

### Common Methods

The following methods are shared by `chrtBars`, `chrtColumns`, and `chrtHistograms` components for customizing appearance and behavior:

#### Styling Methods

#### `.width([value])`

Sets the relative width of the bars/columns. Value should be between 0 and 1, where 1 means bars touch each other.

```js
// Set bars to 75% of available space
chrtBars().width(0.75);

// Vary width based on data
chrtColumns().width((d, i) => (i % 2 ? 0.5 : 0.75));
```

#### `.fill([color])`

Sets the fill color of the bars/columns.

```js
// Set all bars to red
chrtBars().fill("#ff0000");

// Alternate colors
chrtColumns().fill((d, i) => (i % 2 ? "#ff0000" : "#0000ff"));
```

#### `.fillOpacity([value])`

Sets the opacity of the fill color. Value should be between 0 and 1.

```js
// Set 50% opacity
chrtBars().fillOpacity(0.5);

// Vary opacity based on value
chrtColumns().fillOpacity((d) => d.value / 100);
```

#### `.stroke([color])`

Sets the color of the bar/column borders.

```js
// Set border color to black
chrtBars().stroke("#000000");

// No border
chrtColumns().stroke("none");
```

#### `.strokeWidth([value])`

Sets the width of the bar/column borders.

```js
// Set border width to 2 pixels
chrtBars().strokeWidth(2);

// Vary border width
chrtColumns().strokeWidth((d, i) => (i % 2 ? 1 : 2));
```

#### `.strokeOpacity([value])`

Sets the opacity of the border. Value should be between 0 and 1.

```js
// Set border opacity to 80%
chrtBars().strokeOpacity(0.8);
```

#### Layout Methods

#### `.inset([value])`

Sets the spacing between bars/columns.

```js
// Add 2 pixel spacing between bars
chrtBars().inset(2);
```

#### `.binwidth([value])`

Sets the width of bins for histogram-like layouts. Useful when dealing with continuous data.

```js
// Set fixed bin width
chrtColumns().binwidth(10);

// Variable bin width
chrtBars().binwidth((d, i) => i * 5);
```

### Examples

#### Basic Bar Chart

```js
Chrt()
  .data([
    { category: "A", value: 10 },
    { category: "B", value: 20 },
    { category: "C", value: 15 },
  ])
  .add(
    chrtBars()
      .data(data, (d) => ({
        x: d.value,
        y: d.category,
      }))
      .width(0.75)
      .fill("#ff6600")
      .stroke("#333")
      .strokeWidth(1),
  );
```

#### Styled Column Chart

```js
Chrt()
  .data([10, 20, 15, 25, 30])
  .add(
    chrtColumns()
      .width(0.5)
      .fill((d, i) => (i % 2 ? "#ff6600" : "#336699"))
      .fillOpacity(0.8)
      .stroke("#000")
      .strokeWidth(1)
      .inset(2),
  );
```

### chrtHistograms

The `chrtHistograms` component creates histogram charts, which are used to visualize the distribution of numerical data. Each bar represents a bin (range of values) and its height shows the frequency or density of data points falling into that bin.

#### `chrtHistograms()`

Creates a new histogram component. The data for histograms should include `x0` and `x1` fields to define the bin ranges.

```js
// Basic histogram
Chrt().add(
  chrtHistograms().data([
    { x0: 0, x1: 10, y: 5 },
    { x0: 10, x1: 20, y: 8 },
    { x0: 20, x1: 30, y: 3 },
  ]),
);
```

#### Data Format

The histogram component expects data points to contain:

- `x0`: Start value of the bin
- `x1`: End value of the bin
- `y`: Height of the bar (frequency/count/density)

```js
// Example data structure
const data = [
  {
    x0: 0, // bin starts at 0
    x1: 10, // bin ends at 10
    y: 0.2, // frequency/density for this bin
  },
  {
    x0: 10, // next bin starts at 10
    x1: 20, // ends at 20
    y: 0.5, // frequency/density for this bin
  },
];
```

#### Examples

##### Basic Histogram

```js
// Create histogram with fixed bin width
const data = new Array(10).fill(1).map((d, i) => ({
  x0: i * 10,
  x1: (i + 1) * 10,
  y: Math.random(),
}));

Chrt().add(
  chrtHistograms().data(data).fill("#ff6600").fillOpacity(0.5).stroke("#333"),
);
```

##### Variable Width Bins

```js
// Histogram with variable bin widths
const data = [
  { x0: 0, x1: 10, y: 0.2 },
  { x0: 10, x1: 15, y: 0.18 }, // narrower bin
  { x0: 15, x1: 20, y: 0.2 }, // narrower bin
  { x0: 20, x1: 30, y: 0.1 }, // wider bin
];

Chrt().add(
  chrtHistograms()
    .data(data)
    .fill("#396")
    .fillOpacity((d) => d.y) // opacity based on frequency
    .stroke("#000"),
);
```

##### Stacked Histogram

```js
// Create stacked histogram
Chrt().add(
  chrt
    .stack()
    .add(chrtHistograms().data(data1).fill("#ff6600"))
    .add(chrtHistograms().data(data2).fill("#336699")),
);
```

The `chrtHistograms` component shares all the [common styling methods](#common-methods) with `chrtBars` and `chrtColumns`, including `width()`, `fill()`, `stroke()`, etc.
