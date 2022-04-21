import {ItemType} from 'commons';
import {Book, Music} from 'react-feather';

export function FolderIcon(props: {type: ItemType}) {
  return props.type === 'lyric' ? <Music/> : <Book/>;
}
