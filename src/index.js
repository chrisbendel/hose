import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import isElectron from 'is-electron';
import { loadWasm } from './Utils';

loadWasm().then(() => {
  console.log('loaded wasm');
  ReactDOM.render(<App />, document.getElementById('root'));
})

if (isElectron()) {
  registerServiceWorker();
}
