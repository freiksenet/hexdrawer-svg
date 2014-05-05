require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"mAGsqY":[function(require,module,exports){
module.exports = {
  Hex: require('./lib/Hex'),
  HexGrid: require('./lib/HexGrid')
};

},{"./lib/Hex":6,"./lib/HexGrid":7}],"./hexdrawer":[function(require,module,exports){
module.exports=require('mAGsqY');
},{}],3:[function(require,module,exports){
/** @jsx React.DOM */

var React = require('react');
var GetClassMixin = require('./GetClassMixin');

var Border = React.createClass({displayName: 'Border',
  mixins: [GetClassMixin('hexdrawer-HexGrid-Border')],

  render: function () {
    return (
      React.DOM.line( {x1:this.props.x1, y1:this.props.y1,
            x2:this.props.x2, y2:this.props.y2,
            className:this.getClasses()} )
    );
  }
});

module.exports = Border;

},{"./GetClassMixin":5,"react":"M6d2gk"}],4:[function(require,module,exports){
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
          Border( {key:rKey,
                  x1:options.x1, y1:options.y1,
                  x2:options.x2, y2:options.y2,
                  className:options.className} )
        );
      });
    }, this);
    return borders;
  };
};

module.exports = BorderKeeper;

},{"./Border":3,"lodash":"K2RcUv"}],5:[function(require,module,exports){
var _ = require('lodash');
var React = require('react');

var GetClassMixin = function (baseClass) {
  return {
    getClasses: function () {
      var cx = React.addons.classSet;
      var cxMap = {};
      cxMap[baseClass] = true;
      var classNames = this.props.className;
      if (classNames) {
        if (!_.isArray(classNames)) {
          classNames = [classNames];
        }
        for (var className in classNames) {
          cxMap[classNames[className]] = true;
        }
      }
      return cx(cxMap);
    }
  };
};

module.exports = GetClassMixin;

},{"lodash":"K2RcUv","react":"M6d2gk"}],6:[function(require,module,exports){
/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var GetClassMixin = require('./GetClassMixin');

var Hex = React.createClass({displayName: 'Hex',
  mixins: [GetClassMixin('hexdrawer-HexGrid-Hex')],

  render: function () {
    var points = _.map(this.props.corners, function (xy) {
      return xy[0] + ',' + + xy[1];
    }, this).join(' ');

    var strokeHex = [];

    return (
      React.DOM.polygon( {className:this.getClasses(),
               points:points,
               onClick:this.props.onClick,
               onMouseOver:this.props.onMouseOver,
               onMouseOut:this.props.onMouseOut} )
    );
  }
});

module.exports = Hex;

},{"./GetClassMixin":5,"lodash":"K2RcUv","react":"M6d2gk"}],7:[function(require,module,exports){
/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var Hex = require('./Hex');
var BorderKeeper = require('./BorderKeeper');

var HexGrid = React.createClass({displayName: 'HexGrid',
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
          Hex( {className:hex.hexClass,
               key:key,
               corners:hexActualCorners,
               onClick:this.onClick.bind(this, x, y),
               onMouseOver:this.onMouseOver.bind(this, x, y),
               onMouseOut:this.onMouseOut.bind(this, x, y)} )
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
      React.DOM.g( {className:"hexdrawer-HexGrid"}, 
        hexes,
        borders.getBorders()
      )
    );
  }
});

module.exports = HexGrid;

},{"./BorderKeeper":4,"./Hex":6,"lodash":"K2RcUv","react":"M6d2gk"}]},{},["mAGsqY"])