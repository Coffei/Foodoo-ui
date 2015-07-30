var Marty = require("marty");
var MenuConstants = require("../constants/menuConstants");

class MenuStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {
      ranges: {}
    };

    this.handlers = {
      addMenusInRange: MenuConstants.RECEIVE_MENUS_RANGE,
      clearState: [MenuConstants.MENU_CREATED, MenuConstants.MENU_UPDATED, MenuConstants.MENU_DELETED]
    };
  }

  addMenusInRange(result) {
    var key = this._getKey(result.query.from, result.query.to);
    this.state.ranges[key] = result.result;
    this.hasChanged();
  }

  clearState() {
    this.state = {
      ranges: {}
    };
    this.hasChanged();
  }

  getMenusInRange(from, to) {
    return this.fetch({
      id: "menus" + this._getKey(from, to),
      locally: () => this.state.ranges[this._getKey(from, to)],
      remotely: () => this.app.menuQueries.getMenusInRange(from, to)
    });
  }


  _getKey(from, to) {
    var format = "YYYY-MM-DD";
    return from.format(format) + to.format(format);
  }
}

module.exports = MenuStore;
