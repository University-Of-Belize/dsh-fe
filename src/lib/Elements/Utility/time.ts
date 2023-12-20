function getDate(unixTimestamp: number) {
	return unixTimestamp
		? new Date(unixTimestamp * 1000).toISOString().split('T')[0]
		: new Date().toISOString().split('T')[0];
}

function getTime(unixTimestamp: number) {
	return unixTimestamp
		? new Date(unixTimestamp * 1000).toLocaleTimeString()
		: new Date().toLocaleTimeString();
}

function getLocaleDateTime(unixTimestamp: number) {
	return unixTimestamp
		? new Date(unixTimestamp * 1000).toLocaleString()
		: new Date().toLocaleString();
}

export { getDate, getTime, getLocaleDateTime };
