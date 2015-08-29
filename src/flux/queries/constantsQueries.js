/**
 * Created by jtrantin on 9.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/constantsConstants");

class ConstantsQueries extends Marty.Queries {
  getPriceConstant(name) {
    this.dispatch(Constants.RECEIVE_PRICE_CONSTANT_STARTING);

    return this.app.constantsApi.getPriceConstant(name).
      then((constant) => this.dispatch(Constants.RECEIVE_PRICE_CONSTANT, {
        name: name,
        result: constant
      })).
      catch((err) => this.dispatch(Constants.RECEIVE_PRICE_CONSTANT_FAILED, err));
  }
}

module.exports = ConstantsQueries;
