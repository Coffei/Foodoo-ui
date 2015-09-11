var React = require("react");
var Marty = require("marty");
var moment = require("moment");
var _ = require("lodash");

var Toastr = require("toastr");
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var Badge = RB.Badge;
var Button = RB.Button;
var Alert = RB.Alert;
var Tooltip = RB.Tooltip;
var OverlayTrigger = RB.OverlayTrigger;

const fmt = "HH:mm";
class Menu extends React.Component {
  render() {
    var menu = this.props.menu;
    var orderButton = this.props.loadingHours ? (
      <Icon name="spinner" spin={true}/>
    ) : (this.props.hoursError != null ? (this.props.hoursError) :
      (
        <OverlayTrigger overlay={this.getOverlayTooltip()}>
          <Button bsStyle="primary" disabled={!this.canOrder()} onClick={this.addToCart.bind(this)}><Icon
            name="plus"/><Icon
            name="shopping-cart" size="lg"/></Button>
        </OverlayTrigger>
      ));
    return (
      <span>
        <Grid className="autowidth">
          <Col xs={11}>
            <Grid className="autowidth">
              <Col xs={1}><Badge><span className="menu-number">{ menu.number }</span></Badge></Col>
              <Col xs={10}><span className="menu-name">{ menu.name }</span></Col>
              <Col xs={1}><span className="menu-price">{ menu.price }Kč</span></Col>
              <Col xs={12} xsOffset={1}><span className="menu-description">{ menu.description }</span></Col>
            </Grid>
          </Col>
          <Col xs={1}>
            {orderButton}
          </Col>
        </Grid>
      </span>
    );
  }

  canOrder() {
    if (!_.isEmpty(this.props.hours)) {
      var hours = this.props.hours;
      return this.props.date.isSame(moment(), "day") && moment().utc().isBefore(moment.utc(hours.endTime, fmt));
    } else {
      return this.props.date.isSame(moment(), "day");
    }
  }

  getStartTime() {
    return moment.utc(this.props.hours.startTime, fmt).local().format(fmt);
  }

  getEndTime() {
    return moment.utc(this.props.hours.endTime, fmt).local().format(fmt);
  }

  getOverlayTooltip() {
    if (this.canOrder()) {
      return (
        <Tooltip><strong>Order the menu!</strong></Tooltip>
      );
    } else {
      var additionalInfo = _.isEmpty(this.props.hours) ? ("") : (
        <span>
          <br/>
          You can only order today's menu before <strong>{this.getEndTime()}</strong>.
        </span>
      );
      return (
        <Tooltip>
          <strong>You cannot order the menu now.</strong>
          { additionalInfo }
        </Tooltip>
      );
    }
  }

  addToCart() {
    if (this.canOrder()) {
      this.app.orderActionCreator.addMenu(this.props.menu);
      Toastr.info("Menu added to cart.");
    }
  }

}

module.exports = Marty.createContainer(Menu, {
  listenTo: ["hoursStore"],
  fetch: {
    hours: function () {
      return this.app.hoursStore.getHours("MENU");
    }
  },
  pending: function () {
    return this.done({loadingHours: true});
  },
  failed: function () {
    return this.done({hoursError: <Alert bsStyle="danger">Cannot order.</Alert>});
  }
});
