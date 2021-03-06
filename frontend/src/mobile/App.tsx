import {State} from '../store';
import {Service} from './Service';
import './styles.scss';
import {Folder} from './Folder';
import {useSelector} from 'react-redux';
import {ServiceManagerState} from '../store/serviceManagerSlice';
import {useState} from 'react';
import {Search} from './Search';

export function MobileApp() {
  const service = useSelector<State, ServiceManagerState>(state => state.serviceManager);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [scrollToEnd, setScrollToEnd] = useState(false);

  return getShowingComponent();

  function getShowingComponent() {
    if (isSearching) {
      return <Search
        hideSearch={() => setIsSearching(false)}
        highlightAddedItem={() => {
          setIsSearching(false);
          setScrollToEnd(true);
          setSelectedFolderIndex(service.currentService.length - 1);
        }}/>;
    } else {
      return getServiceOrFolderComponent();
    }
  }

  function getServiceOrFolderComponent() {
    if (service.selectedFolder) {
      return <Folder
        folder={service.selectedFolder}
        setSelectedFolderIndex={setSelectedFolderIndex}
      />;
    } else {
      return <Service
        showSearch={() => setIsSearching(true)}
        scrollPosition={scrollPosition}
        setScrollPosition={setScrollPosition}
        scrollToEnd={scrollToEnd}
        stopScrollToEnd={() => setScrollToEnd(false)}
        selectedFolderIndex={selectedFolderIndex}
        setSelectedFolderIndex={setSelectedFolderIndex}
      />;
    }
  }
}
