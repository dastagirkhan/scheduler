export function convertMinsToHrsMins(mins){
	let h = Math.floor(mins / 60);
	let m = mins % 60;
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	return `${h}:${m}`;
}

export function convertHrsMinsToMins(hms){
      let a = hms.split(':'); // split it at the colons
      // Hours are worth 60 minutes.
      return(+a[0]) * 60 + (+a[1]);
}