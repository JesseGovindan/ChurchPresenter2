import {ServiceList} from 'commons';
import {DragEvent, useEffect} from 'react';
import {Book, Music} from 'react-feather';
import {useDispatch, useSelector} from 'react-redux';
import {State} from '../store';
import {getService, songDragCompleted} from '../store/serviceManagerSlice';
import './ServiceManager.scss';

const ServiceManager = () => {
  const service = useSelector<State, ServiceList>(store =>
    store.serviceManager.currentService);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getService());
  }, []);

  const handleDrop = (e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    dispatch(songDragCompleted());
  };

  return (
    <section className='container service-manager' aria-label='service manager'>
      <div className='container-heading'><h2>Service</h2></div>
      <div className='max-height'>
        <ul
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e)}
        >
          {
            service.map((item, index) =>
              <li
                key={`${index}:${item.title}`}>
                {item.type === 'lyric' ? <Music size='16'/> : <Book size='16'/>}
                {/* {item.title} */}
                <p>{item.title}</p>
              </li>)
          }
        </ul>
      </div>
    </section>
  );
};

export default ServiceManager;
