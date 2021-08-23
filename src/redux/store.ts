import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers";

export default function configureStore(preloadedState?: any) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);
  // @ts-ignore
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}
