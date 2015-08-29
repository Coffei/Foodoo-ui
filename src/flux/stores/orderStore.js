/**
 * Created by Coffei on 5.8.15.
 */
var Marty = require("marty");
var Constants = require("../constants/orderConstants");
var _ = require("lodash");

class OrderStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {
      order: {
        orderItems: []
      },
      orders: {}
    };

    this.handlers = {
      addSalad: Constants.ADD_CUSTOM_SALAD,
      removeItem: Constants.REMOVE_ITEM,
      updateItem: Constants.UPDATE_ITEM,
      addMenu: Constants.ADD_MENU,
      cancel: [Constants.CANCEL_ORDER, Constants.SUBMIT_ORDER],
      setTakeaway: Constants.CHANGE_TAKEAWAY,
      addOrder: Constants.RECEIVE_ORDER,
      setTargetTime: Constants.CHANGE_TARGET_TIME,
      clearOrder: Constants.CHANGE_STATUS
    };
  }

  clearOrder(order) {
    this.state.orders = _.filter(this.state.orders, (o) => o.id != order.id);
    this.hasChanged();
  }

  setTargetTime(time) {
    this.state.order.targetTime = time;
    this.app.sessionStorage.saveOrder(this.state.order);
    this.hasChanged();
  }

  addOrder(order) {
    this.state.orders[order.id] = order;
    this.hasChanged();
  }

  setTakeaway(value) {
    this.state.order.takeaway = value;
    this.app.sessionStorage.saveOrder(this.state.order);
    this.hasChanged();
  }

  cancel() {
    this.app.sessionStorage.cancelOrder();
    this.setState({
      order: {orderItems: []}
    });
  }

  addMenu(menu) {
    var orderItem = {
      tempId: this._getTempId(),
      type: "MENU",
      times: 1,
      menu: menu
    };
    this.state.order.orderItems.push(orderItem);
    this.app.sessionStorage.saveOrder(this.state.order);
    this.hasChanged();
  }

  updateItem(item) {
    var index = _.findIndex(this.state.order.orderItems, {tempId: item.tempId});
    this.state.order.orderItems[index] = item;
    this.app.sessionStorage.saveOrder(this.state.order);
    this.hasChanged();
  }

  removeItem(salad) {
    console.log("Removing ");
    console.log(salad.tempId);
    var orderItems = _.filter(this.state.order.orderItems, (item) => item.tempId != salad.tempId)
    this.state.order.orderItems = orderItems;
    this.app.sessionStorage.saveOrder(this.state.order);
    this.hasChanged();
  }

  addSalad(ingredients) {
    var orderItem = {
      tempId: this._getTempId(),
      type: "CUSTOMSALAD",
      times: 1,
      ingredients: ingredients
    };
    this.state.order.orderItems.push(orderItem);
    this.app.sessionStorage.saveOrder(this.state.order);
    this.hasChanged();
  }

  getOrderById(id) {
    return this.fetch({
      id: "order_by_id" + id,
      locally: () => this.state.orders[id],
      remotely: () => this.app.orderQueries.getOrderById(id)
    });
  }

  getCurrentOrder() {
    var sessionOrder = this.app.sessionStorage.getOrder();
    if (sessionOrder != null) {
      this.state.order = sessionOrder;
    }
    return this.fetch({
      id: "current_order",
      locally: () => this.state.order
    });
  }

  _getTempId() {
    return Math.floor((Math.random() * 1000000) + 1);
  }
}

module.exports = OrderStore;
