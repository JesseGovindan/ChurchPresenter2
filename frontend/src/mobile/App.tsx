import {State} from '../store';
import {Service} from './components/Service';
import './mobile.scss';
import {Folder} from './components/Folder';
import {useSelector} from 'react-redux';
import {ServiceManagerState} from '../store/serviceManagerSlice';
import {useState} from 'react';

export function MobileApp() {
  const service = useSelector<State, ServiceManagerState>(state => state.serviceManager);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(-1);

  const output = service.selectedFolder ?
    <Folder folder={service.selectedFolder}/> :
    <Service
      scrollPosition={scrollPosition}
      setScrollPosition={setScrollPosition}
      selectedFolderIndex={selectedFolderIndex}
      setSelectedFolderIndex={setSelectedFolderIndex}
    />;

  return output;
}
