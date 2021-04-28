// const { off } = require("gulp");

const artistTitle = 'Daft punk';
const result = document.querySelector('.result-section');
const resultNumber = document.querySelector('.result-section_counter');
const userInput = document.querySelector('.user-search').value;

let resultSection = document.querySelector('.result-section');
let mainResult = document.querySelector('.result-section_single');
let idResult = document.querySelector('.id-single');
let artistContent = document.querySelector('.artist-name');
let titleContent = document.querySelector('.artist-single');


let showMore = document.querySelector('.show-more-btn');



function getIdArtist(success, error) {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://musicbrainz.org/ws/2/artist/?query=artist:"'+ artistTitle + '"');
    request.setRequestHeader("Accept", "application/json");
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (request.status === 200) {
                // La requête a fonctionnée
                const response = JSON.parse(request.responseText);
                success(response);
            } else {
                error();
            }
        }
    });
    request.send();
}
getIdArtist(function(resp) {

    console.log(resp);

}), function() {
    console.log('Erreur');
};

function searchArtistSingle(success, error) {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://musicbrainz.org/ws/2/recording?fmt=json&limit=10&offset='+offset+'&artist=056e4f3e-d505-4dad-8ec1-d04f521cbb56');
    request.setRequestHeader("Accept", "application/json");
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (request.status === 200) {
                // La requête a fonctionnée
                const response = JSON.parse(request.responseText);
                success(response);
            } else {
                error();
            }
        }
    });
    request.send();
}
let childCopy;
let number = 0;

function searchArtistAlbum(success, error) {
    let idSingle = "";

    searchArtistSingle(function(resp) {

        for (let i = 0; i < resp.recordings.length; i++) {
            let idSingle = resp.recordings[i].id;

            number++;

            let childCopy = mainResult.cloneNode(true);
            childCopy.children[0].textContent = number;
            childCopy.children[1].textContent = artistTitle;
            childCopy.children[2].textContent = resp.recordings[i].title;
            resultSection.appendChild(childCopy);

            const request = new XMLHttpRequest();
            request.open('GET', 'https://musicbrainz.org/ws/2/release?fmt=json&limit=10&offset='+offset+'&recording='+idSingle+'');
            request.setRequestHeader("Accept", "application/json");
            request.addEventListener("readystatechange", function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    // On a reçu toute la réponse
                    if (request.status === 200) {
                        // La requête a fonctionnée
                        const response = JSON.parse(request.responseText);
                        success(response);
                    } else {
                        error();
                    }
                }
            });
            request.send();
        }
    }), function() {
        console.log('Erreur');
    };
}

let albumReturn = '';
let albumSingle = document.createElement('div');

searchArtistAlbum(function(resp) {
    console.log(resp);

    let thing = resp.releases;

    thing.forEach(function() {

        const li = document.createElement('span');
        li.className = 'album-single col-4';

        li.textContent = thing[0].title;
        document.querySelector('.result-album').appendChild(li);
    })

    resultSection.appendChild(albumSingle);
 
}), function() {
    console.log('Erreur');
};


const selectBoxArtist = document.querySelector('select').value = 'artist';
const selectBoxTitle = document.querySelector('select').value = 'title';
const selectBoxAlbum = document.querySelector('select').value = 'album';
