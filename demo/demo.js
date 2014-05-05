var _ = require('lodash');
var React = require('react');
var hexdrawer = require('./hexdrawer');

var DemoComp = React.createClass({
  getInitialState: function () {
    var width = this.props.width;
    var height = this.props.height;
    var hexes = [];
    for (var x = 0; x < this.props.width; x++) {
      hexes.push([]);
      for (var y = 0; y < this.props.height; y++) {
        hexes[x].push({});
      }
    }
    return {
      hexes: hexes
    };
  },

  _iterHexState: function (callback) {
    for (var x = 0; x < this.state.hexes.length; x++) {
      for (var y = 0; y < this.state.hexes[x].length; y++) {
        callback(this.state.hexes[x][y], x, y);
      }
    }
  },

  hexClick: function (x, y) {
    var hexes = this.state.hexes;
    this._iterHexState(function (hex, x, y) {
      var borderClass = hex.borderClass || {};
      hexes[x][y].borderClass = borderClass;
      if (borderClass.active) {
        hexes[x][y].borderClass = _.omit(borderClass, 'active');
      }
    });
    hexes[x][y].borderClass.active = true;
    this.setState({hexes: hexes});
  },

  hexMouseOver: function (x, y) {
    var hexes = this.state.hexes;
    var borderClass = hexes[x][y].borderClass || {};
    borderClass.hovered = true;
    hexes[x][y].borderClass = borderClass;
    this.setState({hexes: hexes});
  },

  hexMouseOut: function (x, y) {
    var hexes = this.state.hexes;
    var borderClass = hexes[x][y].borderClass || {};
    hexes[x][y].borderClass = _.omit(borderClass, 'hovered');
    this.setState({hexes: hexes});
  },

  render: function () {
    return hexdrawer.HexGrid({
      x: 40,
      y: 40,
      hexWidth: 40,
      hexes: this.state.hexes,
      onHexClick: this.hexClick,
      onHexMouseOver: this.hexMouseOver,
      onHexMouseOut: this.hexMouseOut
    });
  }
});
