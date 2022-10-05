const CATEGORY_WIDTH = 200
const CATEGORY_HEIGHT = 270

function categoriesDataJoin(data) {

  const categoriesContainer = d3.select('#categories')

  const frameWidthScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artist)])
    .range([CATEGORY_WIDTH - 110, CATEGORY_WIDTH - 10])

  const frameHeightScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artist)])
    .range([140, CATEGORY_HEIGHT - 30])

  const paspartuWidthScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artwork)])
    .range([70, CATEGORY_WIDTH - 40])

  const paspartuHeightScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artwork)])
    .range([120, CATEGORY_HEIGHT - 60])


  // Data join
  const enterAndUpdate = categoriesContainer
    .selectAll('svg')
    .data(data, d => d.category)
    .join(
      enter => {
        const categorySvg = enter.append('svg')

        categorySvg
          .attr('class', 'category')
          .attr('width', CATEGORY_WIDTH)
          .attr('height', CATEGORY_HEIGHT)

        const group = categorySvg.append('g')

        //Category text
        group.append('text')
          .attr('x', CATEGORY_WIDTH / 2)
          .attr('y', 10)
          .style("dominant-baseline", "middle")
          .style("text-anchor", "middle")
          .attr("text-decoration", "underline")
          .text(d => d.category)

        //Category frame
        group.append('rect')
          .attr('x', d => (CATEGORY_WIDTH / 2) - (frameWidthScale(d.artist) / 2))
          .attr('y', d => (CATEGORY_HEIGHT / 2) - (frameHeightScale(d.artist) / 2) + 10)
          .attr('width', d => frameWidthScale(d.artist))
          .attr('height', d => frameHeightScale(d.artist))
          .attr('fill', 'red')

        //Category paspartu
        group.append('rect')
          .attr('fill', 'white')
          .attr('x', d => (CATEGORY_WIDTH / 2) - (paspartuWidthScale(d.artwork) / 2))
          .attr('y', d => (CATEGORY_HEIGHT / 2) - (paspartuHeightScale(d.artwork) / 2) + 10)
          .attr('width', d => paspartuWidthScale(d.artwork))
          .attr('height', d => paspartuHeightScale(d.artwork))
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
