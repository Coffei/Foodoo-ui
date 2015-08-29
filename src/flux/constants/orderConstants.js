/**
 * Created by Coffei on 5.8.15.
 */
var Marty = require("marty");

module.exports = Marty.createConstants([
  "ADD_CUSTOM_SALAD", // stuf for current order
  "ADD_MENU",
  "REMOVE_ITEM",
  "UPDATE_ITEM",
  "CANCEL_ORDER",
  "CHANGE_TAKEAWAY",
  "CHANGE_TARGET_TIME",
  "SUBMIT_ORDER",

  "RECEIVE_ORDER", // stuff for existing orders
  "CHANGE_STATUS",

  "RECEIVE_ORDERS_TOBEDONE"
]);
