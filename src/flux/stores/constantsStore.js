/**
 * Created by jtrantin on 9.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/constantsConstants");

class ConstantsStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {};
    this.handlers = {
      addPriceConstant: Constants.RECEIVE_PRICE_CONSTANT,
      clearPriceConstant: Constants.SET_PRICE_CONSTANT
    }
  }

  clearPriceConstant(name) {
    if(name!=null) {
      this.state[name] = undefined;
    } else {
      this.state = {};
    }
    this.hasChanged();
  }

  addPriceConstant(result) {
    this.state[result.name] = result.result;
    this.hasChanged();
  }

  getPriceConstant(name) {
    return this.fetch({
      id: "price_constant_" + name,
      locally: () => this.state[name],
      remotely: () => this.app.constantsQueries.getPriceConstant(name)
    });
  }

}

module.exports = ConstantsStore;
