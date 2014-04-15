/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var Hex = require('./Hex');

var HexGrid = React.createClass({
  render: function () {
    var type = this.props.type || 'pointy';
    var align = this.props.align || 'even';

    var longLength;
    var shortLength;
    if (type === 'pointy') {
      longLength = this.props.height;
      shortLength = this.props.width;
    } else {
      longLength = this.props.width;
      shortLength = this.props.height;
    }

    var longSide = this.props.radius * 2;
    var shortSide = (Math.sqrt(3) / 2) * longSide;

    var alignOffsetFunction = function (i) {
      var rem = i % 2;
      return {
        even: rem === 0,
        odd: rem !== 0
      }[align];
    };

    var hexes = [];
    for (var longPos = 0; longPos < longLength; longPos++) {
      var offset;
      if (alignOffsetFunction(longPos)) {
        offset = 0;
      } else {
        offset = shortSide / 2;
      }

      for (var shortPos = 0; shortPos < shortLength; shortPos++) {
        var key = shortPos + (longPos * shortLength);
        var longCoord = 0.75 * longSide * longPos;
        var shortCoord = shortSide * shortPos + offset;

        var xPos;
        var yPos;
        if (type === 'pointy') {
          xPos = this.props.x + shortCoord;
          yPos = this.props.y + longCoord;
        } else {
          xPos = this.props.x + longCoord;
          yPos = this.props.y + shortCoord;
        }

        hexes.push(
          <Hex key={key}
               type={type}
               x={xPos}
               y={yPos}
               radius={this.props.radius} />
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
