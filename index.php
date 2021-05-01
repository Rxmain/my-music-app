<?php header('Access-Control-Allow-Origin: https://musicbrainz.org/'); ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="ECF">
    <link rel="stylesheet" href="assets/css/main.min.css">
    <title>RythmiQ</title>
</head>
<body>
    <header>
        <div class="header-container">
            <div class="header_title-container">
                <h1 class='animated'>
                    <span>RythmiQ</span>
                </h1>
                <h2>Trouvez vos artistes préférés</h2>
                <a href="#main-content" class="button">Cherchez !</a>

            </div>
            <div class="music-background"></div>
           
        </div>
                   
    </header>
    <main id="main-content">
        <div class="introduction-text">
            <h2 class='animated'><span>Par ici !</span></h2>
            <p class="underline">Commencez-votre recherche</p>
            </div>
        <div class="search-form_container">
            <p class="underline">Recherchez par artiste, titre, album</p>
            <form class='search-form' action="">
                <input type="text" name='user-search' class='user-search'>
                <select name="genre" id="genre-select">
                    <option value="">Tous</option>
                    <option value="artist">Artiste</option>
                    <option value="title">Titre</option>
                    <option value="album">Album</option>
                </select>
                <input type="submit" value="Recherche" class="button">
            </form>
            <div class="result-section">
                <div class="result-section_container">
                    <p>#</p>
                    <p>Artiste</p>
                    <p>Titre</p>
                    <p>Album</p>
                    <p>Actions</p>
                </div>
                <div class="result-section_single">
                    <span class="id-single col-1"></span>
                    <span class="artist-name col-2"></span>
                    <span class="artist-single col-3"></span>
                    <div class="result-album"></div>
                </div>
                <div class="result-section_counter"></div>
                <div class="result-section_album"></div>

                
            </div>
            <div class="show-more-btn">
                <a href="" class="button show-more-btn">Show more</a>
                </div>
        </div>
    </main>
</body>
<script src="src/js/artist-request.js"></script>
</html>