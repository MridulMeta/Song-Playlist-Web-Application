// Call loadPlaylist function when the page is loaded
document.addEventListener('DOMContentLoaded', loadPlaylist);

// Event listener for key up events to handle pressing Enter
document.addEventListener('keyup', handleKeyUp);

/*

add listeners to buttons

*/
document.getElementById('submit_button').addEventListener('click', getSong);

document.addEventListener('click', function(event) {
if (event.target.classList.contains('remove-button')) {
    const row = event.target.closest('tr');
    const index = Array.from(row.parentElement.children).indexOf(row);
    removeFromPlaylist(index);
    row.remove();
}
});

document.addEventListener('click', function(event) {
if (event.target.classList.contains('up-button')) {
  const row = event.target.closest('tr');
  const index = Array.from(row.parentElement.children).indexOf(row);
  moveUp(index);
}
});

document.addEventListener('click', function(event) {
if (event.target.classList.contains('down-button')) {
  const row = event.target.closest('tr');
  const index = Array.from(row.parentElement.children).indexOf(row);
  moveDown(index);
}
});
