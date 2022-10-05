const BASE_URL = 'https://gist.githubusercontent.com/Hernan4444/'
const CATEGORY_URL = BASE_URL + '16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/CategoryProcessed.csv'
const ARTISTS_URL = BASE_URL + '16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv'

d3.csv(CATEGORY_URL, parseCategory).then(data => {
  categoryFinalData = JSON.parse(JSON.stringify(data))
  categoriesDataJoin(categoryFinalData)
})

d3.csv(ARTISTS_URL, parseArtists).then(data => {
  artistsFinalData = JSON.parse(JSON.stringify(data))
})

const CATEGORY_WIDTH = 200
const CATEGORY_HEIGHT = 300

const categoriesContainer = d3.select('#categories')
const artistsContainer = d3.select('#artists').append('svg')

const maleBtn = d3.select('#male-btn')
const femaleBtn = d3.select('#female-btn')
const resetBtn = d3.select('#reset-btn')

resetBtn.on('click', resetFilter)

function categoriesDataJoin(data) {

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

  const categoryColor = d3
    .scaleOrdinal()
    .domain(data.map(d => d.category))
    .range(d3.schemeSet2)

  // Data join
  //const enterAndUpdate = 
  categoriesContainer
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
          .attr('x', d => (CATEGORY_WIDTH / 2) - (paspartuWidthScale(d.artwork) / 2))
          .attr('y', d => (CATEGORY_HEIGHT / 2) - (paspartuHeightScale(d.artwork) / 2) + 10)
          .attr('width', d => paspartuWidthScale(d.artwork))
          .attr('height', d => paspartuHeightScale(d.artwork))

        // Category female-male
        group.append('rect')
          .attr('fill', 'green')
          .attr('x', (CATEGORY_WIDTH / 2) - 40 / 2)
          .attr('y', (CATEGORY_HEIGHT / 2) - (90 / 2) + 10)
          .attr('width', 40)
          .attr('height', 100)
        group.append('rect')
          .attr('fill', 'orange')
          .attr('x', (CATEGORY_WIDTH / 2) - 40 / 2)
          .attr('y', (CATEGORY_HEIGHT / 2) - (90 / 2) + 10)
          .attr('width', 40)
          .attr('height', d => {
            const qty = d.female + d.male
            return (d.female / qty).toFixed(2) * 100
          }
          )

        // Category tooltip
        categorySvg.append('text')
          .attr('class', 'female')
          .attr('x', CATEGORY_WIDTH / 2)
          .attr('y', 100)
          .style("dominant-baseline", "middle")
          .style("text-anchor", "middle")

        categorySvg.append('text')
          .attr('class', 'male')
          .attr('x', CATEGORY_WIDTH / 2)
          .attr('y', 235)
          .style("dominant-baseline", "middle")
          .style("text-anchor", "middle")

        categorySvg.on('mouseover', (e, d) => categoryMouseover(e, d))

        categorySvg.on('mouseout', (e, _) => categoryMouseout(e, _))

        categorySvg.on('click', (_, d) => {
          // Update Artists
          updateArtists(d.category)
          // Highlight category
          categorySvg.attr('opacity', (data) => data.category === d.category ? 1 : 0.7)
        }
        )
      }
    )
}

//TODO
function updateArtists(selectedCategory) {
  const filteredArtists = artistsFinalData.filter(a => selectedCategory in a.categories).sort(() => 0.5 - Math.random())
  const selectedArtists = filteredArtists.slice(0, 100)
  artistsDataJoin(selectedArtists, selectedCategory)

}

function artistsDataJoin(data, category) {

  const categoryColor = d3
    .scaleOrdinal()
    .domain(categoryFinalData.map(d => d.category))
    .range(d3.schemeSet2)

  const branchScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.age)])
    .range([0, 20])

  artistsContainer
    //.append('svg')
    .selectAll('g')
    .data(data, d => d.artist)
    .join(
      enter => {
        const artistGroup = enter.append('g')

        artistGroup.append('rect')
          .attr('width', '2px')
          .attr('height', d => branchScale(d.age))
          .attr('x', (_, i) => i * 5)
          // PARA DEFINIR EL Y OCUPAR MODULO o PARTE ENTERA PARA LA GRID
          .attr('y', 50)
          .attr('fill', d => categoryColor(category))
      },
      update => {
        update
      },
      exit => {
        exit.remove()
      }
    )
}

function categoryMouseover(event, d) {
  const artistsQuantity = d.female + d.male

  const femaleTooltip = d3.select(event.currentTarget).select('.female')
  const maleTooltip = d3.select(event.currentTarget).select('.male')

  femaleTooltip.text(`Female: ${(d.female / artistsQuantity).toFixed(2) * 100}%`)
  maleTooltip.text(`Male: ${(d.male / artistsQuantity).toFixed(2) * 100}%`)
}

function categoryMouseout(event, d) {
  d3.select(event.currentTarget).select('.female').text('')
  d3.select(event.currentTarget).select('.male').text('')
}

function resetFilter() {
  categoriesContainer.selectAll('svg').attr('opacity', null)
  artistsContainer.selectAll('g').remove()
  //artistsDataJoin([], '')
}

function parseArtists(d) {
  data = {
    artist: d.Artist,
    birthYear: +d.BirthYear,
    categories: JSON.parse(d.Categories),
    deathYear: +d.DeathYear,
    gender: d.Gender,
    nacionality: d.Nacionality,
    totalArtwork: +d.TotalArtwork,
    age: +this.deathYear - +this.birthYear
  }

  if (data['deathYear'] === -1) {
    data['age'] = new Date().getFullYear() - data['birthYear']
  }
  else {
    data['age'] = data['deathYear'] - data['birthYear']
  }
  //console.log(data)
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
