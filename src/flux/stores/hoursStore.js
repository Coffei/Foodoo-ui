/**
 * Created by Coffei on 9.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/hoursConstants");

class HoursStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {};
    this.handlers = {
      addHours: Constants.RECEIVE_HOURS,
      clearHours: Constants.SET_HOURS
    };
  }

  clearHours(hours) {
    if(hours!=null) {
      this.state[hours.type] = undefined;
    } else {
      this.state = {};
    }
    this.hasChanged();
  }

  addHours(result) {
    this.state[result.type] = result.result;
    this.hasChanged();
  }

  getHours(type) {
    return this.fetch({
      id: "hours_" + type,
      locally: () => this.state[type],
      remotely: () => this.app.hoursQueries.getHours(type)
    });
  }
}

module.exports = HoursStore;
