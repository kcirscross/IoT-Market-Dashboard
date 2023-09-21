import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-tailwind/react';
import { BrowserRouter } from 'react-router-dom';
// import dontenv from 'dotenv';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// dontenv.config();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ContextProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ContextProvider>
    </PersistGate>
  </Provider>,

  document.getElementById('root')
);
