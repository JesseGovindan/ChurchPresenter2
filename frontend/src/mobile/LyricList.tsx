import {useDispatch} from 'react-redux';
import {Property} from 'csstype';
import {FolderView} from 'commons';
import {hideSlide, showSlide} from '../store/serviceManagerSlice';
import {List} from './List';

export function LyricList(props: {folder: FolderView}) {
  const dispatch = useDispatch();
  const uniqueSongHeadings = getUnique(props.folder.slides.map(_ => _.sectionName) || []);

  const getColorForHeading = (heading: string): Property.BackgroundColor => {
    const index = uniqueSongHeadings.get(heading) || 0;
    return `hsl(${index * 360 / uniqueSongHeadings.size}, 37%, 65%)`;
  };

  const getDarkColorForHeading = (heading: string): Property.BackgroundColor => {
    const index = uniqueSongHeadings.get(heading) || 0;
    return `hsl(${index * 360 / uniqueSongHeadings.size}, 37%, 25%)`;
  };

  const listItems = props.folder.slides.map((slide, index) => {
    const color = slide.isShown ?
      getDarkColorForHeading(slide.sectionName) :
      getColorForHeading(slide.sectionName);

    return (
      <li
        key={`${index}${slide.sectionName}`}
        className='folder__item folder__item--lyric'
        style={({backgroundColor: color})}
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

const getUnique = (values: string[]) => {
  const map = new Map<string, number>();
  values.forEach(value => {
    if (!map.has(value)) {
      map.set(value, map.size);
    }
  });
  return map;
};
