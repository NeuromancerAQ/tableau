<template>
    <div class="container">
      <div class="main">
        <svg id="chart">

        </svg>
      </div>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'index',
  mounted () {
    this.getMap()
  },
  methods: {
    getMap () {
      d3.json('./worldGeo50metre.json').then(res => {
        this.drawMap(res)
      })
    },
    drawMap (data) {
      const width = d3.select('#chart').node().clientWidth
      const height = d3.select('#chart').node().clientHeight

      const map = d3.select('#chart')

      const projection = d3.geoMercator()
        .center([0, 0])
        .scale(200)
        .translate([width / 3, 2 * height / 3])

      const path = d3.geoPath()
        .projection(projection)

      map.append('g')
        .attr('class', 'mapGroup')
        .selectAll('path')
        .attr('class', 'countryLine')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#2A2A2A')
        .attr('fill-opacity', 0.8)
        .attr('stroke', '#2C2C2C')
        .attr('stroke-width', 0.1)
        .attr('stroke-opacity', 0.3)

      const colorMap = {
        53: '#DBC456',
        43: '#D69637',
        42: '#D69134',
        41: '#D69134',
        40: '#D5882E',
        39: '#D4832A',
        35: '#D2701E',
        33: '#D2701E',
        32: '#D2701E',
        31: '#D2701E',
        30: '#D2701E'
      }

      map.append('g')
        .append('text')
        .style('text-anchor', 'start')
        .text('Homonymous Cities')
        .style('fill', '#E6C63E')
        .style('font-weight', 'bold')
        .style('font-size', '80px')
        .attr('x', 100)
        .attr('y', 200)

      map.append('g')
        .append('text')
        .style('text-anchor', 'start')
        .text('The 16 most common city names in the world')
        .style('fill', '#ffffff')
        .style('font-size', '30px')
        .attr('x', 100)
        .attr('y', 250)

      const p1 = new Promise((resolve) => {
        d3.csv('./HomonymousCities/Map_city_list_data.csv').then(res => {
          resolve(res)
        })
      })

      const p2 = new Promise((resolve) => {
        d3.csv('./HomonymousCities/Bar_data.csv').then(res => {
          resolve(res)
        })
      })

      Promise.all([p1, p2]).then((result) => {
        const pointData = result[0].slice(0, 700) // 截取300个
        const barData = result[1].slice(0, 15)
        const barMap = {}

        for (let i = 0; i < barData.length; i++) {
          barData[i].position = [3 * width / 4, i * 50 + 120]
          barMap[barData[i]['Place Count']] = [3 * width / 4 - 10, i * 50 + 120 + 9]
        }
        for (let i = 0; i < pointData.length; i++) {
          pointData[i].position = projection([pointData[i].Longitude, pointData[i].Latitude])
          pointData[i].target = barMap[pointData[i]['Place Count']]
        }
        console.log(pointData)
        console.log(barData)

        const diagonal = function (d) {
          return 'M' + d.position[0] + ',' + d.position[1] +
            'L' + (d.position[0] + d.target[0] - 200) / 2 + ',' + d.position[1] +
            'C' + ((d.position[0] + d.target[0] - 200) / 2 + d.target[0] - 200) / 2 + ',' + d.position[1] +
            ' ' + (d.position[0] + d.target[0] - 200) / 2 + ',' + d.target[1] +
            ' ' + (d.target[0] - 200) + ',' + d.target[1] +
            'L' + d.target[0] + ',' + d.target[1]
        }

        const linkGroup = map.append('g')
          .attr('class', 'linkGroup')

        linkGroup
          .selectAll('.link')
          .data(pointData)
          .enter()
          .append('path')
          .attr('class', 'link')
          .attr('fill', 'none')
          .attr('stroke', (d) => {
            return colorMap[d['Place Count']]
          })
          .attr('stroke-opacity', 0.3)
          .attr('stroke-width', 0.5)
          .attr('d', diagonal)

        // 用来装点线
        const pointLine = map.append('g')
          .attr('class', 'pointLineGroup')

        pointLine
          .selectAll('circle')
          .attr('class', 'point')
          .data(pointData)
          .enter()
          .append('circle')
          .attr('fill', (d) => {
            return colorMap[d['Place Count']]
          })
          .attr('stroke', '#1D1C1B')
          .attr('stroke-width', 2)
          .attr('r', 5)
          .attr('transform', (d) => {
            return 'translate(' + d.position + ')'
          })

        const barGroup = map.append('g')
          .attr('class', 'barGroup')

        barGroup.append('g')
          .selectAll('rect')
          .data(barData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('fill', (d) => {
            return colorMap[d['Place Count']]
          })
          .attr('width', (d) => {
            return d['Place Count'] * 5
          })
          .attr('height', 20)
          .attr('x', (d) => {
            return d.position[0]
          })
          .attr('y', (d) => {
            return d.position[1]
          })

        barGroup.append('g')
          .selectAll('text')
          .data(barData)
          .enter()
          .append('text')
          .attr('class', 'bar-text')
          .style('text-anchor', 'start')
          .text((d) => {
            return d['alt name'] + ' : ' + d['Place Count']
          })
          .style('font-family', 'Arial Black')
          .style('fill', (d) => {
            return colorMap[d['Place Count']]
          })
          .style('font-weight', 'bold')
          .style('font-size', '14px')
          .attr('x', d => {
            return d.position[0] + d['Place Count'] * 5 + 20
          })
          .attr('y', (d) => {
            return d.position[1] + 15
          })

        barGroup.append('g')
          .selectAll('circle')
          .data(barData)
          .enter()
          .append('circle')
          .attr('class', 'bar-title')
          .attr('fill', (d) => {
            return colorMap[d['Place Count']]
          })
          .attr('stroke', '#000000')
          .attr('stroke-width', 2)
          .attr('r', 18)
          .attr('transform', (d) => {
            return 'translate(' + [d.position[0] - 10, d.position[1] + 9] + ')'
          })

        barGroup.append('g')
          .selectAll('.circle-text')
          .data(barData)
          .enter()
          .append('text')
          .attr('class', 'circle-text')
          .text((d, i) => {
            return i + 1
          })
          .style('font-family', 'Arial Black')
          .style('fill', '#000000')
          .style('font-weight', 'bold')
          .style('font-size', '18px')
          .attr('x', d => {
            return d.position[0] - 25
          })
          .attr('y', (d) => {
            return d.position[1] + 15
          })
      })
    }
  }
}
</script>

<style scoped>
  .container {
    background: #1B1B1B;
    position: relative;
  }

  svg#chart {
    width: 100vw;
    height: 100vh;
  }

</style>
