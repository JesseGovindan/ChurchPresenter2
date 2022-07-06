import {FolderView, ServiceList} from 'commons';
import {deselectFolder, selectFolder} from '../store/serviceManagerSlice';
import {useDispatch, useSelector} from 'react-redux';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {State} from '../store';
import {LyricList} from './LyricList';
import {ScriptureList} from './ScriptureList';

interface FolderProps {
  folder: FolderView
  setSelectedFolderIndex: (index: number) => void
}

export function Folder(props: FolderProps) {
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
        handleClick={folderIndex => {
          props.setSelectedFolderIndex(folderIndex);
          dispatch(selectFolder(folderIndex));
        }}
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
  type ButtonType = 'previous' | 'next'

  return props.folder.type === 'scripture' ? createButtons() : null;

  function createButtons() {
    return <div className='folder__traverse'>
      {createScriptureTraversalButton(props.folder.serviceIndex - 1, 'previous')}
      {createScriptureTraversalButton(props.folder.serviceIndex + 1, 'next')}
    </div>;
  }

  function createScriptureTraversalButton(index: number, type: ButtonType): JSX.Element | null {
    return isTraversalAllowedFor(index) ? createButton(index, type) : null;
  };

  function isTraversalAllowedFor(index: number): boolean {
    return index >= 0 && index < props.service.length && props.service[index].type === 'scripture';
  }

  function createButton(index: number, type: ButtonType): JSX.Element {
    return <button
      className='folder__traverse__button'
      onClick={() => props.handleClick(index)}>
      { type === 'previous' ? <ArrowLeft/> : <div className='spacer'/> }
      <p>{props.service[index].title}</p>
      { type === 'next' ? <ArrowRight/> : <div className='spacer'/> }
    </button>;
  }
}
