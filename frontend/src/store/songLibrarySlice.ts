import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createEmptyReducer} from './Epic';
import {SongReference} from './previewProjectorSlice';
import {Epic} from 'redux-observable';
import {State} from '.';

type SongLibraryStore = {
  searchResults: SongReference[];
}

const initialState: SongLibraryStore = {
  searchResults: [],
};

export const songLibrarySlice = createSlice({
  name: 'songLibrary',
  initialState,
  reducers: {
    // epics
    getAllSongs: createEmptyReducer<SongLibraryStore>(),
    songSearchStarted: createEmptyReducer<SongLibraryStore, string>(),

    // reducers
    searchResultsChanged: (state, action: PayloadAction<SongReference[]>) => {
      state.searchResults = action.payload;
    },
  },
});

export const {getAllSongs, songSearchStarted, searchResultsChanged} = songLibrarySlice.actions;

// - Epics -----------------------------------------------------------------------------------------

export const epics: Epic<any, any, State>[] = [
  // (action$, _state$) => {
  //   return action$.pipe(
  //     ofType(getAllSongs.type),
  //     switchMap(() => client.getAllSongs().pipe(
  //       map(response => searchResultsChanged(response)),
  //     )),
  //   );
  // },

  // action$ => {
  //   return action$.pipe(
  //     ofType(songSearchStarted.type),
  //     switchMap((action: PayloadAction<string>) => {
  //       return client.getAllSongsMatching(action.payload).pipe(
  //         map(response => searchResultsChanged(response)),
  //       );
  //     }),
  //   );
  // },
];

export default songLibrarySlice.reducer;
