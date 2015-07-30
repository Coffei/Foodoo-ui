var Marty = require("marty");
var IngredientConstants = require("../constants/ingredientConstants");

class IngredientQueries extends Marty.Queries {
  getAllGroups() {
    this.dispatch(IngredientConstants.RECEIVE_GROUPS_STARTING);

    return this.app.ingredientApi.getAllGroups()
    .then((groups) => {
      this.dispatch(IngredientConstants.RECEIVE_GROUPS, groups);
    })
    .catch((err) => this.dispatch(IngredientConstants.RECEIVE_GROUPS_FAILED, err));
  }

  getIngredientsInGroup(group) {
    this.dispatch(IngredientConstants.RECEIVE_INGREDIENTS_IN_GROUP_STARTING);

    return this.app.ingredientApi.getIngredientsInGroup(group)
    .then((ingredients) => {
      this.dispatch(IngredientConstants.RECEIVE_INGREDIENTS_IN_GROUP, {group: group, result: ingredients});
    })
    .catch((err) => this.dispatch(IngredientConstants.RECEIVE_INGREDIENTS_IN_GROUP_FAILED, err));
  }
}

module.exports = IngredientQueries;
