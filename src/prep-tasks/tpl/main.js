var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Boilerplate = require('carbon-boilerplate');

var routes = (
  <Route path="/" handler={Boilerplate.App}>
  </Route>
);

Boilerplate.Route(routes);
