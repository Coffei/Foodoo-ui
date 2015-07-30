var Marty = require("marty");
var context = require.context("./", true, /(actions)|(queries)|(stores)|(sources)/);
var _ = require("lodash");

class Application extends Marty.Application {
  constructor(options) {
    super(options);
    // Iterate through all the JS files in those folders
    _.forEach(context.keys(),((key) => {
      if (!/\.js/.test(key)) {
        // Generate an Id based on directory structure.
        let id = key.replace('./', '').replace(/.*\//g, '');
        this.register(id, context(key));
      }
    }));
  }
}

module.exports = Application;
