var React = require("react");
var Marty = require("marty");
var _ = require("lodash");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;
var Button = RB.Button;

var Menu = require("./menu.js");


var DateHelper = require("../../helpers/dateHelper");

class MenuList extends React.Component {
  render() {
    var days = DateHelper.getDatesInRange(this.props.date.clone().startOf("isoweek"), this.props.date.clone().endOf("isoweek"), "day");
    var menusGrouped = _.mapValues(_.groupBy(this.props.menus || [], "date"), (menus) => _.sortBy(menus, "number"));
    return (
      <span>
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
  listenTo: ["menuStore"],
  fetch: {
    menus: function () {
      var start = this.props.date.clone().startOf("isoweek");
      var end = this.props.date.clone().endOf("isoweek");
      return this.app.menuStore.getMenusInRange(start, end);
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger">Unknown error occurred</Alert>)
});
