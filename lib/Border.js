/** @jsx React.DOM */

var React = require('react');
var GetClassMixin = require('./GetClassMixin');

var Border = React.createClass({
  mixins: [GetClassMixin('hexdrawer-HexGrid-Border')],

  render: function () {
    return (
      <line x1={this.props.x1} y1={this.props.y1}
            x2={this.props.x2} y2={this.props.y2}
            className={this.getClasses()} />
    );
  }
});

module.exports = Border;
