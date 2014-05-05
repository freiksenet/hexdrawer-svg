/** @jsx React.DOM */

var _ = require('lodash');
var Border = require('./Border');

var BorderKeeper = function () {
  this.L = {};
  this.T = {};
  this.R = {};

  this.getOrCreate = function (x, y, type) {
    var key = x + "," + y;
    if (!this[type][key]) {
      this[type][key] = {};
    }
    return this[type][key];
  };

  this.getBorders = function () {
    var borders = [];
    ["L", "T", "R"].map(function (type) {
      _.map(this[type], function (options, key) {
        var rKey = "b" + type + ":" + key;
        borders.push(
          <Border key={rKey}
                  x1={options.x1} y1={options.y1}
                  x2={options.x2} y2={options.y2}
                  className={options.className} />
        );
      });
    }, this);
    return borders;
  };
};

module.exports = BorderKeeper;
