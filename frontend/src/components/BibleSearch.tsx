import {useState} from 'react';

export interface BibleSearchProps {
  id: string
  value: string
  expectVersion: boolean
  onSearchSubmitted: () => void
  onChange: (currentSearchTerm: string) => void
  onSearchValidityChanged: (valid: boolean) => void
}

const BibleSearch = (props: BibleSearchProps) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleChanged = (current: string) => {
    props.onChange(current);
    const valid = current !== '';
    props.onSearchValidityChanged(valid);
    setShowWarning(valid);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'Enter') {
      props.onSearchSubmitted();
    }
  };

  return (
    <input
      type='text'
      value={props.value}
      onChange={e => handleChanged(e.target.value)}
      onKeyPress={e => handleKeyPress(e.key)}
      id='findTextbox'
      className={showWarning ? 'search--warning' : ''}/>
  );
};

export default BibleSearch;
