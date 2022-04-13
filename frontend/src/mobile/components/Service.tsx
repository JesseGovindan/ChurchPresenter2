import classNames from 'classnames';
import {ServiceItem, ServiceList} from 'commons';
import {ChangeEvent, useLayoutEffect, useRef} from 'react';
import {Book, Download, Music, Search} from 'react-feather';
import {useSelector, useDispatch} from 'react-redux';
import {State} from '../../store';
import {selectFolder, importService} from '../../store/serviceManagerSlice';

interface ServiceProps {
  scrollPosition: number
  setScrollPosition: (newPosition: number) => void
  selectedFolderIndex: number
  setSelectedFolderIndex: (index: number) => void
}

export function Service(props: ServiceProps) {
  const dispatch = useDispatch();
  const items = useSelector<State, ServiceList>(state => state.serviceManager.currentService);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(importService(e.target.files as FileList));
  };

  const isOnObs = !!(window as any).obsstudio;

  const listRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    if (listRef.current !== null) {
      listRef.current.scrollTop = props.scrollPosition;
    }
  }, [listRef, props.scrollPosition]);

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
      <ol
        className='stack | rounded | service-list'
        ref={listRef}
        onScroll={e => props.setScrollPosition(e.currentTarget.scrollTop)}
      >
        {items.map((item, index) => <ServiceListItem
          key={index}
          index={index}
          onSelected={() => props.setSelectedFolderIndex(index)}
          selected={index === props.selectedFolderIndex}
          type={item.type}
          title={item.title}
        />)}
      </ol>
    </div>
  );
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
      className='service-item'
      data-highlighted={props.selected}
      onClick={() => handleItemSelected()}
    >
      {props.type === 'lyric' ? <Music size='16'/> : <Book size='16'/>}
      <p>{props.title}</p>
    </li>
  );
}
