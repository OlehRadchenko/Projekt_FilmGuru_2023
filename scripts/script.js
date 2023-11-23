const url = 'https://api.themoviedb.org/3/movie/157336/videos?api_key=c55b1cd24cb5bed30d81132775cd9903';
const buttonFetch = () =>{
    fetch(url)
    .then(checkStatus)
    .then(printFilms)
    .catch(printError)
}

const checkStatus = (response) =>{
    if(response.status == 200){
        return response.json();
    }else{
        throw new Error('Błąd w pobieraniu danych');
    }
}

const printFilms = (json) => {
    console.log(json);
}

const printError = (error) => {
    console.error('Wystąpił błąd:', error);
}