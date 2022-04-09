import {useState} from 'react';
import {Mode} from './App';
import BibleLibrary from './BibleLibrary';
import SongLibrary from './SongLibrary';
import './Library.css';

type LibraryMode = 'songs' | 'bibles';

export type LibraryProps = {
  mode: Mode
}

const Library = (props: LibraryProps) => {
  const [libraryMode, setLibraryMode] = useState<LibraryMode>('songs');

  const classList = ['library', 'container'];
  if (props.mode === 'live') {
    classList.push('container--hidden');
  }

  return (
    <section className={classList.join(' ')} aria-label='library'>
      <div className="library-button-group button-group container-heading">
        <LibraryModeButton
          buttonMode='songs'
          libraryMode={libraryMode}
          setLibraryMode={setLibraryMode}/>
        <div className="vertical-separator" />
        <LibraryModeButton
          buttonMode='bibles'
          libraryMode={libraryMode}
          setLibraryMode={setLibraryMode}/>
      </div>
      {
        libraryMode === 'songs' ? <SongLibrary/> : <BibleLibrary/>
      }
    </section>
  );
};

const LibraryModeButton = (props: {
  buttonMode: LibraryMode,
  libraryMode: LibraryMode,
  setLibraryMode: (mode: LibraryMode) => void,
}) => {
  return (
    <button
      className={props.libraryMode === props.buttonMode ? 'selected' : ''}
      onClick={() => props.setLibraryMode(props.buttonMode)}>
      { props.buttonMode === props.libraryMode ? <h2>{props.buttonMode}</h2> : props.buttonMode }
    </button>
  );
};

export default Library;
