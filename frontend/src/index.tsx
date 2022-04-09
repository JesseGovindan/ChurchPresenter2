import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import store from './store';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {MobileApp} from './mobile/App';
import {App as ProjectorApp} from './projector/App';
import WebSocketProvider from './websocket/index';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/mobile/*' element={<MobileApp/>}/>
            <Route path='/projector/*' element={<ProjectorApp/>}/>
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
