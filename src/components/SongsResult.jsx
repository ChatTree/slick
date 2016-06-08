'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class SongsResult extends React.Component {
	songHandler(){
		return this.props.clicked(this.props.index)
	} 
	render(){
		return(
		<ul>
			<button onClick={this.songHandler}>Add</button>
			<li>{this.props.data}</li>
		</ul>
		)
	}
}

export default SongsResult;