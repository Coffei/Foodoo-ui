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

  deleteGroup(group) {
    return this.app.ingredientApi.deleteGroup(group)
    .then(() => this.dispatch(IngredientConstants.GROUP_DELETED));
  }

  createIngredient(ingredient) {
    return this.app.ingredientApi.createIngredient(ingredient)
    .then(() => this.dispatch(IngredientConstants.INGREDIENT_CREATED, ingredient.group));
  }

  updateIngredient(ingredient) {
    return this.app.ingredientApi.updateIngredient(ingredient)
    .then(() => this.dispatch(IngredientConstants.INGREDIENT_UPDATED, ingredient.group));
  }

  deleteIngredient(ingredient) {
    return this.app.ingredientApi.deleteIngredient(ingredient)
    .then(() => this.dispatch(IngredientConstants.INGREDIENT_DELETED, ingredient.group));
  }
}

module.exports = IngredientActionCreator;
