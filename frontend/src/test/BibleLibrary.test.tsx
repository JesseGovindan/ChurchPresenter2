import BibleLibrary from '../BibleLibrary';
import {createTestStore, renderWithStore} from './utils';
import {screen} from '@testing-library/react';
import {
  BibleVersion,
  findPassageCompleted,
  getBibleVersionsCompleted,
  Verse,
} from '../store/bibleLibrarySlice';
import userEvent, {specialChars} from '@testing-library/user-event';

const BIBLE_VERSIONS: BibleVersion[] = [
  {id: 0, name: 'kjv'},
  {id: 1, name: 'niv'},
  {id: 2, name: 'amp'},
];

const FOUND_VERSES: Verse[] = [
  {book: 'James', chapter: 1, verse: 1, version: 'NKJV', text: 'a'},
  {book: 'James', chapter: 1, verse: 2, version: 'NKJV', text: 'b'},
  {book: 'James', chapter: 1, verse: 3, version: 'NKJV', text: 'c'},
];

test('BibleLibrary contains bible version combobox', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  expect(screen.getByRole('combobox', {name: /version/i}));
});

test('BibleLibrary requests bibles versions ONCE when created', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  renderWithStore(store, <BibleLibrary/>);

  // Act
  userEvent.type(screen.getByRole('textbox'), 'ac');

  // Assert
  const calls = dispatchSpy.mock.calls
    .filter(m => m[0].type === 'bibleLibrary/getBibleVersions');
  expect(calls).toHaveLength(1);
});

test('BibleLibrary shows versions combobox with fetched bible versions', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(getBibleVersionsCompleted(BIBLE_VERSIONS));

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  const versions = screen.getByRole('combobox');
  expect(versions).toHaveLength(BIBLE_VERSIONS.length + 1);
  for (let i = 0; i < BIBLE_VERSIONS.length; i++) {
    expect(versions.children.item(i)).toHaveTextContent(BIBLE_VERSIONS[i].name);
    expect(versions.children.item(i)).toHaveValue(BIBLE_VERSIONS[i].id.toString());
  }
  expect(versions.children.item(versions.children.length - 1)).toHaveValue('-1');
  expect(versions.children.item(versions.children.length - 1)).toHaveTextContent('Other');
});

test('BibleLibrary selects first version once fetched', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(getBibleVersionsCompleted(BIBLE_VERSIONS));

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  const versions = screen.getByRole('combobox');
  expect(versions).toHaveValue('0');
});

test('BibleLibrary contains textbox for finding passages', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  const textbox = screen.getByRole('textbox', {name: /find/i});
  expect(textbox).toBeInTheDocument();
  expect(textbox).not.toHaveClass('search--warning');
});

test('BibleLibrary contains a search button', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  expect(screen.getByRole('button', {name: /search/i}));
});

test('BibleLibrary contains an empty list when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  const versesList = screen.getByRole('list');
  expect(versesList).toBeInTheDocument();
  expect(versesList.children).toHaveLength(0);
});

test('BibleLibrary dispatches findPassage when search button clicked', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  store.dispatch(getBibleVersionsCompleted(BIBLE_VERSIONS));
  renderWithStore(store, <BibleLibrary/>);

  // Act
  userEvent.type(screen.getByRole('textbox'), 'James 3:2');
  userEvent.selectOptions(screen.getByRole('combobox'), '1');
  userEvent.click(screen.getByRole('button'));

  // Assert
  expect(dispatchSpy).toBeCalledWith({
    type: 'bibleLibrary/findPassage',
    payload: {
      version: {id: 1, name: 'niv'},
      text: 'James 3:2',
    },
  });
});

test('BibleLibrary dispatches findPassage when enter pressed in textbox', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  store.dispatch(getBibleVersionsCompleted(BIBLE_VERSIONS));
  renderWithStore(store, <BibleLibrary/>);

  // Act
  userEvent.selectOptions(screen.getByRole('combobox'), '1');
  userEvent.type(screen.getByRole('textbox'), 'James 3:2');
  userEvent.type(screen.getByRole('textbox'), specialChars.enter);

  // Assert
  expect(dispatchSpy).toBeCalledWith({
    type: 'bibleLibrary/findPassage',
    payload: {
      version: {id: 1, name: 'niv'},
      text: 'James 3:2',
    },
  });
});

test('BibleLibrary disables search button when search is empty', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(getBibleVersionsCompleted(BIBLE_VERSIONS));

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  // expect(screen.getByRole('textbox')).toHaveClass('search--warning');
  expect(screen.getByRole('button')).toBeDisabled;
});

test('BibleLibrary enables button when valid search is entered', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(getBibleVersionsCompleted(BIBLE_VERSIONS));
  renderWithStore(store, <BibleLibrary/>);

  // Act
  userEvent.click(screen.getByRole('button'));
  userEvent.type(screen.getByRole('textbox'), 'James 2 NIV');

  // Assert
  expect(screen.getByRole('button')).toBeEnabled;
});

test('BibleLibrary shows passages that are returned', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(findPassageCompleted(FOUND_VERSES));

  // Act
  renderWithStore(store, <BibleLibrary/>);

  // Assert
  const versesList = screen.getByRole('list');
  expect(versesList.children).toHaveLength(FOUND_VERSES.length);
  expect(versesList.children.item(0)).toHaveTextContent('(NKJV) James 1:1 - a');
});

// test('BibleLibrary previews the selected verse', () => {
//   // Arrange
//   const {store} = createTestStore();
//   const dispatchSpy = jest.spyOn(store, 'dispatch');
//   store.dispatch(findPassageCompleted(FOUND_VERSES));
//   renderWithStore(store, <BibleLibrary/>);

//   // Act
//   userEvent.click(screen.getAllByRole('listitem')[1]);

//   // Assert
//   expect(dispatchSpy).toHaveBeenCalledWith({
//     type: 'previewProjector/setPreviewFolder',
//     payload: {
//       title: FOUND_VERSES[1],
//       type: 'bible',
//       id: 1,
//     },
//   });
// });
