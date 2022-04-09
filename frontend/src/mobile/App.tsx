import {State} from '../store';
import {Service} from './components/Service';
import './mobile.scss';
import {Folder} from './components/Folder';
import {useSelector} from 'react-redux';
import {ServiceManagerState} from '../store/serviceManagerSlice';

export function MobileApp() {
  const service = useSelector<State, ServiceManagerState>(state => state.serviceManager);

  const output = service.selectedFolder ?
    <Folder folder={service.selectedFolder}/> :
    <Service/>;

  return output;
}
