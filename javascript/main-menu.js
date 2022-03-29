const ipBox = document.getElementById("ip-box");
const portBox = document.getElementById('port-box');
const usernameBox = document.getElementById('username-box');
const joinButton = document.getElementById('play-button');

const errorMessageBox = document.getElementById('error');

function showUserTheError(errorMessage) {
    errorMessageBox.style.display = "block";
    errorMessageBox.innerHTML = errorMessage;
}

function serverIsValid(ip, port) {
    {
        let connection = new WebSocket("ws://" + ip + ":" + port);

        connection.onopen = (() => {
            connection.send("!" + usernameBox.value);
        });
        connection.onmessage = ((m) => {
            connection.close();
            if (m.data == "SERVER-VALID") {
                showUserTheError("connecting to server...");
                window.location.replace('./lobbies.html');
            } else {
                showUserTheError("username taken!");
            }
        });
        connection.onerror = (() => {
            connection.close();
            showUserTheError("failed contacting server");
        })
    }
}

joinButton.addEventListener("click", () => {
    if (portBox.value != "") {
        if (ipBox.value == "") {
            ipBox.value = "127.0.0.1";
        }
        if (usernameBox.value == "") {
            usernameBox.value = "Player #" + Math.round(Math.random()*1000);
        }
        localStorage.setItem("connect-ip", ipBox.value);
        localStorage.setItem("connect-port", portBox.value);
        localStorage.setItem("username", usernameBox.value);
        serverIsValid(ipBox.value, portBox.value); // TODO: no duplicate names
    }
});
