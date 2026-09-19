const movies = [
    "Titanic",
  "Avatar",
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "Avengers: Endgame",
  "The Matrix",
  "Jurassic Park",
  "Harry Potter and the Philosopher's Stone",
  "The Lion King",
  "Toy Story",
  "Finding Nemo",
  "Home Alone",
  "The Hangover",
  "3 Idiots",
  "Dangal",
  "PK",
  "Taare Zameen Par",
  "Zindagi Na Milegi Dobara",
  "Andhadhun",
  "Drishyam",
  "Stree",
  "Lagaan",
  "Chak De! India",
  "Gully Boy"
];
export function generateMovie(){
    const randomIndex = Math.floor(Math.random() * movies.length);
    
    return movies[randomIndex];
}
export function getRandomMovies(count){
    const shuffled = [...movies].sort(()=> Math.random()-0.5);

    return shuffled.slice(0,count);
};
const options = getRandomMovies(3);

console.log(options);