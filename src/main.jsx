'use strict';
import 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import SongQueue from './components/SongQueue.jsx';
import SongPlayer from './components/SongPlayer.jsx';
import Songs from './components/Songs.jsx';
import SongSearchPopup from './components/SongSearchPopup.jsx';
import LoginBox from './components/loginBox.jsx';

const socket = io();

class Slick extends React.Component {
  constructor() {
    super();
    // initial state is an empty array
    this.state = {
      firstSong: {},
      songInfo: [],
      searchClicked: false,
      usersCount: 1,
      loggedIn:false
    };

    this.newSongClick = this.newSongClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.updateSong = this.updateSong.bind(this);
    this.handleServerPlayEvent = this.handleServerPlayEvent.bind(this);
    this.handleServerPlayCurrentSongEvent = this.handleServerPlayCurrentSongEvent.bind(this);
    this.handleServerPauseCurrentSongEvent = this.handleServerPauseCurrentSongEvent.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.searchClicked = this.searchClicked.bind(this);
    this.updateQueue = this.updateQueue.bind(this);
    this.closeSearchBox = this.closeSearchBox.bind(this);
    this.userCount = this.userCount.bind(this);
    this.loggedInHandler = this.loggedInHandler.bind(this);
  }

  newSongClick(i) {
    const songObj = this.state.songInfo[i];
    // console.log('songObj:', this.state.songInfo[i]);
    const songUrl = songObj.trackUrl;
    console.log('trackUrl in newSongClick() in main.jsx:', songObj.trackUrl);
    socket.emit('playSong', songUrl);
  }

  handleServerPlayEvent(songUrl) {
    console.log('handleServerPlayEvent called (from socket emit), now calling updateSong()');
    this.updateSong(songUrl);
  }

  updateSong(url) {
    for (var i = 0; i < this.state.songInfo.length; i++) {
      if (this.state.songInfo[i].trackUrl === url)
        break;
    }
    let arraycopy = this.state.songInfo.slice(0);
    let nextSong = arraycopy.splice(i, 1);
    console.log('updateSong called, about to set new state.firstSong');
    this.setState({
      firstSong: nextSong[0],
      songInfo: arraycopy,
    });
  }

  onPlay(e) { socket.emit('playCurrent'); }
  handleServerPlayCurrentSongEvent () { this.audio.play(); }

  onPause(e) { socket.emit('pauseCurrent'); }
  handleServerPauseCurrentSongEvent () { this.audio.pause(); }

  onEnded() {
    this.updateSong(this.state.songInfo[0].trackUrl);
  }
  //doing async request in cdm
  componentDidMount() {
    console.log("componentDidMount called!");
    //save reference to audio object in SongPlayer component
    this.audio = document.getElementsByTagName('audio')[0];

    // let that = this;
    // $.ajax({
    //   method: 'GET',
    //   url: `${this.props.hostAddress}/songQueue`,
    //   contentType: 'application/json',
    //   dataTyle: 'json',
    //   success: data => {
    //     that.setState({
    //       firstSong: data.shift(),
    //       songInfo: data
    //     });
    //   }
    // });

    // listen for emit events from the server
    console.log("we're initializing our socket listeners!");
    socket.on('playSong', this.handleServerPlayEvent);
    socket.on('playCurrent', this.handleServerPlayCurrentSongEvent);
    socket.on('pauseCurrent', this.handleServerPauseCurrentSongEvent);
    socket.on('songEnded', this.onEnded);
    socket.on('updateQueue', (songObj) => { this.updateQueue(songObj) });
    socket.on('userCount', (userCount) => { this.userCount(userCount) });
    socket.on('user disconnected', (userLeft) => {this.userCount(userLeft)});
  }

  updateQueue(songObj) {
    let songInfofo = this.state.songInfo.slice(0);
    // console.log('songInfofo is not as complicated as it sounds:', songInfofo);
    songInfofo.push(songObj);
    this.setState({
      songInfo: songInfofo
    })
  }

  clickHandler(songObj){
    socket.emit('updateQueue', songObj);
    // console.log("this is song info", this.state.songInfo)
  }

  searchClicked() {
    this.setState({
      searchClicked:true
    })
  }

  closeSearchBox() {
    this.setState({
      searchClicked:false
    })
  }

  userCount(count) {
    this.setState({
      usersCount: count
    })
  }

  usersListener(e) { socket.emit('usersCount'); }


  loggedInHandler(username){
    if(username){
      this.setState({
        loggedIn:true
      })
    }
  }

  render() {
    //songplayer gets an empty string as props before the component mounds
    let popUp = '';
    let searchBox = <button onClick={this.searchClicked} className='songSearchBtn'>search</button>
    if (this.state.searchClicked) {
      popUp = <SongSearchPopup onClicky={this.clickHandler} closeSearchBox={this.closeSearchBox}/>
      searchBox = '';
    }
    // console.log('this is state songinfo',this.state.songInfo)
    return (
      <div>
        <LoginBox loggedInHandler={this.loggedInHandler} />
        <SongPlayer
          currSong={this.state.firstSong || ''}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onEnded = {this.onEnded}/>
        <SongQueue
          songInfo={this.state.songInfo}
          handleNewSongClick={this.newSongClick}/>
        {searchBox}
        {popUp}
        <div className="userCountNum"> {this.state.usersCount} </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Slick hostAddress="http://localhost:3000"/>,
  document.getElementById('content')
)
