import React from 'react';
import { Route } from 'react-router';
import { startRouter } from 'carbon/lib/utils/router';

var routes = (
  <Route path="/" />
);

startRouter(routes);
