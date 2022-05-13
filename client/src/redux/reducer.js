import { combineReducers } from "redux";
import friendsWannabeesReducer from "../redux/friends-wannabees/slice";
import globalChatReducer from "../redux/global-chat/slice";
import wallReducer from "../redux/wall/slice";
import otherWallReducer from "../redux/other-wall/slice";

const rootReducer = combineReducers({
    friendsWannabees: friendsWannabeesReducer,
    globalChat: globalChatReducer,
    wallPosts: wallReducer,
    otherWallPosts: otherWallReducer,
});

export default rootReducer;
