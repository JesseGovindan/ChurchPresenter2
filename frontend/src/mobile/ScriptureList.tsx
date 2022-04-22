import {FolderView} from 'commons';
import {useDispatch} from 'react-redux';
import {hideSlide, showSlide} from '../store/serviceManagerSlice';
import {List} from './List';

export function ScriptureList(props: {folder: FolderView}) {
  const dispatch = useDispatch();
  const listItems = props.folder.slides.map((slide, index) => {
    return (
      <li
        key={`${index}${slide.sectionName}`}
        className='folder__item'
        data-active={slide.isShown}
        onClick={() => dispatch(slide.isShown ? hideSlide() : showSlide({
          folderIndex: props.folder.serviceIndex,
          slideIndex: index,
        }))}
      >
        <div className='centered | b-right min-width-3'>{slide.sectionName}</div>
        <div>{slide.text}</div>
      </li>
    );
  });

  return <List>{listItems}</List>;
}
