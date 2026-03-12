import { memo } from 'react';
import './filters.css';

type FiltersProps = {
  titles?: string[];
  title?: string;
  name?: string;
};

const Filters = memo(({ titles = [], title = '', name = '' }: FiltersProps) => {
  return (
    <form key={`${title}-${name}`} className="filter-container" method="GET" action="/">
      <div className="filter-dropdown">
        <label htmlFor="title">Select a title</label>
        <select id="title" name="title" defaultValue={title}>
          <option value="">All</option>
          {titles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="filter-search">
        <label htmlFor="search">Search a name</label>
        <input id="search" name="search" type="text" defaultValue={name} />
      </div>

      <div className="filter-buttons">
        <button type="submit">Filter</button>
        <a href="/">Clear</a>
      </div>
    </form>
  );
});

export default Filters;