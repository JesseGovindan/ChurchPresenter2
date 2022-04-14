import {useSelector} from 'react-redux';
import {FolderView, SlideView} from 'commons';
import {State} from '../store';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';

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
    .flatMap(slide => slide.text.split('\n').map(line => ({
      text: line,
      isShown: false,
      caption: '',
    })))
    .map((slide, index) => {
      return <div key={index}>{slide.text}</div>;
    });

  return <div className='lyric'>{parts}</div>;
}

function ScriptureSlide(props: {slide: SlideView}) {
  const [fontSize, setFontSize] = useState(7);
  const [max, setMax] = useState(7);
  const d = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.visualViewport.height);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    window.onresize = () => {
      setWindowHeight(window.visualViewport.height);
      setWindowWidth(window.visualViewport.width);
    };
  }, []);

  useLayoutEffect(() => {
    setMax(7);
  }, [props.slide, windowHeight, windowWidth]);

  useLayoutEffect(() => {
    const container = d.current;
    if (container === null) {
      return;
    }

    if (container.scrollHeight > windowHeight) {
      setFontSize(c => c - 0.1);
      setMax(fontSize - 0.1);
    } else {
      setFontSize(c => Math.min(max, c + 0.1));
    }
  }, [d, props.slide, fontSize, windowHeight, windowWidth]);

  return (
    <div ref={d} className='scripture'>
      <div className='caption' style={{fontSize: `${fontSize - 1}vmin`}}>
        {props.slide?.caption}
      </div>
      <div className='verse' style={{fontSize: `${fontSize}vmin`}}>{props.slide.text}</div>
    </div>
  );
}
