import React from 'react';

const styles = {
  searchBox: {
    border: '1px black solid',
    backgroundColor: 'white',
    width: '50%',
    height: '50%',
    left: '25%',
    top: '25%',
    display: 'block',
    position: 'absolute',
    padding: '10px',
  },
};

class SearchBox extends React.Component {
  constructor() {
    super();

    this.state = {
      firstSong: {},
      songInfo: [],
    };
  }

  componentDidMount() {
    SC.initialize({
      client_id: 'c3a6a7d9251cca666d47267c16038fa1'
    });

    // q is the general search query
    SC.get('/tracks', {
      q: 'panda',
    }).then(function(tracks) {
      console.log(tracks);
    });
  }
  render() {
    return (
      <div className="searchBox" style={styles.searchBox}>

      </div>
    );
  }
}

export default SearchBox;
