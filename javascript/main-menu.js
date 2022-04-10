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
                window.location.replace('./index.html');
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

function isValidName(name) {
	if (name.length < 3) {
		return "Name must be at least 3 letters long";
	}
	if (name == "%server%") {
		return "quand je tends la main j'ai peur de l'accepter";
	}
	if (name.includes("%")) {
		return "no % signs";
	}
	if (name.includes("{")) {
		return "no curly brackets!";
	}
	return "";
}

joinButton.addEventListener("click", () => {
    if (portBox.value != "") {
        if (ipBox.value == "") {
            ipBox.value = "127.0.0.1";
        }
        if (usernameBox.value == "") {
            usernameBox.value = "Player #" + Math.round(Math.random()*1000);
        }
		if (isValidName(usernameBox.value).length > 0) {
			showUserTheError(isValidName(name)); // probably should not use the function twice
			return;
		}
        localStorage.setItem("connect-ip", ipBox.value);
        localStorage.setItem("connect-port", portBox.value);
        localStorage.setItem("username", usernameBox.value);
        serverIsValid(ipBox.value, portBox.value); // TODO: no duplicate names
    }
});
