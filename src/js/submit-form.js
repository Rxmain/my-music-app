const nameInput = document.querySelector('.user-search');

//Fonction permettant l'envoi d'un formulaire en pressant la touche 'entrée' du clavier

function enterSubmit() {
    document.querySelector('form').addEventListener('keypress', function(event) {
    if (event.key == 13) {
        event.preventDefault();
    }
    });
}

document.querySelector('form').addEventListener('submit', function (e) {

    //prevent the normal submission of the form
    e.preventDefault();

    // console.log(nameInput.value); 
    nameInput.value = songTitle;

    // console.log(songTitle);
   
});


