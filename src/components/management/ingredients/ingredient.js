var React = require("react");
var Marty = require("marty");
var Toastr = require("toastr");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var Button = RB.Button;

var IngredientModal = require("./ingredientModal");

class Ingredient extends React.Component {
  render () {
    var ingredient = this.props.ingredient;

    var priceCol = ingredient.price != null ?
    (<Col xs={1}><span className="ingredient-price">{ingredient.price}Kč</span></Col>) :
    "";
    return (
      <span>
        <IngredientModal ref="modal" onSave={this.updateIngredient.bind(this)}/>
        <Grid className="autowidth">
          <Col xs={11}>
            <Grid className="autowidth">
              <Col xs={11}><span className="ingredient-name">{ingredient.name}</span></Col>
              { priceCol }
              <Col xs={12}><span className="ingredient-description">{ingredient.description}</span></Col>
            </Grid>
          </Col>
          <Col xs={1}>
            <Button onClick={this.editClicked.bind(this)}><Icon name="pencil"/></Button>
            <Button bsStyle="danger" onClick={this.deleteIngredient.bind(this)}><Icon name="trash" /></Button>
          </Col>
        </Grid>

      </span>
    );
  }

  deleteIngredient() {
    if(confirm("Are you sure?")) {
      this.app.ingredientActionCreator.deleteIngredient(this.props.ingredient)
      .then(() => Toastr.info("Ingredient deleted!"))
      .catch(() => Toastr.error("Try to refresh the page.", "Unable to delete ingredient"))
    }
  }

  updateIngredient(ingredient) {
    this.app.ingredientActionCreator.updateIngredient(ingredient)
    .then(() => Toastr.info("Ingredient updated!"))
    .catch((res) => {
      var errors = res.body;
      Toastr.error("Invalid ingredient");
      this.refs.modal.open(ingredient, errors);
    })
  }

  editClicked() {
    this.refs.modal.open(this.props.ingredient);
  }
}

module.exports = Marty.createContainer(Ingredient);
