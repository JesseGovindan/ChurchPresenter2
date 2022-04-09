import {CombinedState, combineReducers, configureStore} from '@reduxjs/toolkit';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import bibleLibraryReducer, {epics as bibleLibraryEpics} from './bibleLibrarySlice';
import songLibraryReducer, {epics as songLibraryEpics} from './songLibrarySlice';
import previewProjectorReducer, {epics as previewProjectorEpics} from './previewProjectorSlice';
import serviceManagerReducer, {epics as serviceManagerEpics} from './serviceManagerSlice';

export const reducer = combineReducers({
  songLibrary: songLibraryReducer,
  bibleLibrary: bibleLibraryReducer,
  previewProjector: previewProjectorReducer,
  serviceManager: serviceManagerReducer,
});

type ReducerParam = Parameters<typeof reducer>[0]

// eslint-disable-next-line
type StateType<T> = T extends CombinedState<infer T> ? T : never

export type State = StateType<ReducerParam>

const epicMiddleware = createEpicMiddleware<any, any, any, any>();

const store = configureStore({
  reducer,
  middleware: [epicMiddleware],
});

export default store;

export const allEpics = [
  ...songLibraryEpics,
  ...bibleLibraryEpics,
  ...previewProjectorEpics,
  ...serviceManagerEpics,
];

const rootEpic = combineEpics(...allEpics);
epicMiddleware.run(rootEpic);
