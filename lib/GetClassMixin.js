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
