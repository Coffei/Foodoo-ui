// Styles
require("!style!css!less!../styles/styles.less");
// JS
var React        = require("react");
var Marty        = require("marty");
var Router       = require("react-router");
var Route        = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Application = require("../flux/app");
var ApplicationContainer = Marty.ApplicationContainer;

// Components
var RootComponent = require("./rootComponent");
var Home = require("./home");
var Management = require("./management/management");
var MenuManagement = require("./management/menu/menuManagement");
var IngredientManagement = require("./management/ingredients/ingredientManagement");
var EmptyManagement = require("./management/emptyManagement");

routes = (
  <Route path="/" handler={RootComponent}>
    <DefaultRoute handler={Home}/>
    <Route path="management" handler={Management}>
      <DefaultRoute handler={EmptyManagement}/>
      <Route path="menu" handler={MenuManagement}/>
      <Route path="ingredients" handler={IngredientManagement}/>
    </Route>
  </Route>
);

var app = new Application();
window.Marty = Marty;

Router.run(routes, Router.HashLocation, (Root) => {
  var node = document.getElementById("component-container");
  React.render(
      <ApplicationContainer app={app}>
        <Root />
      </ApplicationContainer>
  , node);
});
