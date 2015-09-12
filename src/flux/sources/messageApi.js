var Marty = require("marty");
var Settings = require("../settings/settings");

class MessageApi extends Marty.HttpStateSource {
  getMessage(type) {
    return this.get(Settings.backendPath + "/messages/" + type).
      then((res) => {
        if(res.status == 204) return {type: type};
        if(res.ok) return res.body;

        throw res;
      });
  }

  createMessage(msg) {
    return this.post({
      url: Settings.backendPath + `/messages/${msg.type}`,
      body: msg
    }).
      then((res) => {
        if(res.ok) return "ok";

        throw res;
      });
  }

  updateMessage(msg) {
    return this.put({
      url: Settings.backendPath + `/messages/${msg.type}`,
      body: msg
    }).
      then((res) => {
        if(res.ok) return "ok";

        throw res;
      });
  }

  deleteMessage(msg) {
    return this.delete({
      url: Settings.backendPath + `/messages/${msg.type}`
    }).
    then((res) => {
      if(res.ok) return "ok";

      throw res;
    });
  }
}

module.exports = MessageApi;
