/**
 * Created by jtrantin on 27.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/orderConstants");
var _ = require("lodash");

class OrdersStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {};
    this.handlers = {
      compareAndAddOrders: Constants.RECEIVE_ORDERS_TOBEDONE,
      clearStore: Constants.CHANGE_STATUS
    };
  }

  clearStore() {
    this.clear();
    this.hasChanged();
  }

  compareAndAddOrders(orders) {
    if(!_.eq(orders, this.state.toBeDoneOrders)) {
      this.state.toBeDoneOrders = orders;
      this.hasChanged();
    }
  }

  getToBeDoneOrders(refreshInterval) {
    if(refreshInterval!=null) {
      this.state.refreshInterval = refreshInterval;
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = setTimeout(this.refreshOrders.bind(this), refreshInterval);
    }
    return this.fetch({
      id: "orders_tobedone",
      locally: () => this.state.toBeDoneOrders,
      remotely: () => this.app.orderQueries.getToBeDoneOrders()
    });
  }

  refreshOrders() {
    this.clearStore();
    if(this.state.refreshInterval!=null) {
      this.refreshTimeout = setTimeout(this.refreshOrders.bind(this), this.state.refreshInterval);
    }
  }
}

module.exports = OrdersStore;