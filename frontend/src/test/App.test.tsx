import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import {renderWithStore, createTestStore} from './utils';

test('App contains selected "setup" button when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <App />);

  // Assert
  const setupButton = screen.getByRole('button', {name: /setup/i});
  expect(setupButton.textContent).toMatch(/setup/i);
  expect(setupButton).toHaveClass('selected');
  expect(screen.getByRole('heading', {name: /setup/i, level: 1})).toBeInTheDocument();
  expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1);
});

test('App contains deselected "live" button when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <App />);

  // Assert
  const button = screen.getByRole('button', {name: /live/i});
  expect(button.textContent).toMatch(/live/i);
  expect(button.className).toBe('');
  expect(button).not.toHaveClass('selected');
});

test('App contains selecte "live" button when "live" button clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <App />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /live/i}));

  // Assert
  expect(screen.getByRole('button', {name: /live/i})).toHaveClass('selected');
  expect(screen.getByRole('heading', {name: /live/i, level: 1})).toBeInTheDocument();
  expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1);
});

test('App shows "setup" sections when created', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <App/>);

  // Assert
  expect(screen.queryByRole('region', {name: 'live projector'})).not.toBeInTheDocument();

  expect(screen.getByRole('region', {name: 'library'})).toBeInTheDocument();
  expect(screen.getByRole('region', {name: 'library'})).toBeVisible();
  expect(screen.getByRole('region', {name: 'preview projector'})).toBeInTheDocument();
  expect(screen.getByRole('region', {name: 'service manager'})).toBeInTheDocument();
});

test('App shows "live" sections when "live" button clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <App/>);

  // Act
  userEvent.click(screen.getByRole('button', {name: /live/i}));

  // Assert
  expect(screen.queryByRole('region', {name: 'preview projector'})).not.toBeInTheDocument();
  expect(screen.queryByRole('region', {name: 'library'})).toHaveClass('container--hidden');

  expect(screen.getByRole('region', {name: 'live projector'})).toBeInTheDocument();
  expect(screen.getByRole('region', {name: 'service manager'})).toBeInTheDocument();
});

test('App shows "setup" sections when "live" clicked, then "setup" clicked', () => {
  // Arrange
  const {store} = createTestStore();
  renderWithStore(store, <App />);

  // Act
  userEvent.click(screen.getByRole('button', {name: /live/i}));
  userEvent.click(screen.getByRole('button', {name: /setup/i}));

  // Assert
  const setupButton = screen.getByRole('button', {name: /setup/i});
  expect(setupButton.textContent).toMatch(/setup/i);
  expect(setupButton).toHaveClass('selected');
  expect(screen.getByRole('heading', {name: /setup/i, level: 1})).toBeInTheDocument();
  expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1);

  expect(screen.queryByRole('region', {name: 'live projector'})).not.toBeInTheDocument();

  expect(screen.getByRole('region', {name: 'library'})).toBeInTheDocument();
  expect(screen.getByRole('region', {name: 'library'})).toBeVisible();
  expect(screen.getByRole('region', {name: 'preview projector'})).toBeInTheDocument();
  expect(screen.getByRole('region', {name: 'service manager'})).toBeInTheDocument();
});
