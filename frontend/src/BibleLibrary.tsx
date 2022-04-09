import {BibleVersion, findPassage, getBibleVersions, Verse} from './store/bibleLibrarySlice';
import {State} from './store';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import './BibleLibrary.css';
import './SongLibrary.css';
import BibleSearch from './components/BibleSearch';

const addNewVersion: BibleVersion = {id: -1, name: 'Other'};

const BibleLibrary = () => {
  const dispatch = useDispatch();
  const knownVersions = useSelector<State, BibleVersion[]>(store => store.bibleLibrary.versions);
  const versions = knownVersions.concat([addNewVersion]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const availableVerses = useSelector<State, Verse[]>(store => store.bibleLibrary.foundVerses);
  const versionsList = versions.map(version => {
    return <option key={version.id} value={version.id}>{version.name}</option>;
  });

  useEffect(() => {
    dispatch(getBibleVersions());
  }, []);

  const handleSearchSubmitted = () => {
    dispatch(findPassage({
      version: versions[selectedVersion],
      text: searchTerm,
    }));
  };

  return (
    <section className='bible-library' aria-label='bible library'>
      <div className='search'>
        <div className='search-row'>
          <label htmlFor='versionCombobox'>Version</label>
          <select id='versionCombobox' onChange={e => setSelectedVersion(parseInt(e.target.value))}>
            { versionsList }
          </select>
        </div>

        <div className='search-row'>
          <label htmlFor='findTextbox'>Find</label>
          <BibleSearch
            id='findTextBox'
            value={searchTerm}
            onChange={setSearchTerm}
            expectVersion={false}
            onSearchSubmitted={handleSearchSubmitted}
            onSearchValidityChanged={setSubmitEnabled} ></BibleSearch>
        </div>

        <div className='search-row'>
          <button
            className='search-btn'
            disabled={!submitEnabled}
            onClick={handleSearchSubmitted}>Search</button>
        </div>
      </div>

      <div className='max-height'>
        <ul className='verse-list'>
          {
            availableVerses.map(verse => {
              return (
                <li
                  key={verse.verse}
                  className='list-item'>
                  { formatVerseText(verse) }
                </li>
              );
            })
          }
        </ul>
      </div>
    </section>
  );
};

const formatVerseText = (verse: Verse) => {
  return `(${verse.version}) ${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;
};

export default BibleLibrary;
