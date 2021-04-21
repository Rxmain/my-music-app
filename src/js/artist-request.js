const artistTitle = 'Ariana grande';
const result = document.querySelector('.result-section');
const resultNumber = document.querySelector('.result-section_counter');

// const artistBlock = document.querySelector('.artist-single');

const userInput = document.querySelector('.user-search').value;

// 056e4f3e-d505-4dad-8ec1-d04f521cbb56
https://musicbrainz.org/ws/2/release?artist=494e8d09-f85b-4543-892f-a5096aed1cd4&fmt=json&inc=release-groups
function searchArtistSingle(success, error,) {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://musicbrainz.org/ws/2/recording/?query=artist:"'+ artistTitle +'"');

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
searchArtistSingle(function(resp) {

    resultNumber.textContent = resp.count + " éléments";

    console.log(resp);

    for(let i = 0; i < resp.recordings.length; i++){


        console.log(resp.recordings[i].releases[0].title);


        console.log(i);
        const p = document.createElement('div');
        p.classList.add('result-section_single');

        const artistName = document.createElement('span');
        artistName.classList.add('artist-name');
        artistName.classList.add('col-2');
        artistName.textContent= artistTitle;

        const singleArtist = document.createElement('span');
        singleArtist.classList.add('artist-single');
        singleArtist.classList.add('col-3');
        singleArtist.textContent = resp.recordings[i].title;

        const albumArtist = document.createElement('span');
        albumArtist.classList.add('album-single');
        albumArtist.classList.add('col-4');
        albumArtist.textContent = resp.recordings[i].releases[0].title;

        const spanNumberIteration = document.createElement('span');
        spanNumberIteration.classList.add('id-single');
        spanNumberIteration.classList.add('col-1');
        spanNumberIteration.textContent = i;
        
        const resultReturnedArtist = resp.recordings[i].title;
        const resultArtist = document.createTextNode(resultReturnedArtist);

        result.appendChild(p);

        p.appendChild(spanNumberIteration);
        p.appendChild(artistName);
        p.appendChild(singleArtist);
        p.appendChild(albumArtist);

       
    }
    
    console.log(resp);

}, function() {
    console.log('Erreur');
});


const selectBoxArtist = document.querySelector('select').value = 'artist';
const selectBoxTitle = document.querySelector('select').value = 'title';
const selectBoxAlbum = document.querySelector('select').value = 'album';

// console.log(selectBoxAlbum, selectBoxArtist, selectBoxTitle);
