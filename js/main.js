const WIDTH = 1000;
const HEIGHT = 500;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70, // se agranda este margen para asegurar que se vean los números
};

const categoriesContainer = d3.select('#categories')
  .append('svg')
  //.attr('viewBox', `0 0 ${100} ${100}`)
  .attr('height', HEIGHT)
  .attr('width', WIDTH)


function categoriesDataJoin(data) {
  // Define scales
  const categoryArtistScale = d3.scaleBand()
    

  // Data join
  const enterAndUpdate = categoriesContainer
    .selectAll('g')
    .data(data, d => d.category)
    .join(
      enter => {
        const group = enter.append('g')

        group.append('rect')
          .attr('fill', 'orange')
          .attr('width', (d) => {
            return d.artist
          })
          .attr('height', '20px')
          .attr('x', (_, i) => i * 100)
          .attr('y', `${HEIGHT / 2}`)

        group.append('rect')
          .attr('fill', 'red')
          .attr('width', '10px')
          .attr('height', '10px')
          .attr('x', (_, i) => i * 100)
          .attr('y', `${HEIGHT / 2}`)

      }
    )

}

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

  data['age'] = calculateAge(data['birthYear'], data['deathYear'])
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

  console.log(data)
  return data
}

function calculateAge(birthYear, deathYear) {
  if (deathYear === -1) {
    return new Date().getFullYear() - birthYear
  }
  return deathYear - birthYear
}

function main() {
  const BASE_URL = 'https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/'
  const CATEGORY_URL = BASE_URL + 'CategoryProcessed.csv'
  const ARTISTS_URL = BASE_URL + 'ArtistProcessed.csv'

  d3.csv(CATEGORY_URL, parseCategory).then(data => {
    finalData = JSON.parse(JSON.stringify(data))
    categoriesDataJoin(finalData)
  })
}

main()
