import {Data, FolderView} from 'commons';
import {createContext, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import io from 'socket.io-client';
import {domain} from '../store/config';
import {folderSelected, serviceChanged} from '../store/serviceManagerSlice';

const ws = io(domain);

const WebSocketContext = createContext(null);

const createWsContext = (props: {children: JSX.Element | JSX.Element[] }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    ws.on(Data.serviceList, service => {
      dispatch(serviceChanged(service));
    });

    ws.on(Data.folder, (folder: FolderView) => {
      console.log(folder);
      dispatch(folderSelected(folder));
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
