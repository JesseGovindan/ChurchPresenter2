import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SongReference, previewSong} from './store/previewProjectorSlice';
import {getAllSongs, songSearchStarted} from './store/songLibrarySlice';
import './SongLibrary.css';
import classNames from 'classnames';
import {songDragCancelled, songDragStarted} from './store/serviceManagerSlice';

const SongLibrary = () => {
  const dispatch = useDispatch();

  const songs = useSelector<any, SongReference[]>(store => store.songLibrary.searchResults);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentSearch, setCurrentSearch] = useState('');

  useEffect(() => {
    dispatch(getAllSongs());
  }, []);

  const handleSearchChanged = (newSearchValue: string) => {
    dispatch(songSearchStarted(newSearchValue));
    setCurrentSearch(newSearchValue);
  };

  const handleSongSelected = (index: number) => {
    setSelectedIndex(index);
    dispatch(previewSong(songs[index]));
  };

  return (
    <section className='song-library' aria-label='song library'>
      <div className="search">
        <label>Search</label>
        <input
          value={currentSearch}
          onChange={e => handleSearchChanged(e.target.value)}
        />
      </div>

      <div className="max-height">
        <ul className='song-list'>
          {
            songs.map((song, index) =>
              <li
                onClick={() => handleSongSelected(index)}
                key={song.id}
                draggable={ true }
                onDragStart={_ => dispatch(songDragStarted(songs[index]))}
                onDragEnd={_ => dispatch(songDragCancelled())}
                className={classNames(
                  'list-item',
                  {'list-item--selected': selectedIndex === index})}>
                {song.title}
              </li>)
          }
        </ul>
      </div>
    </section>
  );
};

export default SongLibrary;
