var React = require("react");
var Marty = require("marty");
var _ = require("lodash");
var moment = require("moment");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;
var Button = RB.Button;

var Menu = require("./menu.js");


var DateHelper = require("../../helpers/dateHelper");
const fmt = "HH:mm";

class MenuList extends React.Component {

  canOrder() {
    return this.props.menuHours != null && moment.utc(this.props.menuHours.endTime, fmt).local().isAfter(moment());
  }

  render() {
    var days = DateHelper.getDatesInRange(this.props.start, this.props.end, "day");
    var menusGrouped = _.mapValues(_.groupBy(this.props.menus || [], "date"), (menus) => _.sortBy(menus, "number"));
    if(this.props.hideIfEmpty && _.isEmpty(this.props.menus)) {
      console.log("menu is empty, not displaying");
      return <span></span>;
    }
    if(this.props.hideIfCannotOrder && !this.canOrder()) {
      console.log("cannot order menu, not displaying");
      return <span></span>;
    }

    var label = _.isEmpty(this.props.label) ? "" : (
      <h2>{this.props.label}</h2>
    );

    return (
      <span>
        {label}
        { _.map(days, (day) => (
          <span>
            <h3>{ day.format("dddd, Do MMMM YYYY") }</h3>
            { this.renderNoMenusWarning(menusGrouped[day.format("YYYY-MM-DD")]) }
            <ListGroup>
              { _.map((menusGrouped[day.format("YYYY-MM-DD")] || []), (menu) => (
                <ListItem>
                  <Menu menu={menu} date={day} />
                </ListItem>
              )) }
            </ListGroup>
          </span>
        ))}
      </span>
    );
  }

  renderNoMenusWarning(menus) {
    if(menus==null || menus.length==0) {
      return (
        <span className="text-muted">no menus for this day</span>
      );
    }
  }
}

module.exports = Marty.createContainer(MenuList, {
  listenTo: ["menuStore", "hoursStore"],
  fetch: {
    menus: function () {
      var start = this.props.start;
      var end = this.props.end;
      return this.app.menuStore.getMenusInRange(start, end);
    },
    menuHours: function() {
      return this.app.hoursStore.getHours("MENU");
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger">Unknown error occurred</Alert>)
});
