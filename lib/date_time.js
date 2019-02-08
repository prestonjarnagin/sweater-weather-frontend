export function parseTime(unixTime){
  let date = new Date(unixTime*1000);
  let hr = date.getHours();
  let min = "0" + date.getMinutes();
  return (hr + ':' + min.substr(-2));
}

export function parseDate(unixTime){
  return (new Date(unixTime*1000).toDateString());
}
