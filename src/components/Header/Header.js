import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';

const years = [
  {"year": "1983-1987", "short": "83-87"},
  {"year": "1988", "short": "'88", "era": "1.0"},
  {"year": "1989", "short": "'89", "era": "1.0"},
  {"year": "1990", "short": "'90", "era": "1.0"},
  {"year": "1991", "short": "'91", "era": "1.0"},
  {"year": "1992", "short": "'92", "era": "1.0"},
  {"year": "1993", "short": "'93", "era": "1.0"},
  {"year": "1994", "short": "'94", "era": "1.0"},
  {"year": "1995", "short": "'95", "era": "1.0"},
  {"year": "1996", "short": "'96", "era": "1.0"},
  {"year": "1997", "short": "'97", "era": "1.0"},
  {"year": "1998", "short": "'98", "era": "1.0"},
  {"year": "1999", "short": "'99", "era": "1.0"},
  {"year": "2000", "short": "'00", "era": "1.0"},
  {"year": "2002", "short": "'02", "era": "2.0"},
  {"year": "2003", "short": "'03", "era": "2.0"},
  {"year": "2004", "short": "'04", "era": "2.0"},
  {"year": "2009", "short": "'09", "era": "3.0"},
  {"year": "2010", "short": "'10", "era": "3.0"},
  {"year": "2011", "short": "'11", "era": "3.0"},
  {"year": "2012", "short": "'12", "era": "3.0"},
  {"year": "2013", "short": "'13", "era": "3.0"},
  {"year": "2014", "short": "'14", "era": "3.0"},
  {"year": "2015", "short": "'15", "era": "3.0"},
  {"year": "2016", "short": "'16", "era": "3.0"},
  {"year": "2017", "short": "'17", "era": "3.0"}
]

const renderList = years.map(function(year) {
  return (
    <li className="yearListItem" key={year.year}>
      <Link key={year.year} to={year.year}>
        <span>{year.short}</span>
      </Link>
    </li>
  );
});

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Navigation">
        <GlobalSearch />
        <ul className="yearList"> 
          {renderList} 
          </ul>
      </div>
    );
  }
}