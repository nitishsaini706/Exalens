// src/components/TimeSeriesChart.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { mockDataFetch } from '../utils/generateData';

const TimeSeriesChart = () => {
    const d3Container = useRef(null);
    const [data, setData] = useState([]);
    const [cache, setCache] = useState({}); // Local cache for data

    useEffect(() => {
        // Initial data fetch
        if (!Object.keys(cache).length) {
            const initialStartDate = new Date(2020, 0, 1);
            const initialEndDate = new Date(2020, 11, 31);
            const initialData = mockDataFetch(initialStartDate, initialEndDate);
            setData(initialData);
            updateCache(initialStartDate, initialEndDate, initialData);
        }
    }, [cache]);

    useEffect(() => {
        // Check if there is data and a reference to the container
        if (data.length && d3Container.current) {
            // Setting the margins and dimensions for the chart
            const margin = { top: 20, right: 20, bottom: 30, left: 50 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // Clear any existing SVG to avoid duplicates
            d3.select(d3Container.current).selectAll("*").remove();

            // Create an SVG element and set its dimensions
            const svg = d3.select(d3Container.current)
                .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Define the x-axis scale as a time scale
            const xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.date)) // Set domain to cover the full range of dates
                .range([0, width]); // Map the domain to the actual width of the chart

            // Define the y-axis scale as a linear scale
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]) // Set domain from 0 to max value
                .range([height, 0]); // Map the domain to the height, inverted for SVG

            // Append and create the x-axis based on the xScale
            const xAxis = g => g
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0));

            // Append and create the y-axis based on the yScale
            const yAxis = g => g
                .call(d3.axisLeft(yScale))
                .call(g => g.select(".domain").remove()); // Remove the domain line

            svg.append("g").call(xAxis); // Add x-axis to SVG
            svg.append("g").call(yAxis); // Add y-axis to SVG

            // Create a line generator for the data points
            const line = d3.line()
                .x(d => xScale(d.date)) // Position each point along the x-axis based on date
                .y(d => yScale(d.value)); // Position each point along the y-axis based on value

            // Append the path for the line chart
            svg.append("path")
                .datum(data) // Bind data to the path
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line); // Use the line generator to create the "d" attribute

            // Define the zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([1, 10]) // Set the scale extent for zooming
                .translateExtent([[0, 0], [width, height]]) // Set the translation extent
                .extent([[0, 0], [width, height]]) // Set the zooming extent
                .on("zoom", zoomed); // Define the zoom event handler

            // Create a transparent rectangle to capture zoom events
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .call(zoom);

            // Zoom event handler function
            function zoomed(event) {
                // Rescale the x-axis according to the zoom transform
                const newXScale = event.transform.rescaleX(xScale);
                svg.selectAll('.x.axis').call(d3.axisBottom(newXScale));

                // Update the line chart according to the new x-axis scale
                const updatedLine = d3.line()
                    .x(d => newXScale(d.date))
                    .y(d => yScale(d.value));

                svg.selectAll('path').attr('d', updatedLine(data));

                // Check for new data based on the new x-axis domain
                const newDomain = newXScale.domain();
                checkAndFetchData(newDomain[0], newDomain[1]);
            }
        }
    }, [data]);


    const updateCache = (startDate, endDate, newData) => {
        setCache(prevCache => {
            const newCache = { ...prevCache };
            newData.forEach(d => {
                const dateStr = d.date.toISOString().split('T')[0];
                newCache[dateStr] = d;
            });
            return newCache;
        });
    };

    const checkAndFetchData = (startDate, endDate) => {
        const format = d3.timeFormat("%Y-%m-%d");
        const startStr = format(startDate);
        const endStr = format(endDate);
        let shouldFetch = false;

        for (let d = new Date(startStr); d <= new Date(endStr); d.setDate(d.getDate() + 1)) {
            if (!cache[format(d)]) {
                shouldFetch = true;
                break;
            }
        }

        if (shouldFetch) {
            const newData = mockDataFetch(startDate, endDate);
            setData(newData);
            updateCache(startDate, endDate, newData);
        }
    };

    // ... (Rest of the component, including JSX with ref to the SVG container)

    return (
        <div>
            <div>
                <svg ref={d3Container} style={{ width: '100%', height: '500px' }} />
            </div>        
        </div>
    );
};

export default TimeSeriesChart;

