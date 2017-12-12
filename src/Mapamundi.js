import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3GeoProjection from 'd3-geo-projection';
import * as topojson from 'topojson';
import world from 'world-atlas/world/110m.json';

import './Mapamundi.css';


export default class Mapamundi extends Component {
    
    componentDidMount() {
        this.drawMap();
    }

    drawMap() {

        var width = 960,
        height = 580;
    
        var color = d3.scaleOrdinal(d3.schemeCategory10);        
        
        var projection = d3GeoProjection.geoKavrayskiy7()
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(.1);

        var path = d3.geoPath()
            .projection(projection);
        
        var graticule = d3.geoGraticule();
        
        var svg = d3.select("#mapContainer").append("svg")
            .attr("width", width)
            .attr("height", height);
        
        svg.append("defs").append("path")
            .datum({type: "Sphere"})
            .attr("id", "sphere")
            .attr("d", path);
        
        svg.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");
        
        svg.append("use")
            .attr("class", "fill")
            .attr("xlink:href", "#sphere");
        
        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);
        
        var countries = topojson.feature(world, world.objects.countries).features,
            neighbors = topojson.neighbors(world.objects.countries.geometries);
        
        svg.selectAll(".country")
            .data(countries)
            .enter().insert("path", ".graticule")
            .attr("class", "country")
            .attr("d", path)
            .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });
        
        svg.insert("path", ".graticule")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "boundary")
            .attr("d", path);
        
        d3.select(window.frameElement).style("height", height + "px");
        
    }

    render() {

        return (
            <div id="mapContainer"></div>
        )
    }
}