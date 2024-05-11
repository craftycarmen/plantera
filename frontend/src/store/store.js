// store.js

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import listingsReducer from './listings';
import cartReducer from './cart';
import ordersReducer from './order';
import userReducer from './user';
import searchReducer from './search';
import guidesReducer from './guides';

const rootReducer = combineReducers({
  // ADD REDUCERS HERE
  session: sessionReducer,
  listings: listingsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  user: userReducer,
  search: searchReducer,
  guides: guidesReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  // Load state from localStorage
  const persistedState = localStorage.getItem('reduxState')
    ? JSON.parse(localStorage.getItem('reduxState'))
    : {};

  // Merge preloadedState with persistedState
  const mergedState = {
    ...preloadedState,
    ...persistedState
  };

  // Create store with merged state and enhancers
  const store = createStore(rootReducer, mergedState, enhancer);

  // Save state to localStorage whenever it changes
  store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
  });

  return store;
};

export default configureStore;


// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
// import sessionReducer from './session';
// import listingsReducer from './listings';
// import cartReducer from './cart';

// const rootReducer = combineReducers({
//   // ADD REDUCERS HERE
//   session: sessionReducer,
//   listings: listingsReducer,
//   cart: cartReducer
// });

// let enhancer;
// if (import.meta.env.MODE === 'production') {
//   enhancer = applyMiddleware(thunk);
// } else {
//   const logger = (await import("redux-logger")).default;
//   const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   enhancer = composeEnhancers(applyMiddleware(thunk, logger));
// }

// const configureStore = (preloadedState) => {
//   return createStore(rootReducer, preloadedState, enhancer);
// };

// export default configureStore;
