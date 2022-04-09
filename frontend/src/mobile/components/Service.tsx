import classNames from 'classnames';
import {ServiceItem, ServiceList} from 'commons';
import {ChangeEvent, useRef} from 'react';
import {Book, Download, Music, Search} from 'react-feather';
import {useSelector, useDispatch} from 'react-redux';
import {State} from '../../store';
import {selectFolder, importService} from '../../store/serviceManagerSlice';
import {List} from './List';

export function Service() {
  const dispatch = useDispatch();
  const items = useSelector<State, ServiceList>(state => state.serviceManager.currentService);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(importService(e.target.files as FileList));
  };

  const isOnObs = !!(window as any).obsstudio;

  return (
    <div className='page'>
      <div className='surrounded'>
        <button className='centered | squared rounded hidden | button'><Search/></button>
        <h1 className='centered | c-fg | title'>Service</h1>

        <button
          className={classNames('centered | squared rounded | button', {hidden: isOnObs})}
          onClick={() => fileInput.current?.click() }
        >
          <Download/>
          <input
            className='not-included'
            type='file'
            accept='.osj'
            ref={fileInput}
            onChange={handleFileSelected}/>
        </button>
      </div>
      <List>
        { items.map((item, index) =>
          <ServiceListItem
            key={index}
            index={index}
            type={item.type}
            title={item.title}
          />)}
      </List>
    </div>
  );
}

function ServiceListItem(props: ServiceItem & { index: number }) {
  const dispatch = useDispatch();

  return (
    <li className='service-item' onClick={() => dispatch(selectFolder(props.index))}>
      {props.type === 'lyric' ? <Music size='16'/> : <Book size='16'/>}
      <p>{props.title}</p>
    </li>
  );
}
