async function login (username,password,redirectUrl) {
	var user = new UserObject(false);
	await user.login(username,password,redirectUrl)
};
