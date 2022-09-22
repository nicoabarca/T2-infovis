const HEIGHT = 0
const WIDTH = 0

const artistsData = d3.csv('data/ArtistProcessed.csv', parseArtists)
const categoriesData = d3.csv('data/CategoryProcessed.csv', parseCategory)

function parseArtists(d) {
  data = {
    artist: d.Artist,
    birthYear: +d.BirthYear,
    categories: JSON.parse(d.Categories),
    deathYear: +d.DeathYear,
    gender: d.Gender,
    nacionality: d.Nacionality,
    totalArtwork: d.TotalArtwork,
    age: +this.deathYear - +this.birthYear
  }

  data['age'] = data['deathYear'] != -1
    ? data['deathYear'] - data['birthYear']
    : new Date().getFullYear() - data['birthYear']

  return data
}

function parseCategory(d) {
  data = {
    category: d.Category,
    artist: +d.Artist,
    artwork: +d.Artwork,
    male: +d.Male,
    female: +d.Female
  }
  return data
}

