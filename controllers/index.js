let theatres = [
  { theatreId: 1, name: 'Regal Cinemas', location: 'Downtown' },
  { theatreId: 2, name: 'AMC Theatres', location: 'Midtown' },
  { theatreId: 3, name: 'Cinemark', location: 'Uptown' },
];

let shows = [
  { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
  { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
  { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
  { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
];

// function to get all shows 
function getAllShows(){
  return shows;
}

// function to get show by Id
function getShowById(id){
  return shows.find(show => show.showId === id);
}

// Input validation function for add Show
function validateShow(show){
  if(!show.title || typeof show.title !== "string"){
    return "Title is required and should be a string.";
  }
  if(!show.showId || typeof show.showId !== "number"){
    return "Show Id is required and should be a number."
  }
  return null;
}

// function to add a new Show
async function addShow(show){
  show.showId += 1;
  shows.push(show);
  return show;
}

module.exports = { getAllShows, getShowById, validateShow, addShow };