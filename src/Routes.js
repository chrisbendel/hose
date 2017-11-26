import React from 'react';
import { Route } from 'react-router-dom';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';

const routes = (
  <div>
    <Route path="/show/:id" component={Show}/>
    <Route path="/shows" component={Shows}/>
    <Route path="/song/:id" component={Show}/>
  </div>
);

export default routes;