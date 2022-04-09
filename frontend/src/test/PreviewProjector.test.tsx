import PreviewProjector from '../PreviewProjector';
import {createTestStore, renderWithStore} from './utils';
import {getAllByRole, getByRole, screen} from '@testing-library/react';
import {Folder, folderLoaded} from '../store/previewProjectorSlice';

test('PreviewProjector shows no slides when no folder selected', () => {
  // Arrange
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <PreviewProjector/>);

  // Assert
  expect(screen.getByRole('region')).toHaveTextContent('Select an item to preview its contents');
  expect(screen.queryByRole('grid')).not.toBeNull;
  expect(screen.queryByRole('row')).toBeNull;
});

test('PreviewProjector shows slides when a folder is selected', () => {
  // Arrange
  const {store} = createTestStore();
  const testFolder = createTestFolder();
  store.dispatch(folderLoaded(testFolder));

  // Act
  renderWithStore(store, <PreviewProjector/>);

  // Assert
  expect(screen.getAllByRole('row')).toHaveLength(testFolder.slides.length);
  const grid = screen.getByRole('grid');
  const row = getAllByRole(grid, 'row');
  const slide = row[1];
  expect(getByRole(slide, 'rowheader')).toHaveTextContent(testFolder.slides[1].heading);
  expect(getByRole(slide, 'cell')).toHaveTextContent(testFolder.slides[1].text);
  expect(row[0]).toHaveStyle('background-color: hsl(0, 37%, 75%)');
  expect(row[1]).toHaveStyle('background-color: hsl(180, 37%, 75%)');
});

function createTestFolder(): Folder {
  return {
    type: 'bible',
    name: 'Test Scripture',
    slides: [{
      text: 'Test text 1',
      caption: 'Caption 1',
      heading: 'C1',
    }, {
      text: 'Test text 2',
      caption: 'Caption 2',
      heading: 'C2',
    },
    ],
  };
}
