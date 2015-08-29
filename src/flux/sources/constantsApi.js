/**
 * Created by jtrantin on 9.8.15.
 */
var Marty = require("marty");
var Settings = require("../settings/settings");

class ConstantsApi extends Marty.HttpStateSource {
  getPriceConstant(name) {
    return this.get(Settings.backendPath + "/constants/" + name).
      then((res) => {
        if (res.ok) return res.body;
        if (res.status == 204) return null;

        throw res;
      });
  }

  setPriceConstant(name, value) {
    return this.post({url: Settings.backendPath + "/constants/" + name, body: {value: value}}).
      then((res) => {
        if(res.ok) return "ok";

        throw res;
      });
  }
}

module.exports = ConstantsApi;
