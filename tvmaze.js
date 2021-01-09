/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
const baseURL = 'http://api.tvmaze.com/'

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const result = await axios.get(`${baseURL}search/shows?q=${query}`);
  const res = result.data;
  const array = [];
  console.log(res)
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  for (let i = 0; i < res.length; i++){
    // console.log('inside for')
    const obj = {}

      const {name, id, summary} = res[i].show;
      obj.name = name;
      obj.id = id;
      obj.summary = summary;

      if(res[i].show.image){
        obj.image = res[i].show.image.original;
      }
      
      array.push(obj);
      console.log(array)
  }
  
  return array;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    if(!show.summary){
      show.summary = '';
    }
    let imgString = ''
    if (show.image){
      imgString = `<img src=${show.image} class="img-fluid"></img>`
    } 

        let $item = $(
                    `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
                      <div class="card" data-show-id="${show.id}">
                        <div class="card-body">
                          <h5 class="card-title">${show.name}</h5>
                          ${imgString}
                          <p class="card-text">${show.summary}</p>
                          <button class="btn btn-primary" id=${show.id}>Show episodes</button>
                          
                        </div>
                      </div>
                    </div>
                    `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const url = `${baseURL}shows/${id}/episodes`;
  const episodes = await axios.get(url);
  const arr = episodes.data;
  console.log(arr)
  for (let i = 0; i < arr.length; i++){
    console.log(arr[i].name);
    $('#episodes-list').append(`<li>${arr[i].name}</li>`)
  }
  $('#episodes-area').show();
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}

// Event listener show list

// const list = document.getElementById('shows-list');
// console.log(list);
// list.addEventListener = ('click', function(e){
//   console.log(e.target);
// });

$('#shows-list').on('click', function(e){
  console.log(e.target);
  let id = +e.target.id;
  getEpisodes(id);
})