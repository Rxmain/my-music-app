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
let offset = 0;


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
getIdArtist(function(resp) {

    console.log(resp);

}), function() {
    console.log('Erreur');
};


showMore.addEventListener("click",function(event){
    event.preventDefault();
    setTimeout(function(){ 
        offset+=10;
        startSearch();
    }, 5000);
});

console.log(offset);

function searchArtistSingle(success, error) {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://musicbrainz.org/ws/2/recording?fmt=json&limit=10&offset='+offset+'&artist=056e4f3e-d505-4dad-8ec1-d04f521cbb56');

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
let idSingle = "";

function startSearch() {

    searchArtistSingle(function(resp) {

        for (let i = 0; i < resp.recordings.length; i++) {
            number++;
    
            let childCopy = mainResult.cloneNode(true);
            childCopy.children[0].textContent = number;
            childCopy.children[1].textContent = artistTitle;
            childCopy.children[2].textContent = resp.recordings[i].title;
            resultSection.appendChild(childCopy);
            
            idSingle = resp.recordings[i].id;
            searchArtistAlbum(function(resp) {            
    
                if(resp.releases[0] !== undefined) {
                    childCopy.children[3].textContent = resp.releases[0].title;
                } else {
                    childCopy.children[3].textContent = "Album inconnu";
                }
                            
            }), function() {
                console.log('Erreur');
            };    
    
    
            
        }
    
        }), function() {
            console.log('Erreur');
    };
}
startSearch();


function searchArtistAlbum(success, error) {

    let albumReturn = '';
    const request = new XMLHttpRequest();
        request.open('GET', 'https://musicbrainz.org/ws/2/release?fmt=json&limit=10&offset=0&recording='+idSingle+'');
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




const selectBoxArtist = document.querySelector('select').value = 'artist';
const selectBoxTitle = document.querySelector('select').value = 'title';
const selectBoxAlbum = document.querySelector('select').value = 'album';
