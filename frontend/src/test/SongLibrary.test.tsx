import {fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SongLibrary from '../SongLibrary';
import {SongReference} from '../store/previewProjectorSlice';
import {searchResultsChanged} from '../store/songLibrarySlice';
import {createTestStore, renderWithStore} from './utils';

const sampleSongs: SongReference[] = [
  {id: 0, title: 'a'},
  {id: 1, title: 'b'},
  {id: 2, title: 'c'},
];

test('SongLibrary does not contain any songs at start', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <SongLibrary/>);

  // Assert
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});

test('SongLibrary dispatches request to get all songs', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();

  // Act
  renderWithStore(store, <SongLibrary/>);

  // Assert
  const calls = dispatchSpy.mock.calls.filter(m => m[0].type === 'songLibrary/getAllSongs');
  expect(calls).toHaveLength(1);
});

test('SongLibrary only requests new songs once', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  store.dispatch(searchResultsChanged(sampleSongs));

  // Act
  renderWithStore(store, <SongLibrary/>);

  // Assert
  const calls = dispatchSpy.mock.calls.filter(m => m[0].type === 'songLibrary/getAllSongs');
  expect(calls).toHaveLength(1);
});

test('SongLibrary shows all songs when search results changed', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(searchResultsChanged(sampleSongs));

  // Act
  renderWithStore(store, <SongLibrary/>);

  // Assert
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  const listitems = screen.getAllByRole('listitem');
  listitems.forEach((item, index) => {
    expect(item).toHaveTextContent(sampleSongs[index].title);
  });
});

test('SongLibrary updates textbox when typed into', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <SongLibrary/>);

  // Act
  userEvent.type(screen.getByRole('textbox'), 'lyrics', {delay: 0});

  // Assert
  expect(screen.getByRole('textbox')).toHaveValue('lyrics');
});

test('SongLibrary dispatches song search when textbox is changed', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  renderWithStore(store, <SongLibrary/>);

  // Act
  userEvent.type(screen.getByRole('textbox'), 'lyrics', {delay: 0});

  // Assert
  expect(dispatchSpy).toHaveBeenLastCalledWith({
    type: 'songLibrary/songSearchStarted',
    payload: 'lyrics'},
  );
});

test('Selects a song item when clicked', () => {
  // Arrange
  const {store} = createTestStore();
  store.dispatch(searchResultsChanged(sampleSongs));
  renderWithStore(store, <SongLibrary/>);

  // Act
  const itemToSelect = screen.getAllByRole('listitem')[1];
  userEvent.click(itemToSelect);

  // Assert
  expect(itemToSelect).toHaveClass('list-item--selected');
});

test('SongLibrary previews the selected song', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  store.dispatch(searchResultsChanged(sampleSongs));
  renderWithStore(store, <SongLibrary/>);

  // Act
  userEvent.click(screen.getAllByRole('listitem')[1]);

  // Assert
  expect(dispatchSpy).toHaveBeenCalledWith({
    type: 'previewProjector/previewSong',
    payload: sampleSongs[1],
  });
});

test('SongLibrary dispatches event when song is dragged', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  store.dispatch(searchResultsChanged(sampleSongs));
  renderWithStore(store, <SongLibrary/>);
  const item = screen.getAllByRole('listitem')[0];

  // Act
  fireEvent.dragStart(item);

  // Assert
  expect(dispatchSpy).toHaveBeenCalledWith({
    type: 'serviceManager/songDragStarted',
    payload: sampleSongs[0],
  });
});

test('SongLibrary cancels event when song is dropped', () => {
  // Arrange
  const {store, dispatchSpy} = createTestStore();
  store.dispatch(searchResultsChanged(sampleSongs));
  renderWithStore(store, <SongLibrary/>);
  const item = screen.getAllByRole('listitem')[0];

  // Act
  fireEvent.dragEnd(item);

  // Assert
  expect(dispatchSpy).toHaveBeenCalledWith({
    type: 'serviceManager/songDragCancelled',
  });
});
