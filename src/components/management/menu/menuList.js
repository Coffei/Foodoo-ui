var React = require("react");
var Marty = require("marty");
var _ = require("lodash");
var DateHelper = require("../../../helpers/dateHelper");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Panel = RB.Panel;
var Grid = RB.Grid;
var Col = RB.Col;
var Badge = RB.Badge;
var Button = RB.Button;

var ListGroup = RB.ListGroup;
var ListGroupItem = RB.ListGroupItem;

var Toastr = require("toastr");

var Menu = require("./menu");
var MenuModal = require("./menuModal");



class MenuList extends React.Component {

  render() {
    var menusGrouped = _.mapValues(_.groupBy(this.props.menus, "date"), (menus) => _.sortBy(menus, "number"));
    var days = DateHelper.getDatesInRange(this.props.from, this.props.to, "day");
    return (
      <div>
        <MenuModal ref="menuModal" onSave={this.saveMenu.bind(this)}/>
        { _.map(days, (day) => (
          <Panel bsStyle="success" className="with-buttons" header={
              <span>
                <span className="pull-right">
                  <Button bsStyle="success" onClick={this.newMenuClicked(day, menusGrouped[day.format("YYYY-MM-DD")]).bind(this)}><Icon name="plus-circle"/></Button>
                </span>
                { day.format("dddd - Do MMMM YYYY") }
              </span>

            }>
            { this.renderNoMenuWarning(menusGrouped[day.format("YYYY-MM-DD")]) }
            <ListGroup>
            { _.map(menusGrouped[day.format("YYYY-MM-DD")] || [], (menu) => (
            <ListGroupItem key={menu.id}>
              <Grid className="autowidth">
                <Col xs={1}>
                  <span className="menu-number"><Badge>{menu.number}</Badge></span>
                </Col>
                <Col xs={10}>
                  <Menu key={menu.id} menu={menu}/>
                </Col>
                <Col xs={1} className="stick-right">
                  <Button onClick={this.editMenuClicked(menu).bind(this)}><Icon name="pencil"/></Button>
                  <Button onClick={this.deleteMenu(menu).bind(this)} bsStyle="danger"><Icon name="trash"/></Button>
                </Col>
              </Grid>
            </ListGroupItem>
            ))}
          </ListGroup>
          </Panel>
        ))}
      </div>
    );
  }


  newMenuClicked(date, menus) {
    return () => {
      var maxNumber = _.max([_.max(_.map(menus, "number")), 0]);
      menu = {date: date.clone(), number: maxNumber + 1};
      this.refs.menuModal.open(menu);
    }
  }

  editMenuClicked(menu) {
    return () => this.refs.menuModal.open(menu);
  }

  deleteMenu(menu) {
    return () => {
      if(menu.id!=null && confirm("Are you sure?")) {
        this.app.menuActionCreator.deleteMenu(menu.id)
        .then(() => Toastr.info("Menu deleted!"))
        .catch((error) => {
          console.log(error);
          Toastr.error("Cannot delete menu, try refreshing the page.");
        });
      }
    }
  }

  saveMenu(menu) {
    var promise;
    if(menu.id!=null) {
      promise = this.app.menuActionCreator.updateMenu(menu);
    } else {
      promise = this.app.menuActionCreator.createMenu(menu);
    }

    promise.then(res => {
      Toastr.info(menu.id!=null ? "Menu updated!" : "Menu created!");
    })
    .catch(res => {
      var errors = res.body;
      Toastr.error("Invalid menu.");
      this.refs.menuModal.open(menu, errors);
    });
  }

  renderNoMenuWarning(menus) {
    if(menus==null || menus.length == 0) {
      return (
        <span className="text-muted">no menus available for this day</span>
      );
    }
  }
}

module.exports = Marty.createContainer(MenuList, {
  listenTo: ["menuStore"],
  fetch: {
    menus: function () {
      return this.app.menuStore.getMenusInRange(this.props.from, this.props.to);
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger"><Icon name="times-circle" size="lg"/> Unknown error occurred.</Alert>)
});
