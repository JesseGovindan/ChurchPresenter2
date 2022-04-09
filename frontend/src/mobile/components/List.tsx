export function List(props: {children: JSX.Element | JSX.Element[]}) {
  return <ol className='stack | rounded | service-list'>
    { props.children }
  </ol>;
}
