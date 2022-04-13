import {useSelector} from 'react-redux';
import {FolderView, SlideView} from 'commons';
import {State} from '../store';
import classNames from 'classnames';

export function OverheadProjector() {
  const folder = useSelector<State, FolderView | null>(
    state => state.serviceManager.selectedFolder);

  const slide = getSlideFromFolder(folder);
  return (
    <div className='overhead-projector' data-active={!!slide} data-type={folder?.type}>
      { slide }
    </div>
  );
}

function getSlideFromFolder(folder: FolderView | null) {
  if (folder) {
    const visibleSlide = folder.slides.find(s => s.isShown);
    if (visibleSlide) {
      return folder.type === 'lyric' ?
        <LyricSlide folder={folder}/> :
        <ScriptureSlide slide={visibleSlide} />;
    }
  }
  return null;
}

function LyricSlide(props: {folder: FolderView}) {
  const slides = props.folder.slides;
  const showingIndex = slides.findIndex(s => s.isShown);
  const currentSection = slides[showingIndex].sectionName;

  let startIndex = showingIndex;
  for (; startIndex > 0; startIndex--) {
    if (slides[startIndex].sectionName === currentSection) {
      continue;
    } else {
      startIndex++;
      break;
    }
  }

  let endIndex = showingIndex;
  for (; endIndex < slides.length; endIndex++) {
    if (slides[endIndex].sectionName === currentSection) {
      continue;
    } else {
      break;
    }
  }

  const parts = slides.slice(startIndex, endIndex)
    .map((slide, index) => {
      return <div className={classNames({active: slide.isShown})} key={index}>{slide.text}</div>;
    });

  return <div className='lyric'>{parts}</div>;
}

function ScriptureSlide(props: {slide: SlideView}) {
  return (
    <div className='scripture'>
      <div className='verse'>{props.slide.text}</div>
      <div className='caption'>{props.slide?.caption}</div>
    </div>
  );
}
