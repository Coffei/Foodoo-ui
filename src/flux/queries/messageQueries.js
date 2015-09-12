var Marty = require("marty");
var Constants = require("../constants/messageConstants");

class MessageQueries extends Marty.Queries {
  getMessage(type)  {
    this.dispatch(Constants.MESSAGE_RECEIVED_STARTING);

    return this.app.messageApi.getMessage(type).
      then((message) => this.dispatch(Constants.MESSAGE_RECEIVED, message)).
      catch(() => this.dispatch(Constants.MESSAGE_RECEIVED_FAILED));
  }
}

module.exports = MessageQueries;
