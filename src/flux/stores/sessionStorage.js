/**
 * Created by Coffei on 5.8.15.
 */
var Marty=  require("marty");

class SessionStorage extends Marty.SessionStorageStateSource {
  constructor(opts) {
    super(opts);
  }

  saveOrder(order) {
    this.set("order", JSON.stringify(order));
  }

  getOrder() {
    var order = JSON.parse(this.get("order"));
    console.log(order);
    return order;
  }

  cancelOrder() {
    this.saveOrder(null);
  }

  setAuthUser(user) {
      this.set("authUser", JSON.stringify(user));
  }

  getAuthUser() {
    var user = this.get("authUser");
    if(user==null) return undefined;

    return JSON.parse(user);
  }

  logoutAuthUser() {
    this.setAuthUser(null);
  }
}

module.exports = SessionStorage;
