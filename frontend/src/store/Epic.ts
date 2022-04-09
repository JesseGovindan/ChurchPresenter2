import {PayloadAction, Draft} from '@reduxjs/toolkit';

// type EpicType<P> =
//   (action: Observable<PayloadAction<P>>,
//   state: StateObservable<State>) => () => Observable<Action>;
// export interface Epic<P, T extends string> {
//   epic: (action$: Observable<Action>, state$: StateObservable<State>) => Observable<Action>;
//   action: ActionCreatorWithPayload<P, T>;
// };

// function createEpic<P, T extends string>(action: ActionCreatorWithPayload<P,
// T>, epic: EpicType<P>)
//   : Epic<P, T> {
//   return {
//     epic: (action$: Observable<Action>, state$: StateObservable<State>) => {
//       return action$.pipe(
//         ofType(action.type),
//         epic(action$ as Observable<PayloadAction<P>>, state$),
//       );
//     },
//     action: action,
//   };
// }

export const createEmptyReducer = <State, T = undefined>() => {
  return (_state: Draft<State>, _action: PayloadAction<T>) => {};
};

// export default createEpic;
