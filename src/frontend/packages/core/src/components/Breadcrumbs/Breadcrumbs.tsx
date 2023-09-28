import { Children, FunctionComponent } from 'react';
import { useMatches } from 'react-router-dom';

export interface BreadcrumbsProps {}

interface BreadcrumbHandle {
  crumb: FunctionComponent;
}

const Breadcrumbs = () => {
  const matches = useMatches();

  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean((match.handle as BreadcrumbHandle)?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => (match.handle as BreadcrumbHandle)!.crumb({ data: match.data }));

  return (
    <ol
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'disc',
        padding: 0,
      }}
    >
      {Children.toArray(
        crumbs.map((crumb, index) => (
          <li
            style={{
              listStyle: index === 0 ? 'none' : 'disc',
              margin: `${index === 0 ? '0px 15px 0 0' : '0 15px'}`,
            }}
          >
            {crumb}
          </li>
        )),
      )}
    </ol>
  );
};

export default Breadcrumbs;
