const url = 'https://api.themoviedb.org/3';
const api_key = 'api_key=c55b1cd24cb5bed30d81132775cd9903';
let movie_id;
let id_backdrops = 0;
let id_trailers = 0;

const buttonClick = form => {
	let keyword = form.keyword.value;
	printAll(url + '/search/movie?query=' + keyword + '&' + api_key, printFilms);
};

const printAll = (url, fn) => {
	fetch(url).then(checkStatus).then(fn).catch(printError);
};

const checkStatus = response => {
	if (response.status == 200) {
		return response.json();
	} else {
		throw new Error('Błąd w pobieraniu danych');
	}
};

const printData = json => {
	let title = document.createElement('h1');
	title.textContent = 'Title: ' + json.title;
	appendToHtml('body', title);

	if (json.poster_path != null) {
		let poster = document.createElement('img');
		poster.src = 'https://image.tmdb.org/t/p/w500' + json.poster_path;
		poster.style.width = '100px';
		poster.style.height = '100px';
		appendToHtml('body', poster);
	}

	let overwiev = document.createElement('h2');
	overwiev.textContent = 'Overwiev: ' + json.overview;
	appendToHtml('body', overwiev);

	let release_date = document.createElement('h2');
	release_date.textContent = 'Release date: ' + json.release_date;
	appendToHtml('body', release_date);

	let genre = document.createElement('h2');
	appendToHtml('body', genre);
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
	appendToHtml('body', themoviedb_link);

	let vote_average = document.createElement('h3');
	vote_average.textContent = 'Average vote: ' + json.vote_average;
	appendToHtml('body', vote_average);

	let vote_count = document.createElement('h3');
	vote_count.textContent = 'Count vote: ' + json.vote_count;
	appendToHtml('body', vote_count);

	if (json.images.backdrops.length > 0) {
		let backdrops = document.createElement('div');
		backdrops.id = 'backdrops_' + id_backdrops;
		appendToHtml('body', backdrops);
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

	if (json.videos.results.length > 0) {
		let trailers = document.createElement('div');
		trailers.id = 'trailers_' + id_trailers;
		appendToHtml('body', trailers);
		for (let i = 0; i < json.videos.results.length; i++) {
			let trailer = document.createElement('a');
			trailer.textContent = 'Open: ' + json.videos.results[i].name;
			trailer.href = 'https://www.youtube.com/watch?v=' + json.videos.results[i].key;
			appendToHtml('#trailers_' + id_trailers, trailer);
		}
		id_trailers++;
	}

	console.log(json);

	console.log(
		'Title: ' +
			json.title +
			'\n' +
			'Poster: href: https://image.tmdb.org/t/p/w500' +
			json.poster_path +
			'\n' +
			'Overwiev: ' +
			json.overview +
			'\n' +
			'Release date: ' +
			json.release_date +
			'\n' +
			'Genre: ' +
			json.genres +
			'\n' +
			'themoviedb link: https://www.themoviedb.org/movie/' +
			movie_id +
			'-' +
			titlee +
			'\n' +
			'Vote avg: ' +
			json.vote_average +
			'\n' +
			'Vote count: ' +
			json.vote_count +
			'\n' +
			'Backdrops: ' +
			json.images.backdrops +
			'\n'
	);
	if (json.videos.results.length > 0) {
		for (let i = 0; i < json.videos.results.length; i++) {
			console.log(
				json.videos.results[i].name + ': https://www.youtube.com/watch?v=' + json.videos.results[i].key + '\n'
			);
		}
	}
};

const printFilms = json => {
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
	for (let i = 0; i < json.results.length; i++) {
		movie_id = json.results[i].id;
		printAll(
			url +
				'/movie/' +
				movie_id +
				'?append_to_response=videos,images,credits&include_image_language=en,null&' +
				api_key,
			printData
		);
	}
};

const printError = error => {
	console.error('Wystąpił błąd:', error);
};

const appendToHtml = (selector, element) => {
	document.querySelector(selector).appendChild(element);
};
