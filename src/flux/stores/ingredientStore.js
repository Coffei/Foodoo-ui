var Marty = require("marty");
var IngredientConstants = require("../constants/ingredientConstants");

class IngredientStore extends Marty.Store {
  constructor(opts) {
    super(opts);

    this.state = {
      ingredients: {}
    };

    this.handlers = {
      addGroups: IngredientConstants.RECEIVE_GROUPS,
      addIngredientsForGroup: IngredientConstants.RECEIVE_INGREDIENTS_IN_GROUP,
      clearGroups: [IngredientConstants.GROUP_CREATED, IngredientConstants.GROUP_UPDATED, IngredientConstants.GROUP_DELETED],
      clearIngredients: [IngredientConstants.INGREDIENT_CREATED, IngredientConstants.INGREDIENT_UPDATED, IngredientConstants.INGREDIENT_DELETED]
    };
  }

  clearIngredients(group) {
    if(group!=null) {
      this.state.ingredients[group.id] = undefined;
      this.hasChanged();
    } else {
      this.state.ingredients = {};
      this.hasChanged();
    }
  }

  clearGroups() {
    this.state.groups = undefined;
    this.hasChanged();
  }

  addGroups(groups) {
    this.state.groups = groups;
    this.hasChanged();
  }

  addIngredientsForGroup(result) {
    if(result.group!=null) {
      this.state.ingredients[result.group.id] = result.result;
      this.hasChanged();
    }
  }

  getAllGroups() {
    return this.fetch({
      id: "groups_all",
      locally: () => this.state.groups,
      remotely: () => this.app.ingredientQueries.getAllGroups()
    });
  }

  getIngredientsInGroup(group) {
    return this.fetch({
      id: "ingredients_in_" + group.id,
      locally: () => this.state.ingredients[group.id],
      remotely: () => this.app.ingredientQueries.getIngredientsInGroup(group)
    });
  }
}

module.exports = IngredientStore;
