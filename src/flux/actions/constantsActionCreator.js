/**
 * Created by jtrantin on 9.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/constantsConstants");

class ConstantsActionCreator extends Marty.ActionCreators {
  setPriceConstant(name, value) {
    return this.app.constantsApi.setPriceConstant(name, value).
      then(() => this.dispatch(Constants.SET_PRICE_CONSTANT, name));
  }
}

module.exports = ConstantsActionCreator;