/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var Hex = require('./Hex');
var BorderKeeper = require('./BorderKeeper');

var HexGrid = React.createClass({
  getHexOptions: function () {
    var rotation = this.props.hexRotation || 0;
    var hexWideWidth = this.props.hexWidth;
    var hexWidth = 0.75 * hexWideWidth;
    var hexRatio = this.props.hexRatio || Math.sqrt(3) / 2;
    var hexHeight = hexRatio * hexWideWidth;
    var sin = Math.sin(rotation);
    var cos = Math.cos(rotation);

    var xVec = [cos * hexWidth - sin * hexHeight / 2,
                sin * hexWidth + cos * hexHeight / 2];
    var yVec = [-sin * hexHeight, cos * hexHeight];

    return {
      hexWideWidth: hexWideWidth,
      hexWidth: hexWidth,
      hexHeight: hexHeight,
      sin: sin,
      cos: cos,
      xVec: xVec,
      yVec: yVec
    };
  },

  getHexCenter: function (x, y, hexOptions) {
    var xOffset = hexOptions.xVec[0] * x + hexOptions.yVec[0] * y;
    var yOffset = hexOptions.xVec[1] * x + hexOptions.yVec[1] * y;
    return [
      this.props.x + xOffset,
      this.props.y + yOffset
    ];
  },

  getHexCorners: function (hexOptions) {
    var halfWidth = hexOptions.hexWideWidth / 2;
    var quaterWidth = hexOptions.hexWideWidth / 4;
    var halfHeight = hexOptions.hexHeight / 2;
    var sin = hexOptions.sin;
    var cos = hexOptions.cos;

    return [
      [cos * halfWidth,
       sin * halfWidth],
      [cos * quaterWidth - sin * halfHeight,
       cos * halfHeight + sin * quaterWidth],
      [cos * -quaterWidth - sin * halfHeight,
       cos * halfHeight + sin * -quaterWidth],
      [cos * -halfWidth,
       sin * -halfWidth],
      [cos * -quaterWidth + sin * halfHeight,
       cos * -halfHeight - sin * quaterWidth],
      [cos * quaterWidth + sin * halfHeight,
       cos * -halfHeight + sin * quaterWidth]
    ];
  },

  getHexBorders: function (hexCorners) {
    var shifted = hexCorners.slice(1);
    shifted.push(hexCorners[0]);
    return _.zip(hexCorners, shifted);
  },

  onClick: function (x, y) {
    this.props.onHexClick(x, y);
  },

  onMouseOver: function (x, y) {
    this.props.onHexMouseOver(x, y);
  },

  onMouseOut: function (x, y) {
    this.props.onHexMouseOut(x, y);
  },

  render: function () {
    var hexOptions = this.getHexOptions();
    var hexCorners = this.getHexCorners(hexOptions);
    var hexBorders = [[1, 0, "L"], [0, 1, "T"], [-1, 1, "R"],
                      [0, 0, "L"], [0, 0, "T"], [0, 0, "R"]];

    var hexes = [];
    var borders = new BorderKeeper();
    for (var x = 0; x < this.props.hexes.length; x++) {
      for (var y = 0; y < this.props.hexes[x].length; y++) {
        var hex = this.props.hexes[x][y];
        var key = x + "," + y;
        var center = this.getHexCenter(x, y, hexOptions);
        var hexX = center[0];
        var hexY = center[1];
        var hexActualCorners = hexCorners.map(function (corner) {
            return [
              hexX + corner[0],
              hexY + corner[1]
            ];
        });
        hexes.push(
          <Hex className={hex.hexClass}
               key={key}
               corners={hexActualCorners}
               onClick={this.onClick.bind(this, x, y)}
               onMouseOver={this.onMouseOver.bind(this, x, y)}
               onMouseOut={this.onMouseOut.bind(this, x, y)} />
        );

        var hexBorderCoordinates = this.getHexBorders(hexActualCorners);
        for (var b = 0; b < hexBorders.length; b++) {
          var borderLocation = [x + hexBorders[b][0],
                                y + hexBorders[b][1],
                                hexBorders[b][2]];
          var borderCoordinates = hexBorderCoordinates[b];
          var border = borders.getOrCreate.apply(borders, borderLocation);
          border.x1 = borderCoordinates[0][0];
          border.y1 = borderCoordinates[0][1];
          border.x2 = borderCoordinates[1][0];
          border.y2 = borderCoordinates[1][1];
          var classes = border.className || [];
          if (hex.borderClass) {
            classes = classes.concat(_.keys(hex.borderClass));
          }
          border.className = classes;
        }
      }
    }

    return (
      <g className="hexdrawer-HexGrid">
        {hexes}
        {borders.getBorders()}
      </g>
    );
  }
});

module.exports = HexGrid;
