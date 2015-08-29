/**
 * Created by jtrantin on 15.8.15.
 */
var React = require("react");
var Marty = require("marty");
var _ = require("lodash");
var moment = require("moment");

var Toastr = require("toastr");
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Label = RB.Label;
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;
var Button = RB.Button;

var OrderItem = require("./orderItem");

class Order extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      cancelling: false
    };
  }

  render() {
    if(this.state.cancelling) {
      return (
        <span>
          <Icon name="spinner" spin={true} size="2x"/> Cancelling the order.
        </span>
      );
    }

    var button = this.props.order.status != "CANCELLED" ? (
      <Button bsStyle="danger" disabled={!this.canCancel()} onClick={this.cancelOrder.bind(this)}><Icon name="ban"/> Cancel the order</Button>
    ) : "";

    return (
      <span>
        <div className="page-header">
          <h1>
            <span className="pull-right">
              {this.getTakeawayText()}
              {this.getTotalPrice()}
            </span>
            Order {this.props.order.id}
            <small> <Label bsStyle={this.getStatusStyle()}>{this.getStatusText()}</Label></small>
          </h1>
        </div>
        <h3>{this.props.order.customerName} {this.getCustomerEmail()}</h3>
        <h4>Ordered at {this.getCreatedTime()} {this.getTargetTime()}</h4>
        {this.renderOrderItems()}
        <div className="page-footer"/>
        <span className="pull-right">
          {button}
        </span>
      </span>
    );
  }

  renderOrderItems() {
    var items = _.map(this.props.order.orderItems, this.renderOrderItem);
    return (
      <ListGroup>
        {items}
      </ListGroup>
    );
  }

  renderOrderItem(item) {
    return (
      <ListItem>
        <OrderItem item={item} readOnly={true}/>
      </ListItem>
    );
  }

  cancelOrder() {
    if(this.canCancel() && confirm("Are you sure you want to cancel order?")) {
      this.setState({
        cancelling: true
      });
      this.app.orderActionCreator.cancelOrder(this.props.order).
        then(() => {
          this.setState({cancelling: false});
          Toastr.info("Order cancelled");
        }).
        catch(() => {
          this.setState({cancelling: false});
          Toastr.error("Order can be cancelled only 15 minutes after it is created.", "Order cannot be cancelled!");
        });
    }
  }

  getTakeawayText() {
    if(this.props.order.takeaway) {
      return (
        <small>(incl. takeaway) </small>
      );
    }
  }

  getTotalPrice() {
    var price = this.props.order.totalPrice;
    return (
      <span>{price}Kč</span>
    );
  }

  getTargetTime() {
    if(this.props.order.targetTime!=null) {
      var time = moment.utc(this.props.order.targetTime, "HH:mm").local().format("HH:mm");
      return (
        <span> for pickup at {time}</span>
      );
    }
  }

  getCreatedTime() {
    return moment.utc(this.props.order.created).local().format("HH:mm Do MMMM YYYY");
  }

  getCustomerEmail() {
    if (!_.isEmpty(this.props.order.customeremail)) {
      return <span> <small>({this.props.order.customeremail})</small></span>
    }
  }

  getStatusText() {
    switch (this.props.order.status) {
      case "NEW":
        return "New";
      case "PENDING":
        return "Pending";
      case "FINISHED":
        return "Finished";
      case "DONE":
        return "Done";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "Unknown";
    }
  }

  getStatusStyle() {
    switch (this.props.order.status) {
      case "NEW":
        return "info";
      case "PENDING":
        return "primary";
      case "FINISHED":
        return "success";
      case "DONE":
        return "default";
      case "CANCELLED":
        return "warning";
      default:
        return "default";
    }
  }

  canCancel() {
    if(this.props.order.status != "NEW") return false;

    var created = moment.utc(this.props.order.created).local();
    var now = moment();
    if(now - created < moment.duration(15, "minutes")) return true;

    return false;
  }
}

module.exports = Marty.createContainer(Order, {
  listenTo: ["orderStore"],
  fetch: {
    order: function () {
      console.log(this);
      return this.app.orderStore.getOrderById(this.props.params.id);
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: function () {
    return (
      <Alert bsStyle="danger">
        <Icon name="info-circle" size="lg"/> No order found for id <strong>{this.props.params.id}</strong>.
      </Alert>
    );
  }
});