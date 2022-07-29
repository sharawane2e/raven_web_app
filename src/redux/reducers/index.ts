import { combineReducers } from "redux";
import chartReducer from "./chartReducer";
import filterReducer from "./filterReducer";
import questionReducer from "./questionReducer";
import userReducer from "./userReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import tourReducer from "./tourReducer";
import sidebarReducer from "./sidebarReducer";
import chapterReducer from "./chapterReducer";
import standardDeviationReduce from "./standardDeviationReduce";
import userCacheReducer from "./userCacheReducer";
import exportReducer from "./exportReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["profile"],
};

const rootReducer = combineReducers({
  chapters: chapterReducer,
  chart: chartReducer,
  export: exportReducer,
  filters: filterReducer,
  questions: questionReducer,
  sidebar: sidebarReducer,
  standard: standardDeviationReduce,
  tour: tourReducer,
  userCache: userCacheReducer,
  user: persistReducer(persistConfig, userReducer),
});

export default rootReducer;
