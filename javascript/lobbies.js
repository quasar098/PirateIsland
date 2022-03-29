const refreshButton = document.getElementById('refresh');
const lobbiesDiv = document.getElementById('listing')


function clearLobbiesList() {
    lobbiesDiv.innerHTML = '<h2 class="text">Lobbies</h2>'
    putLobbies();
}

function fetchLobbies() {
    let lobbies = [];
    return lobbies;
}

function putLobbies() {
    let lobbies = fetchLobbies;
    lobbies.forEach((lobby, index) => {
        lobbiesDiv.appendChild(makeLobbyDiv(lobby.host, lobby.playersTotal));
    });
}

function makeLobbyDiv(host, playersTotal) {
    let div = document.createElement("div");
    return 
}

refreshButton.addEventListener("click", () => {
    clearLobbiesList();
});
