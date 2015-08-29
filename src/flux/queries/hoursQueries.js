/**
 * Created by Coffei on 9.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/hoursConstants");

class HoursQueries extends Marty.Queries {
  getHours(type) {
    this.dispatch(Constants.RECEIVE_HOURS_STARTING);

    return this.app.hoursApi.getHours(type).
      then((hours) => {
        console.log("Fetching gours of type " + type);
        console.log(hours);
        this.dispatch(Constants.RECEIVE_HOURS, {
          type: type,
          result: hours || {}
        });
      }).
      catch((err)=> this.dispatch(Constants.RECEIVE_HOURS_FAILED, err));
  }
}

module.exports = HoursQueries;