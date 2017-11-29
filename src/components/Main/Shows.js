import React, { Component } from 'react';
import { shows, showsForYear, showsForVenue, showsForTour, showsToday, venues } from './../../api/phishin';
import ReactDOM from 'react-dom';
import './../../css/Shows.css';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

//TODO create default empty state if no shows found
export default class Shows extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      shows: null,
      allShows: true,
      filterOption: '',
      page: 1,
      loadingShows: false
    }
  }
  
  componentWillMount = () => {
    venues().then(tours => {
      console.log(tours);
      let stuff = tours.map(tour => {
        return {label: tour.name + " - " + tour.location, value: tour.id, showCount: tour.shows_count};
      });
      console.log(stuff);
    })
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    this.loadRelevantData(type, id);
  }

  componentWillReceiveProps(nextProps) {
    let nextType = nextProps.match.params.type;
    let nextId = nextProps.match.params.id;
    this.loadRelevantData(nextType, nextId);
  }

  loadRelevantData = (type = null, id = null) => {
    if (!type) {
      this.fetchAllShows();
    }

    switch(type) {
      case "year": 
        this.fetchShowsForYear(id);
        break;
      case "today":
        this.fetchShowsToday();
        break;
      case "venue":
        this.fetchShowsForVenue(id);
        break;
      case "tour":
        this.fetchShowsForTour(id);
        break;
    }
  }

  renderShows = (shows) => {
    return shows.map(function (show, index) {
      let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let date = new Date(show.date + ' 00:00');

      return (
        <div key={show.id} className="image-container">
          <div className="show-information-control">
            {show.sbd ? <div className="is-soundboard">Soundboard</div> : null}
            <img 
              src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
              alt={show.id}
              id={show.id}
            />
            <div className="show-information">
              <div className="center-abs">
                <div className="play-button">
                  <Ionicon 
                    icon="ios-play" 
                    fontSize="35px" 
                    onClick={() => this.props.emitter.emit('playlistUpdate', show.id)}
                    color="white"
                    className="left-10"
                  />
                </div>
                <div className="show-likes">
                  <Ionicon 
                    icon="ios-thumbs-up" 
                    fontSize="18px" 
                    onClick={() => console.log('like clicked')}
                    color="white"
                  />
                  <span className="likes-num"> 
                    {show.likes_count} 
                  </span>
                </div>
              </div>
            </div>
          </div>
          <span 
            onClick={() => {
              this.props.history.push('show/' + show.id)}
            }
            className="show-date"
          >
            {date.toLocaleDateString('en-US', dateOptions)}
          </span>
          <span className="show-venue"> {show.venue_name} {show.location} </span>

          {show.remastered ? <p> Remastered: yes </p> : null}
        </div>
      );
    }, this);
  }

  fetchShowsToday = () => {
    let today = new Date();
    let day = today.getDate().toString();
    let month = (today.getMonth() + 1).toString();
    let date = month + "-" + day;
    showsToday(date).then(shows => {
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  fetchShowsForTour = (tour) => {
    showsForVenue(tour).then(shows => {
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  fetchShowsForVenue = (venue) => {
    showsForVenue(venue).then(showIds => {
      //TODO fetch all the shows from the show ids passed in from response
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  fetchShowsForYear = (year) => {
    showsForYear(year).then(shows => {
      console.log(shows);
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  sortShows = (attr, order) => {
    let sorted;
    let shows = this.state.shows;
    if (attr === 'date') {
      sorted = shows.sort((a, b) => {
        var c = new Date(a.date);
        var d = new Date(b.date);
        if (order === 'asc') {
          return c-d;
        } else if (order === 'desc') {
          return d-c;
        }
      });
    }

    if (attr === 'likes_count') {
      sorted = shows.sort((a, b) => {
        return parseFloat(b.likes_count) - parseFloat(a.likes_count);
      });
    }

    this.setState({
      shows: sorted
    })
  }

  fetchAllShows = () => {
    shows().then(shows => {
      this.setState({
        shows: shows,
        allShows: true,
        page: 1
      })
    })
  }

  handleChange = (filterOption) => {
    this.sortShows(filterOption.attr, filterOption.order);
    this.setState({ filterOption: filterOption });
  }

  loadMoreShows = () => {
    this.setState({
      loadingShows: true
    })
    let page = this.state.page + 1;
    
    shows(page).then(shows => {
      console.log(shows);
      this.setState(previousState => ({
        loadingShows: false,
        page: page,
        shows: [...previousState.shows, ...shows]
      }));
    });
  }

  render() {
    let shows = this.state.shows;
    
    if (!shows) {
      return (<div> Loading ... </div>);
    }

    return (
      <div>
        <div className="filters">
          <Ionicon 
            className="clickable" 
            icon="ios-arrow-dropup-circle" 
            fontSize="60px"
            onClick={() => {console.log(this.refs.shows); this.refs.shows.scroll({top: 0, behavior:"smooth"})}}
          />
          <div className="search-filter">
            <Select
              name={"Sort by"}
              placeholder={"Sort by"}
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              options={sortByOptions}
            />
          </div>
          <Filter
            history={this.props.history}
            name={"Years"}
            path={"/shows/year/"}
            placeholder={"Years"}
            options={yearFilters}
            getShows={this.fetchShowsForYear.bind(this)}
          />
          <Filter 
            history={this.props.history}
            name={"Tours"}
            path={"/shows/tour/"}
            placeholder={"Tours"}
            options={tourFilters}
            getShows={this.fetchShowsForYear.bind(this)}
          />
          <Filter 
            history={this.props.history}
            name={"Venues"}
            path={"/shows/venue/"}
            placeholder={"Venues"}
            options={venueFilters}
            getShows={this.fetchShowsForYear.bind(this)}
          />
        </div>
        <div className="shows-container" ref="shows">
          <div className="show-gallery">
            {this.renderShows(shows)}
          </div>
          {this.state.allShows ?
            <div>
              <Ionicon className={this.state.loadingShows ? "" : "hidden"} icon="ios-refresh" fontSize="80px" rotate={true} />
              <div className={this.state.loadingShows ? "hidden" : "load-more"} onClick={() => {
                  this.loadMoreShows();
                }}
              >
                Load more shows 
              </div>
            </div>
            :
            null
            }
        </div>
      </div>
    );
  }
}

const sortByOptions = [
  {label: 'Popular', value: "popular", attr: "likes_count", order: "desc"},
  {label: 'Date (Recent)', value: "recent", attr: "date", order: "desc"},
  {label: 'Date (Older)', value: "older", attr: "date", order: "asc"},
];

const yearFilters = [
  {label: "All Shows", value: "all"},
  {label: "1983-1987", value: "1983-1987"},
  {label: "1988", value: "1988"},
  {label: "1989", value: "1989"},
  {label: "1990", value: "1990"},
  {label: "1991", value: "1991"},
  {label: "1992", value: "1992"},
  {label: "1993", value: "1993"},
  {label: "1994", value: "1994"},
  {label: "1995", value: "1995"},
  {label: "1996", value: "1996"},
  {label: "1997", value: "1997"},
  {label: "1998", value: "1998"},
  {label: "1999", value: "1999"},
  {label: "2000", value: "2000"},
  {label: "2002", value: "2002"},
  {label: "2003", value: "2003"},
  {label: "2004", value: "2004"},
  {label: "2009", value: "2009"},
  {label: "2010", value: "2010"},
  {label: "2011", value: "2011"},
  {label: "2012", value: "2012"},
  {label: "2013", value: "2013"},
  {label: "2014", value: "2014"},
  {label: "2015", value: "2015"},
  {label: "2016", value: "2016"},
  {label: "2017", value: "2017"}
];

let tourFilters = [{"label":"1984 Tour","value":2,"showCount":2},{"label":"1998-1999 New Years Run","value":38,"showCount":3},{"label":"1991 Winter/Spring Tour","value":11,"showCount":52},{"label":"1994 Fall Tour","value":20,"showCount":45},{"label":"1993 Winter/Spring Tour","value":19,"showCount":69},{"label":"1996 Summer U.S. Tour","value":30,"showCount":9},{"label":"1997 Winter European Tour","value":35,"showCount":14},{"label":"1996 Fall Tour","value":27,"showCount":35},{"label":"1996-1997 New Years Run","value":28,"showCount":4},{"label":"1998 Summer European Tour","value":40,"showCount":9},{"label":"1997 Summer European Tour","value":33,"showCount":19},{"label":"2010-2011 New Years Run","value":65,"showCount":5},{"label":"2011 Late Summer Tour","value":67,"showCount":13},{"label":"Super Ball IX","value":79,"showCount":4},{"label":"2011 Early Summer Tour","value":66,"showCount":19},{"label":"2013 Summer Tour","value":87,"showCount":25},{"label":"1994 Summer Tour","value":23,"showCount":29},{"label":"2012-2013 New Years Run","value":78,"showCount":4},{"label":"2013 Fall Tour","value":89,"showCount":12},{"label":"1998 Summer U.S. Tour","value":39,"showCount":21},{"label":"1986 Tour","value":4,"showCount":7},{"label":"1989 Tour","value":7,"showCount":62},{"label":"1998 Fall Tour","value":36,"showCount":24},{"label":"1988 Tour","value":6,"showCount":42},{"label":"1994 Spring Tour","value":22,"showCount":42},{"label":"2014 Fall Tour","value":92,"showCount":12},{"label":"1991 Giant Country Horns Summer Tour","value":10,"showCount":14},{"label":"1992 Fall Tour","value":12,"showCount":20},{"label":"1992 Summer U.S. Tour","value":16,"showCount":24},{"label":"1995 Summer Tour","value":26,"showCount":22},{"label":"1998 Island Tour","value":37,"showCount":4},{"label":"1999 Fall Tour","value":41,"showCount":24},{"label":"1999 Summer Japan Tour","value":43,"showCount":3},{"label":"1999 Winter Tour","value":44,"showCount":14},{"label":"2000 Fall Tour","value":45,"showCount":22},{"label":"2000 NYC Tour","value":46,"showCount":3},{"label":"2000 Summer Japan Tour","value":47,"showCount":7},{"label":"2003 Winter Tour","value":53,"showCount":12},{"label":"2004 Early Summer Tour","value":54,"showCount":9},{"label":"2004 Late Summer Tour","value":55,"showCount":4},{"label":"2004 Vegas Run","value":56,"showCount":3},{"label":"2009 Early Summer Tour","value":60,"showCount":15},{"label":"2009 Late Summer Tour","value":61,"showCount":12},{"label":"2010 Fall Tour","value":62,"showCount":15},{"label":"2010 Late Summer Tour","value":64,"showCount":11},{"label":"2012 Early Summer Tour","value":69,"showCount":20},{"label":"2011-12 New Years Run","value":68,"showCount":4},{"label":"2009-2010 New Years Run","value":59,"showCount":4},{"label":"2003-2004 New Years Run","value":51,"showCount":4},{"label":"1997-1998 New Years Run","value":32,"showCount":4},{"label":"1995-1996 New Years Run","value":25,"showCount":4},{"label":"1994-1995 New Years Run","value":21,"showCount":4},{"label":"1993-1994 New Years Run","value":17,"showCount":4},{"label":"1992-1993 New Years Run","value":13,"showCount":4},{"label":"Festival 8","value":80,"showCount":4},{"label":"20th Anniversary Run","value":50,"showCount":4},{"label":"IT Festival","value":81,"showCount":3},{"label":"Big Cypress","value":82,"showCount":3},{"label":"Lemonwheel","value":83,"showCount":3},{"label":"The Great Went","value":85,"showCount":2},{"label":"1983 Tour","value":1,"showCount":1},{"label":"1991 Fall Tour","value":9,"showCount":44},{"label":"1996 Summer European Tour","value":29,"showCount":18},{"label":"Coventry","value":86,"showCount":3},{"label":"1997 Fall Tour","value":31,"showCount":21},{"label":"Farmhouse Promo","value":88,"showCount":4},{"label":"1985 Tour","value":3,"showCount":6},{"label":"1992 Summer European Tour","value":15,"showCount":5},{"label":"1997 Summer U.S. Tour","value":34,"showCount":17},{"label":"1999 Summer U.S. Tour","value":42,"showCount":20},{"label":"2009 Fall Tour","value":57,"showCount":12},{"label":"Not Part of a Tour","value":71,"showCount":25},{"label":"1987 Tour","value":5,"showCount":19},{"label":"2000 Summer U.S. Tour","value":48,"showCount":20},{"label":"2003 Summer Tour","value":52,"showCount":19},{"label":"2009 Hampton Reunion Run","value":58,"showCount":3},{"label":"2012 Late Summer Tour","value":70,"showCount":13},{"label":"The Clifford Ball","value":84,"showCount":3},{"label":"1995 Fall Tour","value":24,"showCount":54},{"label":"2013-14 New Years Run","value":90,"showCount":4},{"label":"2002-2003 Inverted New Years Run","value":49,"showCount":3},{"label":"1993 Summer Tour","value":18,"showCount":32},{"label":"2014-2015 New Years Run","value":94,"showCount":0},{"label":"2014 Summer Tour","value":91,"showCount":25},{"label":"2015 Summer Tour","value":95,"showCount":0},{"label":"2015-2016 New Years Run","value":96,"showCount":0},{"label":"1990 Tour","value":8,"showCount":89},{"label":"1992 Spring Tour","value":14,"showCount":50},{"label":"2016-2017 New Years Run","value":99,"showCount":4},{"label":"2017 Riviera Maya Run","value":100,"showCount":3},{"label":"2016 Summer Tour","value":97,"showCount":24},{"label":"2010 Early Summer Tour","value":63,"showCount":18},{"label":"2017 Summer Tour","value":101,"showCount":21},{"label":"2016 Fall Tour","value":98,"showCount":13}];
let venueFilters = [{"label":"University of Arizona Student Union - Tucson, AZ","value":41,"showCount":1},{"label":"Alumni Arena, SUNY Buffalo - Buffalo, NY","value":26,"showCount":1},{"label":"Alumni Gymnasium, Bates College - Lewiston, ME","value":27,"showCount":1},{"label":"America West Arena - Phoenix, AZ","value":30,"showCount":1},{"label":"American Theater - St. Louis, MO","value":32,"showCount":2},{"label":"Anaconda Theatre - Isla Vista, CA","value":34,"showCount":1},{"label":"ARCO Arena - Sacramento, CA","value":39,"showCount":1},{"label":"The Arlington Theatre - Santa Barbara, CA","value":43,"showCount":1},{"label":"Armstrong Hall, Colorado College - Colorado Springs, CO","value":44,"showCount":2},{"label":"Arrowhead Ranch - Parksville, NY","value":46,"showCount":2},{"label":"Austin Music Hall - Austin, TX","value":54,"showCount":2},{"label":"Backstage - Seattle, WA","value":55,"showCount":1},{"label":"Bader Field - Atlantic City, NJ","value":57,"showCount":3},{"label":"Bailey Hall, Cornell University - Ithaca, NY","value":58,"showCount":1},{"label":"Balch Fieldhouse, University of Colorado - Boulder, CO","value":59,"showCount":2},{"label":"The Ballpark - Old Orchard Beach, ME","value":60,"showCount":1},{"label":"The Band House - Winooski, VT","value":61,"showCount":1},{"label":"The Barn, Hobart College - Geneva, NY","value":65,"showCount":1},{"label":"Barrymore Theatre - Madison, WI","value":67,"showCount":4},{"label":"Bataclan - Paris, France","value":69,"showCount":1},{"label":"Battery Park - Burlington, VT","value":70,"showCount":1},{"label":"Bayfront Park Amphitheater - Miami, FL","value":71,"showCount":1},{"label":"A. J. Palumbo Center - Pittsburgh, PA","value":9,"showCount":1},{"label":"After the Gold Rush - Tempe, AZ","value":15,"showCount":1},{"label":"NBC Studios, Burbank - Burbank, CA","value":466,"showCount":1},{"label":"Alter Wartesaal - Cologne, Germany","value":25,"showCount":1},{"label":"Arena - Vienna, Austria","value":40,"showCount":1},{"label":"Acker Gym, Chico State University - Chico, CA","value":13,"showCount":1},{"label":"Bangor Auditorium - Bangor, ME","value":63,"showCount":2},{"label":"Arlene Schnitzer Concert Hall - Portland, OR","value":42,"showCount":1},{"label":"The Backyard - Bee Cave, TX","value":56,"showCount":1},{"label":"The Academy - New York, NY","value":11,"showCount":1},{"label":"Augusta Civic Center - Augusta, ME","value":53,"showCount":1},{"label":"The Base Lodge, Johnson State College - Stearns, VT","value":68,"showCount":2},{"label":"Alumni Hall - Barre, VT","value":28,"showCount":1},{"label":"BI-LO Center - Greenville, SC","value":81,"showCount":1},{"label":"Big Birch Concert Pavilion - Patterson, NY","value":83,"showCount":1},{"label":"Big Cat - Chuo-ku, Osaka, Japan","value":84,"showCount":1},{"label":"Archa Theater - Prague, Czech Republic","value":38,"showCount":1},{"label":"Billings Lounge, University of Vermont - Burlington, VT","value":87,"showCount":3},{"label":"The Boathouse - Norfolk, VA","value":94,"showCount":1},{"label":"Boatyard Village Pavilion - Clearwater, FL","value":95,"showCount":1},{"label":"Bogart's - Cincinnati, OH","value":97,"showCount":2},{"label":"Boise State University Pavilion - Boise, ID","value":98,"showCount":2},{"label":"Brad Sands's and Pete Carini's House - Charlotte, VT","value":107,"showCount":1},{"label":"Broome County Arena - Binghamton, NY","value":111,"showCount":2},{"label":"Buena Vista Theater - Tucson, AZ","value":114,"showCount":1},{"label":"Cabaret Metro - Chicago, IL","value":116,"showCount":1},{"label":"Cal Expo Amphitheater - Sacramento, CA","value":119,"showCount":2},{"label":"Campus Club - Providence, RI","value":121,"showCount":5},{"label":"The Cave, Carleton College - Northfield, MN","value":131,"showCount":1},{"label":"Cayuga County Fairgrounds - Weedsport, NY","value":132,"showCount":1},{"label":"Centre International - Deauville, France","value":135,"showCount":1},{"label":"The Agora Theatre - Cleveland, OH","value":17,"showCount":3},{"label":"Alpine Valley Music Theatre - East Troy, WI","value":24,"showCount":17},{"label":"American Airlines Arena - Miami, FL","value":31,"showCount":12},{"label":"Campus Recreation Center, Evergreen College - Olympia, WA","value":124,"showCount":4},{"label":"Benton Convention Center - Winston-Salem, NC","value":76,"showCount":1},{"label":"Biddy Mulligans - Chicago, IL","value":82,"showCount":1},
                    {"label":"The Blue Note - Columbia, MO","value":90,"showCount":1},{"label":"The Brewery - Raleigh, NC","value":108,"showCount":1},{"label":"The Capitol Theatre - Port Chester, NY","value":128,"showCount":7},{"label":"Cat's Cradle - Chapel Hill, NC","value":129,"showCount":5},{"label":"Celebrity Theatre - Phoenix, AZ","value":134,"showCount":1},{"label":"Burlington Boat House - Burlington, VT","value":115,"showCount":1},{"label":"Boulder Theater - Boulder, CO","value":105,"showCount":3},{"label":"Broome County Forum - Binghamton, NY","value":112,"showCount":2},{"label":"Berkshire Performing Arts Center - Lenox, MA","value":78,"showCount":1},{"label":"The Catalyst - Santa Cruz, CA","value":130,"showCount":3},{"label":"Boston Garden - Boston, MA","value":102,"showCount":2},{"label":"Cincinnati Music Hall - Cincinnati, OH","value":146,"showCount":1},{"label":"Cincinnati Zoo Peacock Pavilion - Cincinnati, OH","value":147,"showCount":1},{"label":"Civic Arena - Pittsburgh, PA","value":148,"showCount":2},{"label":"Boston World Trade Center Exhibition Hall - Boston, MA","value":104,"showCount":2},{"label":"Canyon West Room, Lincoln Center - Fort Collins, CO","value":127,"showCount":1},{"label":"Cutler Quad, Colorado College - Colorado Springs, CO","value":195,"showCount":1},{"label":"Club Quattro - Naka-ku, Nagoya, Japan","value":157,"showCount":1},{"label":"The Coach House - San Juan Capistrano, CA","value":160,"showCount":1},{"label":"Cobo Arena - Detroit, MI","value":161,"showCount":1},{"label":"The Colonial Theatre - Keene, NH","value":168,"showCount":7},{"label":"Concert Hall - Toronto, Ontario, Canada","value":174,"showCount":3},{"label":"Concord Pavilion - Concord, CA","value":175,"showCount":1},{"label":"Congress Center - Ottawa, Ontario, Canada","value":176,"showCount":1},{"label":"Continental Airlines Arena - East Rutherford, NJ","value":177,"showCount":1},{"label":"Cultural Center Auditorium - Charleston, WV","value":193,"showCount":1},{"label":"Dane County Coliseum - Madison, WI","value":197,"showCount":1},{"label":"Champlain Valley Exposition - Essex Junction, VT","value":138,"showCount":1},{"label":"The Cow Palace - Daly City, CA","value":187,"showCount":1},{"label":"The Cubby Bear - Chicago, IL","value":192,"showCount":1},{"label":"Club Bene - Sayreville, NJ","value":156,"showCount":1},{"label":"College Station Theater - Tuscaloosa, AL","value":166,"showCount":1},{"label":"Contois Auditorium, City Hall - Burlington, VT","value":178,"showCount":1},{"label":"Crest Theatre - Sacramento, CA","value":188,"showCount":1},{"label":"Charlotte Coliseum - Charlotte, NC","value":140,"showCount":2},{"label":"Chase Hall, Bates College - Lewiston, ME","value":141,"showCount":1},{"label":"Collis Center, Dartmouth College - Hanover, NH","value":167,"showCount":2},{"label":"Dining Commons, Bennington College - Bennington, VT","value":209,"showCount":1},{"label":"Dobson Arena - Vail, CO","value":212,"showCount":1},{"label":"The Downs - Santa Fe, NM","value":217,"showCount":1},{"label":"The Dugout Lounge, Ohio University - Athens, OH","value":220,"showCount":1},{"label":"Dyrskuepladsen - Ringe, Fyn, Denmark","value":222,"showCount":1},{"label":"Earlham College - Richmond, IN","value":227,"showCount":1},{"label":"Hara Arena - Dayton, OH","value":304,"showCount":1},{"label":"Boardwalk Hall - Atlantic City, NJ","value":93,"showCount":6},{"label":"Civic Center - Philadelphia, PA","value":150,"showCount":1},{"label":"The Bomb Factory - Dallas, TX","value":99,"showCount":1},{"label":"Cheel Arena, Clarkson University - Potsdam, NY","value":142,"showCount":1},
                    {"label":"Eastbrook Theatre - Grand Rapids, MI","value":229,"showCount":1},{"label":"El Dorado Café - Crested Butte, CO","value":233,"showCount":3},{"label":"Classic Amphitheater - Richmond, VA","value":154,"showCount":2},{"label":"Cross Insurance Arena - Portland, ME","value":194,"showCount":7},{"label":"Sleep Train Amphitheatre - Chula Vista, CA","value":179,"showCount":5},{"label":"Electric Ballroom - Knoxville, TN","value":235,"showCount":1},{"label":"Elk Ballroom - Telluride, CO","value":236,"showCount":2},{"label":"Espace Julien - Marseilles, France","value":242,"showCount":1},{"label":"Fenway Park - Boston, MA","value":244,"showCount":1},{"label":"The Fillmore - San Francisco, CA","value":249,"showCount":1},{"label":"Fine Arts Auditorium, Fort Lewis College - Durango, CO","value":252,"showCount":1},{"label":"FleetCenter - Boston, MA","value":262,"showCount":3},{"label":"Drum Logos - Chuo-ku, Fukuoka, Japan","value":218,"showCount":1},{"label":"Glenn Miller Ballroom, University of Colorado - Boulder, CO","value":279,"showCount":1},{"label":"Fiddler's Green - Englewood, CO","value":245,"showCount":1},{"label":"DNA Lounge - San Francisco, CA","value":211,"showCount":1},{"label":"The E Center - West Valley City, UT","value":225,"showCount":2},{"label":"Eagles Ballroom - Milwaukee, WI","value":226,"showCount":1},{"label":"Empire Polo Club - Indio, CA","value":239,"showCount":4},{"label":"First Avenue - Minneapolis, MN","value":255,"showCount":2},{"label":"Five Points South Music Hall - Birmingham, AL","value":260,"showCount":1},{"label":"Five Seasons Arena - Cedar Rapids, IA","value":261,"showCount":1},{"label":"Douglass Dining Center, University of Rochester - Rochester, NY","value":215,"showCount":1},{"label":"Dionysus Club, The 'Sco, Oberlin College - Oberlin, OH","value":210,"showCount":2},{"label":"Dour Festival - Dour, Belgium","value":216,"showCount":1},{"label":"Empire Court - Syracuse, NY","value":238,"showCount":1},{"label":"EMU Ballroom, University of Oregon - Eugene, OR","value":240,"showCount":1},{"label":"Event Center - San Jose, CA","value":243,"showCount":1},{"label":"Finbar's - Burlington, VT","value":251,"showCount":1},{"label":"Deep Ellum Live - Dallas, TX","value":202,"showCount":1},{"label":"Desert Sky Pavilion - Phoenix, AZ","value":205,"showCount":4},{"label":"Fillmore - Cortemaggiore, Italy","value":250,"showCount":1},{"label":"The Greek Theatre - Redlands, CA","value":293,"showCount":1},{"label":"Greenfield Armory Castle - Greenfield, MA","value":294,"showCount":1},{"label":"Greensboro Coliseum - Greensboro, NC","value":295,"showCount":1},{"label":"Haas Center for the Arts - Bloomsburg, PA","value":299,"showCount":1},{"label":"Hibiya Outdoor Theatre - Chiyoda-ku, Tokyo, Japan","value":315,"showCount":1},{"label":"Florida Theatre - Gainesville, FL","value":264,"showCount":1},{"label":"Fort Ram - Fort Collins, CO","value":268,"showCount":1},{"label":"The Forum - Nüremberg, Germany","value":269,"showCount":1},{"label":"Harris-Millis Cafeteria, University of Vermont - Burlington, VT","value":306,"showCount":1},{"label":"Huden Dining Hall, Castleton State College - Castleton, VT","value":324,"showCount":1},{"label":"Gallaghers - Waitsfield, VT","value":272,"showCount":3},{"label":"Grady Cole Center - Charlotte, NC","value":287,"showCount":2},{"label":"Great American Music Hall - San Francisco, CA","value":288,"showCount":2},{"label":"Greek Theatre - Los Angeles, CA","value":292,"showCount":5},{"label":"Hayden Square - Tempe, AZ","value":311,"showCount":1},{"label":"Hampton Casino Ballroom - Hampton Beach, NH","value":302,"showCount":1},{"label":"Hollywood Bowl - Hollywood, CA","value":321,"showCount":2},{"label":"Hampton Coliseum - Hampton, VA","value":303,"showCount":18},{"label":"The Haunt - Ithaca, NY","value":309,"showCount":4},{"label":"Glens Falls Civic Center - Glens Falls, NY","value":280,"showCount":2},{"label":"XL Center - Hartford, CT","value":307,"showCount":4},{"label":"The Fox Theatre - Boulder, CO","value":270,"showCount":1},{"label":"Hilton Coliseum - Ames, IA","value":320,"showCount":2},{"label":"The Georgia Theatre - Athens, GA","value":276,"showCount":5},{"label":"Goddard College - Plainfield, VT","value":282,"showCount":4},{"label":"Halverson's - Burlington, VT","value":300,"showCount":1},{"label":"Hamilton College - Clinton, NY","value":301,"showCount":2},{"label":"Greenstreets - Columbia, SC","value":296,"showCount":1},{"label":"Ervin J. Nutter Center, Wright State University - Dayton, OH","value":241,"showCount":3},{"label":"Humphries House (The Zoo), Amherst College - Amherst, MA","value":325,"showCount":2},{"label":"International Beer Garden - Arcata, CA","value":336,"showCount":2},{"label":"John Paul Jones Arena - Charlottesville, VA","value":345,"showCount":1},{"label":"Key Club - Los Angeles, CA","value":355,"showCount":1},{"label":"Kiel Center - St. Louis, MO","value":359,"showCount":1},{"label":"KLRU Studios, University of Texas - Austin, TX","value":361,"showCount":1},{"label":"Laguna Seca Raceway - Monterey, CA","value":369,"showCount":4},
                    {"label":"Le Zenith - Paris, France","value":377,"showCount":1},{"label":"Les Arenes Romaines - Arles, France","value":380,"showCount":1},{"label":"Liberty Lunch - Austin, TX","value":383,"showCount":1},{"label":"HUB Ballroom - Seattle, WA","value":323,"showCount":1},{"label":"Hersheypark Stadium - Hershey, PA","value":314,"showCount":4},{"label":"Long Beach Arena - Long Beach, CA","value":390,"showCount":1},{"label":"IMU Ballroom, University of Iowa - Iowa City, IA","value":332,"showCount":1},{"label":"Incognito - Munich, Germany","value":333,"showCount":1},{"label":"Kiefer UNO Lakefront Arena, University of New Orleans - New Orleans, LA","value":358,"showCount":1},{"label":"Lisner Auditorium, George Washington University - Washington, DC","value":385,"showCount":2},{"label":"Memorial Hall, University of North Carolina - Chapel Hill, NC","value":430,"showCount":1},{"label":"Memorial Union Building, University of New Hampshire - Durham, NH","value":431,"showCount":2},{"label":"The Inferno - Steamboat Springs, CO","value":335,"showCount":2},{"label":"Mabel Brown Room, Keene State College - Keene, NH","value":402,"showCount":1},{"label":"Mabel's - Champaign, IL","value":403,"showCount":1},{"label":"MAC Center, Kent State University - Kent, OH","value":404,"showCount":1},{"label":"The Macauley Theater - Louisville, KY","value":405,"showCount":2},{"label":"Joyous Lake - Woodstock, NY","value":349,"showCount":1},{"label":"Le Spectrum - Montréal, Québec, Canada","value":375,"showCount":2},{"label":"Keswick Theatre - Glenside, PA","value":353,"showCount":1},{"label":"KeySpan Park - Brooklyn, NY","value":356,"showCount":2},{"label":"LAeronef - Lille, France","value":366,"showCount":1},{"label":"La Laiterie - Strasbourg, France","value":367,"showCount":1},{"label":"The Library - Richmond, VA","value":384,"showCount":1},{"label":"Ivory Tusk - Tuscaloosa, AL","value":338,"showCount":1},{"label":"Kohl Center - Madison, WI","value":364,"showCount":1},{"label":"Kuhl Gym, SUNY Geneseo - Geneseo, NY","value":365,"showCount":1},{"label":"Le Botanique - Brussels, Belgium","value":374,"showCount":1},{"label":"Lengyel Gym, University of Maine - Orono, ME","value":378,"showCount":1},{"label":"Leon County Civic Center - Tallahassee, FL","value":379,"showCount":1},{"label":"IC Light Amphitheater - Pittsburgh, PA","value":331,"showCount":1},{"label":"J.J. McCabe's - Boulder, CO","value":339,"showCount":1},{"label":"Mahaffey Theatre - St. Petersburg, FL","value":409,"showCount":1},{"label":"Markethalle - Hamburg, Germany","value":414,"showCount":2},{"label":"Matthews Arena, Northeastern University - Boston, MA","value":419,"showCount":1},{"label":"MCI Center - Washington, DC","value":422,"showCount":1},{"label":"McNichols Arena - Denver, CO","value":423,"showCount":3},{"label":"Lakewood Amphitheatre - Atlanta, GA","value":371,"showCount":10},{"label":"Knoxville Civic Coliseum - Knoxville, TN","value":363,"showCount":3},{"label":"Ian McLean's Farm - Hebron, NY","value":329,"showCount":2},{"label":"Mullins Center, University of Massachusetts - Amherst, MA","value":453,"showCount":6},{"label":"Hunt's - Burlington, VT","value":326,"showCount":9},{"label":"John M. Greene Hall, Smith College - Northampton, MA","value":344,"showCount":1},{"label":"Melkweg - Amsterdam, Netherlands","value":426,"showCount":1},{"label":"Memorial Coliseum - Portland, OR","value":428,"showCount":2},{"label":"Memorial Hall - Kansas City, KS","value":429,"showCount":3},{"label":"Mid-Hudson Civic Center - Poughkeepsie, NY","value":438,"showCount":1},{"label":"Mt. Baker Theatre - Bellingham, WA","value":450,"showCount":1},{"label":"Mud Island Amphitheater - Memphis, TN","value":452,"showCount":1},{"label":"KBCO Studios - Boulder, CO","value":351,"showCount":1},{"label":"Kahootz - Richmond, VA","value":350,"showCount":1},{"label":"Louisville Gardens - Louisville, KY","value":396,"showCount":1},{"label":"Love Auditorium, Davidson College - Davidson, NC","value":398,"showCount":1},{"label":"Lucerna Theatre - Prague, Czech Republic","value":400,"showCount":2},{"label":"MSU Auditorium, Michigan State University - East Lansing, MI","value":449,"showCount":1},{"label":"Luther Burbank Center for the Arts - Santa Rosa, CA","value":401,"showCount":1},{"label":"Nassau Coliseum - Uniondale, NY","value":462,"showCount":6},{"label":"Mississippi Nights - St. Louis, MO","value":442,"showCount":2},{"label":"Mesa Amphitheatre - Mesa, AZ","value":433,"showCount":1},{"label":"Michigan Theater - Ann Arbor, MI","value":437,"showCount":3},{"label":"The Metropolis - Montréal, Québec, Canada","value":435,"showCount":1},{"label":"Mid-South Coliseum - Memphis, TN","value":439,"showCount":1},{"label":"The Moon - Tallahassee, FL","value":446,"showCount":1},{"label":"MacPhie Pub, Tufts University - Medford, MA","value":406,"showCount":1},{"label":"The Moore Theatre - Seattle, WA","value":447,"showCount":1},
                    {"label":"Marine Midland Arena - Buffalo, NY","value":412,"showCount":1},{"label":"McAlister Auditorium, Tulane University - New Orleans, LA","value":420,"showCount":1},{"label":"Meadow Brook Music Festival - Rochester Hills, MI","value":424,"showCount":2},{"label":"Metropol - Pittsburgh, PA","value":434,"showCount":1},{"label":"Molly's Cafe - Boston, MA","value":443,"showCount":1},{"label":"Lory Student Center Theatre, Colorado State University - Fort Collins, CO","value":395,"showCount":1},{"label":"The Marquee - New York, NY","value":415,"showCount":3},{"label":"Nautica Stage - Cleveland, OH","value":463,"showCount":2},{"label":"Nissan Pavilion at Stone Ridge - Bristow, VA","value":479,"showCount":1},{"label":"North Shore Surf Club - Olympia, WA","value":481,"showCount":1},{"label":"Oklahoma City Zoo Amphitheatre - Oklahoma City, OK","value":486,"showCount":1},{"label":"Old Stone Church - Newmarket, NH","value":488,"showCount":3},{"label":"On Air East - Shibuya-ku, Tokyo, Japan","value":491,"showCount":1},{"label":"Orange County Fairgrounds - Middletown, NY","value":493,"showCount":1},{"label":"Oswego County Airport - Volney, NY","value":498,"showCount":2},{"label":"Oz Nightclub - Seattle, WA","value":499,"showCount":1},{"label":"The Palace - Hollywood, CA","value":502,"showCount":2},{"label":"Plattsburgh Air Force Base - Plattsburgh, NY","value":532,"showCount":3},{"label":"Paolo Soleri Amphitheatre - Santa Fe, NM","value":506,"showCount":1},{"label":"Paradiso - Amsterdam, Netherlands","value":508,"showCount":3},{"label":"Paul Wright Gym, Western State College - Gunnison, CO","value":514,"showCount":2},{"label":"Murat Theatre - Indianapolis, IN","value":455,"showCount":2},{"label":"Sarratt Student Center, Vanderbilt University - Nashville, TN","value":598,"showCount":1},{"label":"Snivley Arena, University of New Hampshire - Durham, NH","value":612,"showCount":1},{"label":"Naeba Ski Resort - Niigata, Japan","value":460,"showCount":3},{"label":"Pepsi Center - Denver, CO","value":520,"showCount":1},{"label":"Municipal Auditorium - Nashville, TN","value":454,"showCount":4},{"label":"Key Arena - Seattle, WA","value":354,"showCount":2},{"label":"Nikon at Jones Beach Theater - Wantagh, NY","value":478,"showCount":14},{"label":"Oak Mountain Amphitheatre - Pelham, AL","value":485,"showCount":4},{"label":"Pete's Phabulous Phish Phest - Underhill, VT","value":522,"showCount":1},{"label":"Portland Expo - Portland, ME","value":537,"showCount":1},{"label":"Newport Music Hall - Columbus, OH","value":471,"showCount":3},{"label":"The Omni - Atlanta, GA","value":490,"showCount":1},{"label":"Nietzsches - Buffalo, NY","value":475,"showCount":1},{"label":"Olympic Center - Lake Placid, NY","value":489,"showCount":3},{"label":"Pan American Center - Las Cruces, NM","value":505,"showCount":1},{"label":"The Palace of Auburn Hills - Auburn Hills, MI","value":503,"showCount":4},{"label":"The Paradise - Boston, MA","value":507,"showCount":6},{"label":"North Charleston Coliseum - North Charleston, SC","value":480,"showCount":6},{"label":"Piazza Risorgimento - Como, Italy","value":526,"showCount":1},{"label":"Paramount Theatre - Seattle, WA","value":509,"showCount":1},{"label":"Night Stage - Cambridge, MA","value":476,"showCount":1},{"label":"The Orange Grove - Syracuse, NY","value":494,"showCount":1},{"label":"Orpheum Theatre - Memphis, TN","value":496,"showCount":1},{"label":"Patriot Center, George Mason University - Fairfax, VA","value":513,"showCount":2},{"label":"Myskyn's - Charleston, SC","value":459,"showCount":1},{"label":"Niagara Falls Convention Center - Niagara Falls, NY","value":473,"showCount":1},{"label":"Piazza del Duomo - Pistoia, Italy","value":525,"showCount":1},{"label":"Portland Meadows - Portland, OR","value":538,"showCount":2},{"label":"Pima County Fairgrounds - Tucson, AZ","value":530,"showCount":2},
                    {"label":"Prescott College - Prescott, AZ","value":542,"showCount":1},{"label":"Sawatch Hall, Park Hyatt Beaver Creek - Avon, CO","value":599,"showCount":1},{"label":"Somerville Theatre - Somerville, MA","value":615,"showCount":7},{"label":"South Park Meadows - Austin, TX","value":618,"showCount":3},{"label":"Spiaggia di Rivoltella - Desenzano, Italy","value":621,"showCount":1},{"label":"Sports Arena - San Diego, CA","value":624,"showCount":1},{"label":"Slade Hall, University of Vermont - Burlington, VT","value":610,"showCount":2},{"label":"Polo Fields, Golden Gate Park - San Francisco, CA","value":535,"showCount":1},{"label":"Serenadenhof - Nüremberg, Germany","value":602,"showCount":1},{"label":"Shepherd's Bush Empire - London, England","value":604,"showCount":2},{"label":"Smith Opera House - Geneva, NY","value":611,"showCount":1},{"label":"Sony Music Studios - New York, NY","value":617,"showCount":1},{"label":"Philipshalle - Düsseldorf, Germany","value":523,"showCount":1},{"label":"Phoenix Plaza Theatre - Pontiac, MI","value":524,"showCount":1},{"label":"Pershing Auditorium - Lincoln, NE","value":521,"showCount":1},{"label":"Portland Performing Arts Center - Portland, ME","value":539,"showCount":1},{"label":"Robert Crown Center, Hampshire College - Amherst, MA","value":577,"showCount":1},{"label":"Pearl Street Ballroom - Northampton, MA","value":517,"showCount":5},{"label":"Polaris Amphitheater - Columbus, OH","value":534,"showCount":4},{"label":"Sam's Tavern - Burlington, VT","value":593,"showCount":4},{"label":"Sculpture Room, Goddard College - Plainfield, VT","value":600,"showCount":3},{"label":"Sonic Studios - Philadelphia, PA","value":616,"showCount":1},{"label":"Spokane Arena - Spokane, WA","value":622,"showCount":1},{"label":"Sigma Phi House, Hamilton College - Clinton, NY","value":607,"showCount":2},{"label":"Pike's Peak Center - Colorado Springs, CO","value":529,"showCount":1},{"label":"Salisbury School - Salisbury, CT","value":591,"showCount":1},{"label":"The S.F.X. Centre - Dublin, Ireland","value":589,"showCount":2},{"label":"Sports Center, University of Hartford - West Hartford, CT","value":625,"showCount":1},{"label":"St. Andrew's Hall - Detroit, MI","value":628,"showCount":1},{"label":"Stadio Olimpico - Rome, Italy","value":633,"showCount":1},{"label":"nTelos Pavilion - Portsmouth, VA","value":483,"showCount":6},{"label":"BlueCross Arena - Rochester, NY","value":578,"showCount":3},{"label":"Shoreline Amphitheatre - Mountain View, CA","value":605,"showCount":14},{"label":"The Orpheum Theatre - Minneapolis, MN","value":497,"showCount":1},{"label":"Palace Theatre - Louisville, KY","value":504,"showCount":4},{"label":"St. Lawrence University - Canton, NY","value":629,"showCount":2},{"label":"Starry Night - Portland, OR","value":638,"showCount":5},{"label":"Salem Armory - Salem, OR","value":590,"showCount":1},{"label":"SunFest - West Palm Beach, FL","value":654,"showCount":1},{"label":"SUNY Potsdam - Potsdam, NY","value":656,"showCount":1},{"label":"The Syracuse Armory - Syracuse, NY","value":661,"showCount":1},
                    {"label":"Target Center - Minneapolis, MN","value":663,"showCount":3},{"label":"Telluride Town Park - Telluride, CO","value":666,"showCount":2},{"label":"Ten Mile Room - Breckenridge, CO","value":667,"showCount":1},{"label":"Tennessee Theatre - Knoxville, TN","value":669,"showCount":1},{"label":"Theatre de Verdure - Nice, France","value":672,"showCount":1},{"label":"Times Union Center - Albany, NY","value":679,"showCount":11},{"label":"Townshend Family Park - Townshend, VT","value":684,"showCount":3},{"label":"Township Auditorium - Columbia, SC","value":685,"showCount":1},{"label":"Stadio Briamasco - Trento, Italy","value":632,"showCount":1},{"label":"Rupp Arena - Lexington, KY","value":588,"showCount":1},{"label":"Stadtpark - Hamburg, Germany","value":634,"showCount":2},{"label":"Sun Dome, University of South Florida - Tampa, FL","value":653,"showCount":1},{"label":"Theatre St. Denis - Montréal, Québec, Canada","value":673,"showCount":1},{"label":"Symphony Hall - Springfield, MA","value":660,"showCount":1},{"label":"Tanzbrunnen - Cologne, Germany","value":662,"showCount":1},{"label":"Theatre Antique - Vienne, France","value":671,"showCount":1},{"label":"Starwood Ampitheater - Antioch, TN","value":639,"showCount":4},{"label":"Sullivan Gymnasium, University of Southern Maine - Portland, ME","value":650,"showCount":1},{"label":"Royal Albert Hall - London, England","value":587,"showCount":1},{"label":"13x13 Club - Charlotte, NC","value":2,"showCount":1},{"label":"Sunrise Musical Theatre - Sunrise, FL","value":655,"showCount":1},{"label":"Trax - Charlottesville, VA","value":688,"showCount":5},{"label":"Tree Café - Portland, ME","value":689,"showCount":2},{"label":"Ross Arena, St. Michael's College - Colchester, VT","value":584,"showCount":1},{"label":"Starplex Amphitheatre - Dallas, TX","value":637,"showCount":2},{"label":"University Hall, University of Virginia - Charlottesville, VA","value":697,"showCount":1},{"label":"University of Central Florida Arena - Orlando, FL","value":698,"showCount":1},{"label":"The Upper, St. Paul's School - Concord, NH","value":703,"showCount":1},{"label":"USAir Arena - Landover, MD","value":704,"showCount":2},{"label":"Utica Memorial Auditorium - Utica, NY","value":706,"showCount":1},{"label":"Van Andel Arena - Grand Rapids, MI","value":708,"showCount":2},{"label":"Summer Pops, Embarcadero Center - San Diego, CA","value":651,"showCount":1},{"label":"Summer Stage at Sugarbush - North Fayston, VT","value":652,"showCount":3},{"label":"Verizon Wireless Arena - Manchester, NH","value":721,"showCount":1},{"label":"Vernon Downs - Vernon, NY","value":723,"showCount":1},{"label":"Waldbuhne - Northeim, Germany","value":731,"showCount":1},{"label":"The Waldorf Astoria - New York, NY","value":732,"showCount":1},{"label":"Warfield Theatre - San Francisco, CA","value":737,"showCount":6},{"label":"Waterloo Village - Stanhope, NJ","value":739,"showCount":2},{"label":"Spreckels Theatre - San Diego, CA","value":626,"showCount":2},{"label":"Tower Theatre - Upper Darby, PA","value":683,"showCount":0},{"label":"SWF3 Studios - Baden-Baden, Germany","value":659,"showCount":0},{"label":"Tipitina's - New Orleans, LA","value":680,"showCount":4},{"label":"State Palace Theatre - New Orleans, LA","value":640,"showCount":2},{"label":"University of Vermont - Burlington, VT","value":701,"showCount":4},{"label":"Star Lake Amphitheatre - Burgettstown, PA","value":635,"showCount":7},{"label":"The State Theatre - Ithaca, NY","value":642,"showCount":2},{"label":"State Theatre - Minneapolis, MN","value":643,"showCount":2},{"label":"Webster Hall, Dartmouth College - Hanover, NH","value":741,"showCount":2},{"label":"Starlight Theatre - Kansas City, MO","value":636,"showCount":2},{"label":"Wesleyan University - Middletown, CT","value":744,"showCount":1},{"label":"West Palm Beach Auditorium - West Palm Beach, FL","value":745,"showCount":1},{"label":"Wheeler Opera House - Aspen, CO","value":747,"showCount":1},{"label":"Triad Amphitheater - Salt Lake City, UT","value":690,"showCount":1},{"label":"Toyota Park - Bridgeview, IL","value":686,"showCount":2},{"label":"Valley Club Café - Rutland, VT","value":707,"showCount":1},{"label":"The Vic Theatre - Chicago, IL","value":725,"showCount":2},{"label":"War Memorial at Oncenter - Syracuse, NY","value":735,"showCount":2},{"label":"Warner Theatre - Erie, PA","value":738,"showCount":1},{"label":"University of Mississippi - Oxford, MS","value":699,"showCount":1},{"label":"E. Glenn Giltz Auditorium, SUNY-Plattsburgh - Plattsburgh, NY","value":224,"showCount":1},{"label":"Pauley Pavilion, University of California Los Angeles - Los Angeles, CA","value":515,"showCount":1},{"label":"Pritchard Gym, SB Sports Complex, SUNY Stony Brook - Stony Brook, NY","value":543,"showCount":1},{"label":"Veterans Memorial Auditorium - Columbus, OH","value":724,"showCount":1},{"label":"Virginia Beach Amphitheater - Virginia Beach, VA","value":726,"showCount":3},{"label":"Virginia Horse Center - Lexington, VA","value":727,"showCount":1},{"label":"Thomas & Mack Center - Las Vegas, NV","value":674,"showCount":10},{"label":"Vogue Theatre - Vancouver, British Columbia, Canada","value":728,"showCount":1},{"label":"Ukrainian National Home - New York, NY","value":696,"showCount":1},{"label":"U.S. Bank Arena - Cincinnati, OH","value":693,"showCount":7},{"label":"Wolf Mountain Amphitheatre - Park City, UT","value":755,"showCount":1},{"label":"1stBank Center - Broomfield, CO","value":3,"showCount":3},{"label":"23 East Caberet - Ardmore, PA","value":4,"showCount":5},
                    {"label":"320 Spear Street - Burlington, VT","value":5,"showCount":1},{"label":"Liberty Hall - Lawrence, KS","value":382,"showCount":1},{"label":"World Music Theatre - Tinley Park, IL","value":759,"showCount":3},{"label":"Worthy Farm - Somerset, England","value":760,"showCount":1},{"label":"WOW Hall - Eugene, OR","value":761,"showCount":1},{"label":"Ventura County Fairgrounds - Ventura, CA","value":713,"showCount":2},{"label":"Ventura Theatre - Ventura, CA","value":714,"showCount":1},{"label":"8x10 Club - Baltimore, MD","value":8,"showCount":2},{"label":"Assembly Hall, University of Illinois - Champaign, IL","value":49,"showCount":3},{"label":"Big Cypress Seminole Indian Reservation - Big Cypress, FL","value":85,"showCount":3},{"label":"Flood Zone - Richmond, VA","value":263,"showCount":2},{"label":"Loreley - St. Goarshausen, Koblenz, Germany","value":393,"showCount":1},{"label":"New Haven Veterans Memorial Coliseum - New Haven, CT","value":469,"showCount":3},{"label":"Wendell Studios - Boston, MA","value":743,"showCount":1},{"label":"Providence Performing Arts Center - Providence, RI","value":547,"showCount":1},{"label":"Purple Dragon Recording Studios - Atlanta, GA","value":551,"showCount":1},{"label":"Pyramid Arena - Memphis, TN","value":552,"showCount":1},{"label":"Quigley's, University of Colorado - Boulder, CO","value":554,"showCount":1},{"label":"Chameleon Club - Lancaster, PA","value":137,"showCount":1},{"label":"Providence Civic Center - Providence, RI","value":546,"showCount":6},{"label":"Bryce Jordan Center, Penn State University - State College, PA","value":113,"showCount":2},{"label":"Verizon Wireless Amphitheater - Irvine, CA","value":717,"showCount":2},{"label":"Will Rogers Auditorium - Fort Worth, TX","value":749,"showCount":1},{"label":"The Wiltern Theatre - Los Angeles, CA","value":751,"showCount":1},{"label":"IU Auditorium, Indiana University - Bloomington, IN","value":511,"showCount":1},{"label":"The Wetlands Preserve - New York, NY","value":746,"showCount":6},{"label":"Watkins Glen International - Watkins Glen, NY","value":740,"showCount":8},{"label":"Withey Hall Dining Room, Green Mountain College - Poultney, VT","value":753,"showCount":1},{"label":"The Clarke Memorial Fountain, Notre Dame University - Notre Dame, IN","value":153,"showCount":1},{"label":"The Gathering Place, Northwestern University - Evanston, IL","value":275,"showCount":1},{"label":"Loring Commerce Center at Loring Air Force Base - Limestone, ME","value":394,"showCount":8},{"label":"Hurricane Festival - Scheessel, Germany","value":327,"showCount":1},{"label":"Chaifetz Arena, Saint Louis University - St. Louis, MO","value":136,"showCount":1},{"label":"Radio City Music Hall - New York, NY","value":555,"showCount":2},{"label":"Ramskeller, Colorado State University - Fort Collins, CO","value":556,"showCount":1},{"label":"The Ranch - South Burlington, VT","value":557,"showCount":3},{"label":"Redwood Acres Fairgrounds - Eureka, CA","value":567,"showCount":1},{"label":"Ritz Theatre - Tampa, FL","value":573,"showCount":2},{"label":"The Sting - New Britain, CT","value":645,"showCount":2},{"label":"Variety Arts Center - Los Angeles, CA","value":710,"showCount":1},{"label":"Wachovia Center - Philadelphia, PA","value":729,"showCount":2},{"label":"Zepp - Koto-ku, Tokyo, Japan","value":764,"showCount":2},{"label":"Achilles Rink, Union College - Schenectady, NY","value":12,"showCount":1},{"label":"Recreation Hall, Penn State University - State College, PA","value":561,"showCount":1},{"label":"Zilker Park - Austin, TX","value":766,"showCount":1},{"label":"William Randolph Hearst Greek Theatre - Berkeley, CA","value":750,"showCount":4},{"label":"Aiko's - Saratoga Springs, NY","value":18,"showCount":1},{"label":"Alumni Hall, Brown University - Providence, RI","value":29,"showCount":1},{"label":"Asheville Civic Center - Asheville, NC","value":47,"showCount":1},{"label":"The Chance - Poughkeepsie, NY","value":139,"showCount":3},{"label":"CSU Convocation Center - Cleveland, OH","value":191,"showCount":3},
                    {"label":"Band Shell, University of Florida - Gainesville, FL","value":62,"showCount":1},{"label":"Adams Fieldhouse, University of Montana - Missoula, MT","value":14,"showCount":1},{"label":"Recreation Hall, University of California, Davis - Davis, CA","value":562,"showCount":1},{"label":"Student Union Ballroom, University of Massachusetts - Amherst, MA","value":648,"showCount":2},{"label":"Bender Arena, American University - Washington, DC","value":75,"showCount":1},{"label":"UCSB Events Center, University of California, Santa Barbara - Goleta, CA","value":694,"showCount":1},{"label":"Civic Center Arena - St. Paul, MN","value":151,"showCount":1},{"label":"Compton Terrace Amphitheater - Chandler, AZ","value":173,"showCount":1},{"label":"Varsity Gym, Appalachian State University - Boone, NC","value":712,"showCount":1},{"label":"Food Court, Mont Alto Campus, Penn State University - Mont Alto, PA","value":267,"showCount":1},{"label":"Field House, Montana State University - Bozeman, MT","value":246,"showCount":1},{"label":"Pumpehuset - Copenhagen, Denmark","value":550,"showCount":1},{"label":"The Rave - Milwaukee, WI","value":559,"showCount":1},{"label":"Resi - Nüremberg, Germany","value":568,"showCount":1},{"label":"The Riviera Theatre - North Tonawanda, NY","value":576,"showCount":1},{"label":"Rosemont Horizon - Rosemont, IL","value":582,"showCount":5},{"label":"Reynolds Coliseum - Raleigh, NC","value":569,"showCount":1},{"label":"The Rink - Buffalo, NY","value":572,"showCount":1},{"label":"Riverport Amphitheater - Maryland Heights, MO","value":575,"showCount":4},{"label":"Dining Center, Haverford College - Haverford, PA","value":208,"showCount":1},{"label":"East Gym, Humboldt State University - Arcata, CA","value":228,"showCount":1},{"label":"Rick's Café - Ann Arbor, MI","value":571,"showCount":1},{"label":"Silva Concert Hall, Hult Center for the Performing Arts - Eugene, OR","value":608,"showCount":1},{"label":"The Red Barn, Hampshire College - Amherst, MA","value":564,"showCount":1},{"label":"Red Rocks Amphitheatre - Morrison, CO","value":565,"showCount":13},{"label":"Roseland Ballroom - New York, NY","value":580,"showCount":4},{"label":"Ziggy's - Winston-Salem, NC","value":765,"showCount":2},{"label":"The Great Hall, University of Wisconsin - Madison, WI","value":289,"showCount":1},{"label":"KFOG Fantasy Studios - Berkeley, CA","value":357,"showCount":1},{"label":"Murphy Center, Middle Tennessee State University - Murfreesboro, TN","value":456,"showCount":1},{"label":"Newport State Airport - Coventry, VT","value":472,"showCount":3},{"label":"Northfield/Mt. Hermon School Gymnasium - Northfield, MA","value":482,"showCount":1},{"label":"Skidmore Gymnasium, Skidmore College - Saratoga Springs, NY","value":609,"showCount":1},{"label":"Page Commons Room, Student Center, Colby College - Waterville, ME","value":501,"showCount":1},{"label":"Thompson-Boling Arena - Knoxville, TN","value":676,"showCount":1},{"label":"Stowe Performing Arts Center - Stowe, VT","value":646,"showCount":2},{"label":"Cricket Wireless Amphitheater - Bonner Springs, KS","value":718,"showCount":4},{"label":"Wing's Stadium - Kalamazoo, MI","value":752,"showCount":1},{"label":"Redbird Arena, Illinois State University - Normal, IL","value":566,"showCount":1},{"label":"Aragon Entertainment Center - Chicago, IL","value":37,"showCount":1},{"label":"Bethel Woods Center for the Arts - Bethel, NY","value":80,"showCount":4},{"label":"Doctor Music Festival - Catalonia, Spain","value":213,"showCount":1},{"label":"The Cameo Theatre - Miami Beach, FL","value":120,"showCount":1},{"label":"The Delta Center - Salt Lake City, UT","value":204,"showCount":1},{"label":"Fly Me to the Moon Saloon - Telluride, CO","value":265,"showCount":2},
                    {"label":"Gothic Theatre - Englewood, CO","value":285,"showCount":2},{"label":"Memorial Auditorium Basement - Burlington, VT","value":427,"showCount":1},{"label":"Stabler Arena, Lehigh University - Bethlehem, PA","value":630,"showCount":1},{"label":"Michigan State University Union Ballroom - East Lansing, MI","value":436,"showCount":1},{"label":"Atlanta Civic Center - Atlanta, GA","value":50,"showCount":1},{"label":"The Bayou - Washington, DC","value":72,"showCount":6},{"label":"Beecher Hill Farm - Hinesburg, VT","value":74,"showCount":1},{"label":"Field House, University of New Hampshire - Durham, NH","value":247,"showCount":4},{"label":"The Grey Hall - Freetown Christiana, Copenhagen, Denmark","value":297,"showCount":3},{"label":"Montezuma Hall, San Diego State University - San Diego, CA","value":445,"showCount":1},{"label":"Huxleys Neue Welt - Berlin, Germany","value":328,"showCount":1},{"label":"Jesse Auditorium, University of Missouri - Columbia, MO","value":342,"showCount":1},{"label":"Lowell Memorial Auditorium - Lowell, MA","value":399,"showCount":1},{"label":"Mission Park Dining Hall, Williams College - Williamstown, MA","value":441,"showCount":1},{"label":"The Music Hall - Portsmouth, NH","value":458,"showCount":5},{"label":"Roskilde Festival - Roskilde, Denmark","value":583,"showCount":2},{"label":"Soldiers and Sailors Memorial Auditorium - Chattanooga, TN","value":613,"showCount":1},{"label":"Spartanburg Memorial Auditorium - Spartanburg, SC","value":619,"showCount":1},{"label":"Alpha Delta Phi Fraternity, Trinity College - Hartford, CT","value":23,"showCount":1},{"label":"Hartman Union Activities Center, Plymouth State University - Plymouth, NH","value":308,"showCount":1},{"label":"The Filene Center at Wolf Trap - Vienna, VA","value":248,"showCount":1},{"label":"Living and Learning Center, University of Vermont - Burlington, VT","value":386,"showCount":2},{"label":"Riverbend Music Center - Cincinnati, OH","value":574,"showCount":3},{"label":"Main Stage, New Orleans Fairgrounds - New Orleans, LA","value":410,"showCount":2},{"label":"The Edge Night Club - Orlando, FL","value":232,"showCount":3},{"label":"UIC Pavilion, University of Illinois - Chicago, IL","value":695,"showCount":8},{"label":"Bonnaroo Music & Arts Festival - Manchester, TN","value":100,"showCount":3},{"label":"Walnut Creek Amphitheater - Raleigh, NC","value":733,"showCount":9},{"label":"Darien Lake Performing Arts Center - Darien Center, NY","value":199,"showCount":5},{"label":"La Marna - Sesto Calende, Italy","value":368,"showCount":1},{"label":"Parco Aquatica - Milan, Italy","value":510,"showCount":1},{"label":"Pickle Barrel Pub - Killington, VT","value":527,"showCount":1},{"label":"Spokane Opera House - Spokane, WA","value":623,"showCount":1},{"label":"Teatro Olimpico - Rome, Italy","value":664,"showCount":1},{"label":"USANA Amphitheatre - West Valley City, UT","value":705,"showCount":1},{"label":"PH Live - Las Vegas, NV","value":19,"showCount":1},{"label":"Water Street Music Hall - Rochester, NY","value":736,"showCount":1},{"label":"Campus Pond, UMass Spring Concert, University of Massachusetts - Amherst, MA","value":122,"showCount":1},{"label":"Cochran Lounge, Student Union, Macalester College - St. Paul, MN","value":162,"showCount":1},{"label":"Poplar Creek Music Center - Hoffman Estates, IL","value":536,"showCount":1},{"label":"Cynthia Woods Mitchell Pavilion - The Woodlands, TX","value":196,"showCount":2},
                    {"label":"McCullough Student Center, Middlebury College - Middlebury, VT","value":421,"showCount":1},{"label":"Galliard Auditorium - Charleston, SC","value":273,"showCount":1},{"label":"Johnson State College - Johnson, VT","value":347,"showCount":1},{"label":"NBC Studios, New York - New York, NY","value":465,"showCount":5},{"label":"O'Connell Center, University of Florida - Gainesville, FL","value":484,"showCount":2},{"label":"Auditorium Theatre - Rochester, NY","value":52,"showCount":1},{"label":"Teatro Smeraldo - Milan, Italy","value":665,"showCount":1},{"label":"Santa Cruz Civic Auditorium - Santa Cruz, CA","value":596,"showCount":1},{"label":"Berkeley Square Theatre - Berkeley, CA","value":77,"showCount":1},{"label":"The Cotton Club - Atlanta, GA","value":186,"showCount":1},{"label":"Masquerade Music Park - Atlanta, GA","value":418,"showCount":1},{"label":"Hilton Ballroom - Eugene, OR","value":319,"showCount":2},{"label":"Dane County Exposition Center - Madison, WI","value":198,"showCount":1},{"label":"The Living Room - Providence, RI","value":387,"showCount":4},{"label":"DeVos Hall - Grand Rapids, MI","value":206,"showCount":1},{"label":"The Roma - Telluride, CO","value":579,"showCount":3},{"label":"Seattle Center Arena - Seattle, WA","value":601,"showCount":2},{"label":"Rogers Arena - Vancouver, British Columbia, Canada","value":281,"showCount":1},{"label":"86th Street Music Hall - Vancouver, British Columbia, Canada","value":7,"showCount":1},{"label":"Commodore Ballroom - Vancouver, British Columbia, Canada","value":172,"showCount":1},{"label":"Saltair Pavilion - Salt Lake City, UT","value":775,"showCount":1},{"label":"Wilbur Field, Stanford University - Palo Alto, CA","value":776,"showCount":1},{"label":"Toad's Place - New Haven, CT","value":681,"showCount":2},{"label":"Woodbury Ski & Racquet Club - Woodbury, CT","value":779,"showCount":1},{"label":"State Theater - Kalamazoo, MI","value":641,"showCount":2},{"label":"Bob Carpenter Center, University of Delaware - Newark, DE","value":96,"showCount":2},{"label":"Cotterell Court, Reid Athletic Center, Colgate University - Hamilton, NY","value":185,"showCount":1},{"label":"Beta Intramural Hockey Team Party, Denison University - Granville, OH","value":79,"showCount":1},{"label":"Le Transbordeur - Lyon/Villeurbanne, France","value":769,"showCount":1},{"label":"Tenax - Florence, Italy","value":770,"showCount":1},{"label":"The Spectrum - Toronto, Ontario, Canada","value":620,"showCount":1},{"label":"The Spectrum - Philadelphia, PA","value":730,"showCount":9},{"label":"Pacific Coliseum - Vancouver, British Columbia, Canada","value":771,"showCount":1},{"label":"Cruzan Amphitheatre - West Palm Beach, FL","value":772,"showCount":1},{"label":"Vanderbilt University Memorial Gym - Nashville, TN","value":774,"showCount":1},{"label":"Hill Auditorium, University of Michigan - Ann Arbor, MI","value":773,"showCount":1},{"label":"Larrabee Farm, a.k.a. Amy’s Farm - Auburn, ME","value":777,"showCount":1},{"label":"Herman's Hideaway - Denver, CO","value":778,"showCount":1},{"label":"Lawrence Joel Veterans Memorial Coliseum - Winston-Salem, NC","value":373,"showCount":3},{"label":"The Front - Burlington, VT","value":271,"showCount":25},{"label":"Santander Arena - Reading, PA","value":785,"showCount":1},{"label":"LKA-Longhorn - Stuttgart, Germany","value":786,"showCount":1},{"label":"Zeleste - Barcelona, Spain","value":763,"showCount":3},{"label":"Haybarn Theater, Goddard College - Plainfield, VT","value":780,"showCount":1},{"label":"Darling's Waterfront Pavilion - Bangor, ME","value":767,"showCount":1},{"label":"Lake Tahoe Outdoor Arena at Harveys - Stateline, NV","value":370,"showCount":4},{"label":"The Flynn Theatre - Burlington, VT","value":266,"showCount":4},{"label":"Fox Theatre - St. Louis, MO","value":787,"showCount":2},{"label":"Fox Theatre - Atlanta, GA","value":788,"showCount":3},{"label":"Susquehanna Bank Center - Camden, NJ","value":692,"showCount":10},{"label":"Charleston Municipal Auditorium - Charleston, WV","value":783,"showCount":0},{"label":"Molson Canadian Amphitheatre - Toronto, Ontario, Canada","value":444,"showCount":3},{"label":"Klipsch Music Center - Noblesville, IN","value":722,"showCount":23},{"label":"The Mann Center for the Performing Arts - Philadelphia, PA","value":411,"showCount":10},{"label":"Gorge Amphitheatre - George, WA","value":284,"showCount":16},{"label":"Nectar's - Burlington, VT","value":467,"showCount":22},{"label":"PNC Bank Arts Center - Holmdel, NJ","value":533,"showCount":9},{"label":"Matthew Knight Arena - Eugene, OR","value":798,"showCount":1},{"label":"Civic Center - Des Moines, IA","value":789,"showCount":1},
                    {"label":"State Theatre - New Brunswick, NJ","value":790,"showCount":1},{"label":"Beacon Theatre - New York, NY","value":73,"showCount":3},{"label":"PNC Music Pavilion - Charlotte, NC","value":719,"showCount":6},{"label":"The Orpheum - Vancouver, British Columbia Canada","value":795,"showCount":1},{"label":"Municipal Auditorium - Charleston, WV","value":791,"showCount":1},{"label":"Merriweather Post Pavillion - Columbia, MD","value":432,"showCount":14},{"label":"Amphitheater at the Wharf - Orange Beach, AL US","value":794,"showCount":1},{"label":"DTE Energy Music Theater - Clarkston, MI","value":219,"showCount":2},{"label":"Palace Theatre - New Haven, CT","value":797,"showCount":0},{"label":"Municipal Auditorium - Kansas City, MO","value":784,"showCount":0},{"label":"Orpheum Theatre - Boston, MA","value":796,"showCount":1},{"label":"Santa Barbara County Bowl - Santa Barbara, CA","value":799,"showCount":2},{"label":"Palace Theatre - Albany, NY","value":801,"showCount":3},{"label":"CMAC - Canandaigua, NY","value":253,"showCount":6},{"label":"Tower Theater - Houston, TX","value":802,"showCount":2},{"label":"Randall's Island - New York, NY","value":792,"showCount":4},{"label":"Les Schwab Amphitheatre - Bend, OR","value":803,"showCount":2},{"label":"Austin360 Amphitheatre - Austin, TX","value":805,"showCount":1},{"label":"Tuscaloosa Amphitheater - Tuscaloosa, AL","value":806,"showCount":1},{"label":"Blossom Music Center - Cuyahoga Falls, OH","value":89,"showCount":6},{"label":"Britt Ballroom, Southern Oregon State College - Ashland, OR","value":808,"showCount":1},{"label":"Civic Auditorium - Santa Monica, CA","value":809,"showCount":0},{"label":"Wrigley Field - Chicago, IL","value":812,"showCount":2},{"label":"Dick's Sporting Goods Park - Commerce City, CO","value":207,"showCount":21},{"label":"The Strand Theater - Dorchester, MA","value":647,"showCount":1},{"label":"Variety Playhouse - Atlanta, GA","value":711,"showCount":4},{"label":"Chestnut Cabaret - Philadelphia, PA","value":143,"showCount":1},{"label":"Civic Auditorium - Portland, OR ","value":810,"showCount":2},{"label":"Civic Auditorium - Omaha, NE","value":149,"showCount":2},{"label":"Xcel Energy Center - St. Paul, MN","value":811,"showCount":1},{"label":"Bill Graham Civic Auditorium - San Francisco, CA","value":86,"showCount":12},{"label":"The Forum - Inglewood, CA","value":290,"showCount":4},{"label":"Saratoga Performing Arts Center - Saratoga Springs, NY","value":597,"showCount":20},{"label":"Xfinity Center - Mansfield, MA","value":691,"showCount":17},{"label":"XFINITY Theatre - Hartford, CT","value":425,"showCount":6},{"label":"Lakeview Amphitheater - Syracuse, NY","value":813,"showCount":1},{"label":"Roxy Theatre - Atlanta, GA","value":586,"showCount":3},{"label":"Ed Sullivan Theater - New York, NY","value":230,"showCount":13},{"label":"Oak Ridge Farm - Arrington, VA","value":814,"showCount":2},{"label":"Jacksonville Veterans Memorial Arena - Jacksonville, FL","value":815,"showCount":1},{"label":"Ascend Amphitheater - Nashville, TN","value":807,"showCount":3},{"label":"Verizon Theatre at Grand Prairie - Grand Prairie, TX","value":804,"showCount":3},{"label":"Verizon Wireless Amphitheatre at Encore Park - Alpharetta, GA","value":720,"showCount":9},{"label":"DCU Center - Worcester, MA","value":757,"showCount":16},{"label":"Worcester Memorial Auditorium - Worcestor, MA","value":816,"showCount":1},{"label":"MGM Grand Garden Arena - Las Vegas, NV","value":800,"showCount":7},{"label":"Barcelo Maya Beach - Riviera Maya, Quintana Roo Mexico","value":817,"showCount":3},{"label":"Madison Square Garden - New York, NY","value":408,"showCount":52},{"label":"FirstMerit Bank Pavilion at Northerly Island - Chicago, IL","value":782,"showCount":8},{"label":"Huntington Bank Pavilion - Chicago, IL","value":768,"showCount":1},{"label":"Petersen Events Center - Pittsburgh, PA","value":818,"showCount":1}];