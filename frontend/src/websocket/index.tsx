import {Data, FolderView} from 'commons';
import {createContext, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import io from 'socket.io-client';
import {folderSelected, searchCompleted, serviceChanged} from '../store/serviceManagerSlice';

const ws = io(getServerAddress());

export function getServerAddress() {
  const port = process.env.REACT_APP_CP_PORT;
  const domain = port ? `http://localhost:${port}/` : '/';
  return domain;
}

const WebSocketContext = createContext(null);

const createWsContext = (props: {children: JSX.Element | JSX.Element[] }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    ws.on(Data.serviceList, service => {
      dispatch(serviceChanged(service));
    });

    ws.on(Data.folder, (folder: FolderView) => {
      dispatch(folderSelected(folder));
    });

    ws.on(Data.searchResults, searchResults => {
      dispatch(searchCompleted(searchResults));
    });
  }, []);

  return (
    <WebSocketContext.Provider value={null}>
      { props.children }
    </WebSocketContext.Provider>
  );
};

export default createWsContext;

export {ws, WebSocketContext};
