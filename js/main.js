const WIDTH = 800;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70, // se agranda este margen para asegurar que se vean los números
};

const categoriesContainer = d3.select('#categories')
  .append('svg')
  .attr('height', HEIGHT)
  .attr('width', WIDTH)


function categoriesDataJoin(data) {

  const xScale = d3
    .scaleLinear()
    .domain([...data.keys()])
    .rangeRound([0, WIDTH])

  const frameScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artwork)])
    .range([100, 200])


  // Data join
  const enterAndUpdate = categoriesContainer
    .selectAll('g')
    .data(data, d => d.category)
    .join(
      enter => {
        const group = enter.append('g')

        group.append('rect')
          .attr('fill', 'orange')
          .attr('width', d => frameScale(d.artwork))
          .attr('height', d => frameScale(d.artwork) * 1.3)
          .attr('x', (_, i) => i * 210)
          .attr('y', `${HEIGHT / 6}`)

        //group.append('rect')
        //  .attr('fill', 'red')
        //  .attr('width', '10px')
        //  .attr('height', '10px')
        //  .attr('x', (_, i) => i * 100)
        //  .attr('y', `${HEIGHT / 2}`)

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
