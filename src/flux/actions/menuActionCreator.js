var Marty = require("marty");
var MenuConstants = require("../constants/menuConstants");

class MenuActionCreator extends Marty.ActionCreators {
  createMenu(menu) {
    return this.app.menuApi.createMenu(menu)
    .then(res => this.dispatch(MenuConstants.MENU_CREATED));
  }

  updateMenu(menu) {
    return this.app.menuApi.updateMenu(menu)
    .then(res => this.dispatch(MenuConstants.MENU_UPDATED));
  }

  deleteMenu(menuId) {
    return this.app.menuApi.deleteMenu(menuId)
    .then((res) => this.dispatch(MenuConstants.MENU_DELETED));
  }
}

module.exports = MenuActionCreator;
