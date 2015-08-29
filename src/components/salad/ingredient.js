var React = require("react");

var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;

class Ingredient extends React.Component {
  render() {
    return (
      <span>
        <Grid className="autowidth">
          <Col xs={11}>
            <span className="ingredient-name">{this.props.ingredient.name}</span>
          </Col>
          <Col xs={1} className="ingredient-price-col">
            { this.renderPriceColContent() }
          </Col>
          <Col xs={12}>
            <span className="ingredient-description">{this.props.ingredient.description}</span>
          </Col>
        </Grid>
      </span>
    );
  }

  renderPriceColContent() {
    var ingredient = this.props.ingredient;
    var price = ingredient.price!=null ? ingredient.price : ingredient.group.price;

    return (
      <span className="ingredient-price">{price}Kč</span>
    );
  }
}

module.exports = Ingredient;