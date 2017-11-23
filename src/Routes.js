import React from 'react';
import { Route } from 'react-router-dom';
import Main from './components/Main/Main';

//Unused for now, might move routes to here for simplicity.
const routes = (
  <div>
    <Route path="main/:id" component={Main}/>
  </div>
);

export default routes;