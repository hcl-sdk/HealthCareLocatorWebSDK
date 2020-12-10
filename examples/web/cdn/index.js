function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
  document.querySelector(".menu").style.display = "none";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  setTimeout(() => {
    document.querySelector(".menu").style.display = "block";
  }, 500);
}

function openSettings() {
  document.querySelector('#mySidenav').classList.add('show-settings');
  document.querySelector('settings-panel').addEventListener('backPressed', closeSettings, { once: true });
}

function closeSettings() {
  document.querySelector('#mySidenav').classList.remove('show-settings');
}
