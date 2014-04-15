/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var Hex = React.createClass({
  render: function () {
    var type = this.props.type || 'pointy';

    var angleOffset;
    if (type === 'pointy') {
      angleOffset = 0.5;
    } else if (type === 'flat') {
      angleOffset = 0;
    }

    var corners = [];
    for (var corner = 0; corner < 6; corner++) {
      var angle = 2 * (Math.PI / 6) * (corner + angleOffset);
      corners.push([
        this.props.x + (this.props.radius * Math.cos(angle)),
        this.props.y + (this.props.radius * Math.sin(angle))
      ]);
    }

    var points = _.map(corners, function (xy) {
      return xy[0] + ',' + xy[1];
    }).join(' ');

    var cx = React.addons.classSet;
    var classes = cx({
      'hexdrawer-Hex': true,
      'hexdrawer-Hex--pointy': type === 'pointy',
      'hexdrawer-Hex--flat': type === 'flat'
    });

    return (
      <polygon className={classes} points={points} />
    );
  }
});

module.exports = Hex;
