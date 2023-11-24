const url = 'https://api.themoviedb.org/3';
const api_key = 'api_key=c55b1cd24cb5bed30d81132775cd9903';
let movie_id, maxPages, keyword;
let id_backdrops = 0;
let id_trailers = 0;
let alreadySearched = 0;
let actualPage = 1;
let navigationButtonsShows = false;

const buttonClick = (word, page) => {
    if(alreadySearched==1){
        let flush=document.getElementById('biggerDivId');
        flush.remove();
        alreadySearched=0;}
        let biggerDiv = document.createElement('div');
        biggerDiv.id = 'biggerDivId';
        appendToHtml('body', biggerDiv);
	keyword = word;
	printAll(url+'/search/movie?query='+keyword+'&'+api_key+'&page='+page, printFilms);
};

const sortAlfa = () =>{ 
    var toSort = document.getElementById('biggerDivId').children;
    toSort = Array.prototype.slice.call(toSort, 0);
    let sorted= toSort.sort(function(a, b) {
        
        if (a.Title < b.Title) {
            return -1;
            
          }
          if (a.Title > b.Title) {
            return 1;
           
          }
          
          return 0;
    });
    var parent = document.getElementById('biggerDivId');
parent.innerHTML = "";

for(var i = 0, l = toSort.length; i < l; i++) {
    parent.appendChild(sorted[i]);
}
}

const sortYear = () =>{ 
    var toSort = document.getElementById('biggerDivId').children;
    toSort = Array.prototype.slice.call(toSort, 0);
    let sorted= toSort.sort(function(a, b) {
        
        if (a.Year < b.Year) {
            return -1;
            
          }
          if (a.Year > b.Year) {
            return 1;
           
          }
          
          return 0;
    });
    var parent = document.getElementById('biggerDivId');
parent.innerHTML = "";

for(var i = 0, l = toSort.length; i < l; i++) {
    parent.appendChild(sorted[i]);
}
}

const printAll = (url, fn) => {
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

const printData = (json) => {
    movie_id = json.id;
    let bigDiv = document.createElement('div');
        bigDiv.id = 'bigDivId'+movie_id;
        appendToHtml("div#biggerDivId", bigDiv);
   

	let title = document.createElement('h1');
	title.textContent = 'Title: ' + json.title;
    appendToHtml("div#bigDivId"+movie_id, title);
    bigDiv.Title=json.title;

	if (json.poster_path != null) {
		let poster = document.createElement('img');
		poster.src = 'https://image.tmdb.org/t/p/w500' + json.poster_path;
		poster.style.width = '100px';
		poster.style.height = '100px';
        appendToHtml("div#bigDivId"+movie_id, poster);
	}

	let overwiev = document.createElement('h2');
	overwiev.textContent = 'Overwiev: ' + json.overview;
	appendToHtml("div#bigDivId"+movie_id, overwiev);

	let release_date = document.createElement('h2');
	release_date.textContent = 'Release date: ' + json.release_date;
	appendToHtml("div#bigDivId"+movie_id, release_date);
    bigDiv.Year=json.release_date;

	let genre = document.createElement('h2');
	appendToHtml("div#bigDivId"+movie_id, genre);
	if (json.genres.length > 0) {
		for (let i = 0; i < json.genres.length; i++) {
			genre.innerHTML += '- ' + json.genres[i].name + '<br>';
		}
	} else {
		genre.innerHTML = 'IDK';
	}

	let themoviedb_link = document.createElement('a');
	const titles = json.title.toLowerCase().split(' ');
	const titlee = titles.join('_');
	themoviedb_link.href = 'https://www.themoviedb.org/movie/' + movie_id + '-' + titlee;
	themoviedb_link.textContent = 'Open on themoviedb';
	appendToHtml("div#bigDivId"+movie_id, themoviedb_link);

	let vote_average = document.createElement('h3');
	vote_average.textContent = 'Average vote: ' + json.vote_average;
	appendToHtml("div#bigDivId"+movie_id, vote_average);

	let vote_count = document.createElement('h3');
	vote_count.textContent = 'Count vote: ' + json.vote_count;
	appendToHtml("div#bigDivId"+movie_id, vote_count);

    let showBackdrops = document.createElement("BUTTON");
    showBackdrops.innerHTML = "pokaż zdjęcia";
    showBackdrops.onclick = function(){
    let backdropButton= document.getElementById('allBackdrops_' + movie_id);
    if(backdropButton.style.display=="block")
    {backdropButton.style.display = "none";} else{
    backdropButton.style.display = "block";}
   };
   appendToHtml("div#bigDivId"+movie_id, showBackdrops);

    let allBackdrops = document.createElement('div');
    allBackdrops.id = 'allBackdrops_' + movie_id;  
    appendToHtml("div#bigDivId"+movie_id, allBackdrops);
    

	if (json.images.backdrops.length > 0) {
       
		let backdrops = document.createElement('div');
        
		backdrops.id = 'backdrops_' + id_backdrops;
        allBackdrops.appendChild(backdrops);
		for (let i = 0; i < json.images.backdrops.length; i++) {
			let backdrop = document.createElement('img');
			backdrop.src = 'https://image.tmdb.org/t/p/w500' + json.images.backdrops[i].file_path;
			backdrop.alt = 'Backdrop ' + i;
			backdrop.style.width = 200;
			backdrop.style.height = 200;
			appendToHtml('#backdrops_' + id_backdrops, backdrop);
		}
        
		id_backdrops++;
	}
    allBackdrops.style.display = "none";

	if (json.videos.results.length > 0) {
		let trailers = document.createElement('div');
		trailers.id = 'trailers_' + id_trailers;
		appendToHtml("div#bigDivId"+movie_id, trailers);
		for (let i = 0; i < json.videos.results.length; i++) {
			let trailer = document.createElement('a');
			trailer.textContent = ' Open: ' + json.videos.results[i].name;
			trailer.href = 'https://www.youtube.com/watch?v=' + json.videos.results[i].key;
			appendToHtml('#trailers_' + id_trailers, trailer);
		}
		id_trailers++;
	}

    var rate = document.createElement('input');
    rate.id='rate'+movie_id;
    rate.setAttribute('type','number');
    let rate2=movie_id;
    appendToHtml("div#bigDivId"+movie_id, rate);
    let rating = document.createElement("BUTTON");
    rating.innerHTML = "oceń film";
    rating.onclick = function(){
    let ratingButton= document.getElementById('rate' + rate2);
    if(ratingButton.value>10||ratingButton.value<0){
        alert('ocena musi byc miedzy 0 a 10')
    }
    else{
     /* WYSYLANIE OCENY DO DOKONCZENIA!   const options = {
            method: 'POST',
            headers: {accept: 'application/json', 'Content-Type': 'application/json;charset=utf-8'},
            body: '{"value":'+ratingButton.value+'}'
            };
          
          fetch('https://api.themoviedb.org/3/movie/'+movie_id+'/'+ratingButton.value, options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err)); */
            alert('ocena '+ratingButton.value+' wystawiona!')
        }
   };
   appendToHtml("div#bigDivId"+movie_id, rating);

alreadySearched=1;

    console.log(json);

	console.log(
        'Title: ' + json.title + '\n' +
        'Poster: href: https://image.tmdb.org/t/p/w500' + json.poster_path + '\n' +
        'Overwiev: ' + json.overview + '\n' +
        'Release date: ' + json.release_date + '\n' +
        'Genre: ' + json.genres + '\n' +
        'themoviedb link: https://www.themoviedb.org/movie/' + movie_id + '-' + titlee + '\n' +
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

const printFilms = (json) => {
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
		printAll(url+'/movie/'+movie_id+'?append_to_response=videos,images,credits&include_image_language=en,null&'+api_key, printData);
	}
    if(!navigationButtonsShows){
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

const printError = error => {
	console.error('Wystąpił błąd:', error);
};

const appendToHtml = (selector, element) => {
	document.querySelector(selector).appendChild(element);
};

const printNextPage = () =>{
    if(actualPage<maxPages){
        actualPage++;
        buttonClick(keyword, actualPage);
    }
}

const printPreviousPage = () =>{
    if(actualPage>1){
        actualPage--;
        buttonClick(keyword, actualPage);
    }
}