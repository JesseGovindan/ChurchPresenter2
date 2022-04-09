import {List} from './List';
import {FolderView} from 'commons';
import {Property} from 'csstype';
import {deselectFolder, hideSlide, showSlide} from '../../store/serviceManagerSlice';
import {useDispatch} from 'react-redux';
import {ArrowLeft} from 'react-feather';
import {Dispatch} from 'react';

export function Folder(props: {folder: FolderView}) {
  const dispatch = useDispatch();

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
    </div>
  );
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
        <div className='centered | b-right min-w-3'>{slide.sectionName}</div>
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
        <div className='centered | b-right min-w-3'>{slide.sectionName}</div>
        <div>{slide.text}</div>
      </li>
    );
  });
}
