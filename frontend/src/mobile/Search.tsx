import {SearchResults} from 'commons/interfaces';
import {useEffect, useState} from 'react';
import {ArrowLeft, Plus} from 'react-feather';
import {useDispatch, useSelector} from 'react-redux';
import {State} from '../store';
import {acknowledgeSongAdded, addSongToService, findSong} from '../store/serviceManagerSlice';
import {List} from './List';
import {FolderIcon} from './FolderIcon';

export function Search(props: { hideSearch: () => void, highlightAddedItem: () => void }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const results = useSelector<State, SearchResults>(state => state.serviceManager.searchResults);
  const songAdded = useSelector<State, boolean>(state => state.serviceManager.songAdded);

  const handleSearchTermChanged = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    dispatch(findSong(newSearchTerm));
  };

  const handleItemClicked = (id: number) => {
    dispatch(addSongToService(id));
  };

  useEffect(() => {
    if (songAdded) {
      dispatch(acknowledgeSongAdded());
      props.highlightAddedItem();
    }
  }, [songAdded]);

  return (
    <div className='search'>
      <div className='search__header'>
        <button className='icon-button' onClick={props.hideSearch}><ArrowLeft/></button>
        <input
          autoFocus={true}
          className='search__input'
          type='text'
          value={searchTerm}
          placeholder='Search'
          onChange={e => handleSearchTermChanged(e.target.value)}/>
      </div>
      <List>
        {
          results.map((item, index) => {
            return <li
              key={index}
              className='list-item'
              onClick={() => handleItemClicked(item.id)}
            >
              <FolderIcon type={item.type}/>
              <p>{item.title}</p>
              <Plus/>
            </li>;
          })
        }
      </List>
    </div>
  );
}
