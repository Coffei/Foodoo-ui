/**
 * Created by jtrantin on 9.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/hoursConstants");

class HoursActionCreator extends Marty.ActionCreators {
  setHours(hours) {
    return this.app.hoursApi.setHours(hours).
      then(() => this.dispatch(Constants.SET_HOURS, hours));
  }
}

module.exports = HoursActionCreator;