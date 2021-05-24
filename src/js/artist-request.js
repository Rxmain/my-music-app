let nameInputForm = document.querySelector('.user-search');
let form = document.querySelector('form');
//Fonction permettant l'envoi d'un formulaire en pressant la touche 'entrée' du clavier

function enterSubmit() {
    form.addEventListener('keypress', function(event) {
        event.preventDefault();
    if (event.key == 13) {
        event.preventDefault();
    }
    });
}

// form.addEventListener('submit', function (e) {
//     //prevent the normal submission of the form
//     e.preventDefault();
   
// });

const result = document.querySelector('.result-section');
const resultNumber = document.querySelector('.result-section_counter');
const userInput = document.querySelector('.user-search').value;

let spinner = document.querySelector('.spinner');
let resultSection = document.querySelector('.result-section');
let mainResult = document.querySelector('.result-section_single');
let idResult = document.querySelector('.id-single');
let artistContent = document.querySelector('.artist-name');
let titleContent = document.querySelector('.artist-single');
let artistIdSearched = "";

let showMoreDiv = document.querySelector('.more-btn');
let showMore = document.querySelector('.show-more-btn');
let offset = 0;

var handler;

let mainResultDelete;

let childCopy;
let number = 0;
let idSingle = "";
let albumId = "";

form.addEventListener('submit', function (e) {
    //prevent the normal submission of the form
    e.preventDefault();
    // console.log(nameInputForm.value); 

    const artistTitle = nameInputForm.value;
    
   
  

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
        artistIdSearched = resp.artists[0].id;

        mainResultDelete = document.querySelectorAll('.result-section_single');

         handler = function(event){
            event.preventDefault();
    
            spinner.style.display = 'block';
                    
            mainResultDelete = document.querySelectorAll('.result-section_single');
                
            setTimeout(function(){ 
                offset+=10;
                spinner.style.display = 'none';
                startSearch();
            }, 3000);
        };
        
        showMore.removeEventListener('click', handler);
        showMore.addEventListener('click', handler, true);

        for (let i = 1; i < mainResultDelete.length; i++) {
            mainResultDelete[i].remove();
        }
        offset = 0;
        startSearch();
        // showMore.style.display = "block";
        

    }), function() {
        console.log('Erreur');
    };


    function searchArtistSingle(success, error) {

        const request = new XMLHttpRequest();
        request.open('GET', 'https://musicbrainz.org/ws/2/recording?fmt=json&limit=5&offset='+offset+'&artist='+artistIdSearched+'&inc=genres');
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

    function startSearch() {

        showMoreDiv.style.display = "block";

        searchArtistSingle(function(resp) {
            resultNumber.textContent=resp["recording-count"] + " résultats";

            for (let i = 0; i < resp.recordings.length; i++) {
                
                number++;
                let newChildCopy = childCopy;
                newChildCopy = mainResult.cloneNode(true);
                let plusBtn = newChildCopy.children[4].children[0];
                let mainModal = newChildCopy.children[4].children[1];
                let modalContent = newChildCopy.children[4].children[1].firstElementChild;

                let closingCross = document.createElement('span');
                closingCross.classList.add('closing');
                modalContent.appendChild(closingCross);

                let titleModal = document.createElement('p');
                titleModal.textContent = "Artist: " + artistTitle;
                modalContent.appendChild(titleModal);

                let genreModal = document.createElement('p');
                if (resp.recordings[i].genres[0] !== undefined) {
                    genreModal.textContent = "Genre: " + resp.recordings[i].genres[0].name;
                } else {
                    genreModal.textContent = "Genre: Inconnu";
                }
                modalContent.appendChild(genreModal);

                let albumModal = document.createElement('p');
                modalContent.appendChild(albumModal);

                function timeConvert(num)
                { 
                    var hours = Math.floor(num / 60);  
                    var minutes = num % 60;
                    return hours + ":" + minutes;         
                }
                let lengthModal = document.createElement('p');
                let lengthResponse = resp.recordings[i].length;
                
                lengthModal.textContent = "Length: " + timeConvert(lengthResponse);
                modalContent.appendChild(lengthModal);

                newChildCopy.children[0].textContent = number;

                newChildCopy.children[1].textContent = artistTitle;

                newChildCopy.children[2].textContent = resp.recordings[i].title;


                closingCross.onclick = function() {
                    mainModal.style.display = "none";
                }
                
                window.onclick = function(event) {
                    if (event.target == mainModal) {
                        mainModal.style.display = "none";
                    }
                } 
    
                plusBtn.onclick = function(event) {
                    event.preventDefault();
                    mainModal.style.display = "block";
                }
                
                idSingle = resp.recordings[i].id;
                
                searchArtistAlbum(function(resp) {  

                    albumId = resp.releases[0].id;
                    // console.log(albumId);

                    if(resp.releases[0] !== undefined) {
                        newChildCopy.children[3].textContent = resp.releases[0].title;
                    } else {
                        childCopy.children[3].textContent = "Album inconnu";
                    }

                    albumModal.textContent = "Album: " + resp.releases[0].title;

                    searchArtistAlbumCover(function(resp) {
    
                        for (let i = 0; i < resp.images.length; i++) {
                            let imageAlbum = document.createElement('img');
                            imageAlbum.classList.add('image-album');
                            imageAlbum.src = resp.images[i].image;

                            modalContent.appendChild(imageAlbum);

                            // console.log(imageAlbum);
                        }
                                    
                    }), function() {
                        console.log('Erreur');
                    };    
                                
                }), function() {
                    console.log('Erreur');
                };  

                

                resultSection.appendChild(newChildCopy); 

            }
        
            }), function() {
                console.log('Erreur');
        };
    }

    function searchArtistAlbum(success, error) {

        const request = new XMLHttpRequest();
            request.open('GET', 'https://musicbrainz.org/ws/2/release?fmt=json&limit=5&offset=&recording='+idSingle+'');
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

    function searchArtistAlbumCover(success, error) {
        const request = new XMLHttpRequest();
            request.open('GET', 'http://coverartarchive.org/release/'+albumId+'/');
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
  
    
});


// const selectBoxArtist = document.querySelector('select').value = 'artist';
// const selectBoxTitle = document.querySelector('select').value = 'title';
// const selectBoxAlbum = document.querySelector('select').value = 'album';
