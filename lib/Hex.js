/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var Hex = React.createClass({
  getClasses: function () {
    var cx = React.addons.classSet;
    var cxMap = {
      'hexdrawer-Hex': true
    };
    cxMap[this.props.className] = true;
    return cx(cxMap);
  },

  render: function () {
    var rotation = this.props.rotation || 0;

    var cos = Math.cos(rotation);
    var sin = Math.sin(rotation);
    var wideWidth = this.props.width;
    var halfWidth = wideWidth * 0.5;
    var quaterWidth = halfWidth * 0.5;
    var halfHeight = wideWidth * this.props.ratio * 0.5;

    var corners = [
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

    var points = _.map(corners, function (xy) {
      return (this.props.x + xy[0]) + ',' + (this.props.y + xy[1]);
    }, this).join(' ');


    return (
      <polygon className={this.getClasses()} points={points} />
    );
  }
});

module.exports = Hex;
