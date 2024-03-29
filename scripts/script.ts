const url = 'https://api.themoviedb.org/3';
const api_key = 'api_key=c55b1cd24cb5bed30d81132775cd9903';
let movie_id: number, maxPages: number, keyword: string, shownActors: number, shownDirectors: number, genre: number;
let id_backdrops: number = 0;
let id_trailers: number = 0;
let actualPage: number = 1;
let navigationButtonsShows: boolean = false;
let sortedByAlfa: number = 0;
let sortedByYear: number = 0;
let sortedByRating: number = 0;

const startProgram = (print: string, word: string, page: number) => {
    if (print == "Title") {
        buttonClick(word, page);
    } else if (print == "Genre") {
        buttonGenre(word);
    }
};

const mostPopular = () => {
    navigationButtonsShows = true;
    checkAndClearMainDiv();
    createMainDiv(true);
    createNavigationButtonDiv();
    uniqueFetch(url + '/movie/popular?' + api_key + '&page=' + actualPage, printFancyMovie);
    printAllRankings();
};

const printAllRankings = () => {
    printRanking("Rating");
    printRanking("Movie Popularity");
    printRanking("Actor Popularity");
};

const buttonClick = (word: string, page: number) => {
    checkAndClearMainDiv();
    createMainDiv(true);
    createNavigationButtonDiv();
    clearNavButtons();
    keyword = word;
    uniqueFetch(url + '/search/movie?query=' + keyword + '&' + api_key + '&page=' + page, printFancyMovie);
    printAllRankings();
};

const sort = (by: string) => {
    if (document.getElementById('mainDiv') != null) {
        let toSort = Array.prototype.slice.call(document.getElementById('mainDiv').children);
        let sorted;
        if (by == "Alfa") {
            sorted = toSort.sort((a, b) => (sortedByAlfa % 2 == 0) ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
            sortedByAlfa++;
        } else if (by == "Year") {
            sorted = toSort.sort((a, b) => (sortedByYear % 2 == 0) ? new Date(a.year) - new Date(b.year) : new Date(b.year) - new Date(a.year));
            sortedByYear++;
        } else if (by == "Rating") {
            sorted = toSort.sort((a, b) => (sortedByRating % 2 == 0) ? b.rating - a.rating : a.rating - b.rating);
            sortedByRating++;
        }
        var parent = document.getElementById('mainDiv');
        parent.innerHTML = "";
        for (var i = 0, l = toSort.length; i < l; i++) {
            parent.appendChild(sorted[i]);
        }
    }
};

const buttonGenre = (genr: string) => {
    if (document.getElementById('mainDiv') != null) {
        setGenre(genr);
        checkAndClearMainDiv();
        createMainDiv(true);
        printAllRankings();
        if(keyword != undefined){
            uniqueFetch(url + '/search/movie?query=' + keyword + '&' + api_key + '&page=' + actualPage, filtrGenre);
        }else{
            uniqueFetch(url + '/movie/popular?' + api_key + '&page=' + actualPage, filtrGenre);
        }
    }
};

const filtrGenre = (json) => {
    json.results = json.results.filter(movie => {
        return movie.genre_ids.some(g => g == genre);
    });
    //console.log(json);
    printFancyMovie(json);
};

const uniqueFetch = (url: string, fn) => {
    fetch(url)
        .then(checkStatus)
        .then(fn)
        .catch(printError);
};

const checkStatus = (response) => {
    if (response.status == 200) {
        return response.json();
    } else {
        throw new Error('Error downloading data');
    }
};

const printMovie = (json) => {
    let movieDiv = document.createElement('div');
    let themoviedb_link = document.createElement('a');

    movie_id = json.id;
    movieDiv.id = 'movieDiv' + movie_id;

    movieDiv.title = json.title;
    movieDiv.year = json.release_date;
    movieDiv.rating = json.vote_average;

    themoviedb_link.href = 'https://www.themoviedb.org/movie/' + movie_id;
    themoviedb_link.textContent = 'Open on themoviedb';
    themoviedb_link.target = "_blank";

    appendToHtml("div#mainDiv", movieDiv);
    printPoster(json.poster_path);
    createDivsWithIdAndClass('div', 'info' + movie_id, 'info', 'div#movieDiv');
    createDivsWithIdAndClass('div', 'movie' + movie_id, 'movie', 'div#info');
    createAndPrintSmth('h2', '', json.title, 'div#movie');
    createAndPrintSmth('h3', '', json.release_date, 'div#movie');
    if (json.credits.cast.length > 0 || json.credits.crew.length > 0) {
        createAndPrintSmthWithID('div', 'actors_', movie_id, 'div#movie', searchActorsDirectors, json);
    }
    createMoreInfo();
    createAndPrintSmth('h2', 'Storyline', '', 'div#more')
    createAndPrintSmth('p', '', json.overview, 'div#more');

    if (json.images.backdrops.length > 0) {
        createAndPrintSmth('h2', 'Backdrops/Posters', '', 'div#more')
        createAndPrintSmthWithID('div', 'backdrops_', id_backdrops, 'div#more', printBackdrops, json.images.backdrops);
    }

    printGenres(json.genres);
    appendToHtml("div#more" + movie_id, themoviedb_link);
    createAndPrintSmth('h3', 'Average vote:  ', json.vote_average, 'div#more');
    createAndPrintSmth('h3', 'Count vote: ', json.vote_count, 'div#more');



    if (json.videos.results.length > 0) {
        createAndPrintSmthWithID('div', 'trailers_', id_trailers, 'div#more', printTrailers, json.videos.results);
    }

    var br = document.createElement('br');
    appendToHtml("div#info" + movie_id, br);
    var rate = document.createElement('input');
    rate.id = 'rate' + movie_id;
    rate.value = 0;
    rate.setAttribute('type', 'number');
    let rate2 = movie_id;
    appendToHtml("div#info" + movie_id, rate);
    let rating = document.createElement("BUTTON");
    rating.innerHTML = "Rate the movie";
    rating.onclick = function () {
        let ratingButton = document.getElementById('rate' + rate2);
        if (ratingButton.value > 10 || ratingButton.value <= 0 || ratingButton.value.length == 0) {
            alert('Rating must be between 0 and 10')
        }
        else {
            if (ratingButton.value % 0.5 != 0) { alert('Rating must be divisible by 0.5') }
            else {
                const options = {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTViMWNkMjRjYjViZWQzMGQ4MTEzMjc3NWNkOTkwMyIsInN1YiI6IjY1NWYxM2NjN2RmZGE2MDBlMTcxZTNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aq4P4mtIi3ic52cHENEDpNkanbxZ4W8FcVUBmdvG-_o'
                    },
                    body: '{"value":' + ratingButton.value + '}'
                };

                fetch('https://api.themoviedb.org/3/movie/' + movie_id + '/rating', options)
                    .then(response => response.json())
                    .then(response => console.log(response))
                    .catch(err => console.error(err));
                alert('Rating ' + ratingButton.value + ' given!')
            }
        }
    };
    appendToHtml("div#info" + movie_id, rating);
    //printOnConsole(json);
};

const printPoster = (posterData) => {
    let posterDiv = document.createElement('div');
    posterDiv.id = "poster" + movie_id;
    posterDiv.className = "image";
    appendToHtml("div#movieDiv" + movie_id, posterDiv)
    let poster = document.createElement('img');
    if (posterData != null) {
        poster.src = 'https://image.tmdb.org/t/p/w500' + posterData;
    } else {
        poster.src = 'src/images/unknown_movie.png';
    }
    appendToHtml("div#poster" + movie_id, poster);
};

const printTrailers = (trailersData) => {
    let shownTrailers: number = 0;
    for (let i = 0; i < trailersData.length; i++) {
        let trailer = document.createElement('a');
        let br = document.createElement('br');
        trailer.textContent = ' Open: ' + trailersData[i].name;
        trailer.target = "_blank";
        trailer.href = 'https://www.youtube.com/watch?v=' + trailersData[i].key;
        appendToHtml('#trailers_' + id_trailers, trailer);
        appendToHtml('#trailers_' + id_trailers, br);
        shownTrailers++;
    }
    id_trailers++;
};

const printBackdrops = (backdropsData) => {
    for (let i = 0; i < backdropsData.length; i++) {
        let backdrop = document.createElement('img');
        backdrop.src = 'https://image.tmdb.org/t/p/w500' + backdropsData[i].file_path;
        backdrop.alt = 'Backdrop ' + i;
        backdrop.width = 100;
        backdrop.height = 56;
        appendToHtml('#more' + movie_id, backdrop);
    }
};

const printGenres = (genresData) => {
    let genre = document.createElement('p');
    let genreH2 = document.createElement('h2');
    appendToHtml("div#more" + movie_id, genreH2);
    appendToHtml("div#more" + movie_id, genre);
    if (genresData.length > 0) {
        genreH2.innerHTML = "Genres";
        for (let i = 0; i < genresData.length; i++) {
            genre.innerHTML += '- ' + genresData[i].name + '<br>';
        }
    }
};

const createMoreInfo = () => {
    let moreInfoDiv = document.createElement('div');
    let showMoreInfo = document.createElement('button');
    moreInfoDiv.id = "more" + movie_id;
    moreInfoDiv.style.display = "none";
    showMoreInfo.innerHTML = "Show more info";
    showMoreInfo.id = "showMoreInfoButton_" + movie_id;
    setMoreInfoOnClick(showMoreInfo, movie_id);
    appendToHtml("div#info" + movie_id, showMoreInfo);
    appendToHtml("div#info" + movie_id, moreInfoDiv);
};

const createAndPrintSmth = (element: string, text: string, value: string, parentId: string) => {
    let smth = document.createElement(element);
    smth.textContent = text + value;
    appendToHtml(parentId + movie_id, smth);
};

const createDivsWithIdAndClass = (element: string, id: string, clas: string, parentId: string) => {
    let smth = document.createElement(element);
    smth.id = id;
    smth.className = clas;
    appendToHtml(parentId + movie_id, smth);
};

const createAndPrintSmthWithID = (element: string, idText: string, idValue: string, parentId: string, funct, argument) => {
    let smth = document.createElement(element);
    smth.id = idText + idValue;
    appendToHtml(parentId + movie_id, smth);
    funct(argument);
};

const searchActorsDirectors = (json) => {
    shownActors = 0;
    shownDirectors = 0;
    for (let i = 0; i < json.credits.cast.length; i++) {
        if (json.credits.cast[i].known_for_department == "Directing" && shownDirectors < 5) {
            printActors(json.credits.cast[i]);
            shownDirectors++;
        }
        if (json.credits.cast[i].known_for_department == "Acting" && shownActors < 5) {
            printActors(json.credits.cast[i]);
            shownActors++;
        }
    }
    /*for(let i=0; i<json.credits.crew.length; i++){
        if(json.credits.crew[i].known_for_department == "Directing" &&  shownDirectors < 5){
            printActors(json.credits.crew[i]);
            shownDirectors++;
        }
    }*/
};

const printActors = (json_actor) => {
    let actorImage = document.createElement('img');
    actorImage.width = 66;
    actorImage.height = 100;
    if (json_actor.known_for_department == "Acting") {
        actorImage.alt = 'name: ' + json_actor.name + '\trole: Actor';
    } else {
        actorImage.alt = 'name: ' + json_actor.name + '\trole: Director';
    }
    if (json_actor.profile_path != null) {
        actorImage.src = 'https://image.tmdb.org/t/p/w500' + json_actor.profile_path;
    } else {
        actorImage.src = 'src/images/unknown.png';
    }
    appendToHtml('#actors_' + movie_id, actorImage)
};

const printRanking = (nomination: string) => {
    makeTable(nomination);
    switch (nomination) {
        case "Rating":
            uniqueFetch(url + "/movie/top_rated?" + api_key, printRankingMovieTopRated);
            break;
        case "Movie Popularity":
            uniqueFetch(url + "/movie/popular?" + api_key, printRankingMoviePopular);
            break;
        case "Actor Popularity":
            uniqueFetch(url + "/person/popular?" + api_key, printRankingActorPopular);
            break;
        default:
            console.log("Something not yes ;c");
    }
};

const printRankingMovieTopRated = (json) => {
    for (let i = 1; i <= 5; i++) {
        makeRow("rankingRating" + i, i, json.results[i - 1].title, json.results[i - 1].vote_average + "(" + json.results[i - 1].vote_count + " votes)", "rankingRating", 'td', 'https://www.themoviedb.org/movie/' + json.results[i - 1].id);
    }
};

const printRankingMoviePopular = (json) => {
    for (let i = 1; i <= 5; i++) {
        makeRow("rankingMoviePopularity" + i, i, json.results[i - 1].title, json.results[i - 1].popularity, "rankingMoviePopularity", 'td', 'https://www.themoviedb.org/movie/' + json.results[i - 1].id);
    }
};

const printRankingActorPopular = (json) => {
    for (let i = 1; i <= 5; i++) {
        makeRow("rankingActorPopularity" + i, i, json.results[i - 1].name, json.results[i - 1].popularity, "rankingActorPopularity", 'td', 'https://www.themoviedb.org/person/' + json.results[i - 1].id);
    }
};

const makeRow = (trId: string, td1Content: string, td2Content: string, td3Content: string, tableId: string, elements: string, link) => {
    let tr = document.createElement('tr');
    let td1 = document.createElement(elements);
    let td2 = document.createElement(elements);
    let td3 = document.createElement(elements);
    tr.id = trId;
    td2.id = trId;
    td1.textContent = td1Content;
    td2.textContent = td2Content;
    td3.textContent = td3Content;
    appendToHtml('table#' + tableId, tr);
    appendToHtml('tr#' + trId, td1);
    appendToHtml('tr#' + trId, td2);
    appendToHtml('tr#' + trId, td3);
    if (link != null) {
        td2.innerHTML = "";
        let themoviedbLink = document.createElement('a');
        themoviedbLink.textContent = td2Content;
        themoviedbLink.href = link;
        themoviedbLink.style.textDecoration = 'none';
        themoviedbLink.style.color = 'black';
        themoviedbLink.target = '_blank';
        appendToHtml('td#' + trId, themoviedbLink)
    }
};

const makeTable = (nomination: string) => {
    let table = document.createElement('table');
    let nominationWithoutSpaces = nomination.replace(/ /g, '');
    table.id = "ranking" + nominationWithoutSpaces;
    appendToHtml('div#ranking', table);
    if (nomination == "Actor Popularity") {
        makeRow("ranking" + nominationWithoutSpaces, "Place", "Movie", nomination, table.id, 'th', null);
    } else {
        makeRow("ranking" + nominationWithoutSpaces, "Place", "Actor", nomination, table.id, 'th', null);
    }
};

const printFancyMovie = (json) => {
    maxPages = json.total_pages;
    for (let i = 0; i < json.results.length; i++) {
        movie_id = json.results[i].id;
        uniqueFetch(url + '/movie/' + movie_id + '?append_to_response=videos,images,credits&include_image_language=en,null&' + api_key, printMovie);
    }
    if (!navigationButtonsShows) {
        let previousPageButton = document.createElement('button');
        previousPageButton.id = 'previousPageButton';
        previousPageButton.onclick = printPreviousPage;
        previousPageButton.textContent = "<=";
        previousPageButton.style.width = "50px";
        previousPageButton.style.height = "25px";
        appendToHtml("div#navigationButtons", previousPageButton);

        let nextPageButton = document.createElement('button');
        nextPageButton.onclick = printNextPage;
        nextPageButton.id = 'nextPageButton';
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
        let moreDiv = document.getElementById('more' + movieId);
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

const checkAndClearMainDiv = () => {
    if (document.getElementById('mainDiv') != null) {
        document.getElementById('mainDiv').remove();
    }
    if (document.getElementById('ranking') != null) {
        document.getElementById('ranking').remove();
    }
};

const createMainDiv = (ranking: boolean) => {
    if (ranking) {
        let rankingDiv = document.createElement('div');
        rankingDiv.id = 'ranking';
        appendToHtml('div#content', rankingDiv);
    }
    let mainDiv = document.createElement('div');
    mainDiv.id = 'mainDiv';
    appendToHtml('div#content', mainDiv);
};

const createNavigationButtonDiv = () => {
    if (document.getElementById('navigationButtons') == null) {
        let navigationButtonsDiv = document.createElement('div');
        navigationButtonsDiv.id = "navigationButtons";
        appendToHtml("div#mainDiv", navigationButtonsDiv);
    }
};

const clearNavButtons = () => {
    if (document.getElementById('nextPageButton') != null) {
        document.getElementById('previousPageButton').remove();
        document.getElementById('nextPageButton').remove();
    }
    navigationButtonsShows = false;
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

const addMovie = () => {
    checkAndClearMainDiv();
    createMainDiv(false);
    clearNavButtons();
    var title = document.createElement('input');
    title.id = 'title';
    title.placeholder = 'Give movie title';
    createBr();
    mainDiv.appendChild(title);
    createBr();
    var genreCount = 0;
    var newlabel = document.createElement("Label");
    newlabel.setAttribute("for", 'rok_w');
    newlabel.innerHTML = "Give movie release date: ";
    mainDiv.appendChild(newlabel);
    var rok_w = document.createElement('input');
    rok_w.id = 'rok_w';
    rok_w.setAttribute('type', 'date');
    mainDiv.appendChild(rok_w);
    createBr();
    var overview = document.createElement('input');
    overview.id = 'overview';
    overview.placeholder = 'Give movie overview';
    mainDiv.appendChild(overview);
    createBr();
    var genres = document.createElement('div');
    var genre = document.createElement('input');
    genre.id = 'genre' + genreCount;
    genre.placeholder = "Give movie genre";
    mainDiv.appendChild(genres);
    genres.appendChild(genre);
    let moreGenre = document.createElement("BUTTON");
    moreGenre.innerHTML = "+";
    moreGenre.onclick = function () {
        genreCount++;
        var genre = document.createElement('input');
        genre.id = 'genre' + genreCount;
        genre.placeholder = "Give movie genre";
        genres.appendChild(genre);
    }
    mainDiv.appendChild(moreGenre);
    let uploadMovie = document.createElement("BUTTON");
    uploadMovie.innerHTML = "dodaj film";
    uploadMovie.onclick = function () {
        let newTitle = document.getElementById('title').value;
        let newRok_w = document.getElementById('rok_w').value;
        let newOverview = document.getElementById('overview').value;
        if (document.getElementById('title').value.replace(/ /g, '') == "") {
            newTitle = 'unknown';
        }
        if (document.getElementById('rok_w').value.replace(/ /g, '') == "") {
            newRok_w = 'unknown';
        }
        if (document.getElementById('overview').value.replace(/ /g, '') == "") {
            newOverview = 'unknown';
        }
        let newGenres = new Array();
        let minus = 0;
        for (let i = 0; i <= genreCount; i++) {
            if (document.getElementById('genre' + i).value.replace(/ /g, '') != "") {
                newGenres[i - minus] = document.getElementById('genre' + i).value;
            } else {
                minus++;
            }
        }

        const newMovie = {
            title: newTitle,
            rok_w: newRok_w,
            overview: newOverview,
            genres: newGenres
        }
        console.log(JSON.stringify(newMovie));
        window.localStorage.setItem("newMovie" + localStorage.length, JSON.stringify(newMovie))
    }
    mainDiv.appendChild(uploadMovie);
};

const createBr = () => {
    let br = document.createElement('br');
    mainDiv.appendChild(br);
};

const showMovie = () => {
    checkAndClearMainDiv();
    createMainDiv(false);
    clearNavButtons();
    for (let i: number = 0; i < localStorage.length; i++) {
        let shownMovie = window.localStorage.getItem("newMovie" + (i));
        let shownMovie2 = JSON.parse(shownMovie);
        let movieDiv = document.createElement('div');
        movieDiv.id = "movie"+i;
        mainDiv.appendChild(movieDiv);
        let title = document.createElement('h1');
        title.textContent = 'Title: ' + shownMovie2.title;
        movieDiv.title = shownMovie2.title;
        movieDiv.appendChild(title);
        let rok_w = document.createElement('h2');
        rok_w.textContent = 'Release date: ' + shownMovie2.rok_w;
        movieDiv.year = shownMovie2.rok_w;
        movieDiv.appendChild(rok_w);
        let overview = document.createElement('h2');
        overview.textContent = 'Overview: ' + shownMovie2.overview;
        movieDiv.appendChild(overview);
        let genre = document.createElement('h2');
        genre.textContent = 'Genres: ' + shownMovie2.genres;
        movieDiv.appendChild(genre);
        let br = document.createElement('br');
        movieDiv.appendChild(br);

        console.log(shownMovie2);
    }
};

const delMovies = () => {
    localStorage.clear();
};

const setGenre = (g: string) => {
    switch (g) {
        case "Action":
            genre = 28;
            break;
        case "Adventure":
            genre = 12;
            break;
        case "Animation":
            genre = 16;
            break;
        case "Comedy":
            genre = 35;
            break;
        case "Crime":
            genre = 80;
            break;
        case "Documentary":
            genre = 99;
            break;
        case "Drama":
            genre = 18;
            break;
        case "Family":
            genre = 10751;
            break;
        case "Fantasy":
            genre = 14;
            break;
        case "History":
            genre = 36;
            break;
        case "Horror":
            genre = 27;
            break;
        case "Music":
            genre = 10402;
            break;
        case "Mystery":
            genre = 9648;
            break;
        case "Romance":
            genre = 10749;
            break;
        case "Science Fiction":
            genre = 878;
            break;
        case "TV Movie":
            genre = 10770;
            break;
        case "Thriller":
            genre = 53;
            break;
        case "War":
            genre = 10752;
            break;
        case "Western":
            genre = 37;
            break;
        default:
            genre = 0;
    }
};