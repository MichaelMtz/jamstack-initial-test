        // Color gradient array based on Tailwind colors
const colorGradient = [
    '#01162E',  // midnight-900
    '#01203D',  // midnight-800
    '#01203D',  
    '#003460',  // midnight-700
    '#003460',  
    '#044B81',  // midnight-600
    '#044B81',  
    '#0D568B',  // midnight-500
    '#0D568B',  
    '#266E9F',  // midnight-400
    '#266E9F',
    '#529CC3'  // midnight-300
];


// Extract max value from title string
function extractMaxValue(title) {
    const match = title.match(/Max:\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// Calculate colors based on max values ranking
function calculateColors(titles, colorGradient) {
    // Create array of {index, maxValue} objects
    const seasonsRanked = titles.map((title, index) => ({
        index: index,
        maxValue: extractMaxValue(title)
    }));

    // Sort by maxValue descending (highest first)
    seasonsRanked.sort((a, b) => b.maxValue - a.maxValue);

    // Assign colors based on ranking
    const colors = new Array(titles.length);
    seasonsRanked.forEach((season, rank) => {
        colors[season.index] = colorGradient[Math.min(rank, colorGradient.length - 1)];
    });

    return colors;
}

// Check if mobile view
function isMobile() {
    return window.innerWidth <= 639;
}

// Extract season label from title (e.g., "2023-2024" -> "Season 23-24" or "23-24" for mobile)
function extractSeasonLabel(title, forceFormat = null) {
    const match = title.match(/(\d{4})-(\d{4})/);
    if (match) {
        const year1 = match[1].slice(-2);
        const year2 = match[2].slice(-2);
        const mobile = forceFormat !== null ? forceFormat : isMobile();
        return  `${year1}-${year2}`;
        //return mobile ? `${year1}-${year2}` : `Season ${year1}-${year2}`;
    }
    return title;
}

// Normalize dates to 2024 timeline
function normalizeDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const day = date.getDate();
    // Use 2024 for Jan-Mar, 2023 for Dec
    const year = month >= 0 && month <= 2 ? 2024 : 2023;
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Transform time-series data into bar chart race format
function transformDataForRace(resortData, colorGradient) {
    const seasons = resortData.titles.map(title => extractSeasonLabel(title));
    const colors = calculateColors(resortData.titles, colorGradient);
    
    // Create normalized data for each season with last-value carry-forward
    const seasonData = {};
    const seasonColors = {};
    seasons.forEach((season, index) => {
        seasonData[season] = new Map();
        seasonColors[season] = colors[index];
    });
    
    // Normalize dates and store values for each season
    resortData.data.forEach((dataArray, seasonIndex) => {
        const season = seasons[seasonIndex];
        dataArray.forEach(point => {
            const normalizedDate = normalizeDate(point.x);
            seasonData[season].set(normalizedDate, parseInt(point.y));
        });
    });
    
    // Collect all unique normalized dates
    const allDatesSet = new Set();
    Object.values(seasonData).forEach(dateMap => {
        dateMap.forEach((value, date) => {
            allDatesSet.add(date);
        });
    });
    
    // Sort all dates
    const allDates = Array.from(allDatesSet).sort();
    
    // Build frames with carry-forward for missing values
    const frames = [];
    const lastKnownValues = {};
    seasons.forEach(season => lastKnownValues[season] = 0);
    
    allDates.forEach(date => {
        const frameData = { date: date };
        
        seasons.forEach(season => {
            const dateMap = seasonData[season];
            if (dateMap.has(date)) {
                // Update with actual value
                lastKnownValues[season] = dateMap.get(date);
            }
            // Use last known value (or 0 if never had a value)
            frameData[season] = lastKnownValues[season];
        });
        
        frames.push(frameData);
    });

    return { frames, seasons, seasonColors };
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Fetch data and create charts
//fetch('ski-resort-data.json')
fetch('ski-resort-data.json')
    .then(response => response.json())
    .then(resortData => {
        // Transform data for both datasets with their respective color gradients
        const baseDepthRaceData = transformDataForRace(resortData.BaseDepth, colorGradient);
        const trailsRaceData = transformDataForRace(resortData.Trails, colorGradient);
        console.log('--baseDepthRaceData', baseDepthRaceData);
        // Create Base Depth Bar Chart Race
        createBarChartRace(
            'baseDepthRace',
            baseDepthRaceData,
            'Ski Resort Base Depth Race',
            'Base Depth (inches)',
            200, // Animation interval in ms
            'BaseDepth' // Control ID
        );

        // Create Trails Bar Chart Race
        createBarChartRace(
            'trailsRace',
            trailsRaceData,
            'Ski Resort Open Trails Race',
            'Number of Trails',
            200, // Animation interval in ms
            'Trails' // Control ID
        );
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

function createBarChartRace(containerId, raceData, chartTitle, xAxisTitle, interval, controlId) {
    const { frames, seasons, seasonColors } = raceData;
    seasons.reverse();
    // Create root element
    const root = am5.Root.new(containerId);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.verticalLayout
        })
    );

    // Add title with responsive font size
    const titleFontSize = isMobile() ? 14 : 16;
    chart.children.unshift(am5.Label.new(root, {
        text: chartTitle,
        fontSize: titleFontSize,
        fontWeight: "bold",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingBottom: 10
    }));

    // Create axes
    const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "season",
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 1
            })
        })
    );

    // Apply monospace font to X-axis labels with responsive font size
    const labelFontSize = isMobile() ? 10 : 12;
    xAxis.get("renderer").labels.template.setAll({
        fontFamily: "monospace",
        fontSize: labelFontSize
    });

    // Add x-axis title with responsive font size
    const axisTitleFontSize = isMobile() ? 11 : 16;
    xAxis.children.push(am5.Label.new(root, {
        text: "SEASON",
        fontSize: axisTitleFontSize,
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 10
    }));

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {
                minGridDistance: 50
            }),
            min: 0
        })
    );

    // Add y-axis title
    yAxis.children.push(am5.Label.new(root, {
        text: xAxisTitle,
        fontSize: axisTitleFontSize,
        y: am5.percent(50),
        centerY: am5.percent(50),
        rotation: -90,
        paddingRight: 10
    }));

    // Create series
    const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            name: "Values",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            categoryXField: "season",
            sequencedInterpolation: true,
            calculateAggregates: true,
            tooltip: am5.Tooltip.new(root, {
                labelText: "{categoryX}: {valueY}"
            })
        })
    );

    // Apply colors to columns
    series.columns.template.adapters.add("fill", function(fill, target) {
        const season = target.dataItem.dataContext.season;
        return am5.color(seasonColors[season]);
    });

    series.columns.template.adapters.add("stroke", function(stroke, target) {
        const season = target.dataItem.dataContext.season;
        return am5.color(seasonColors[season]);
    });

    // Add value labels at the end of bars
    const bulletLabelFontSize = isMobile() ? 10 : 12;
    series.bullets.push(function() {
        const bullet = am5.Bullet.new(root, {
            locationY: 1,
            sprite: am5.Label.new(root, {
                fill: am5.color("#01162E"),
                centerY: am5.p100,
                centerX: am5.p50,
                paddingBottom: 5,
                fontSize: bulletLabelFontSize,
                fontWeight: "600"
            })
        });

        bullet.get("sprite").adapters.add("text", function(text, target) {
            return target.dataItem ? target.dataItem.get("valueY") : "";
        });

        return bullet;
    });

    // Add date label with responsive font size
    const dateLabelFontSize = isMobile() ? 18 : 24;
    const dateLabel = chart.plotContainer.children.push(am5.Label.new(root, {
        text: "",
        fontSize: dateLabelFontSize,
        fontWeight: "bold",
        opacity: 0.3,
        x: am5.percent(95),
        y: am5.percent(5),
        centerX: am5.percent(100),
        centerY: am5.percent(0)
    }));

    // Animation state
    let currentFrame = 0;
    let animationInterval = null;
    let isPlaying = false;

    // Function to render a specific frame
    function renderFrame(frameIndex) {
        if (frameIndex < 0 || frameIndex >= frames.length) {
            return;
        }

        const frameData = frames[frameIndex];
        
        // Update date label
        dateLabel.set("text", formatDate(frameData.date));

        // Prepare data for this frame
        
        const chartData = seasons.map(season => ({
            season: season,
            value: frameData[season] || 0
        }));

        // Keep bars in chronological order (no sorting by value)
        // Sort by value descending
        //chartData.sort((a, b) => b.value - a.value);
        // Bars are already ordered by season from earliest to latest

        // Calculate max value for this frame and set Y-axis max dynamically
        const maxValue = Math.max(...chartData.map(d => d.value));
        yAxis.set("max", maxValue);

        // Update x-axis and series data
        xAxis.data.setAll(chartData);
        series.data.setAll(chartData);
    }

    // Function to update chart with current frame data (for animation)
    function updateChart() {
        if (currentFrame >= frames.length) {
            // Stop at the end instead of looping
            pauseAnimation();
            return;
        }

        renderFrame(currentFrame);

        // Update slider position
        if (slider) {
            slider.value = currentFrame;
        }

        currentFrame++;
    }

    // Start animation
    function startAnimation() {
        if (!isPlaying) {
            // If at the end, restart from beginning
            if (currentFrame >= frames.length) {
                currentFrame = 0;
            }
            isPlaying = true;
            animationInterval = setInterval(updateChart, interval);
        }
    }

    // Pause animation
    function pauseAnimation() {
        if (isPlaying && animationInterval) {
            isPlaying = false;
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }

    // Wire up play/pause buttons
    const playButton = document.getElementById(`play${controlId}`);
    const pauseButton = document.getElementById(`pause${controlId}`);
    const slider = document.getElementById(`slider${controlId}`);

    if (playButton) {
        playButton.addEventListener('click', startAnimation);
    }

    if (pauseButton) {
        pauseButton.addEventListener('click', pauseAnimation);
    }

    // Initialize slider
    if (slider) {
        slider.max = frames.length - 1;
        slider.value = 0;

        // Slider input handler
        slider.addEventListener('input', function() {
            pauseAnimation();
            currentFrame = parseInt(slider.value);
            renderFrame(currentFrame);
        });

        // Create month ticks
        createMonthTicks(frames, controlId);
    }

    // Show first frame and start animation after a brief delay
    updateChart();
    setTimeout(startAnimation, 500);
}

// Function to create month tick marks on the slider
function createMonthTicks(frames, controlId) {
    const ticksContainer = document.getElementById(`ticks${controlId}`);
    if (!ticksContainer) return;

    // Find first occurrence of each month
    const monthTicks = [];
    let lastMonth = null;

    frames.forEach((frame, index) => {
        const date = new Date(frame.date);
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
        
        if (monthYear !== lastMonth) {
            monthTicks.push({
                index: index,
                label: date.toLocaleDateString('en-US', { month: 'short' })
            });
            lastMonth = monthYear;
        }
    });

    // Create tick elements
    const maxIndex = frames.length - 1;
    monthTicks.forEach(tick => {
        const tickElement = document.createElement('div');
        tickElement.className = 'tick';
        const position = (tick.index / maxIndex) * 100;
        tickElement.style.left = `${position}%`;
        
        tickElement.innerHTML = `
            <div class="tick-mark"></div>
            <div class="tick-label">${tick.label}</div>
        `;
        
        ticksContainer.appendChild(tickElement);
    });
}
