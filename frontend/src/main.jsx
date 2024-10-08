import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import * as listingActions from './store/listings';
import * as cartActions from './store/cart';
import * as orderActions from './store/order';
import * as userActions from './store/user';
import * as searchActions from './store/search';
import * as guideActions from './store/guides';
import * as sellActions from './store/sell';
import * as reviewActions from './store/reviews';
import { Modal, ModalProvider } from './context/Modal';

const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.listingActions = listingActions;
  window.cartActions = cartActions;
  window.orderActions = orderActions;
  window.userActions = userActions;
  window.searchActions = searchActions;
  window.guideActions = guideActions;
  window.sellActions = sellActions;
  window.reviewActions = reviewActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
