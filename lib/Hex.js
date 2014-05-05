/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var GetClassMixin = require('./GetClassMixin');

var Hex = React.createClass({
  mixins: [GetClassMixin('hexdrawer-HexGrid-Hex')],

  render: function () {
    var points = _.map(this.props.corners, function (xy) {
      return xy[0] + ',' + + xy[1];
    }, this).join(' ');

    var strokeHex = [];

    return (
      <polygon className={this.getClasses()}
               points={points}
               onClick={this.props.onClick}
               onMouseOver={this.props.onMouseOver}
               onMouseOut={this.props.onMouseOut} />
    );
  }
});

module.exports = Hex;
