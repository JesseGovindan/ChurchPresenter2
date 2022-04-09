import {Route, Routes} from 'react-router-dom';
import {OverheadProjector} from './OverheadProjector';
import {StreamProjector} from './Stream';
import './styles.scss';

export function App() {
  return (
    <Routes>
      <Route path='/stream' element={<StreamProjector/>}/>
      <Route path='/overhead' element={<OverheadProjector/>}/>
    </Routes>
  );
}
