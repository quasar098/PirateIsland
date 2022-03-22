const ipBox = document.getElementById("ip-box");
const portBox = document.getElementById('port-box');
const joinButton = document.getElementById('play-button');

function showUserTheError(errorMessage) {
    // TODO: do this
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
                window.location.replace('./index.html');
            } else {
                showUserTheError("server is online, but is not a pirate island server!");
            }
        });
        connection.onerror = (() => {
            connection.close();
            showUserTheError("what the hell just happened??");
        })
    }
}

joinButton.addEventListener("click", () => {
    if (ipBox.value != "" && portBox.value != "") {
        localStorage.setItem("connect-ip", ipBox.value);
        localStorage.setItem("port-ip", ipBox.value);
        serverIsValid(ipBox.value, portBox.value)
    }
});
