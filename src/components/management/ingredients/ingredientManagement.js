var React = require("react");
var Marty = require("marty");
var Toastr = require("toastr");

var RB = require("react-bootstrap");
var Panel = RB.Panel;
var Alert = RB.Alert;
var Button = RB.Button;
var Icon = require("react-fa");

var GroupList = require("./groupList");
var GroupModal = require("./groupModal");

class IngredientManagement extends React.Component {
  render() {
    return (
      <Panel className="with-buttons" header={
          <span>
            <span className="pull-right">
              <Button bsStyle="primary" onClick={this.newGroupClicked.bind(this)}><Icon name="plus-circle"/></Button>
            </span>
            Ingredient groups
          </span>
        }>
        <GroupModal ref="groupModal" onSave={this.createGroup.bind(this)}/>
        <GroupList />
      </Panel>
    );
  }

  createGroup(group) {
    this.app.ingredientActionCreator.createGroup(group)
    .then(() => {
      Toastr.info("Group created!");
      this.refs.groupModal.hide();
    })
    .catch((res) => {
      var errors = res.body;
      Toastr.error("Invalid group");
      this.refs.groupModal.open(group, errors);
    })
  }

  newGroupClicked() {
    this.refs.groupModal.open();
  }
}

module.exports = Marty.createContainer(IngredientManagement);
