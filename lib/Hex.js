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

    var corners = [];
    for (var corner = 0; corner < 6; corner++) {
      var angle = 2 * (Math.PI / 6) * corner - rotation;
      corners.push([
        this.props.x + (this.props.radius * Math.cos(angle)),
        this.props.y + (this.props.radius * Math.sin(angle))
      ]);
    }

    var points = _.map(corners, function (xy) {
      return xy[0] + ',' + xy[1];
    }).join(' ');


    return (
      <polygon className={this.getClasses()} points={points} />
    );
  }
});

module.exports = Hex;
