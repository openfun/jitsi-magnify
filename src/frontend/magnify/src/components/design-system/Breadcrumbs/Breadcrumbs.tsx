import * as React from 'react';
import { useMatches } from 'react-router-dom';

export interface BreadcrumbsProps {}

const Breadcrumbs = () => {
  const matches = useMatches();

  let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match: any) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match: any) => match.handle.crumb(match.data));

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
      {crumbs.map((crumb, index) => (
        <li
          key={index}
          style={{
            listStyle: index === 0 ? 'none' : 'disc',
            margin: `${index === 0 ? '0px 15px 0 0' : '0 15px'}`,
          }}
        >
          {crumb}
        </li>
      ))}
    </ol>
  );
};

export default Breadcrumbs;
