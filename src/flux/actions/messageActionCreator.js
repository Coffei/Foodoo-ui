var Marty = require("marty");
var Constants = require("../constants/messageConstants");

class MessageActionCreator extends Marty.ActionCreators {
  submitMessage(msg) {
    var promise;
    if(msg.id != null) {
      promise = this.app.messageApi.updateMessage(msg);
    } else {
      promise = this.app.messageApi.createMessage(msg);
    }

    return promise.then(() => this.dispatch(Constants.MESSAGE_CHANGED));
  }

  deleteMessage(msg) {
    return this.app.messageApi.deleteMessage(msg).
      then(() => this.dispatch(Constants.MESSAGE_CHANGED));
  }
}

module.exports = MessageActionCreator;
