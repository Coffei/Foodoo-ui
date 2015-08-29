/**
 * Created by jtrantin on 15.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/orderConstants");

class OrderQueries extends Marty.Queries {
  getOrderById(id) {
    this.dispatch(Constants.RECEIVE_ORDER_STARTING);

    return this.app.orderApi.getOrderById(id).
      then((order) => {
        if(order!=null) this.dispatch(Constants.RECEIVE_ORDER, order);
        else this.dispatch(Constants.RECEIVE_ORDER_FAILED, "not found");
      }).
      catch((res) => this.dispatch(Constants.RECEIVE_ORDER_FAILED))
  }

  getToBeDoneOrders() {
    this.dispatch(Constants.RECEIVE_ORDERS_TOBEDONE_STARTING);

    return this.app.orderApi.getToBeDoneOrders().
      then(orders => this.dispatch(Constants.RECEIVE_ORDERS_TOBEDONE, orders)).
      catch((res) => this.dispatch(Constants.RECEIVE_ORDERS_TOBEDONE_FAILED, res.body));
  }
}

module.exports = OrderQueries;