/**
 * Created by Coffei on 5.8.15.
 */
var React = require("react");
var Marty = require("marty");
var _ = require("lodash");
var moment = require("moment");

var TimePicker = require('react-widgets/lib/DateTimePicker')
var Toastr = require("toastr");
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;
var Grid = RB.Grid;
var Col = RB.Col;
var Button = RB.Button;
var Alert = RB.Alert;
var Input = RB.Input;
var Well = RB.Well;

var FancyBooleanSwitch = require("./fancyBooleanSwitch");
var OrderItem = require("./orderItem");

const fmt = "HH:mm";
class OrderHome extends React.Component {
  render() {
    var price = this.getTotalPrice();
    var buttons = this.canOrder() ? (
      <span className="separated-buttons">
        <Button onClick={this.cancelOrder.bind(this)} bsStyle="danger"><Icon name="ban" /> Cancel</Button>
        <Button bsStyle="primary" href="#/checkout/finish">Next step</Button>
      </span>
    ) : "";

    return (
      <span>
        <div className="page-header"><h1>Checkout</h1></div>
        { this.renderNoItemsWarning() }
        <ListGroup>
          {_.map(this.props.order.orderItems, (item) => (
            <ListItem>
              <Grid className="autowidth">
                <Col xs={11}>
                  <OrderItem item={item}/>
                </Col>
                <Col xs={1}>
                  <Button bsStyle="danger" onClick={this.removeItem(item).bind(this)}><Icon name="trash"/></Button>
                </Col>
              </Grid>
            </ListItem>
          ))}
        </ListGroup>
        <div className="page-footer">
          <FancyBooleanSwitch label="Takeaway" bsStyle="info" value={this.props.order.takeaway || false} valueChanged={this.takeawayChanged.bind(this)}/>
          <div style={{height: "50px"}}>
            <span className="pull-right">
              <Well bsSize="xsmall">
                <Grid className="autowidth">
                  <Col xs={6}>
                    <Input type="checkbox" checked={this.props.order.targetTime == null} label="As soon as possible" onChange={this.asapChanged.bind(this)} />
                  </Col>
                  <Col xs={6} style={{paddingTop: "5px"}}>
                    <TimePicker disabled={this.props.order.targetTime == null} onChange={this.targetTimeChanged.bind(this)}
                                value={this.getTargetTime()} calendar={false} format={fmt} timeFormat={fmt} step={15}
                                min={this.getMinTargetTime()} max={this.getMaxTargetTime()}/>
                  </Col>
                </Grid>
              </Well>
            </span>
            <h3>Pickup time</h3>
          </div>
          <h2>
            <span className="pull-right">{price} Kč</span>
            Total:
          </h2>
        </div>
        { this.renderTooLateWarning() }
        <span className="pull-right">
          {buttons}
        </span>
      </span>
    );
  }

  getMinTargetTime() {
    if(this.props.businessHours!=null) {
      var start = moment.utc(this.props.businessHours.startTime, fmt).local();
      return start.toDate();
    }
  }
  getMaxTargetTime() {
    if(this.props.businessHours!=null) {
      var end = moment.utc(this.props.businessHours.endTime, fmt).local();
      return end.toDate();
    }
  }

  targetTimeChanged(date) {
    var time = moment(date);
    this.app.orderActionCreator.setTargetTime(time.utc().format(fmt));
  }

  asapChanged(event) {
    var value = event.target.checked;
    if(value) {
      this.app.orderActionCreator.setTargetTime(null);
    } else {
      var time = moment().utc().format(fmt);
      console.log("changing time to " + time);
      this.app.orderActionCreator.setTargetTime(time);
    }
  }

  getTargetTime() {
    var targetTime = this.props.order.targetTime;
    if(targetTime != null) {
      return moment.utc(targetTime, fmt).local().toDate();
    }

    return null;
  }

  getTotalPrice() {
    var price = 0;
    _.forEach(this.props.order.orderItems, (orderItem) => {
      if (orderItem.type === "MENU") {
        price += orderItem.menu.price * (orderItem.times || 1);
        if(this.props.order.takeaway === true) {
          price += (orderItem.times || 1) * (this.props.takeawayPrice.value || 0);
        }
      } else if (orderItem.type === "CUSTOMSALAD") {
        var saladPrice = 0;
        _.forEach(orderItem.ingredients, (ingredient) => {
          var ingredientPrice = ingredient.price || ingredient.group.price || 0;
          price += ingredientPrice * (orderItem.times || 1);
        });
        if(this.props.order.takeaway === true) {
          price += (orderItem.times || 1) * (this.props.takeawayPrice.value || 0);
        }
      }
    });

    return price;
  }

  renderNoItemsWarning() {
    if (_.isEmpty(this.props.order.orderItems)) {
      return (
        <Alert bsStyle="info"><Icon name="info-circle" size="lg"/> <strong>There are no items in your cart. </strong>
          Please add some first.</Alert>
      );
    }
  }

  renderTooLateWarning() {
    var end = moment.utc(this.props.businessHours.endTime, fmt).local();
    if(moment().isAfter(end)) {
      return (
        <Alert bsStyle="warning"><Icon name="info-circle" size="lg"/> You cannot place an order after <strong>{end.format(fmt)}</strong>.</Alert>
      );
    }
  }

  canOrder() {
    var end = moment.utc(this.props.businessHours.endTime, fmt).local();
    return !_.isEmpty(this.props.order.orderItems) && moment().isBefore(end);
  }

  takeawayChanged(value) {
    this.app.orderActionCreator.setTakeaway(value);
  }

  cancelOrder() {
    if(confirm("Are you sure you want to cancel the current order?")) {
      this.app.orderActionCreator.cancelCurrentOrder();
      Toastr.info("Order cancelled!");
    }
  }

  removeItem(item) {
    return () => {
      if (confirm("Are you sure?")) {
        this.app.orderActionCreator.removeItem(item);
      }
    }
  }

}

module.exports = Marty.createContainer(OrderHome, {
  listenTo: ["orderStore", "constantsStore", "hoursStore"],
  fetch: {
    order: function () {
      return this.app.orderStore.getCurrentOrder();
    },
    takeawayPrice: function () {
      return this.app.constantsStore.getPriceConstant("takeaway");
    },
    businessHours: function () {
      return this.app.hoursStore.getHours("GENERAL");
    }
  },
  pending:() => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger">Unknown error occurred.</Alert>)
});
