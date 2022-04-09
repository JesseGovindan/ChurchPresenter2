import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createEmptyReducer} from './Epic';
import {Epic} from 'redux-observable';
import {State} from '.';

export type FolderType = 'song' | 'bible';

export interface SongReference {
  title: string
  id: number
};

export interface Slide {
  text: string
  caption: string
  heading: string
}

export interface Folder {
  type: FolderType
  name: string
  slides: Slide[]
}

export interface PreviewProjectorState {
  showing: boolean
  folder?: Folder
}

const initialState: PreviewProjectorState = {
  showing: false,
};

export const previewProjectorSlice = createSlice({
  name: 'previewProjector',
  initialState,
  reducers: {
    previewSong: createEmptyReducer<PreviewProjectorState, SongReference>(),
    folderLoaded: (state, action: PayloadAction<Folder>) => {
      state.showing = true;
      state.folder = action.payload;
    },
  },
});

export const {previewSong, folderLoaded} = previewProjectorSlice.actions;

// - Epics -----------------------------------------------------------------------------------------
export const epics: Epic<any, any, State>[] = [
  // (action$, _state$) => {
  //   return action$.pipe(
  //     ofType(previewSong.type),
  //     switchMap((action: PayloadAction<SongReference>) => {
  //       return client.getSongFolder(action.payload.id).pipe(
  //         map(response => {
  //           return folderLoaded(response);
  //         }),
  //       );
  //     }),
  //   );
  // },
];

export default previewProjectorSlice.reducer;
