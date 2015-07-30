var Marty = require("marty");
var IngredientConstants = require("../constants/ingredientConstants");

class IngredientActionCreator extends Marty.ActionCreators {
  createGroup(group) {
    return this.app.ingredientApi.createGroup(group)
    .then(() => this.dispatch(IngredientConstants.GROUP_CREATED));
  }

  updateGroup(group) {
    return this.app.ingredientApi.updateGroup(group)
    .then(() => this.dispatch(IngredientConstants.GROUP_UPDATED));
  }
}

module.exports = IngredientActionCreator;
