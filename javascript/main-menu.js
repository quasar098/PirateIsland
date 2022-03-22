const ipBox = document.getElementById("ip-box");
const portBox = document.getElementById('port-box');
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
            connection.send("SERVER-CHECK");
        });
        connection.onmessage = ((m) => {
            connection.close();
            if (m.data == "SERVER-VALID") {
                showUserTheError("connecting to server...");
                window.location.replace('./index.html');
            } else {
                showUserTheError("server is online, but is not a pirate island server!");
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
        localStorage.setItem("connect-ip", ipBox.value);
        localStorage.setItem("connect-port", portBox.value);
        serverIsValid(ipBox.value, portBox.value)
    }
});
