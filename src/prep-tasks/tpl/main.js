import React from 'react';
import Router from 'react-router';
import Boilerplate from 'carbon-boilerplate';

var Route = Router.Route;

import Components from './components';
import Views from './views';

var routes = (
  <Route path="/" handler={Boilerplate.App}>
  </Route>
);

Boilerplate.Route(routes);
