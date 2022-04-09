import {createTestStore, renderWithStore} from '../utils';
import {screen} from '@testing-library/react';
import ServiceManager from '../../components/ServiceManager';
import {serviceChanged} from '../../store/serviceManagerSlice';
import {ServiceList} from 'commons';

test('ServiceManager shows nothing when no items in service', () => {
  // Arrage
  const {store} = createTestStore();

  // Act
  renderWithStore(store, <ServiceManager/>);

  // Assert
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument;
});

test('ServiceManager shows items when items in service', () => {
  // Arrage
  const {store} = createTestStore();
  store.dispatch(serviceChanged(testService));

  // Act
  renderWithStore(store, <ServiceManager/>);

  // Assert
  expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('A Song');
  expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('A Scripture');
});

test('ServiceManager dispatches request for current service', () => {
  // Arrage
  const {store, dispatchSpy} = createTestStore();

  // Act
  renderWithStore(store, <ServiceManager/>);

  // Assert
  expect(dispatchSpy).toHaveBeenCalledWith({type: 'serviceManager/getService'});
});


const testService: ServiceList = [{
  type: 'lyric',
  title: 'A Song',
}, {
  type: 'scripture',
  title: 'A Scripture',
}];
