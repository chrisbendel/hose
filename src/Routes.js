import React from 'react';
import { Route } from 'react-router-dom';
import Main from './components/Main/Main';

const routes = (
  <Route>
    <Route path="/main/:year" component={Main}/>
  </Route>
);

export default routes;