/**
 * Created by Coffei on 5.8.15.
 */
var React = require("react");
var Marty = require("marty");

var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var Input = RB.Input;
var Badge = RB.Badge;

class OrderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {
      timesValue: this.props.item.times
    };
  }
  render() {
    return (
      <span>
        <Grid className="autowidth">
          <Col xs={11}><span className="order-type">{this.getOrderType()}</span></Col>
          <Col xs={1}><span className="order-price">{this.getPrice()}Kč</span></Col>
          <Col xs={12}><span className="order-description">{this.getDetails()}</span></Col>
          {this.renderTimesInput()}
        </Grid>
      </span>
    );
  }

  renderTimesInput() {
    if(this.props.readOnly) {
      return (
        <Col xs={3}>
          <span className="order-times">{this.props.item.times} times</span>
        </Col>
      );
    } else {
      return (
        <span>
          <Col xs={2}><span className="order-timeslabel">How many?</span></Col>
          <Col xs={1}><Input type="text" bsStyle={this.timesValidStyle()} value={this.state.timesValue} onChange={this.timesChanged.bind(this)} /></Col>
        </span>

      );
    }
  }

  timesChanged(event) {
    var times = event.target.value;
    if(/^\d+$/.test(times) && parseInt(times) > 0) {
      var item = _.clone(this.props.item);
      item.times = parseInt(times);
      this.app.orderActionCreator.updateItem(item);
    }

    this.setState({
      timesValue: times
    });
  }

  timesValidStyle() {
    if (/^\d+$/.test(this.state.timesValue) && parseInt(this.state.timesValue) > 0) return "success";

    return "error";
  }

  getOrderType() {
    if(this.props.item.type=="CUSTOMSALAD") return "Custom Salad"
    else if (this.props.item.type == "MENU") return (
      <span>Menu <Badge>{this.props.item.menu.number}</Badge> - {this.props.item.menu.name}</span>
    );

    return "Unknown";
  }

  getDetails() {
    if(this.props.item.type == "CUSTOMSALAD") {
      return _(this.props.item.ingredients).map("name").reduce((a,b) => a + ", " + b);
    } else {
      return this.props.item.menu.description;
    }
  }

  getPrice() {
    var item = this.props.item;
    var price = 0;
    if(item.type == "CUSTOMSALAD") {
      _.forEach(item.ingredients, (ingredient) => {
        var ingredientPrice = (ingredient.price != null ? ingredient.price : ingredient.group.price) || 0;
        price += ingredientPrice;
      })
    } else {
      price += item.menu.price || 0;
    }

    return price * (item.times || 1);
  }
}

module.exports = Marty.createContainer(OrderItem);