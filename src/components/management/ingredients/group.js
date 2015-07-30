var React = require("react");
var Marty = require("marty");
var Toastr = require("toastr");

var RB = require("react-bootstrap");
var Panel = RB.Panel;
var Button = RB.Button;
var Alert = RB.Alert;
var Icon = require("react-fa");

var GroupModal = require("./groupModal");


class Group extends React.Component {
  render() {
    return (
      <span>
        <GroupModal ref="groupModal" onSave={this.updateGroup.bind(this)}/>
        <Panel bsStyle="success" className="with-buttons" header={
            <span>
              <span className="pull-right">
                <Button onClick={this.editGroup.bind(this)}><Icon name="pencil"/></Button>
                <Button bsStyle="success"><Icon name="plus-circle"/></Button>
              </span>
              <span>
              <strong>{ this.props.group.name }</strong> ({this.getModifiersDescription(this.props.group)}) - <strong>{this.props.group.price}Kč</strong>
              </span>

            </span>
          }>
          { this.props.ingredients.length }
        </Panel>
      </span>
    );
  }

  updateGroup(group) {
    this.app.ingredientActionCreator.updateGroup(group)
    .then(() => Toastr.info("Group updated!"))
    .catch((res) => {
      var errors = res.body;
      Toastr.error("Invalid group");
      this.refs.groupModal.open(group, errors);
    });
  }

  editGroup() {
    this.refs.groupModal.open(this.props.group);
  }

  getModifiersDescription(group) {
    modifiers = [];
    if(group.required) {
      modifiers.push("is mandatory");
    }

    if(group.allowMore) {
      modifiers.push("multiple ingredients allowed");
    }

    return _.reduce(modifiers, (a,b) => `${a}, ${b}`);
  }
}

module.exports = Marty.createContainer(Group, {
  listento: ["ingredientStore"],
  fetch: {
    ingredients: function () {
      return this.app.ingredientStore.getIngredientsInGroup(this.props.group);
    }
  },
  pending: function() {
    return (
      <Panel bsStyle="success" header={this.props.group.name}>
        <Icon name="spinner" spin={true} size="2x"/>
      </Panel>
    );
  },
  failed: () => (
    <Panel bsStyle="success" header={this.props.group.name}>
      <Alert bsStyle="danger"><Icon name="times-circle" size="lg"/> Unknown error occurred.</Alert>
    </Panel>
  )
});
