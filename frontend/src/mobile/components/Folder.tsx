import {List} from './List';
import {FolderView, ServiceList} from 'commons';
import {Property} from 'csstype';
import {deselectFolder, hideSlide, selectFolder, showSlide} from '../../store/serviceManagerSlice';
import {useDispatch, useSelector} from 'react-redux';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {Dispatch} from 'react';
import {State} from '../../store';

export function Folder(props: {folder: FolderView}) {
  const dispatch = useDispatch();
  const service = useSelector<State, ServiceList>(state => state.serviceManager.currentService);


  return (
    <div className='page'>
      <div className='surrounded'>
        <button
          className='centered | squared rounded | button'
          onClick={() => dispatch(deselectFolder())}
        >
          <ArrowLeft/>
        </button>
        <h1 className='centered | c-fg | title'>{props.folder.title}</h1>
        <div className='squared hidden'/>
      </div>
      <List>
        {
          props.folder.type === 'lyric' ?
            createLyricList(props.folder, dispatch) :
            createScriptureList(props.folder, dispatch)
        }
      </List>
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
    return position === 'previous' ?
      <ArrowLeft className='width-2'/> :
      <div className='width-2'/>;
  };

  const createNextTraversalIcon = (position: 'previous' | 'next') => {
    return position === 'next' ?
      <ArrowRight className='width-2'/> :
      <div className='width-2'/>;
  };

  const createScriptureTraversalButton = (index: number, position: 'previous' | 'next') => {
    if (index >= props.service.length || index < 0 || props.service[index].type !== 'scripture') {
      return null;
    }
    return (
      <button
        className='surrounded | rounded | button'
        onClick={() => props.handleClick(index)}>
        { createPreviousTraversalIcon(position) }
        <div className='centered'>{props.service[index].title}</div>
        { createNextTraversalIcon(position) }
      </button>
    );
  };

  return props.folder.type === 'scripture' ?
    <div className='stack | with-a-gap'>
      {createScriptureTraversalButton(props.folder.serviceIndex - 1, 'previous')}
      {createScriptureTraversalButton(props.folder.serviceIndex + 1, 'next')}
    </div> :
    null;
}

function createLyricList(folder: FolderView, dispatch: Dispatch<any>): JSX.Element[] {
  const uniqueSongHeadings = getUnique(folder.slides.map(_ => _.sectionName) || []);

  const getColorForHeading = (heading: string): Property.BackgroundColor => {
    const index = uniqueSongHeadings.get(heading) || 0;
    return `hsl(${index * 360 / uniqueSongHeadings.size}, 37%, 65%)`;
  };

  const getDarkColorForHeading = (heading: string): Property.BackgroundColor => {
    const index = uniqueSongHeadings.get(heading) || 0;
    return `hsl(${index * 360 / uniqueSongHeadings.size}, 37%, 25%)`;
  };

  return folder.slides.map((slide, index) => {
    const color = slide.isShown ?
      getDarkColorForHeading(slide.sectionName) :
      getColorForHeading(slide.sectionName);

    return (
      <li
        key={`${index}${slide.sectionName}`}
        className='row-with-header | split-linebreaks c-black | list-item'
        data-active={slide.isShown}
        style={({backgroundColor: color})}
        onClick={() => dispatch(slide.isShown ? hideSlide() : showSlide({
          folderIndex: folder.serviceIndex,
          slideIndex: index,
        }))}
      >
        <div className='centered | b-right min-width-3'>{slide.sectionName}</div>
        <div>{slide.text}</div>
      </li>
    );
  });
}

const getUnique = (values: string[]) => {
  const map = new Map<string, number>();
  values.forEach(value => {
    if (!map.has(value)) {
      map.set(value, map.size);
    }
  });
  return map;
};

function createScriptureList(folder: FolderView, dispatch: Dispatch<any>): JSX.Element[] {
  return folder.slides.map((slide, index) => {
    return (
      <li
        key={`${index}${slide.sectionName}`}
        className='row-with-header | split-linebreaks c-fg2 | list-item'
        data-active={slide.isShown}
        onClick={() => dispatch(slide.isShown ? hideSlide() : showSlide({
          folderIndex: folder.serviceIndex,
          slideIndex: index,
        }))}
      >
        <div className='centered | b-right min-width-3'>{slide.sectionName}</div>
        <div>{slide.text}</div>
      </li>
    );
  });
}
