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

function getLocalDateTime(unixTimestamp: number) {
	return unixTimestamp
		? new Date(unixTimestamp * 1000).toLocaleString()
		: new Date().toLocaleString();
}

// Function that returns the date and time in the format 'yyyy-MM-ddThh:mm:ss.SSS'
function getLocaleDateTime(unixTimestamp: number) {
	const date = new Date(unixTimestamp ? unixTimestamp * 1000 : Date.now());
	const datePart = date.toLocaleDateString('en-CA');
	const timePart = date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
	return `${datePart}T${timePart}`;
}

export { getDate, getTime, getLocaleDateTime, getLocalDateTime };
