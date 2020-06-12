/*
 * Get the HTML for the specific menu bar link.
 */
function getPage (filename) {
  const fileUrl = filename; // provide file location

  fetch(fileUrl)
    .then(r => r.text())
    .then(t => document.getElementById("contentArea").innerHTML = t);
}
