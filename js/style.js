document.querySelectorAll('.track').forEach(track => {
  const content = track.innerHTML;
  track.innerHTML += content + content; 
});