function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
  document.querySelector(".menu").style.display = "none";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.querySelector(".menu").style.display = "block";
  document.body.style.backgroundColor = "white";
}

function openSettings() {
  document.querySelector('#mySidenav').classList.add('show-settings');
  document.querySelector('settings-panel').addEventListener('backPressed', closeSettings, { once: true });
}

function closeSettings() {
  document.querySelector('#mySidenav').classList.remove('show-settings');
}
