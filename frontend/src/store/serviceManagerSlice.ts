import {Action, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {from} from 'rxjs';
import {createEmptyReducer} from './Epic';
import {SongReference} from './previewProjectorSlice';
import {of, switchMap} from 'rxjs';
import {Epic, ofType} from 'redux-observable';
import {State} from '.';
import {ws} from '../websocket';
import {Actions, ServiceList, FolderView} from 'commons';
import {SlideSpecifier} from 'commons/interfaces';

export interface ServiceManagerState {
  currentService: ServiceList
  selectedFolder: FolderView | null
  draggedSong?: SongReference
}

const initialState: ServiceManagerState = {
  currentService: [],
  selectedFolder: null,
};

export const serviceManagerSlice = createSlice({
  name: 'serviceManager',
  initialState,
  reducers: {
    getService: createEmptyReducer<ServiceManagerState>(),

    songDragStarted: (state, action: PayloadAction<SongReference>) => {
      state.draggedSong = action.payload;
    },

    songDragCancelled: state => {
      state.draggedSong = undefined;
    },

    songDragCompleted: createEmptyReducer<ServiceManagerState>(),

    serviceChanged: (state, action: PayloadAction<ServiceList>) => {
      state.currentService = action.payload;
    },

    folderSelected: (state, action: PayloadAction<FolderView | null>) => {
      state.selectedFolder = action.payload;
    },

    importService: createEmptyReducer<ServiceManagerState, FileList>(),
    selectFolder: createEmptyReducer<ServiceManagerState, number>(),
    deselectFolder: createEmptyReducer<ServiceManagerState>(),
    showSlide: createEmptyReducer<ServiceManagerState, SlideSpecifier>(),
    hideSlide: createEmptyReducer<ServiceManagerState>(),
  },
});


export const {
  songDragStarted,
  songDragCancelled,
  songDragCompleted,
  serviceChanged,
  getService,
  importService,
  selectFolder,
  deselectFolder,
  showSlide,
  hideSlide,
  folderSelected,
} = serviceManagerSlice.actions;
export const epics: Epic<any, any, State>[] = [
  // songDragCompletedEpic
  // (action$, state$) => {
  //   return action$.pipe(
  //     ofType(songDragCompleted.type),
  //     switchMap(_ => {
  //       const serviceManager = state$.value.serviceManager;
  //       const songReference = serviceManager.draggedSong;
  //       if (!songReference) {
  //         return of({type: ''});
  //       }
  //       return client.postAddItemToService(songReference).pipe(
  //         map(response => {
  //           return serviceChanged(response.response);
  //         }),
  //       );
  //     }),
  //   );
  // },

  // importServiceEpic
  action$ => {
    return action$.pipe(
      ofType(importService.type),
      switchMap((action: PayloadAction<FileList>) => {
        if (action.payload.length === 0) {
          return of({type: 'empty'});
        }

        return from(new Promise<Action>(async resolve => {
          const fileBuffer = await new Promise<ArrayBuffer>(res => {
            const reader = new FileReader();
            reader.onloadend = () => {
              res(reader.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(action.payload[0]);
          });

          ws.emit('importService', fileBuffer);

          resolve({type: 'empty'});
        }));
      }),
    );
  },

  // selectFolderEpic
  action$ => {
    return action$.pipe(
      ofType(selectFolder.type),
      switchMap((action: PayloadAction<number>) => {
        ws.emit(Actions.selectFolder, action.payload);
        return of({type: 'empty'});
      }),
    );
  },

  // deselectFolderEpic
  action$ => {
    return action$.pipe(
      ofType(deselectFolder.type),
      switchMap(() => {
        ws.emit(Actions.deselectFolder);
        return of({type: 'empty'});
      }),
    );
  },

  // showSlide
  action$ => {
    return action$.pipe(
      ofType(showSlide.type),
      switchMap(action => {
        ws.emit(Actions.showSlide, action.payload);
        return of({type: 'empty'});
      }),
    );
  },

  // hideSlide
  action$ => {
    return action$.pipe(
      ofType(hideSlide.type),
      switchMap(() => {
        ws.emit(Actions.hideSlide);
        return of({type: 'empty'});
      }),
    );
  },
];

export default serviceManagerSlice.reducer;
