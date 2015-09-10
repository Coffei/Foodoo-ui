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

var Icon = require("react-fa");

var OrderItem = require("../orderItem");
var ItemsBar = require("./itemsBar");

class Order extends React.Component {
  render() {
    var order = this.props.order;
    var created = moment.utc(order.created).local().format("HH:mm Do MMMM YYYY");
    var duration = moment.duration(moment.utc(order.created).local() - moment()).humanize(true);
    var targetTime = order.targetTime!=null ? "at " + moment.utc(order.targetTime, "HH:mm").local().format("HH:mm") : "ASAP";
    var items = _.sortBy(order.orderItems, (item) => {
      if(item.type === "CUSTOMSALAD") return 0;
      if(item.type === "MENU") return item.menu.number;

      return 100;
    });
    var containsSalad = _.any(items, {type: "CUSTOMSALAD"});
    return (
      <span>
        <Panel bsStyle={this.getPanelStyle()} collapsible={true} defaultExpanded={false} header={
          <Grid className="autowidth">
            <Col xs={2}>
              <Badge>{order.id}</Badge>
            </Col>
            <Col xs={7}><strong>{order.customerName}</strong>{this.getCustomerEmail()}</Col>
            <Col xs={3}><strong>{order.totalPrice}Kč</strong>{this.getTakeawayText()}</Col>
          </Grid>
        } footer={
          <Grid fluid className="grid-compact">
            <Col xs={order.status == "NEW" ? 2 : 3}>
              {this.renderActionButtons()}
            </Col>
            <Col xs={order.status == "NEW" ? 8 : 7} className="itembar-col">
              <ItemsBar items={order.orderItems}/>
            </Col>
            <Col xs={1} className="itembar-col" style={{textAlign: "center"}}>
              {containsSalad ? (<Icon name="cutlery" size="lg"/>) : ""}
            </Col>
            <Col xs={1}>
              <span className="pull-right">
                <Button bsStyle="danger" onClick={this.cancelOrder.bind(this)}>Cancel</Button>
              </span>
            </Col>
          </Grid>
        }>
          <Grid className="autowidth">
            <Row>
              <Col xs={4}><h5>Created at {created} ({duration})</h5></Col>
              <Col xs={4}><h5>Pickup time {targetTime}</h5></Col>
            </Row>
            <Row className="items-row">
              <Col xs={12}>
                <ListGroup>
                  {_.map(items, (item) => (<ListItem><OrderItem item={item} readOnly={true}/></ListItem>))}
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
      nexttext = "Order is finished";
      nextstyle = "primary";
      nextaction = this.changeStatus("FINISHED");
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
      backtext = "Back to NEW";
      backstyle = "primary";
      backaction = this.changeStatus("NEW");
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
