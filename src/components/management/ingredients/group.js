var React  = require("react");
var Marty  = require("marty");
var Toastr = require("toastr");
var _      = require("lodash");

var Icon          = require("react-fa");
var RB            = require("react-bootstrap");
var Panel         = RB.Panel;
var Button        = RB.Button;
var Alert         = RB.Alert;
var ListGroup     = RB.ListGroup;
var ListGroupItem = RB.ListGroupItem;

var GroupModal      = require("./groupModal");
var IngredientModal = require("./ingredientModal");
var Ingredient      = require("./ingredient");


class Group extends React.Component {
  render() {
    return (
      <span>
        <GroupModal ref="groupModal" onSave={this.updateGroup.bind(this)}/>
        <IngredientModal ref="ingredientModal" onSave={this.createIngredient.bind(this)} onSave={this.createIngredient.bind(this)} />
        <Panel bsStyle={this.getPanelStyle()} className="with-buttons" header={
            <span>
              <span className="pull-right">
                <Button onClick={this.editGroup.bind(this)}><Icon name="pencil"/></Button>
                <Button bsStyle="danger" onClick={this.deleteGroup.bind(this)}><Icon name="trash"/></Button>
                <Button bsStyle="success" onClick={this.createIngredientClicked.bind(this)}><Icon name="plus-circle"/></Button>
              </span>
              <span>
              <strong>{ this.props.group.name }</strong> ({this.getModifiersDescription(this.props.group)}) - <strong>{this.props.group.price}Kč</strong>
              </span>

            </span>
          }>
          { this.renderPanelContent() }
        </Panel>
      </span>
    );
  }

  renderPanelContent() {
    return this.noIngredientsWarning() || (
      <ListGroup fill>
        { _.map(this.props.ingredients, (ingredient) => (
          <ListGroupItem>
            <Ingredient ingredient={ingredient}/>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  getPanelStyle() {
    if(this.props.group.required) return "primary";

    return "success";
  }


  createIngredientClicked() {
    var ingredient = {
      group: this.props.group
    };
    this.refs.ingredientModal.open(ingredient);
  }

  noIngredientsWarning() {
    if(this.props.ingredients==null || this.props.ingredients.length == 0) {
      return (<span className="text-muted">no ingredients in this group</span>);
    }
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

  createIngredient(ingredient) {
    this.app.ingredientActionCreator.createIngredient(ingredient)
    .then(() => Toastr.info("Ingredient created!"))
    .catch((res) => {
      var errors = res.body;
      Toastr.error("Invalid ingredient");
      this.refs.ingredientModal.open(ingredient, errors);
    });
  }

  deleteGroup() {
    if(confirm("Are you sure? Deleting a group means deleting all ingredients within.")) {
      this.app.ingredientActionCreator.deleteGroup(this.props.group)
      .then(() => Toastr.info("Group deleted!"))
      .catch(() => Toastr.error("Try to refresh the page.", "Unable to delete group"));
    }
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
