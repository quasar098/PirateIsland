const ipBox = document.getElementById("ip-box");
const portBox = document.getElementById('port-box');
const joinButton = document.getElementById('play-button');
joinButton.addEventListener("click", () => {
    if (ipBox.value != "" && portBox.value != "") { // TODO: make a bunch of checks here
        localStorage.setItem("connect-ip", ipBox.value);
        localStorage.setItem("port-ip", ipBox.value);

        // verify that the server is online and a valid server

        window.location.replace('./index.html');
    }
});
