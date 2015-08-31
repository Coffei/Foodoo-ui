/**
 * Created by Coffei on 5.8.15.
 */
var Marty = require("marty");
var _ = require("lodash");
var Constants = require("../constants/orderConstants");

class OrderActionCreator extends Marty.ActionCreators {
  addSalad(ingredients) {
    this.dispatch(Constants.ADD_CUSTOM_SALAD, ingredients);
  }

  removeItem(salad) {
    console.log("Remving item in creator");
    this.dispatch(Constants.REMOVE_ITEM, salad);
    console.log("done");
  }

  updateItem(salad) {
    this.dispatch(Constants.UPDATE_ITEM, salad);
  }

  addMenu(menu) {
    this.dispatch(Constants.ADD_MENU, menu);
  }

  cancelCurrentOrder() {
    this.dispatch(Constants.CANCEL_ORDER);
  }

  setTakeaway(value) {
    this.dispatch(Constants.CHANGE_TAKEAWAY, value);
  }

  setTargetTime(time) {
    this.dispatch(Constants.CHANGE_TARGET_TIME, time);
  }

  cancelOrder(order) {
    return this.app.orderApi.cancelOrder(order).
      then(() => this.dispatch(Constants.CHANGE_STATUS, order, "CANCELLED"));

  }

  changeStatus(order, status) {
    var orderEntity = _.clone(order);
    orderEntity.status = status;
    return this.app.orderApi.updateOrder(orderEntity).
      then(() => this.dispatch(Constants.CHANGE_STATUS, order, status));
  }

  submitOrder(order) {
    return this.app.orderApi.submitNewOrder(order).
      then((id) => {
        this.dispatch(Constants.SUBMIT_ORDER);
        window.location.hash = "/order/" + id;
      })
  }
}

module.exports = OrderActionCreator;
