'use strict';

const User = require('./userModel')

module.exports = {
	createUser: function(request, response){
		let userInfo = request.body
		User.sync().then(()=>{
			return User.create(request.body)
		})
	},
	verifyUser: function(request, response){
		let userInfo = request.query;
		User.sync().then(()=>{
			User.findAll({
				where:{
					username: userInfo.username,
					password: userInfo.password
				},
			});
		}).then((userInfoObj)=>{
			response.send(userInfo.username)
		})
	}
};