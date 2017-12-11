import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import worldData from 'world-atlas/world/110m.json';



export default class Mapamundi extends Component {
    
    componentDidMount() {
        this.drawMap();
    }

    drawMap() {

        const svg = d3.select("#mapContainer")
        .append("svg")
        .attr("height", 400)
        .attr("width", 600);
        const path = d3.geoPath();

        svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(worldData, worldData.objects.countries).features)
        .enter().append("path")
            .attr("d", path);
    
        svg.append("path")
            .attr("class", "country-borders")
            .attr("d", path(topojson.mesh(worldData, worldData.objects.countries, function(a, b) { return a !== b; })));
        
    }

    render() {
        console.log(worldData);
        return (
            <div id="mapContainer"></div>
        )
    }
}