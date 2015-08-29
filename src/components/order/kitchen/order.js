/**
 * Created by jtrantin on 28.8.15.
 */
var React = require("react");
var _ = require("lodash");
var Marty = require("marty");
var moment = require("moment");

var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Row = RB.Row;
var Col = RB.Col;
var Badge = RB.Badge;
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;
var Panel = RB.Panel;
var Button = RB.Button;
var ButtonGroup = RB.ButtonGroup;

var OrderItem = require("../orderItem");

class Order extends React.Component {
  render() {
    var order = this.props.order;
    var created = moment.utc(order.created).local().format("HH:mm Do MMMM YYYY");
    var duration = moment.duration(moment.utc(order.created).local() - moment()).humanize(true);
    var targetTime = order.targetTime!=null ? "at " + moment.utc(order.targetTime, "HH:mm").local().format("HH:mm") : "ASAP";
    return (
      <span>
        <Panel bsStyle={this.getPanelStyle()} header={
          <Grid className="autowidth">
            <Col xs={2}>
              <Badge>{order.id}</Badge>
            </Col>
            <Col xs={7}><strong>{order.customerName}</strong>{this.getCustomerEmail()}</Col>
            <Col xs={3}><strong>{order.totalPrice}Kč</strong>{this.getTakeawayText()}</Col>
          </Grid>
        } footer={
          <span>
            {this.renderActionButtons()}
            <span className="pull-right">
              <Button bsStyle="danger" onClick={this.cancelOrder.bind(this)}>Cancel</Button>
            </span>
          </span>
        }>
          <Grid className="autowidth">
            <Row>
              <Col xs={4}><h5>Created at {created} ({duration})</h5></Col>
              <Col xs={4}><h5>Pickup time {targetTime}</h5></Col>
            </Row>
            <Row className="items-row">
              <Col xs={12}>
                <ListGroup>
                  {_.map(order.orderItems, (item) => (<ListItem><OrderItem item={item} readOnly={true}/></ListItem>))}
                </ListGroup>
              </Col>
            </Row>
          </Grid>
        </Panel>
      </span>
    );
  }

  renderActionButtons() {
    var status = this.props.order.status;
    var nexttext;
    var nextaction;
    var nextstyle;
    var backtext;
    var backaction;
    var backstyle;
    if(status === "NEW") {
      nexttext = "Start working on it";
      nextstyle = "primary";
      nextaction = this.changeStatus("PENDING");
    } else if (status === "PENDING") {
      nexttext = "Finish it";
      nextstyle = "success";
      nextaction = this.changeStatus("FINISHED");
      backtext = "Set to NEW"
      backstyle = "info";
      backaction = this.changeStatus("NEW");
    } else if (status === "FINISHED") {
      nexttext = "Order is done";
      nextstyle = "default";
      nextaction = this.changeStatus("DONE");
      backtext = "Set to PENDING";
      backstyle = "primary";
      backaction = this.changeStatus("PENDING");
    }
    var buttons = [<Button bsStyle={nextstyle} onClick={nextaction}>{nexttext}</Button>];
    if(backtext != null) {
      buttons.push(<Button bsStyle={backstyle} onClick={backaction}>{backtext}</Button>)
    }

    return (<ButtonGroup>{buttons}</ButtonGroup>)
  }

  changeStatus(status) {
    return () => {
      this.app.orderActionCreator.changeStatus(this.props.order, status);
    };
  }

  cancelOrder() {
    if(confirm("Are you sure you want to cancel the order?")) {
      this.app.orderActionCreator.changeStatus(this.props.order, "CANCELLED");
    }
  }

  getPanelStyle() {
    switch(this.props.order.status) {
      case "NEW":
        //is it verified (not cancelable)?
        if (moment.duration(moment() - moment.utc(this.props.order.created).local()) < moment.duration(15,"minute")) {
          return "default";
        }

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

  getCustomerEmail() {
    if(!_.isEmpty(this.props.order.customeremail)) {
      return (<span> ({this.props.order.customeremail})</span>)
    } else {
      return <span></span>;
    }
  }

  getTakeawayText() {
    if(this.props.order.takeaway) return " (incl. takeaway)";
  }
}

module.exports = Marty.createContainer(Order);
