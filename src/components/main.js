// Styles
require("!style!css!less!../styles/styles.less");
// JS
var React         = require("react");
var Marty         = require("marty");
var Router        = require("react-router");
var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;

var Application = require("../flux/app");
var ApplicationContainer = Marty.ApplicationContainer;

// Components
var RootComponent = require("./rootComponent");
var NotFound = require("./notFound");
var Home = require("./home");
var Management = require("./management/management");
var MenuManagement = require("./management/menu/menuManagement");
var IngredientManagement = require("./management/ingredients/ingredientManagement");
var HoursManagement = require("./management/hours/hoursManagement");
var ConstantsManagement = require("./management/constants/constantsManagement");
var MessageManagement = require("./management/message/messageManagement");
var EmptyManagement = require("./management/emptyManagement");

var MenuHome = require("./menu/menuHome");
var CustomSaladHome = require("./salad/customSaladHome");

var OrderHome = require("./order/orderHome");
var FinishOrder = require("./order/finishOrder");
var Order = require("./order/order");
var KitchenHome = require("./order/kitchen/home");

//TODO
var Login = require("./auth/login");

routes = (
  <Route path="/" handler={RootComponent}>
    <DefaultRoute handler={Home}/>
    <NotFoundRoute handler={NotFound}/>

    <Route path="login" handler={Login}/>

    <Route path="menu" handler={MenuHome}/>
    <Route path="salad" handler={CustomSaladHome}/>

    <Route path="checkout" handler={OrderHome}/>
    <Route path="checkout/finish" handler={FinishOrder} />

    <Route path="order/:id" handler={Order}/>
    <Route path="orders/list" handler={KitchenHome}/>

    <Route path="management" handler={Management}>
      <DefaultRoute handler={EmptyManagement}/>
      <Route path="menu" handler={MenuManagement}/>
      <Route path="ingredients" handler={IngredientManagement}/>
      <Route path="hours" handler={HoursManagement}/>
      <Route path="constants" handler={ConstantsManagement}/>
      <Route path="announcement" handler={MessageManagement}/>
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
