import {useSelector} from 'react-redux';
import {FolderView, SlideView} from 'commons';
import {State} from '../store';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';

const FONT_SIZE_INCREMENT = 0.02;
const NON_BREAKING_SPACE = '\u00A0';
const REGULAR_SPACE = ' ';

export function OverheadProjector() {
  const folder = useSelector<State, FolderView | null>(
    state => state.serviceManager.selectedFolder);

  const [fontScale, setFontScale] = useState(1);
  const [max, setMax] = useState(1);
  const d = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.visualViewport.height);
  const [windowWidth, setWindowWidth] = useState(window.visualViewport.width);

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

    const contentHeight = container.scrollHeight - 1;
    let contentWidth = 0;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children.item(i);
      if (child) {
        contentWidth = Math.max(child.getBoundingClientRect().width, contentWidth);
      }
    }

    if (contentHeight > windowHeight || contentWidth > windowWidth) {
      setFontScale(c => c - FONT_SIZE_INCREMENT);
      setMax(fontScale - FONT_SIZE_INCREMENT);
    } else {
      setFontScale(c => Math.min(max, c + FONT_SIZE_INCREMENT));
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
  const verseFontSize = `${(6 * props.fontScale).toFixed(2)}vmax`;
  const gapSize = `${(4 * props.fontScale).toFixed(2)}vmin`;

  const parts = getSectionAroundShownSlide(props.folder.slides)
    .flatMap(slideToLines)
    .map((text, index) => createLyricLine(text, index, verseFontSize, gapSize));

  return <div className='lyric'>{parts}</div>;
}

function slideToLines(slide: SlideView): string[] {
  return slide.text
    .split('\n')
    .map(line => line.replaceAll(REGULAR_SPACE, NON_BREAKING_SPACE));
}

function createLyricLine(line: string, index: number, fontSize: string, gap: string) {
  return <div key={index} style={{fontSize, gap}}>{line}</div>;
}

export function getSectionAroundShownSlide(slides: SlideView[]): SlideView[] {
  const selectedSlideIndex = slides.findIndex(slide => slide.isShown);
  const selectedSlide = slides[selectedSlideIndex];
  const selectedRange = findConsecutiveRangeAround(
    slides, selectedSlideIndex, slide => slide.sectionName == selectedSlide.sectionName);
  return slides.slice(selectedRange.start, selectedRange.end);
}

export function findConsecutiveRangeAround<T>(
  array: T[], startingIndex: number, predicate: (t: T) => boolean)
: { start: number, end: number} {
  const flags = Array<boolean>(array.length);
  flags[startingIndex] = true;

  const checkFlag = (index: number, increment: number): boolean => {
    if (flags[index] === undefined) {
      flags[index] = checkFlag(index + increment, increment) && predicate(array[index]);
      return flags[index];
    } else {
      return flags[index];
    }
  };

  checkFlag(array.length - 1, -1);
  checkFlag(0, 1);

  const consecutives = flags
    .map((flag, index) => ({flag, index}))
    .filter(value => value.flag);

  return {start: consecutives[0].index, end: consecutives[0].index + consecutives.length};
}

function ScriptureSlide(props: {slide: SlideView, fontScale: number}) {
  const captionFontSize = fixedDecimalString(4 * props.fontScale, 'vmax');
  const verseFontSize = fixedDecimalString(6 * props.fontScale, 'vmax');

  return (
    <div className='scripture'>
      <div className='caption' style={{fontSize: captionFontSize}}>
        {props.slide?.caption}
      </div>
      <div className='verse' style={{fontSize: verseFontSize}}>{props.slide.text}</div>
    </div>
  );
}

function fixedDecimalString(value: number, suffix: string) {
  return value.toFixed(2) + suffix;
}
