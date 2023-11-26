const url = 'https://api.themoviedb.org/3';
const api_key = 'api_key=c55b1cd24cb5bed30d81132775cd9903';
let movie_id, maxPages, keyword; //savedSelector;
let id_backdrops = 0;
let id_trailers = 0;
let alreadySearched = 0;
let sortNumber=0;
let actualPage = 1;
let navigationButtonsShows = false;
let shownActors, shownDirectors;

const buttonClick = (word, page) => {
    if (alreadySearched == 1) {
        document.getElementById('biggerDivId').remove();
        
    }
    let biggerDiv = document.createElement('div');
    biggerDiv.id = 'biggerDivId';
    appendToHtml('body', biggerDiv);
    keyword = word;
    uniqueFetch(url + '/search/movie?query=' + keyword + '&' + api_key + '&page=' + page, printFancyMovie);
};

const addMovie =() =>{
    if (alreadySearched == 1) {
        document.getElementById('biggerDivId').remove();
    }
    let biggerDiv = document.createElement('div');
    biggerDiv.id = 'biggerDivId';
    appendToHtml('body', biggerDiv);
    var newlabel = document.createElement("Label");
newlabel.setAttribute("for",'title');
newlabel.innerHTML = "podaj tytuł twojego filmu";
biggerDiv.appendChild(newlabel);
    var title = document.createElement('input');
    title.id = 'title';
    biggerDiv.appendChild(title); 
    
    var genreCount=0;
    var newlabel = document.createElement("Label");
newlabel.setAttribute("for",'rok_w');
newlabel.innerHTML = "podaj rok wydania twojego filmu";
biggerDiv.appendChild(newlabel);
    var rok_w = document.createElement('input');
    rok_w.id = 'rok_w';
    rok_w.setAttribute('type', 'date');
    biggerDiv.appendChild(rok_w);
    var newlabel = document.createElement("Label");
newlabel.setAttribute("for",'overview');
newlabel.innerHTML = "podaj opis twojego filmu";
biggerDiv.appendChild(newlabel);
    var overview = document.createElement('input');
    overview.id = 'overview';
    biggerDiv.appendChild(overview);
    var newlabel = document.createElement("Label");
newlabel.setAttribute("for",'genre');
newlabel.innerHTML = "podaj gatunki swojego filmu (+ żeby dodać więcej)";
biggerDiv.appendChild(newlabel);
var genre = document.createElement('input');
    genre.id = 'genre'+genreCount;
    biggerDiv.appendChild(genre);
    let moreGenre = document.createElement("BUTTON");
    moreGenre.innerHTML = "+";
    moreGenre.onclick= function(){
        genreCount++;
        var genre = document.createElement('input');
        genre.id = 'genre'+genreCount;
        biggerDiv.appendChild(genre);
    }
    biggerDiv.appendChild(moreGenre);
    let uploadMovie = document.createElement("BUTTON");
    uploadMovie.innerHTML = "dodaj film";
    uploadMovie.onclick = function () {
        let newTitle = document.getElementById('title').value;
        let newRok_w = document.getElementById('rok_w').value;
        let newOverview = document.getElementById('overview').value;
        let newGenres = new Array();
        for(i=0;i<=genreCount;i++){
            newGenres[i]=document.getElementById('genre'+i).value;
        }
        
    const newMovie= {
        title : newTitle, 
        rok_w : newRok_w,
        overview : newOverview,
        genres : newGenres
    }
    console.log(JSON.stringify(newMovie));
    window.localStorage.setItem("newMovie"+localStorage.length, JSON.stringify(newMovie))
    

    }
    biggerDiv.appendChild(uploadMovie);
    alreadySearched=1;
}
const delMovies=()=>{localStorage.clear();}

const showMovie=()=>{
    if (alreadySearched == 1) {
        document.getElementById('biggerDivId').remove();
    }
    let biggerDiv = document.createElement('div');
    biggerDiv.id = 'biggerDivId';
    appendToHtml('body', biggerDiv);

    for(i=0; i<localStorage.length; i++){
    let shownMovie = window.localStorage.getItem("newMovie"+(i));
    let shownMovie2= JSON.parse(shownMovie);
    let title = document.createElement('h1');
    title.textContent = 'Title: '+shownMovie2.title;
    biggerDiv.appendChild(title);
    let rok_w = document.createElement('h2');
    rok_w.textContent = 'rok wydania: '+shownMovie2.rok_w;
    biggerDiv.appendChild(rok_w);
    let overview = document.createElement('h2');
    overview.textContent = 'overview: '+shownMovie2.overview;
    biggerDiv.appendChild(overview);
    let genre = document.createElement('h2');
    genre.textContent = 'genres: '+shownMovie2.genres;
    biggerDiv.appendChild(genre);

        console.log(shownMovie2);}
    
    alreadySearched=1;
}

const sortFunction = (sortNumber2) => {
    var toSort = document.getElementById('biggerDivId').children;
    toSort = Array.prototype.slice.call(toSort, 0);
    let sorted;
    
    if(sortNumber2==sortNumber){sortNumber=sortNumber+3} else {sortNumber=sortNumber2}
    switch(sortNumber){
    case 1: sorted = toSort.sort(function (a, b) {

        if (a.Title < b.Title) {
            return -1;

        }
        if (a.Title > b.Title) {
            return 1;

        }

        return 0;
    }); break;
    case 2: sorted = toSort.sort(function (a, b) {

        if (a.Year < b.Year) {
            return -1;

        }
        if (a.Year > b.Year) {
            return 1;

        }
        console.log(a.voteAvg+" "+ b.voteAvg)
        return 0;
    }); break;
    case 3: sorted = toSort.sort(function (a, b) {

        if (a.voteAvg < b.voteAvg) {
            return -1;

        }
        if (a.voteAvg > b.voteAvg) {
            return 1;

        }
console.log(a.voteAvg+" "+ b.voteAvg)
        return 0;
    }); break;
    case 4: sorted = toSort.sort(function (a, b) {

        if (a.Title > b.Title) {
            return -1;

        }
        if (a.Title < b.Title) {
            return 1;

        }

        return 0;
    }); break;
    case 5: sorted = toSort.sort(function (a, b) {

        if (a.Year > b.Year) {
            return -1;

        }
        if (a.Year < b.Year) {
            return 1;

        }

        return 0;
    }); break;
    case 6: sorted = toSort.sort(function (a, b) {

        if (a.voteAvg > b.voteAvg) {
            return -1;

        }
        if (a.voteAvg < b.voteAvg) {
            return 1;

        }

        return 0;
    }); break;
};
    var parent = document.getElementById('biggerDivId');
    parent.innerHTML = "";

    for (var i = 0, l = toSort.length; i < l; i++) {
        parent.appendChild(sorted[i]);
    }
};



const uniqueFetch = (url, fn) => {
    fetch(url)
        .then(checkStatus)
        .then(fn)
        .catch(printError);
};

const checkStatus = (response) => {
    if (response.status == 200) {
        return response.json();
    } else {
        throw new Error('Błąd w pobieraniu danych');
    }
};

const printMovie = (json) => {
    let bigDiv = document.createElement('div');
    let moreInfoDiv = document.createElement('div');
    let title = document.createElement('h1');
    let release_date = document.createElement('h2');
    let overwiev = document.createElement('h2');
    let genre = document.createElement('h2');
    let themoviedb_link = document.createElement('a');
    let vote_average = document.createElement('h3');
    let vote_count = document.createElement('h3');
    let showMoreInfo = document.createElement('button');
    movie_id = json.id;

    bigDiv.id = 'bigDivId' + movie_id;
    moreInfoDiv.id = "more_" + movie_id;
    moreInfoDiv.style.display = "none";
    appendToHtml("div#biggerDivId", bigDiv);
    

    title.textContent = 'Title: ' + json.title;
    appendToHtml("div#bigDivId" + movie_id, title);
    bigDiv.Title = json.title;

    if (json.poster_path != null) {
        let poster = document.createElement('img');
        poster.src = 'https://image.tmdb.org/t/p/w500' + json.poster_path;
        poster.style.width = '100px';
        poster.style.height = '100px';
        appendToHtml("div#bigDivId" + movie_id, poster);
    }

    release_date.textContent = 'Release date: ' + json.release_date;
    appendToHtml("div#bigDivId" + movie_id, release_date);
    bigDiv.Year = json.release_date;
    
    showMoreInfo.innerHTML = "Show more info";
    showMoreInfo.id = "showMoreInfoButton_" + movie_id;
    setMoreInfoOnClick(showMoreInfo, movie_id);
    appendToHtml("div#bigDivId" + movie_id, showMoreInfo);
    appendToHtml("div#bigDivId" + movie_id, moreInfoDiv);

    overwiev.textContent = 'Overwiev: ' + json.overview;
    appendToHtml("div#more_" + movie_id, overwiev);

    appendToHtml("div#more_" + movie_id, genre);
    if (json.genres.length > 0) {
        genre.innerHTML += "Genres: <br>";
        for (let i = 0; i < json.genres.length; i++) {
            genre.innerHTML += '- ' + json.genres[i].name + '<br>';
        }
    }

    themoviedb_link.href = 'https://www.themoviedb.org/movie/' + movie_id;
    themoviedb_link.textContent = 'Open on themoviedb';
    appendToHtml("div#more_" + movie_id, themoviedb_link);

    vote_average.textContent = 'Average vote: ' + json.vote_average;
    appendToHtml("div#more_" + movie_id, vote_average);
    bigDiv.voteAvg = json.vote_average;

    vote_count.textContent = 'Count vote: ' + json.vote_count;
    appendToHtml("div#more_" + movie_id, vote_count);

    if (json.images.backdrops.length > 0) {
        let backdrops = document.createElement('div');
        backdrops.id = 'backdrops_' + id_backdrops;
        appendToHtml("div#more_" + movie_id, backdrops);
        for (let i = 0; i < json.images.backdrops.length; i++) {
            let backdrop = document.createElement('img');
            backdrop.src = 'https://image.tmdb.org/t/p/w500' + json.images.backdrops[i].file_path;
            backdrop.alt = 'Backdrop ' + i;
            backdrop.width = 200;
            backdrop.height = 200;
            appendToHtml('#backdrops_' + id_backdrops, backdrop);
        }
        id_backdrops++;
    }

    if (json.videos.results.length > 0) {
        let trailers = document.createElement('div');
        trailers.id = 'trailers_' + id_trailers;
        appendToHtml("div#more_" + movie_id, trailers);
        for (let i = 0; i < json.videos.results.length; i++) {
            let trailer = document.createElement('a');
            trailer.textContent = ' Open: ' + json.videos.results[i].name;
            trailer.href = 'https://www.youtube.com/watch?v=' + json.videos.results[i].key;
            appendToHtml('#trailers_' + id_trailers, trailer);
        }
        id_trailers++;
    }



    if(json.credits.cast.length > 0){
        let actors = document.createElement('div');
        actors.id = 'actors_' + movie_id;
        appendToHtml("div#more_" + movie_id, actors);
        //savedSelector = actors;
        searchActorsDirectors(json);
    }
    var rate = document.createElement('input');
    rate.id = 'rate' + movie_id;
    rate.value=0;
    rate.setAttribute('type', 'number');
    let rate2 = movie_id;
    appendToHtml("div#bigDivId" + movie_id, rate);
    let rating = document.createElement("BUTTON");
    rating.innerHTML = "oceń film";
    rating.onclick = function () {
        let ratingButton = document.getElementById('rate' + rate2);
        if (ratingButton.value > 10 || ratingButton.value <= 0 || ratingButton.value.length==0) {
            alert('ocena musi byc miedzy 0 a 10')
        }
        else{if(ratingButton.value%0.5!=0){alert('ocena musi byc podzielna przez 0.5')}
        else {
     const options = {
           method: 'POST',
           headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTViMWNkMjRjYjViZWQzMGQ4MTEzMjc3NWNkOTkwMyIsInN1YiI6IjY1NWYxM2NjN2RmZGE2MDBlMTcxZTNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aq4P4mtIi3ic52cHENEDpNkanbxZ4W8FcVUBmdvG-_o'
          },
           body: '{"value":'+ratingButton.value+'}'
           };
         
         fetch('https://api.themoviedb.org/3/movie/'+movie_id+'/rating', options)
           .then(response => response.json())
           .then(response => console.log(response))
           .catch(err => console.error(err)); 
    alert('ocena ' + ratingButton.value + ' wystawiona!')
}
}};
appendToHtml("div#bigDivId" + movie_id, rating);
    alreadySearched = 1;
    //printOnConsole(json);
};

const searchActorsDirectors = (json) => {
    shownActors = 0;
    shownDirectors = 0;
    for(let i=0; i<json.credits.cast.length; i++){
        if(json.credits.cast[i].known_for_department == "Directing" &&  shownDirectors < 5){
            console.log("Directors: "+shownDirectors+" Actors: "+shownActors+" Movie id: "+movie_id);
            printActors(json.credits.cast[i]);
            shownDirectors++;
        }
        if(json.credits.cast[i].known_for_department == "Acting" && shownActors < 5){
            console.log("Directors: "+shownDirectors+" Actors: "+shownActors+" Movie id: "+movie_id);
            printActors(json.credits.cast[i]);
            shownActors++;
        }
    }
    for(let i=0; i<json.credits.crew.length; i++){
        if(json.credits.crew[i].known_for_department == "Directing" &&  shownDirectors < 5){
            console.log("Directors: "+shownDirectors+" Actors: "+shownActors+" Movie id: "+movie_id);
            printActors(json.credits.crew[i]);
            shownDirectors++;
        }
        if(json.credits.crew[i].known_for_department == "Acting" && shownActors < 5){
            console.log("Directors: "+shownDirectors+" Actors: "+shownActors+" Movie id: "+movie_id);
            printActors(json.credits.crew[i]);
            shownActors++;
        }
    }
}

const printActors = (json_actor) =>{
    let actorImage = document.createElement('img');
    actorImage.width = 50;
    actorImage.height = 100;
    if (json_actor.known_for_department == "Acting") {
        actorImage.alt = 'name: ' + json_actor.name + '\trole: Actor';
    } else {
        actorImage.alt = 'name: ' + json_actor.name + '\trole: Director';
    }
    if(json_actor.profile_path != null){
        actorImage.src = 'https://image.tmdb.org/t/p/w500' + json_actor.profile_path; 
    }else{
        actorImage.src = 'src/images/unknown.png'; 
    }
    appendToHtml('#' + 'actors_' + movie_id, actorImage)
}

const printFancyMovie = (json) => {
    /*o    (0.25 pkt) Tytuł filmu
        o    (0.25 pkt) Zdjęcie/plakat filmu
        o    (0.25 pkt) Opis filmu
        o    (0.25 pkt) Data premiery
        o    (0.25 pkt) Wymieniony gatunek filmów
        o    (0.25 pkt) Wymienienie reżysera
        o    (0.25 pkt) Wyświetlenie głównych aktorów
        o    (0.25 pkt) Odnośnik do strony w serwisie https://www.themoviedb.org
        o    (1 pkt) Średnia ocen z tego filmu (z ilością oddanych głosów)
        o    (1 pkt) Możliwość obejrzenia galerii scen z tego filmu
        o    (1 pkt) Możliwość obejrzenia zwiastunu tego filmu
        
        https://api.themoviedb.org/3/movie/{movie_id}?append_to_response=videos,images,credits&include_image_language=en,null :
        - tytuł = title
        - plakat = poster_path
        - opis = overview
        - data premiery = release_date
        - gatunek = genres.name
        - odnośnik do strony w serwisie = https://www.themoviedb.org/movie/{movie_id}-{movie_name_to_lowwer_case}
        - oceny = vote_average and vote_count
        - sceny z filmu = backdrops(link do późniejszych zdjęć typu: https://image.tmdb.org/t/p/w1280/ngabKMnalcHzm4DvR52BW93uhS9.jpg)
        - zwiastun = videos.key (link typu: https://www.youtube.com/watch?v={key})
        
        - reżyser, gdy cast.known_for_department = "Directing"
        - aktor, gdy cast.known_for_department = "Acting"
        jeżeli człowiek jest reżyserem/aktorem zapisujemy jego cast.id i robimy fetcha https://api.themoviedb.org/3/person/{person_id}?append_to_response=images
        pobieramy szerokość z images.profiles.width
        */
    maxPages = json.total_pages;
    for (let i = 0; i < json.results.length; i++) {
        movie_id = json.results[i].id;
        uniqueFetch(url + '/movie/' + movie_id + '?append_to_response=videos,images,credits&include_image_language=en,null&' + api_key, printMovie);
    }
    if (!navigationButtonsShows) {
        let previousPageButton = document.createElement('button');
        previousPageButton.onclick = printPreviousPage;
        previousPageButton.textContent = "<=";
        previousPageButton.style.width = "50px";
        previousPageButton.style.height = "25px";
        appendToHtml("div#navigationButtons", previousPageButton);

        let nextPageButton = document.createElement('button');
        nextPageButton.onclick = printNextPage;
        nextPageButton.textContent = "=>";
        nextPageButton.style.width = "50px";
        nextPageButton.style.height = "25px";
        appendToHtml("div#navigationButtons", nextPageButton);
        navigationButtonsShows = true;
    }
};

const printError = (error) => {
    console.error('Wystąpił błąd:', error);
};

const appendToHtml = (selector, element) => {
    document.querySelector(selector).appendChild(element);
};

const printNextPage = () => {
    if (actualPage < maxPages) {
        actualPage++;
        buttonClick(keyword, actualPage);
    }
};

const printPreviousPage = () => {
    if (actualPage > 1) {
        actualPage--;
        buttonClick(keyword, actualPage);
    }
};

const setMoreInfoOnClick = (button, movieId) => {
    button.onclick = () => {
        let moreDiv = document.getElementById('more_' + movieId);
        let moreInfoButton = document.getElementById("showMoreInfoButton_" + movieId);
        if (moreDiv.style.display == "block") {
            moreDiv.style.display = "none";
            moreInfoButton.innerHTML = "Show more info";
        } else {
            moreDiv.style.display = "block";
            moreInfoButton.innerHTML = "Hide more info";
        }
    }
};

const printOnConsole = (json) => {
    console.log(json);
    console.log(
        'Title: ' + json.title + '\n' +
        'Poster: href: https://image.tmdb.org/t/p/w500' + json.poster_path + '\n' +
        'Overwiev: ' + json.overview + '\n' +
        'Release date: ' + json.release_date + '\n' +
        'Genre: ' + json.genres + '\n' +
        'themoviedb link: https://www.themoviedb.org/movie/' + movie_id + '\n' +
        'Vote avg: ' + json.vote_average + '\n' +
        'Vote count: ' + json.vote_count + '\n' +
        'Backdrops: ' + json.images.backdrops + '\n'
    );
    if (json.videos.results.length > 0) {
        for (let i = 0; i < json.videos.results.length; i++) {
            console.log(
                json.videos.results[i].name + ': https://www.youtube.com/watch?v=' + json.videos.results[i].key + '\n'
            );
        }
    }
};