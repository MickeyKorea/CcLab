// let redirect_uri = ''
let redirect_uri = "http://127.0.0.1:5500/Project_B/index.html";

let client_id = "";
let client_secret = "";

let access_token = null;
let refresh_token = null;

//api endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

//get OAuth Token
function requestAuthorization(){
    client_id = "1d343529bfcf491cb4dff59b57d73eaa";
    client_secret = "5e0b0d3e507f4e75bde95e3e1ea1f7d8";
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

//from here call and use api with the OAuth Token!
const app={};

app.apiUrl = "https://api.spotify.com/v1";

//ask user to enter artist name
app.events = function() {
  $("form").on("submit",function(e) {
    e.preventDefault();
    $('.loading').toggleClass('show');
    let artists = $("input[type=artist]").val();
    // console.log(artists);
    artists = artists.split(',');
    let search = artists.map(artistName => app.searchArtist(artistName));
    // console.log(search);

    app.retreiveArtistInfo(search);

  });
}

//use spotify to get artists' Id
app.searchArtist = (artistName) => $.ajax({
    url: `${app.apiUrl}/search`,
    method: 'GET',
    dataType: 'json',
    data: {
        q: artistName,
        type: 'artist',
    },
    headers: {
        'Authorization' : 'Bearer ' + access_token
    }
});

//get album Id using the artist Ids
app.getArtistAlbums = (artistId) => $.ajax({
    url: `${app.apiUrl}/artists/${artistId}/albums`,
    method: 'GET',
    dataType: 'json',
    data:{
        include_groups: 'album'
    },
    headers: {
        'Authorization' : 'Bearer ' + access_token
    }
});

//get tracks of the album
app.getArtistTracks = (id) => $.ajax({
    url: `${app.apiUrl}/albums/${id}/tracks`,
    method: 'GET',
    dataType: 'json',
    headers: {
        'Authorization' : 'Bearer ' + access_token
    }
});

//finally, create playlist
app.createPlaylist = function(tracks) {
    $.when(...tracks)
        .then((...tracksResults) => {
            tracksResults = tracksResults.map(getFirstElement)
                .map(item => item.items)
                .reduce(flatten,[])
                .map(item => item.id)
            const randomTracks = [];
            for(let i=0; i<30; i++) {
                randomTracks.push(getRandomTrack(tracksResults));
            }
            const baseUrl = `https://open.spotify.com/?theme=white&uri=spotify:trackset:MickeyPlaylist:${randomTracks.join()}`;
            
            $('.loading').toggleClass('show');
            // $('.playlist').html(`<iframe src="${baseUrl}" height="400"></iframe>`);
        });
};

window.onSpotifyIframeApiReady = (IFrameAPI) => {
    let element = document.getElementById('embed-iframe');
    let options = {
      uri: 'spotify:episode:7makk4oTQel546B0PZlDM5'
    };
    let callback = (EmbedController) => {};
    IFrameAPI.createController(element, options, callback);
};

app.retreiveArtistInfo = function(search) {
    $.when(...search)
        .then((...results) => {
            results = results.map(getFirstElement)
                .map(res => res.artists.items[0].id)
                .map(id => app.getArtistAlbums(id));

                app.retreiveArtistTracks(results);
        });
};

app.retreiveArtistTracks = function(artistAlbums) {
    $.when(...artistAlbums)
        .then((...albums)=>{
            albumIds = albums.map(getFirstElement)
                .map(res => res.items)
                .reduce(flatten,[])
                .map(album => album.id)
                .map(ids => app.getArtistTracks(ids));
            app.createPlaylist(albumIds);
        });
};

const getFirstElement = (item) => item[0];

const flatten = (prev,curr) => [...prev,...curr];

const getRandomTrack = (trackArray) => {
    const randomNum = Math.floor(Math.random()*trackArray.length);
    return trackArray[randomNum];
}

app.init = function() {
  app.events();
};

$(app.init);