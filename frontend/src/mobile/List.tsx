import React, {UIEventHandler} from 'react';

export type ListProps = React.PropsWithChildren<{
  onScroll?: UIEventHandler<HTMLOListElement>
}>

export const List = React.forwardRef(
  (props: React.PropsWithChildren<ListProps>, ref: React.ForwardedRef<HTMLOListElement>) => {
    return <ol
      ref={ref}
      onScroll={props.onScroll}
      className='list'
    >
      { props.children }
    </ol>;
  });

List.displayName = 'List';
