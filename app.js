const url =
  'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=100&format=json&origin=*';

const page_url = 'href=http://en.wikipedia.org/?curid=${pageid}';


const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
let resultsDOM =  document.getElementById('results');

let searchTerm = '';
let searchQuery = '';


searchForm.addEventListener('submit', e => {
  e.preventDefault();
  // get the search term
  searchTerm = searchInput.value;
  searchQuery = `&srsearch=${searchTerm}`;
  if(searchTerm === '') {
    resultsDOM.innerHTML = '<div class="alert alert-danger text-center w-100"> please enter a search term </div>';
    return;
  }
  fetchPages(searchInput);
});

const fetchPages = async () => {
  resultsDOM.innerHTML = '<div class="row w-100 justify-content-center"><div class="loading"></div></div>';
  try {
    const response = await fetch(`${url}${searchQuery}`);
    const data = await response.json();
    const searchResults = data.query.search;
    if(searchResults.length < 1) {
      resultsDOM.innerHTML = '<div class="alert alert-danger text-center w-100"> no matching results, please try again </div>';
      return;
    }
    renderResults(searchResults);
  } catch (error) {
    resultsDOM.innerHTML = '<div class="alert alert-danger text-center w-100"> please enter a search term </div>';
  }
};

const renderResults = (list) => {
  const cardList = list.map(item => {
    console.log(item.pageid);
    return `
      <div class="col">
        <div class="card h-100">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Wikipedia_Logo_1.0.png" class="card-img-top" alt="article image">
          <div class="card-body h-100 bg-info">
            <h4 class="card-title">${item.title}</h4>
            <p class="card-text">${item.snippet}</p>
          </div>
          <div class="d-grid card-footer bg-primary">
              <a href="http://en.wikipedia.org/?curid=${item.pageid}" target="_blank" class="btn btn-primary" type="button">
                View More
              </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  resultsDOM.innerHTML = cardList;
};