/**
 * Created by jtrantin on 12.8.15.
 */
var React = require("react");
var Marty = require("marty");
var _ = require("lodash");

var Toastr = require("toastr");
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Grid = RB.Grid;
var Col = RB.Col;
var Input = RB.Input;
var Button = RB.Button;

class FinishOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: ""
    };
  }

  render() {
    if(_.isEmpty(this.props.order.orderItems)) {
      return (
        <Alert bsStyle="warning"><Icon name="info-circle" size="lg"/> <strong>There are no items in your cart. </strong>
          Please add some first.</Alert>
      );
    }
    return (
      <span>
        <div className="page-header"><h1>Checkout</h1></div>
        <Alert bsStyle="info">
          <h4>
            <Icon name="info-circle" size="lg"/> You are ordering <strong>{this.getNumberOfItems()} </strong>
            items {this.props.order.takeaway ? " with takeaway." : "without takeaway."}
          </h4>
        </Alert>

        <form className="form-horizontal">
          <Input type="text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="name" value={this.state.name}
                 placeholder="Enter your name" label="Name" onChange={this.nameChanged.bind(this)}
                 bsStyle={this.getNameClass()}
                 help="(Required) Enter your real name, it serves as identification when picking up the order."/>
          <Input type="email" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="email"
                 value={this.state.email}
                 placeholder="Enter your email" label="Email" bsStyle={this.getEmailClass()}
                 onChange={this.emailChanged.bind(this)} help="Enter your email if you want to get notifications of the progress."/>

        </form>
        <div className="page-footer">
          <h2>
            <span className="pull-right">{this.getTotalPrice()}Kč</span>
            Total:
          </h2>
        </div>
        <span className="pull-right separated-buttons">
          <Button href="#/checkout">Go Back</Button>
          <Button bsStyle="primary" onClick={this.submitOrder.bind(this)}><Icon name="check"/> Order!</Button>
        </span>
      </span>
    );
  }

  getEmailClass() {
    const regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var value = this.state.email;
    if (value == null || value.length == 0) return "";
    if (regex.test(value)) {
      return "success";
    }

    return "error";

  }

  getNameClass() {
    var value = this.state.name;
    if(value==null || value.length <= 3) return "error";

    return "success";
  }

  getNumberOfItems() {
    return _.sum(_.map(this.props.order.orderItems, "times"));
  }

  getTotalPrice() {
    var price = 0;
    _.forEach(this.props.order.orderItems, (orderItem) => {
      if (orderItem.type === "MENU") {
        price += orderItem.menu.price * (orderItem.times || 1);
        if (this.props.order.takeaway === true) {
          price += (orderItem.times || 1) * (this.props.takeawayPrice.value || 0);
        }
      } else if (orderItem.type === "CUSTOMSALAD") {
        var saladPrice = 0;
        _.forEach(orderItem.ingredients, (ingredient) => {
          var ingredientPrice = ingredient.price || ingredient.group.price || 0;
          price += ingredientPrice * (orderItem.times || 1);
        });
        if (this.props.order.takeaway === true) {
          price += (orderItem.times || 1) * (this.props.takeawayPrice.value || 0);
        }
      }
    });

    return price;
  }

  submitOrder() {
    if(confirm("Are you sure?")) {
      var order = _.clone(this.props.order);
      order.customerName = this.state.name;
      order.customeremail = this.state.email;
      this.removeAllTempIds(order);
      // post order
      this.app.orderActionCreator.submitOrder(order).
        then(() => {
          Toastr.info("Order created!");
        }).
        catch((res) => {
          var errors = res.body;
          var errorPaths = _.map(errors || [], "path");
          if (_.contains(errorPaths, "customerName")) Toastr.error("Fill in your name.", "Invalid order");
          if (_.contains(errorPaths, "customeremail")) Toastr.error("Fix the email and try again.", "Invalid email");


          Toastr.error("This order cannot be submitted at the moment.");
        });
    }
  }

  removeAllTempIds(order) {
    _.forEach(order.orderItems, (item) => {
      item.tempId = undefined;
    });
  }

  nameChanged() {
    var value = this.refs.name.getValue();
    this.setState({name: value});
  }

  emailChanged() {
    var value = this.refs.email.getValue();
    this.setState({email: value});
  }

}

module.exports = Marty.createContainer(FinishOrder, {
  listenTo: ["orderStore", "constantsStore"],
  fetch: {
    order: function () {
      return this.app.orderStore.getCurrentOrder();
    },
    takeawayPrice: function () {
      return this.app.constantsStore.getPriceConstant("takeaway");
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger">Unknown error occurred.</Alert>)
});