var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Boilerplate = require('carbon-boilerplate');

var Components = require('./components');
var Views = require('./views');

var routes = (
  <Route path="/" handler={Boilerplate.App}>
  </Route>
);

Boilerplate.Route(routes);
