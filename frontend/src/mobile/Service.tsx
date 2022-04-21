import classNames from 'classnames';
import {ServiceItem, ServiceList} from 'commons';
import {ChangeEvent, useLayoutEffect, useRef} from 'react';
import {Download, Search} from 'react-feather';
import {useSelector, useDispatch} from 'react-redux';
import {State} from '../store';
import {selectFolder, importService} from '../store/serviceManagerSlice';
import {List} from './List';
import {FolderIcon} from './FolderIcon';

interface ServiceProps {
  showSearch: () => void
  scrollPosition: number
  setScrollPosition: (newPosition: number) => void
  selectedFolderIndex: number
  setSelectedFolderIndex: (index: number) => void
}

export function Service(props: ServiceProps) {
  const items = useSelector<State, ServiceList>(state => state.serviceManager.currentService);

  const listRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    if (listRef.current !== null) {
      listRef.current.scrollTop = props.scrollPosition;
    }
  }, [listRef, props.scrollPosition]);

  return (
    <div className='service'>
      <ServiceHeader showSearch={props.showSearch}/>
      <List ref={listRef} onScroll={e => props.setScrollPosition(e.currentTarget.scrollTop)}>
        {items.map((item, index) => <ServiceListItem
          key={index}
          index={index}
          onSelected={() => props.setSelectedFolderIndex(index)}
          selected={index === props.selectedFolderIndex}
          type={item.type}
          title={item.title}
        />)}
      </List>
    </div>
  );
}

function ServiceHeader(props: {showSearch: () => void}) {
  const dispatch = useDispatch();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(importService(e.target.files as FileList));
  };

  const canUpload = !(window as any).obsstudio;

  return <div className='service__header'>
    <button
      className='icon-button'
      onClick={props.showSearch}
    >
      <Search/>
    </button>
    <h1>Service</h1>

    <button
      className={classNames('icon-button', {'icon-button--hidden': !canUpload})}
      onClick={() => fileInput.current?.click() }
    >
      <Download/>
      <input type='file' accept='.osz' ref={fileInput} onChange={handleFileSelected}/>
    </button>
  </div>;
}

interface ServiceListItemProps extends ServiceItem {
  index: number
  onSelected: () => void
  selected: boolean
}

function ServiceListItem(props: ServiceListItemProps) {
  const dispatch = useDispatch();

  const handleItemSelected = () => {
    dispatch(selectFolder(props.index));
    props.onSelected();
  };

  return (
    <li
      className='list-item'
      data-highlighted={props.selected}
      onClick={() => handleItemSelected()}
    >
      <FolderIcon type={props.type}/>
      <p>{props.title}</p>
    </li>
  );
}
