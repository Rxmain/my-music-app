let nameInputForm = document.querySelector('.user-search');
let form = document.querySelector('form');
const result = document.querySelector('.result-section');
const resultNumber = document.querySelector('.result-section_counter');
const userInput = document.querySelector('.user-search').value;

const select = document.querySelector('select');
const selectBoxArtist = document.querySelector('select').value = 'artist';
const selectBoxTitle = document.querySelector('select').value = 'title';
const selectBoxAlbum = document.querySelector('select').value = 'album';

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

//Fonction permettant l'envoi d'un formulaire en pressant la touche 'entrée' du clavier

function enterSubmit() {
    form.addEventListener('keypress', function(event) {
        event.preventDefault();
    if (event.key == 13) {
        event.preventDefault();
    }
    });
}


//Recherche en fonction de la dropdown

form.addEventListener('submit', function(e) {
    number = 0;
    e.preventDefault();
    showMore.removeEventListener('click', handler, true);

    if(select.value === "album") {
        searchByAlbum();
    }else if(select.value === 'title') {
        searchByTitle()
    }else if(select.value === 'artist') {
        searchByArtist();
    }
});


// Recherche par artistes
function searchByArtist() {

    let artistTitle = nameInputForm.value;

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
        offset = 0;

        mainResultDelete = document.querySelectorAll('.result-section_single');

        function handler(event){
            event.preventDefault();
            event.stopPropagation();
    
            spinner.style.display = 'block';
                    
            mainResultDelete = document.querySelectorAll('.result-section_single');

            setTimeout(function(){ 
                offset = offset+5;
                spinner.style.display = 'none';
                startSearch();
            }, 5000);
        };
        showMore.removeEventListener('click', handler, true);
        showMore.addEventListener('click', handler, true);



        for (let i = 1; i < mainResultDelete.length; i++) {
            mainResultDelete[i].remove();
        }
        startSearch();        

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
                    var minutes = Math.floor(num / 60000);
                    var seconds = ((num % 60000) / 1000).toFixed(0);
                    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;     
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

                    albumId = resp.releases[0];

                    if(albumId == null) {
                        newChildCopy.children[3].textContent = "Album inconnu";
                    } else {
                        albumId = resp.releases[0].id;
                        newChildCopy.children[3].textContent = resp.releases[0].title;
                        albumModal.textContent = "Album: " + resp.releases[0].title;
                    }


                    searchArtistAlbumCover(function(resp) {
    
                        for (let i = 0; i < resp.images.length; i++) {
                            let imageAlbum = document.createElement('img');
                            imageAlbum.classList.add('image-album');
                            imageAlbum.src = resp.images[i].image;

                            modalContent.appendChild(imageAlbum);
                        }
                                    
                    });
                                
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

    function searchArtistAlbumCover(success) {
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
                        console.log('Couverture d\'album manquante');
                    }
                }
            });
            request.send();
    }
}

// Recherche par titre
function searchByTitle() {


    const artistTitle = nameInputForm.value;
    

    function getTitleSong(success, error) {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://musicbrainz.org/ws/2/recording/?query=recording:"'+ artistTitle + '"');
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
    getTitleSong(function(resp) {
    

        mainResultDelete = document.querySelectorAll('.result-section_single');

         handler = function(event){
            event.preventDefault();
    
            spinner.style.display = 'block';
                    
            mainResultDelete = document.querySelectorAll('.result-section_single');
                
            setTimeout(function(){ 
                offset = offset + 10;
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

    function startSearch() {

        showMoreDiv.style.display = "block";

        getTitleSong(function(resp) {
            resultNumber.textContent=resp.count+ " résultats";

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
                titleModal.textContent = "Titre: " + artistTitle;
                modalContent.appendChild(titleModal);

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

                newChildCopy.children[1].textContent = resp.recordings[i]['artist-credit'][0].name;

                newChildCopy.children[2].textContent = resp.recordings[i].title;

                albumId = resp.recordings[i].releases[0];

                if(albumId == null) {
                    newChildCopy.children[3].textContent = "Album inconnu";
                } else {
                    albumId = resp.recordings[i].releases[0];
                    newChildCopy.children[3].textContent = resp.recordings[i].releases[0].title;
                    albumModal.textContent = "Album: " + resp.recordings[i].releases[0].title;
                }



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
                albumId = resp.recordings[i].releases[0].id;
                    albumModal.textContent = "Album: " + resp.recordings[i].releases[0].title;

                    searchArtistAlbumCover(function(resp) {
    
                        for (let i = 0; i < resp.images.length; i++) {
                            let imageAlbum = document.createElement('img');
                            imageAlbum.classList.add('image-album');
                            imageAlbum.src = resp.images[i].image;

                            modalContent.appendChild(imageAlbum);
                        }
                                    
                    }), function() {
                        console.log('Erreur');
                    };    
                                
                resultSection.appendChild(newChildCopy); 

            }
        
            }), function() {
                console.log('Erreur');
        };
    }
    function searchArtistAlbumCover(success, error) {
        const request = new XMLHttpRequest();
            request.open('GET', 'http://coverartarchive.org/release/'+albumId+'/');
            request.setRequestHeader("Accept", "application/json");
            request.addEventListener("readystatechange", function () {
                if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
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
}

//Recherche par album

function searchByAlbum() {
    const albumTitle = nameInputForm.value;

    function getTitleSong(success, error) {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://musicbrainz.org/ws/2/release/?query=recording:"'+ albumTitle + '"');
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
    getTitleSong(function(resp) {
    

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

    }), function() {
        console.log('Erreur');
    };

    function startSearch() {

        showMoreDiv.style.display = "block";

        getTitleSong(function(resp) {
            resultNumber.textContent=resp.count+ " résultats";
            for (let i = 0; i < resp.releases.length; i++) {
                
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
                titleModal.textContent = "Titre: " + albumTitle;
                modalContent.appendChild(titleModal);

                let ratingModal = document.createElement('p');
                ratingModal.textContent = "Note: " + resp.releases[i].score + "/100";
                modalContent.appendChild(ratingModal);

                let albumModal = document.createElement('p');
                modalContent.appendChild(albumModal);

                function timeConvert(num)
                { 
                    var hours = Math.floor(num / 60);  
                    var minutes = num % 60;
                    return hours + ":" + minutes;         
                }
                let lengthModal = document.createElement('p');
                let lengthResponse = resp.releases[i].length;
                
                lengthModal.textContent = "Length: " + timeConvert(lengthResponse);
                modalContent.appendChild(lengthModal);

                newChildCopy.children[0].textContent = number;

                newChildCopy.children[1].textContent = resp.releases[i]['artist-credit'][0].name;

                newChildCopy.children[2].textContent = albumTitle;

                newChildCopy.children[3].textContent = resp.releases[i].title;

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
                
                albumId = resp.releases[i].id;

                    if(resp.releases[i] !== undefined) {
                        newChildCopy.children[3].textContent = resp.releases[i].title;
                    } else {
                        childCopy.children[3].textContent = "Album inconnu";
                    }

                    albumModal.textContent = "Album: " + resp.releases[i].title;

                    searchArtistAlbumCover(function(resp) {
    
                        for (let i = 0; i < resp.images.length; i++) {
                            let imageAlbum = document.createElement('img');
                            imageAlbum.classList.add('image-album');
                            imageAlbum.src = resp.images[i].image;

                            modalContent.appendChild(imageAlbum);
                        }
                                    
                    }), function() {
                        console.log('Erreur');
                    };    
                                
                resultSection.appendChild(newChildCopy); 

            }
        
            }), function() {
                console.log('Erreur');
        };
    }
    function searchArtistAlbumCover(success, error) {
        const request = new XMLHttpRequest();
            request.open('GET', 'http://coverartarchive.org/release/'+albumId+'/');
            request.setRequestHeader("Accept", "application/json");
            request.addEventListener("readystatechange", function () {
                if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
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
    
}