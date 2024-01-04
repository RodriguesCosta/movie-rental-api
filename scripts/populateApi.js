import axios from 'axios';

import { moviesData } from '../tests/moviesData.js';

export async function populateApi() {
  const currentMovies = await axios.get('http://localhost:3333/api/all');

  if (currentMovies.data.length > 0) {
    console.log('Database already populated');
    return;
  }

  for (const movie of moviesData) {
    await axios.post('http://localhost:3333/api/movie', movie);
  }

  console.log(`Database populated with ${moviesData.length} movies`);
}
