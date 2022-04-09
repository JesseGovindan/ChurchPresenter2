import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import biblesRaw from '../data/bibles.json';
import {map} from 'rxjs';
import {createEmptyReducer} from './Epic';
import {Epic, ofType} from 'redux-observable';
import {State} from '.';

interface BibleStats {
  [book: string]: number[]
}

const bibleStats = biblesRaw as BibleStats;

export type BibleVersion = {
  id: number;
  name: string;
};

export type BibleLibraryStore = {
  versions: BibleVersion[],
  searchWarning: boolean,
  foundVerses: Verse[],
}

export type FindPassageOptions = {
  version: BibleVersion,
  text: string,
}

export interface Verse {
  text: string
  version: string
  verse: number
  book: string
  chapter: number
}

const initialState: BibleLibraryStore = {
  versions: [],
  searchWarning: false,
  foundVerses: [],
};

export const bibleLibrarySlice = createSlice({
  name: 'bibleLibrary',
  initialState,
  reducers: {
    getBibleVersions: createEmptyReducer<BibleLibraryStore>(),

    getBibleVersionsCompleted: (state, action: PayloadAction<BibleVersion[]>) => {
      state.versions = action.payload;
    },

    findPassage: createEmptyReducer<BibleLibraryStore, FindPassageOptions>(),
    findPassageCompleted: (state, action: PayloadAction<Verse[]>) => {
      state.foundVerses = action.payload;
    },
  },
});

export const {
  getBibleVersions,
  getBibleVersionsCompleted,
  findPassage,
  findPassageCompleted,
} = bibleLibrarySlice.actions;

// - Epics -----------------------------------------------------------------------------------------

export default bibleLibrarySlice.reducer;

export const epics: Epic<any, any, State>[] = [
  // action$ => {
  //   return action$.pipe(
  //     ofType(getBibleVersions.type),
  //     switchMap(_ => {
  //       return client.getAllBibleVersions().pipe(
  //         map(response => {
  //           return getBibleVersionsCompleted(response);
  //         }),
  //       );
  //     }),
  //   );
  // },

  action$ => {
    return action$.pipe(ofType(findPassage.type), map(() => ({type: ''})));
  },
];

export const bibleBooks: string[] = Object.keys(bibleStats).sort();

export const getBookSuggestions = (text: string): string[] => {
  text = text.trim();
  if (text === '') {
    return [];
  }

  return bibleBooks.filter(book => book.toLowerCase().startsWith(text.toLowerCase()));
};
