var React = require("react");
var Marty = require("marty");
var _ = require("lodash");
var moment = require("moment");

var Toastr = require("toastr");
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Button = RB.Button;


var Group = require("./group");

const fmt = "HH:mm";
class CustomSaladHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIngredients: {}
    };
  }

  render() {
    var groups = _.sortByOrder(this.props.groups, ["required", "name"], ["desc","asc"]);
    var cannotOrderWarning = !this.canOrder() ? (
      <Alert bsStyle="danger">
        <Icon name="times-circle" size="lg"/><strong> You cannot order at this time</strong>.
        Orders are only possible before <strong>{this.getEndTime()}</strong>.
      </Alert>
    ) : "";
    return (
      <div>
        <div className="page-header"><h1>Custom salad</h1></div>
        { cannotOrderWarning }
        {_.map(groups, (group) => (
          <Group group={group} ingredientsChanged={this.ingredientsChanged.bind(this)}/>
        ))}
        { this.renderFooter() }
      </div>
    );
  }


  getEndTime() {
    return moment.utc(this.props.hours.endTime, fmt).local().format(fmt);
  }

  renderFooter() {
    var orderButton = this.canOrder() ? (
      <span className="pull-right" style={{marginBottom: "10px"}}>
            <Button bsStyle="primary" onClick={this.addToCart.bind(this)}><Icon name="shopping-cart"/> Add to
              cart</Button>
          </span>
    ) : "";
    var errors = this.getErrors();
    if (!_.isEmpty(errors)) {
      return (
        <span>
          { _.map(errors, (error) => (
            <Alert bsStyle="danger"><Icon name="exclamation-triangle"/> {error}</Alert>
          )) }
        </span>
      );
    } else {
      var total = this.getTotalPrice();
      return (
        <span>
          <div className="page-footer">
            <h2>
              <span className="pull-right">{total}Kč</span>
              Total:
            </h2>
          </div>
          { orderButton }
        </span>
      );
    }
  }

  canOrder() {
    if (!_.isEmpty(this.props.hours)) {
      const hours = this.props.hours;
      return moment().utc().isBefore(moment.utc(hours.endTime, fmt));
    }

    return true;
  }

  addToCart() {
    if (_.isEmpty(this.getErrors())) {
      var ingredients = _.flatten(_.values(this.state.selectedIngredients));
      this.app.orderActionCreator.addSalad(ingredients);
      Toastr.info("Salad added");
    }
  }

  getTotalPrice() {
    var ingredients = _.flatten(_.values(this.state.selectedIngredients));
    var total = 0;
    _.forEach(ingredients, (ingredient) => {
      var ingredientPrice = (ingredient.price != null ? ingredient.price : ingredient.group.price) || 0;
      total += ingredientPrice;
    });

    return total;
  }

  getErrors() {
    var groups = this.props.groups;
    var errors = [];

    var requiredGroups = _.filter(groups, {required: true});
    var notUsedRequiredGroups = _.filter(requiredGroups, (group) => _.isEmpty(this.state.selectedIngredients[group.id]));
    if (!_.isEmpty(notUsedRequiredGroups)) {
      _.forEach(notUsedRequiredGroups, (group) => errors.push(
        <span>No ingredients from group <strong>{group.name}</strong> are selected.</span>));
    }

    return errors;
  }

  ingredientsChanged(group, ingredients) {
    this.state.selectedIngredients[group.id] = ingredients;
    this.forceUpdate();
  }
}

module.exports = Marty.createContainer(CustomSaladHome, {
  listenTo: ["ingredientStore", "hoursStore"],
  fetch: {
    groups: function () {
      return this.app.ingredientStore.getAllGroups();
    },
    hours: function () {
      return this.app.hoursStore.getHours("SALAD");
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger">Unknown error occurred</Alert>)
});