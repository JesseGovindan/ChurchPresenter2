import {configureStore, PayloadAction} from '@reduxjs/toolkit';
import {Observable, map} from 'rxjs';
import {Action} from 'redux';
import {combineEpics, createEpicMiddleware, ofType} from 'redux-observable';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import Store, {reducer} from '../store';

interface HasType<T extends string = string> {
  type: T;
}

export const createEpicMock =
<P extends any = undefined, T extends string = string>(actionCreator: HasType<T>) => {
  const mock = jest.fn();
  mock.mockImplementation(() => ({type: ''}));
  return {
    mock: mock,
    epic: (action$: Observable<Action>) =>
      action$.pipe(
        ofType(actionCreator.type),
        map(action => {
          return mock((action as PayloadAction<P>).payload);
        }),
      ),
  };
};

export const createTestStore = () => {
  const epicMiddleware = createEpicMiddleware();
  const store = configureStore({
    reducer,
    middleware: [epicMiddleware],
  });

  const dispatchSpy = jest.spyOn(store, 'dispatch');

  return {store, dispatchSpy};
};

export const renderWithStore = <C, >(store: typeof Store, component: C) => {
  return render(
    <Provider store={store}>
      { component }
    </Provider>,
  );
};
