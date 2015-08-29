/**
 * Created by jtrantin on 27.8.15.
 */
var React = require("react");
var Marty = require("marty");
var _ = require("lodash");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;

var Order = require("./order");

class Home extends React.Component {
  render() {
    var newOrders = _.filter(this.props.orders, order => order.status==="NEW");
    var pendingOrders = _.filter(this.props.orders ,order => order.status === "PENDING");
    var finishedOrders = _.filter(this.props.orders ,order => order.status === "FINISHED");

    var newOrdersList = _.isEmpty(newOrders) ? this.renderNoOrders() : _.map(newOrders, (order) => (
        <Order order={order}/>
    ));
    var pendingOrdersList = _.isEmpty(pendingOrders) ? this.renderNoOrders() :_.map(pendingOrders, (order) => (
        <Order order={order}/>
    ));
    var finishedOrdersList = _.isEmpty(finishedOrders) ? this.renderNoOrders() :_.map(finishedOrders, (order) => (
      <Order order={order}/>
    ));

    return (
      <span>
        <div className="page-header"><h1>Orders</h1></div>
        <h3>Pending orders</h3>
        { pendingOrdersList }

        <h3>New orders</h3>
        { newOrdersList }

        <h3>Finished orders</h3>
        { finishedOrdersList }
      </span>
    );
  }

  renderNoOrders() {
    return (<p className="text-muted">no orders present</p>)
  }
}

module.exports = Marty.createContainer(Home, {
    listenTo: ["ordersStore"],
    fetch: {
      orders: function () {
        return this.app.ordersStore.getToBeDoneOrders(10000);
      }
    },
    pending: () => (<Icon name="spinner" spin={true}/>),
    failed: () => (<RB.Alert bsStyle="danger">Unknown error occurred</RB.Alert>)
  }
);
