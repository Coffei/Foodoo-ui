/**
 * Created by Coffei on 9.8.15.
 */
var Marty = require("marty");
var Settings = require("../settings/settings");

class HoursApi extends Marty.HttpStateSource {
  getHours(type = "GENERAL") {
    return this.get(Settings.backendPath + "/hours/" + type).
      then(res => {
        if (res.status === 204) return null;
        if (res.ok) return res.body;

        throw res;
      });
  }

  setHours(hours) {
    console.log(hours);
    return this.post({
      url: Settings.backendPath + "/hours/" + hours.type,
      body: hours
    }).
      then((res)=> {
        if (res.ok) return "ok";

        throw res;
      });
  }
}

module.exports = HoursApi;