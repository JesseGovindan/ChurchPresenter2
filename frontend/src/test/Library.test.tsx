import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Library from '../Library';
import {createTestStore, renderWithStore} from './utils';

test('Library contains all sub library buttons', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <Library mode='setup' />);

  // Assert
  expect(screen.getByRole('button', {name: /songs/i})).toBeInTheDocument();
  expect(screen.getByRole('button', {name: /bibles/i})).toBeInTheDocument();
});

test('Library contains a "songs" h2 when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <Library mode='setup' />);

  // Assert
  expect(screen.getByRole('heading', {name: /songs/i, level: 2})).toBeInTheDocument();
});

test('Library contains a "song library" section when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <Library mode='setup' />);

  // Assert
  expect(screen.getByRole('region', {name: /song library/i})).toBeInTheDocument();
});

test('Library contains a single h2', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <Library mode='setup' />);

  // Assert
  expect(screen.getAllByRole('heading', {level: 2})).toHaveLength(1);
});

test('Library contains a "bibles" h2 when the "bibles" button is clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <Library mode='setup' />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /bibles/i}));

  // Assert
  expect(screen.getByRole('heading', {name: /bibles/i, level: 2})).toBeInTheDocument();
});

test('Library only contains a "songs" button thats selected when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <Library mode='setup' />);

  // Assert
  const songsButton = screen.getByRole('button', {name: /songs/i});
  expect(songsButton).toHaveClass('selected');
  screen.getAllByRole('button')
    .filter(button => button != songsButton)
    .forEach(button => {
      expect(button).not.toHaveClass('selected');
    });
});

test('Library contains a single h2 when multiple headings are clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <Library mode='setup' />);

  // Act
  userEvent.click(screen.getByRole('heading'));
  userEvent.click(screen.getByRole('heading'));

  // Assert
  expect(screen.getAllByRole('heading')).toHaveLength(1);
});

test('Library contains a "songs" heading when "bibles" clicked and then "songs" clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <Library mode='setup' />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /bibles/i}));
  userEvent.click(screen.getByRole('button', {name: /songs/i}));

  // Assert
  expect(screen.getByRole('heading', {name: /songs/i})).toBeInTheDocument();
});

test('when "bibles" button clicked only it becomes selected', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <Library mode='setup' />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /bibles/i}));

  // Assert
  const biblesButton = screen.getByRole('button', {name: /bibles/i});
  expect(biblesButton).toHaveClass('selected');
  screen.getAllByRole('button')
    .filter(button => button != biblesButton)
    .forEach(button => {
      expect(button).not.toHaveClass('selected');
    });
});

test('Library contains a "bibles library" section when "bibles" clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <Library mode='setup' />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /bibles/i}));

  // Assert
  expect(screen.getByRole('region', {name: /bible library/i})).toBeInTheDocument();
});

test('when "bibles" clicked, then "songs" clicked, only "songs" becomes selected', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <Library mode='setup' />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /bibles/i}));
  userEvent.click(screen.getByRole('button', {name: /songs/i}));

  // Assert
  const songsButton = screen.getByRole('button', {name: /songs/i});
  expect(songsButton).toHaveClass('selected');
  screen.getAllByRole('button')
    .filter(button => button != songsButton)
    .forEach(button => {
      expect(button).not.toHaveClass('selected');
    });
});
