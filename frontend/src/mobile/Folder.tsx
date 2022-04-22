import {FolderView, ServiceList} from 'commons';
import {deselectFolder, selectFolder} from '../store/serviceManagerSlice';
import {useDispatch, useSelector} from 'react-redux';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {State} from '../store';
import {LyricList} from './LyricList';
import {ScriptureList} from './ScriptureList';

export function Folder(props: {folder: FolderView}) {
  const dispatch = useDispatch();
  const service = useSelector<State, ServiceList>(state => state.serviceManager.currentService);

  return (
    <div className='folder'>
      <div className='folder__header'>
        <button className='icon-button' onClick={() => dispatch(deselectFolder())} >
          <ArrowLeft/>
        </button>
        <h1>{props.folder.title}</h1>
        <div className='hidden'/>
      </div>
      {
        props.folder.type === 'lyric' ?
          <LyricList folder={props.folder}/> :
          <ScriptureList folder={props.folder}/>
      }
      <ScriptureTraversal
        folder={props.folder}
        service={service}
        handleClick={folderIndex => dispatch(selectFolder(folderIndex))}
      />
    </div>
  );
}

interface ScriptureTraversalProps {
  folder: FolderView
  service: ServiceList
  handleClick: (folderIndex: number) => void
}

function ScriptureTraversal(props: ScriptureTraversalProps) {
  const createPreviousTraversalIcon = (position: 'previous' | 'next') => {
    return position === 'previous' ? <ArrowLeft/> : <div className='spacer'/>;
  };

  const createNextTraversalIcon = (position: 'previous' | 'next') => {
    return position === 'next' ? <ArrowRight/> : <div className='spacer'/>;
  };

  const createScriptureTraversalButton = (index: number, position: 'previous' | 'next') => {
    if (index >= props.service.length || index < 0 || props.service[index].type !== 'scripture') {
      return null;
    }
    return (
      <button
        className='folder__traverse__button'
        onClick={() => props.handleClick(index)}>
        { createPreviousTraversalIcon(position) }
        <p>{props.service[index].title}</p>
        { createNextTraversalIcon(position) }
      </button>
    );
  };

  return props.folder.type === 'scripture' ?
    <div className='folder__traverse'>
      {createScriptureTraversalButton(props.folder.serviceIndex - 1, 'previous')}
      {createScriptureTraversalButton(props.folder.serviceIndex + 1, 'next')}
    </div> :
    null;
}
