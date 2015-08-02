var Marty = require("marty");
var Settings = require("../settings/settings");

class IngredientApi extends Marty.HttpStateSource {
  getAllGroups() {
    return this.get(Settings.backendPath + "/groups")
    .then((res) => {
      if(res.ok) return res.body;

      throw res;
    });
  }

  getIngredientsInGroup(group) {
    return this.get(Settings.backendPath + `/groups/${group.id}/ingredients`)
    .then((res) => {
      if(res.ok) return res.body;

      throw res;
    });
  }

  createGroup(group) {
    return this.post({url: Settings.backendPath + "/groups", body: group})
    .then((res) => {
      if(res.ok) return "ok";

      throw res;
    });
  }

  updateGroup(group) {
    return this.put({url: Settings.backendPath + `/groups/${group.id}`, body: group})
    .then((res) => {
      if(res.ok) return "ok";

      throw res;
    });
  }

  deleteGroup(group) {
    return this.delete({url: Settings.backendPath + `/groups/${group.id}`})
    .then((res) => {
      if(res.ok) return "ok";

      throw res;
    });
  }

  createIngredient(ingredient) {
    return this.post({url: Settings.backendPath + `/groups/${ingredient.group.id}/ingredients`, body: ingredient})
    .then((res) => {
      if(res.ok) return "ok";

      throw res;
    });
  }

  updateIngredient(ingredient) {
    return this.put({url: Settings.backendPath + `/ingredients/${ingredient.id}`, body: ingredient})
    .then((res)=> {
      if(res.ok) return "ok";

      throw res;
    });
  }

  deleteIngredient(ingredient) {
    return this.delete({url: Settings.backendPath + `/ingredients/${ingredient.id}`})
    .then((res) => {
      if(res.ok) return "ok";

      throw res;
    });
  }
}

module.exports = IngredientApi;
