var Marty = require("marty");
var MenuConstants = require("../constants/menuConstants");

class MenuQueries extends Marty.Queries {
  getMenusInRange(from, to) {
    this.dispatch(MenuConstants.RECEIVE_MENUS_RANGE_STARTING);

    return this.app.menuApi.getMenusInRange(from, to)
      .then(menus => {
        this.dispatch(MenuConstants.RECEIVE_MENUS_RANGE, {
          query: {
            from: from,
            to: to
          },
          result: menus
        });
      })
      .catch(err => this.dispatch(MenuConstants.RECEIVE_MENUS_RANGE_FAILED, err));
  }
}

module.exports = MenuQueries;
