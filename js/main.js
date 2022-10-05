const CATEGORY_WIDTH = 200
const CATEGORY_HEIGHT = 300

function categoriesDataJoin(data) {

  const categoriesContainer = d3.select('#categories')

  // TODO: artist genre stackbar
  let genreStackGen = d3.stack().keys(['male', 'female'])
  let genreStackData = genreStackGen(data)

  const frameScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artist)])
    .range([15, 50])

  const paspartuWidthScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artwork)])
    .range([CATEGORY_WIDTH - 100, CATEGORY_WIDTH - 60])

  const paspartuHeightScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.artwork)])
    .range([CATEGORY_HEIGHT - 120, CATEGORY_HEIGHT - 80])

  const artistGenreColor = d3
    .scaleOrdinal()
    .domain(['male', 'female'])
    .range(['green', 'orange'])


  const artistGenreScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, 90])

  const categoryColor = d3
    .scaleOrdinal()
    .domain(data.map(d => d.category))
    .range(d3.schemeSet2)

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
          .attr('fill', d => categoryColor(d.category))
          .attr('x', d => (CATEGORY_WIDTH / 2) - ((paspartuWidthScale(d.artwork) + frameScale(d.artist)) / 2))
          .attr('y', d => (CATEGORY_HEIGHT / 2) - ((paspartuHeightScale(d.artwork) + frameScale(d.artist)) / 2) + 10)
          .attr('width', d => paspartuWidthScale(d.artwork) + frameScale(d.artist))
          .attr('height', d => paspartuHeightScale(d.artwork) + frameScale(d.artist))

        //Category paspartu
        group.append('rect')
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('x', d => (CATEGORY_WIDTH / 2) - (paspartuWidthScale(d.artwork) / 2))
          .attr('y', d => (CATEGORY_HEIGHT / 2) - (paspartuHeightScale(d.artwork) / 2) + 10)
          .attr('width', d => paspartuWidthScale(d.artwork))
          .attr('height', d => paspartuHeightScale(d.artwork))

        group.append('rect')
          .attr('fill', 'green')
          .attr('x', (CATEGORY_WIDTH / 2) - 40 / 2)
          .attr('y', (CATEGORY_HEIGHT / 2) - (90 / 2) + 10)
          .attr('width', 40)
          .attr('height', 90)
        group.append('rect')
          .attr('fill', 'orange')
          .attr('x', (CATEGORY_WIDTH / 2) - 40 / 2)
          .attr('y', (CATEGORY_HEIGHT / 2) - (90 / 2) + 10)
          .attr('width', 40)
          .attr('height', 10)
      }
    )
}

function parseArtists(d) {
  data = {
    artist: d.Artist,
    birthYear: +d.BirthYear,
    categories: JSON.parse(d.Categories), deathYear: +d.DeathYear,
    gender: d.Gender,
    nacionality: d.Nacionality,
    totalArtwork: d.TotalArtwork,
    age: +this.deathYear - +this.birthYear
  }

  if (data['deathYear'] === -1) {
    data['age'] = new Date().getFullYear() - data['birthYear']
  }
  else {
    data['age'] = data['deathYear'] - data['birthYear']
  }

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
  const BASE_URL = 'https://gist.githubusercontent.com/Hernan4444/'
  const CATEGORY_URL = BASE_URL + '16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/CategoryProcessed.csv'
  const ARTISTS_URL = BASE_URL + '16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv'


  d3.csv(CATEGORY_URL, parseCategory).then(data => {
    finalData = JSON.parse(JSON.stringify(data))
    categoriesDataJoin(finalData)
  })

  d3.csv(ARTISTS_URL, parseArtists)
}

main()
