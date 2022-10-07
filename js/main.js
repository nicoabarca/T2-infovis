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
  d3.select('#reset-btn').on('click', resetFilter)
}


function updateArtists(selectedCategory) {
  if (selectedCategory != highlightedCategory) {
    const filteredArtists = artistsFinalData.filter(a => selectedCategory in a.categories).sort(() => 0.5 - Math.random()).slice(0, 100)
    highlightedCategory = selectedCategory
    highlightedArtists = filteredArtists
    artistsDataJoin(filteredArtists)
  }
}

let highlightedCategory = null
let highlightedArtists = null

const artistsContainer = d3.select('#artists').append('svg')
  .attr('width', 1200)
  .attr('height', 2200)

const artistTooltip = d3.select('#artists').append('div')
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("background-color", "white")
  .style("border", "1px solid black")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style('font-size', '10px')

function artistsDataJoin(data) {

  const categoryColor = d3
    .scaleOrdinal()
    .domain(categoryFinalData.map(d => d.category))
    .range(d3.schemeSet2)

  const branchScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.age)])
    .range([50, 100])

  const circleScale = d3
    .scaleSqrt()
    .domain([0, d3.max(data, d => d.categories[`${highlightedCategory}`])])
    .range([20, 40])

  const showDeathLeaf = (artistDeathYear) => {
    return artistDeathYear === -1 ? 'hidden' : 'visible'
  }

  const showAliveLeaf = (artistDeathYear) => {
    return artistDeathYear === -1 ? 'visible' : 'hidden'
  }

  artistsContainer
    .selectAll('g')
    .data(data, d => d.artist)
    .join(
      enter => {
        const artistGroup = enter.append('g')

        //Artist name
        artistGroup.append('text')
          .attr('class', 'artist-name')
          .attr('font-size', 14)
          .attr('x', (_, i) => 50 + (i % 10) * 120)
          .attr('y', (_, i) => 190 + Math.trunc(i / 10) * 220) 
          .style("dominant-baseline", "middle")
          .style("text-anchor", "middle")
          .text(d => `${d.artist.slice(0, 10)}...`)

        // Branch
        artistGroup.append('rect')
          .attr('class', 'branch')
          .attr('x', (_, i) => 45 + (i % 10) * 120) 
          .attr('y', (d, i) => (Math.trunc(i / 10) * 220) + (180 - branchScale(d.age)))
          .transition('branch')
          .delay(1000)
          .duration(500)
          .attr('width', '10px')
          .attr('height', d => branchScale(d.age))

        // Death Leaf
        artistGroup.append('rect')
          .attr('class', 'death-leaf')
          .attr('x', (_, i) => 50 + (i % 10) * 120)
          .attr('y', (d, i) => (Math.trunc(i / 10) * 220) + (220 - branchScale(d.age)))
          .attr('visibility', d => showDeathLeaf(d.deathYear))
          .transition('death-leaf')
          .delay(1000)
          .duration(1000)
          .attr('width', 30)
          .attr('height', 5)

        // Alive Leaf
        artistGroup.append('ellipse')
          .attr('class', 'alive-leaf')
          .attr('cx', (_, i) => 70 + (i % 10) * 120)
          .attr('cy', (d, i) => (Math.trunc(i / 10) * 220) + (220 - branchScale(d.age)))
          .attr('visibility', d => showAliveLeaf(d.deathYear))
          .transition('alive-leaf')
          .delay(1000)
          .duration(1000)
          .attr('rx', 20)
          .attr('ry', 5)

        // Flower
        artistGroup.append('circle')
          .attr('class', 'flower')
          .attr('cx', (_, i) => 50 + (i % 10) * 120)
          .attr('cy', (d, i) => (
            Math.trunc(i / 10) * 220) + (180 - branchScale(d.age)) - circleScale(d.categories[`${highlightedCategory}`]
            )
          )
          .transition('flower')
          .duration(500)
          .attr('r', d => circleScale(d.categories[`${highlightedCategory}`]))
          .attr('fill', categoryColor(highlightedCategory))

        artistGroup
          .on('mouseover', (_, d) => {
            artistGroup.attr('opacity', (data) => data.artist === d.artist ? 1 : 0.7)
            artistTooltip.style('visibility', 'visible')
          })
          .on('mousemove', (event, d) => {
            artistTooltip
              .style('top', `${event.pageY - 20}px`)
              .style('left', `${event.pageX + 50}px`)
              .html(`
              <p>Name: ${d.artist}<p/>
              <p>Gender: ${d.gender}<p/>
              <p>Nacionality: ${d.nacionality}<p/>
              <p>Birth Year: ${d.birthYear}<p/>
              <p>Age: ${d.age}<p/>
              `)
          })
          .on('mouseout', () => {
            artistGroup.attr('opacity', null)
            artistTooltip.style('visibility', 'hidden')
          })
      },
      update => {

        update.select('.artist-name')
          .transition('update-name')
          .duration(500)
          .attr('x', (_, i) => 50 + (i % 10) * 120) // 50 is middle of invisible rect
          .attr('y', (_, i) => 190 + Math.trunc(i / 10) * 220) // 190 is just above bottom line of invisible rect
          .text(d => `${d.artist.slice(0, 10)}...`)

        update.select('.branch')
          .transition('update-branch')
          .duration(500)
          .attr('x', (_, i) => 45 + (i % 10) * 120) // 45 because width is 10
          .attr('y', (d, i) => (Math.trunc(i / 10) * 220) + (180 - branchScale(d.age)))
          .attr('height', d => branchScale(d.age))

        update.select('.death-leaf')
          .transition('update-death-leaf')
          .duration(500)
          .attr('x', (_, i) => 50 + (i % 10) * 120)
          .attr('y', (d, i) => (Math.trunc(i / 10) * 220) + (220 - branchScale(d.age)))

        update.select('.alive-leaf')
          .transition('update-alive-leaf')
          .duration(500)
          .attr('cx', (_, i) => 70 + (i % 10) * 120)
          .attr('cy', (d, i) => (Math.trunc(i / 10) * 220) + (220 - branchScale(d.age)))

        update.select('.flower')
          .transition('update-flower')
          .duration(500)
          .attr('cx', (_, i) => 50 + (i % 10) * 120)
          .attr('cy', (d, i) => (
            Math.trunc(i / 10) * 220) + (180 - branchScale(d.age)) - circleScale(d.categories[`${highlightedCategory}`]
            )
          )
          .attr('r', d => circleScale(d.categories[`${highlightedCategory}`]))
          .attr('fill', categoryColor(highlightedCategory))
      },
      exit => {
        exit.selectAll('.artist-name')
          .transition('remove-name')
          .duration(100)
          .text('')

        exit.selectAll('.branch')
          .transition('remove-branch')
          .duration(100)
          .attr('height', 0)

        exit.selectAll('.flower')
          .transition('remove-flower')
          .duration(100)
          .attr('r', 0)

        exit.selectAll('.alive-leaf')
          .transition('remove-alive-leaf')
          .duration(100)
          .attr('rx', 0)
          .attr('rx', 0)

        exit.selectAll('.death-leaf')
          .transition('remove-death-leaf')
          .duration(100)
          .attr('width', 0)

        exit
          .transition('exit')
          .delay(200)
          .duration(100)
          .remove()
      }
    )

  d3.select('#male-btn').on('click', () => { maleFilter(data) })

  d3.select('#female-btn').on('click', () => { femaleFilter(data) })

  d3.select("#order").on("change", (event) => {
    const value = event.target.value;
    const copy = JSON.parse(JSON.stringify(data));

    if (value === 'alphabetically') {
      copy.sort((a, b) => a.artist.localeCompare(b.artist));
      artistsDataJoin(copy);
    }
    else if (value === 'age') {
      copy.sort((a, b) => a.age - b.age);
      artistsDataJoin(copy);
    }
    else {
      artistsDataJoin(highlightedArtists);
    }
  })
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

function femaleFilter() {
  const dataCopy = JSON.parse(JSON.stringify(highlightedArtists))
  const femaleArtists = dataCopy.filter(d => d.gender === 'Female')
  artistsDataJoin(femaleArtists)
}

function maleFilter() {
  const dataCopy = JSON.parse(JSON.stringify(highlightedArtists))
  const maleArtists = dataCopy.filter(d => d.gender === 'Male')
  artistsDataJoin(maleArtists)
}

function resetFilter() {
  highlightedCategory = null
  highlightedArtists = null
  categoriesContainer.selectAll('svg').attr('opacity', null)
  artistsDataJoin([])
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
  return data
}
