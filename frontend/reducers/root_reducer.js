import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import HeaderReducer from './header_reducer';
import ProjectReducer from './project_reducer';
import LoadingReducer from './loading_reducer';
import PixelReducer from './pixel_reducer';
import SidebarReducer from './sidebar_reducer';
import ErrorReducer from './error_reducer';

export default combineReducers({
  session: SessionReducer,
  headerInfo: HeaderReducer,
  projects: ProjectReducer,
  loading: LoadingReducer,
  pixels: PixelReducer,
  sidebar: SidebarReducer,
  globalErrors: ErrorReducer,
});
