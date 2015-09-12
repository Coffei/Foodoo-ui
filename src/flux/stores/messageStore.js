var Marty = require("marty");
var Constants = require("../constants/messageConstants");

class MessageStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {};
    this.handlers = {
      addMessage: Constants.MESSAGE_RECEIVED,
      clearStore: Constants.MESSAGE_CHANGED
    };
  }

  addMessage(msg) {
    this.state[msg.type] = msg;
    this.hasChanged();
  }

  clearStore() {
    this.state = {};
    this.hasChanged();
  }

  getMessage(type) {
    return this.fetch({
      id: "message_" + type,
      locally: () => this.state[type],
      remotely: () => this.app.messageQueries.getMessage(type)
    });
  }
}

module.exports = MessageStore;
