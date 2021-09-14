import { combineReducers } from "redux";
import chartReducer from "./chartReducer";
import filterReducer from "./filterReducer";
import questionReducer from "./questionReducer";
import userReducer from "./userReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["profile"],
};

const rootReducer = combineReducers({
  filters: filterReducer,
  questions: questionReducer,
  chart: chartReducer,
  user: persistReducer(persistConfig, userReducer),
});

export default rootReducer;
