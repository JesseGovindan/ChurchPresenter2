import {SlideView} from 'commons';
import {
  getSectionAroundShownSlide,
  findConsecutiveRangeAround,
} from '../../projector/OverheadProjector';
import crypto from 'crypto';

describe('getSectionAroundShownSlide', () => {
  let slides: SlideView[];

  beforeEach(() => {
    slides = [
      createTestSlide('V1'),
      createTestSlide('V1'),
      createTestSlide('C1'),
      createTestSlide('C1'),
      createTestSlide('C2'),
      createTestSlide('C2'),
    ];
  });

  it('selects all slides around selected chorus', () => {
    // Arrange
    slides[2].isShown = true;
    // Act
    const selectedSlides = getSectionAroundShownSlide(slides);
    // Assert
    expect(selectedSlides).toEqual(slides.slice(2, 4));
  });

  it('selects all slides around selected verse', () => {
    // Arrange
    slides[1].isShown = true;
    // Act
    const selectedSlides = getSectionAroundShownSlide(slides);
    // Assert
    expect(selectedSlides).toEqual(slides.slice(0, 2));
  });

  function createTestSlide(sectionName: string): SlideView {
    return {
      isShown: false,
      sectionName,
      text: crypto.randomBytes(10).toString('hex'),
    };
  }
});

describe('findConsecutiveRangeAround', () => {
  it('finds range when only no consecutive values found', () => {
    // Arrange
    const data = [{value: 'a'}, {value: 'x'}, {value: 'b'}];
    // Act
    const range = findConsecutiveRangeAround(data, 1, v => v.value === 'x');
    // Assert
    expect(range).toEqual({start: 1, end: 2});
  });

  it('finds range when one consecutive value found', () => {
    // Arrange
    const data = [{value: 'a'}, {value: 'x'}, {value: 'x'}, {value: 'b'}];
    // Act
    const range = findConsecutiveRangeAround(data, 1, v => v.value === 'x');
    // Assert
    expect(range).toEqual({start: 1, end: 3});
  });

  it('finds range around first item', () => {
    // Arrange
    const data = [{value: 'a'}, {value: 'x'}, {value: 'x'}, {value: 'b'}];
    // Act
    const range = findConsecutiveRangeAround(data, 0, v => v.value === 'a');
    // Assert
    expect(range).toEqual({start: 0, end: 1});
  });

  it('finds range around last item', () => {
    // Arrange
    const data = [{value: 'a'}, {value: 'x'}, {value: 'x'}, {value: 'b'}];
    // Act
    const range = findConsecutiveRangeAround(data, 3, v => v.value === 'b');
    // Assert
    expect(range).toEqual({start: 3, end: 4});
  });
});
