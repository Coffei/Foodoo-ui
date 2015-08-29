var React = require("react");
var Marty = require("marty");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Panel = RB.Panel
var ListGroup = RB.ListGroup;
var ListItem = RB.ListGroupItem;

var Ingredient = require("./ingredient");

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIngredientIds: []
    };
  }
  render() {
    return (
      <span>
        <Panel header={this.getTitle()} bsStyle={this.getStyle()}>
          { this.renderPanelContent() }
        </Panel>
      </span>
    );
  }

  renderPanelContent() {
    if(this.props.error!=null) {
      return this.props.error;
    } else if(this.props.loading) {
      return (
        <Icon name="spinner" spin={true} size="2x" />
      );
    } else {
      return (
        <ListGroup fill>
          { _.map(this.props.ingredients, (ingredient) => (
          <ListItem bsStyle={this.getIngredientClass(ingredient)} href="#" onClick={this.toggleIngredient(ingredient).bind(this)}>
            <Ingredient ingredient={ingredient}/>
          </ListItem>
          )) }
        </ListGroup>
      );
    }
  }

  toggleIngredient(ingredient) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (_.contains(this.state.selectedIngredientIds, ingredient.id)) {
        _.remove(this.state.selectedIngredientIds, (el) => el == ingredient.id);
      } else {
        if(!this.props.group.allowMore && this.state.selectedIngredientIds.length >= 1) {
          this.state.selectedIngredientIds = [ingredient.id];
        } else {
          this.state.selectedIngredientIds.push(ingredient.id);
        }
      }
      this.invokeIngredientCallback();
      this.forceUpdate();
      return false;
    }
  }

  invokeIngredientCallback() {
    if(this.props.ingredientsChanged!=null) {
      var ingredients = _.map(this.state.selectedIngredientIds, (id) => _.find(this.props.ingredients, {id: id}));
      this.props.ingredientsChanged(this.props.group, ingredients);
    }
  }

  getIngredientClass(ingredient) {
    if(_.contains(this.state.selectedIngredientIds, ingredient.id)) return "success";

    return "";
  }

  getTitle() {
    return (
      <strong>{this.props.group.name}</strong>
    );
  }

  getStyle() {
    if(this.props.group.required) return "primary";

    return "info";
  }


}

module.exports = Marty.createContainer(Group, {
  listenTo: ["ingredientStore"],
  fetch: {
    ingredients: function() {
      return this.app.ingredientStore.getIngredientsInGroup(this.props.group);
    }
  },
  pending: function() {
    return this.done({loading: true});
  },
  failed: function() {
    return this.done({error: (
      <Alert bsStyle="danger">Unknown error</Alert>
    )});
  }
});