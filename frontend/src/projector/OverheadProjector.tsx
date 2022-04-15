import {useSelector} from 'react-redux';
import {FolderView, SlideView} from 'commons';
import {State} from '../store';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';

export function OverheadProjector() {
  const folder = useSelector<State, FolderView | null>(
    state => state.serviceManager.selectedFolder);

  const [fontScale, setFontScale] = useState(1);
  const [max, setMax] = useState(1);
  const d = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.visualViewport.height);
  const [windowWidth, setWindowWidth] = useState(window.visualViewport.width);
  console.log(fontScale);

  useEffect(() => {
    window.onresize = () => {
      setWindowHeight(window.visualViewport.height);
      setWindowWidth(window.visualViewport.width);
    };
  }, []);

  useLayoutEffect(() => {
    setMax(1);
  }, [folder, windowHeight, windowWidth]);

  useLayoutEffect(() => {
    const container = d.current;
    if (container === null) {
      return;
    }

    const rect = container.scrollHeight - 1;
    let maxWidth = 0;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children.item(i);
      if (child) {
        maxWidth = Math.max(child.getBoundingClientRect().width, maxWidth);
      }
    }

    console.log(`window width: ${windowWidth} div width: ${maxWidth}`);
    console.log(`window height: ${windowHeight} div height: ${rect}`);
    if (rect > windowHeight || maxWidth > windowWidth) {
      setFontScale(c => c - 0.02);
      setMax(fontScale - 0.02);
    } else {
      setFontScale(c => Math.min(max, c + 0.02));
    }
  }, [d, folder, fontScale, max, windowHeight, windowWidth]);

  const slide = getSlideFromFolder(folder, fontScale);
  return (
    <div ref={d} className='overhead-projector' data-active={!!slide} data-type={folder?.type}>
      { slide }
    </div>
  );
}

function getSlideFromFolder(folder: FolderView | null, fontScale: number) {
  if (folder) {
    const visibleSlide = folder.slides.find(s => s.isShown);
    if (visibleSlide) {
      return folder.type === 'lyric' ?
        <LyricSlide folder={folder} fontScale={fontScale}/> :
        <ScriptureSlide slide={visibleSlide} fontScale={fontScale}/>;
    }
  }
  return null;
}

function LyricSlide(props: {folder: FolderView, fontScale: number}) {
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

  const verseFontSize = `${(6*props.fontScale).toFixed(2)}vmax`;
  const gapSize = `${(4 * props.fontScale).toFixed(2)}vmin`;
  console.log(verseFontSize);

  const parts = slides.slice(startIndex, endIndex)
    .flatMap(slide => slide.text.split('\n').map(line => ({
      text: line.split(' ').join('\u00A0'),
      isShown: false,
      caption: '',
    })))
    .map((slide, index) => {
      return <div key={index} style={{fontSize: verseFontSize, gap: gapSize}}>{slide.text}</div>;
    });

  return <div className='lyric'>{parts}</div>;
}

function ScriptureSlide(props: {slide: SlideView, fontScale: number}) {
  const captionFontSize = `${(4*props.fontScale).toFixed(2)}vmax`;
  const verseFontSize = `${(6*props.fontScale).toFixed(2)}vmax`;
  console.log(captionFontSize);

  return (
    <div className='scripture'>
      <div className='caption' style={{fontSize: captionFontSize}}>
        {props.slide?.caption}
      </div>
      <div className='verse' style={{fontSize: verseFontSize}}>{props.slide.text}</div>
    </div>
  );
}
