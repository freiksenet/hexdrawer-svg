/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var Hex = require('./Hex');

var HexGrid = React.createClass({
  render: function () {
    var align = this.props.align || 'even';
    var rotation = this.props.hexRotation;
    var sin = Math.sin(rotation);
    var cos = Math.cos(rotation);

    var hexAbsWidth = this.props.hexRadius * 2;
    var hexWidth = 0.75 * hexAbsWidth;
    var hexHeight = (Math.sqrt(3) / 2) * hexAbsWidth;

    var hexes = [];
    for (var w = 0; w < this.props.width; w++) {
      for (var h = 0; h  < this.props.height; h++) {
        var key = w + "," + h;
        var sideHexOffset = hexWidth * w;
        var vertHexOffest = hexHeight * h;
        var sideVertHexOffset = (hexHeight / 2) * w;

        var x = cos * sideHexOffset + sin * (vertHexOffest + sideVertHexOffset);
        var y = cos * (sideVertHexOffset + vertHexOffest) - sin * sideHexOffset;

        hexes.push(
          <Hex key={key}
               x={this.props.x + x}
               y={this.props.y + y}
               rotation={rotation}
               radius={this.props.hexRadius} />
        );
      }
    }

    return (
      <g>
        {hexes}
      </g>
    );
  }
});

module.exports = HexGrid;
