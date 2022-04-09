import {useState} from 'react';
import './App.css';
import Library from './Library';
import LiveProjector from './LiveProjector';
import PreviewProjector from './PreviewProjector';
import ServiceManager from './components/ServiceManager';

export type Mode = 'setup' | 'live';

function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('setup');

  const getHeadingFor = (modeHeading: Mode) => {
    if (modeHeading === currentMode) {
      return (<h1>{modeHeading}</h1>);
    } else {
      return modeHeading;
    }
  };

  return (
    <div className='app'>
      <div className='mode-button-group button-group'>
        <button
          className={currentMode === 'setup' ? 'selected' : ''}
          onClick={() => setCurrentMode('setup')}
        >
          { getHeadingFor('setup') }
        </button>
        <div className='vertical-separator'/>
        <button
          className={currentMode === 'live' ? 'selected' : ''}
          onClick={() => setCurrentMode('live')}>
          { getHeadingFor('live') }
        </button>
      </div>

      <div className='content'>
        <Library mode={currentMode}/>

        {
          currentMode === 'setup' ? <PreviewProjector/> : <LiveProjector/>
        }

        <ServiceManager/>
      </div>
    </div>
  );
}

export default App;
