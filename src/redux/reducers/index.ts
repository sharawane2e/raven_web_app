import { combineReducers } from "redux";
import chartReducer from "./chartReducer";
import filterReducer from "./filterReducer";
import questionReducer from "./questionReducer";
import userReducer from "./userReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import tourReducer from "./tourReducer";
import sidebarReducer from "./sidebarReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["profile"],
};

const rootReducer = combineReducers({
  questions: questionReducer,
  filters: filterReducer,
  chart: chartReducer,
  tour: tourReducer,
  sidebar: sidebarReducer,
  user: persistReducer(persistConfig, userReducer),
});

export default rootReducer;
