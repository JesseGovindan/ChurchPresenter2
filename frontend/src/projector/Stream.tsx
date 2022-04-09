import {useSelector} from 'react-redux';
import {FolderView, SlideView} from 'commons';
import {State} from '../store';

export function StreamProjector() {
  const folder = useSelector<State, FolderView | null>(
    state => state.serviceManager.selectedFolder);

  const slide = getSlideFromFolder(folder);
  return (
    <div className='stream-projector' data-active={!!slide}>
      { slide }
    </div>
  );
}

function getSlideFromFolder(folder: FolderView | null) {
  if (folder) {
    const visibleSlide = folder.slides.find(s => s.isShown);
    if (visibleSlide) {
      return folder.type === 'lyric' ?
        <LyricSlide slide={visibleSlide}/> :
        <ScriptureSlide slide={visibleSlide} />;
    }
  }
  return null;
}

function LyricSlide(props: {slide: SlideView}) {
  return <div className='lyric'>{props.slide.text}</div>;
}

function ScriptureSlide(props: {slide: SlideView}) {
  return (
    <div className='scripture'>
      <div className='verse'>{props.slide.text}</div>
      <div className='caption'>{props.slide?.caption}</div>
    </div>
  );
}
