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
}

module.exports = SessionStorage;
