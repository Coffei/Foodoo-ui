/**
 * Created by jtrantin on 15.8.15.
 */
var Marty = require("marty");
var Settings = require("../settings/settings");

class OrderApi extends Marty.HttpStateSource {

  getOrderById(id) {
    return this.get(Settings.backendPath + "/orders/" + id).
      then((res) => {
        if(res.ok) return res.body;

        throw res
      });
  }


  submitNewOrder(order) {
    return this.post({
      url: Settings.backendPath + "/orders",
      body: order
    }).
      then((res) => {
        if (res.ok) return res.body;

        throw res;
      });
  }

  updateOrder(order) {
    return this.put({
      url: Settings.backendPath + "/orders/" + order.id,
      body: order
    }).
      then((res) => {
        if (res.ok) return res.body;

        throw res;
      });
  }

  cancelOrder(order) {
    return this.post({
      url: Settings.backendPath + `/orders/${order.id}/cancel`
    }).
      then((res) => {
        if (res.ok) return res.body;

        throw res
      });
  }

  getToBeDoneOrders() {
    return this.get(Settings.backendPath + "/orders/status/NEW,PENDING,FINISHED").
      then((res) => {
        if(res.ok) return res.body;

        throw res;
      });
  }
}

module.exports = OrderApi;
