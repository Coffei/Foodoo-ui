var Marty = require("marty");
var Settings = require("../settings/settings");
var Promise = require("promise");


class MenuApi extends Marty.HttpStateSource {
  getMenusInRange(from, to) {
    var format = "YYYY-MM-DD";
    return this.get(Settings.backendPath + `/menus/range/${from.format(format)}/${to.format(format)}`)
    .then(res => {
      if(res.ok) return res.body;

      throw res;
    })
  }

  createMenu(menu) {
    return this.post({url: Settings.backendPath + "/menus", body: menu})
    .then(res => {
      if(res.ok) return res.body;

      throw res;
    })
  }

  updateMenu(menu) {
    return this.put({url: Settings.backendPath + `/menus/${menu.id}`, body: menu})
    .then(res => {
      if(res.ok) return res.body;

      throw res;
    })
  }

  deleteMenu(menuId) {
    return this.delete({url: Settings.backendPath + `/menus/${menuId}`})
    .then((res) => {
      console.log(res);
      if(res.ok) return "ok";

      throw res;
    })
  }
}
module.exports = MenuApi;
