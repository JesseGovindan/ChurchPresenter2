import {useSelector} from 'react-redux';
import {State} from './store';
import {Folder} from './store/previewProjectorSlice';
import './PreviewProjector.scss';
import {Property} from 'csstype';

const PreviewProjector = () => {
  const folder = useSelector<State, Folder | undefined>(store => store.previewProjector.folder);

  const content = folder ?
    createSlides(folder) :
    <div className='info'>Select an item to preview its contents</div>;

  return (
    <section className='container preview' aria-label='preview projector'>
      <div className='max-height'>
        {content}
      </div>
    </section>
  );
};

const createSlides = (folder: Folder) => {
  const uniqueSongHeadings = getUnique(folder.slides.map(_ => _.heading) || []);

  const getColorForHeading = (heading: string): Property.BackgroundColor => {
    const index = uniqueSongHeadings.get(heading) || 0;
    return `hsl(${index * 360 / uniqueSongHeadings.size}, 37%, 75%)`;
  };

  return (
    <div role='grid'>
      {
        folder.slides.map((slide, index) => {
          return (
            <div
              key={index}
              role='row'
              style={({backgroundColor: getColorForHeading(slide.heading)})}>
              <div role='rowheader'>{slide.heading}</div>
              <div role='cell'><p>{slide.text}</p></div>
            </div>
          );
        })
      }
    </div>
  );
};

const getUnique = (values: string[]) => {
  const map = new Map<string, number>();
  values.forEach(value => {
    if (!map.has(value)) {
      map.set(value, map.size);
    }
  });
  return map;
};

export default PreviewProjector;
