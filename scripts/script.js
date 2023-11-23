const url = 'https://api.themoviedb.org/3';
const api_key = 'api_key=c55b1cd24cb5bed30d81132775cd9903';
let movie_id;

const buttonClick = (form) =>{
    let keyword = form.keyword.value;
    printAll(url+'/search/movie?query='+keyword+'&'+api_key, printFilms);
}

const printAll = (url, fn) => {
    fetch(url)
    .then(checkStatus)
    .then(fn)
    .catch(printError)
}

const checkStatus = (response) =>{
    if(response.status == 200){
        return response.json();
    }else{
        throw new Error('Błąd w pobieraniu danych');
    }
}

const printData = (json) =>{
    let title = document.createElement('h1');
    let poster = document.createElement('img');
    let overwiev = document.createElement('h2');
    let release_date = document.createElement('h2');
    let genre = document.createElement('h2');
    let themoviedb_link = document.createElement('a');
    let vote_average = document.createElement('h3');
    let vote_count = document.createElement('h3');
    let backdrops = document.createElement('div');
    let trailer = document.createElement('a');
    console.log(json);
    const titles = json.title.toLowerCase().split(' ');
    const titlee = titles.join("_");
    console.log(
        "Title: "+json.title+"\n"+
        "Poster: href: https://image.tmdb.org/t/p/w500"+json.poster_path+"\n"+
        "Overwiev: "+json.overview+"\n"+
        "Release date: "+json.release_date+"\n"+
        "Genre: "+json.genres+"\n"+
        "themoviedb link: https://www.themoviedb.org/movie/"+movie_id+"-"+titlee+"\n"+
        "Vote avg: "+json.vote_average+"\n"+
        "Vote count: "+json.vote_count+"\n"+
        "Backdrops: "+json.images.backdrops+"\n"
    );
    if(json.videos.results.length>0){
        for(let i=0; i<json.videos.results.length; i++){
            console.log(json.videos.results[i].name+": https://www.youtube.com/watch?v="+json.videos.results[i].key+"\n");
        }   
    }
}

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
    console.log(json);
    for(let i=0; i<json.results.length; i++){
        movie_id = json.results[i].id;
        printAll(url+'/movie/'+movie_id+'?append_to_response=videos,images,credits&include_image_language=en,null&'+api_key, printData);
    }
}

const printError = (error) => {
    console.error('Wystąpił błąd:', error);
}