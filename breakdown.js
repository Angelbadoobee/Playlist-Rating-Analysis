// Global variables to store parsed data
let musicData = [];

// Helper function to parse rating from "X.X/10" format
function parseRating(ratingStr) {
    if (!ratingStr) return 0;
    const parts = ratingStr.toString().split('/');
    const rating = parseFloat(parts[0]);
    return isNaN(rating) ? 0 : rating;
}

// Typewriter effect for home page
document.addEventListener("DOMContentLoaded", function() {
    const typewriterElement = document.getElementById('typewriter');
    
    if (typewriterElement) {
        const words = ["Your Music. Your Stats.", "Discover Your Trends.", "Own Your Sound."];
        let i = 0;
        let timer;

        function typingEffect() {
            let word = words[i].split("");
            let loopTyping = function() {
                if (word.length > 0) {
                    typewriterElement.innerHTML += word.shift();
                } else {
                    clearTimeout(timer);
                    return;
                }
                timer = setTimeout(loopTyping, 100);
            };
            loopTyping();
        }

        typingEffect();
    }

    // Navbar hide/show on scroll
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            navbar.style.top = "-100px";
        } else {
            navbar.style.top = "0";
        }
        lastScrollTop = scrollTop;
    });

    // File upload functionality
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');

    if (uploadButton && fileInput) {
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', handleFileUpload);
    }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        musicData = parseCSV(contents);
        
        // Store data in localStorage for the download report page
        localStorage.setItem('musicData', JSON.stringify(musicData));
        
        renderAllVisualizations();
    };
    reader.readAsText(file);
}

function parseCSV(contents) {
    const lines = contents.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Parse CSV properly handling quoted fields
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"' && inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }
    
    // Parse header line and filter out empty headers
    const headerValues = parseCSVLine(lines[0]);
    const headers = headerValues.filter(h => h.length > 0);
    
    // Determine if there's an offset (empty first column in header)
    const headerOffset = headerValues[0] === '' ? 1 : 0;
    
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        let obj = {};
        
        // For data rows, skip the row number column (first column is always a number)
        // But align it with headers that have already skipped the empty column
        const dataOffset = (!isNaN(parseInt(values[0])) && headerOffset === 1) ? 1 : 0;
        
        headers.forEach((header, index) => {
            obj[header] = values[index + dataOffset] || '';
        });
        return obj;
    }).filter(obj => obj.Title); // Filter out empty rows
}

function renderAllVisualizations() {
    // Show the insights section
    document.getElementById('keyInsights').style.display = 'grid';
    
    // Render all charts
    renderKeyInsights();
    renderWorldMap();
    renderGenreHeatmap();
    renderRaceChart();
    renderGenderChart();
    renderExpectationGap();
    renderTrackLengthScatter();
    renderLanguageRatings();
    renderReleaseDateGraph();
    renderGenreVariance();
    renderSongCards();
}

function renderKeyInsights() {
    // Calculate bias score (correlation between review sentiment and rating)
    const biasScore = calculateBiasScore();
    document.getElementById('biasScore').textContent = biasScore + '%';
    
    // Find biggest surprise category
    const surprise = findBiggestSurprise();
    document.getElementById('biggestSurprise').textContent = surprise;
    
    // Find hidden gem
    const gem = findHiddenGem();
    document.getElementById('hiddenGem').textContent = gem;
}

function calculateBiasScore() {
    // Simplified: measure variance in ratings
    const ratings = musicData.map(d => {
        const ratingStr = d.Rating || '';
        // Handle "5.0/10" format
        const ratingNum = parseFloat(ratingStr.split('/')[0]);
        return isNaN(ratingNum) ? 0 : ratingNum;
    }).filter(r => r > 0);
    
    if (ratings.length === 0) return 0;
    
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length;
    const alignmentScore = Math.max(0, 100 - (variance * 20));
    return Math.round(alignmentScore);
}

function findBiggestSurprise() {
    // Find the genre with highest variance
    const genreVariances = {};
    const genreRatings = {};
    
    musicData.forEach(song => {
        const genre = song.Genre;
        const rating = parseRating(song.Rating);
        
        if (!genreRatings[genre]) genreRatings[genre] = [];
        genreRatings[genre].push(rating);
    });
    
    let maxVariance = 0;
    let surpriseGenre = '';
    
    for (const genre in genreRatings) {
        const ratings = genreRatings[genre];
        if (ratings.length === 0) continue;
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length;
        
        if (variance > maxVariance) {
            maxVariance = variance;
            surpriseGenre = genre;
        }
    }
    
    return surpriseGenre || 'N/A';
}

function findHiddenGem() {
    // Find song with highest rating that has negative review words
    const negativeWords = ['bad', 'boring', 'annoying', 'weird', 'hate', 'trash', 'terrible'];
    
    let bestGem = null;
    let bestRating = 0;
    
    musicData.forEach(song => {
        const review = (song.Review || '').toLowerCase();
        const rating = parseRating(song.Rating);
        const hasNegative = negativeWords.some(word => review.includes(word));
        
        if (hasNegative && rating > bestRating) {
            bestRating = rating;
            bestGem = song.Title;
        }
    });
    
    return bestGem || 'None found';
}

function renderWorldMap() {
    const countryRatings = {};
    const countryCounts = {};
    
    musicData.forEach(song => {
        const countries = song['Country of Origin (artist(s))'].split('&').map(c => c.trim());
        const rating = parseRating(song.Rating);
        
        countries.forEach(country => {
            if (!countryRatings[country]) {
                countryRatings[country] = 0;
                countryCounts[country] = 0;
            }
            countryRatings[country] += rating;
            countryCounts[country]++;
        });
    });
    
    const locations = [];
    const avgRatings = [];
    const hoverText = [];
    
    for (const country in countryRatings) {
        const avg = countryRatings[country] / countryCounts[country];
        locations.push(country);
        avgRatings.push(avg);
        hoverText.push(`${country}<br>Avg Rating: ${avg.toFixed(2)}<br>Songs: ${countryCounts[country]}`);
    }
    
    const data = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: locations,
        z: avgRatings,
        text: hoverText,
        hoverinfo: 'text',
        colorscale: [
            [0, '#121212'],
            [0.5, '#535353'],
            [0.7, '#1DB954'],
            [1, '#1ed760']
        ],
        colorbar: {
            title: 'Avg Rating',
            tickfont: { color: '#ffffff' },
            titlefont: { color: '#ffffff' }
        }
    }];
    
    const layout = {
        geo: {
            projection: { type: 'natural earth' },
            bgcolor: 'rgba(0,0,0,0)',
            showframe: false,
            showcoastlines: true,
            coastlinecolor: '#535353',
            landcolor: '#191414',
            countrycolor: '#535353'
        },
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff' },
        margin: { t: 0, b: 0, l: 0, r: 0 }
    };
    
    Plotly.newPlot('worldMap', data, layout, { responsive: true });
}

function renderGenreHeatmap() {
    const genreRatings = {};
    
    musicData.forEach(song => {
        const genres = song.Genre.split('&').map(g => g.trim());
        const rating = parseRating(song.Rating);
        
        genres.forEach(genre => {
            if (!genreRatings[genre]) genreRatings[genre] = [];
            genreRatings[genre].push(rating);
        });
    });
    
    const genres = Object.keys(genreRatings);
    const avgRatings = genres.map(g => {
        const ratings = genreRatings[g];
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    });
    
    const data = [{
        type: 'bar',
        x: genres,
        y: avgRatings,
        marker: {
            color: avgRatings,
            colorscale: [
                [0, '#e74c3c'],
                [0.5, '#f39c12'],
                [1, '#1DB954']
            ],
            line: { color: '#1DB954', width: 2 }
        },
        text: avgRatings.map(r => r.toFixed(2)),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Avg Rating: %{y:.2f}<extra></extra>'
    }];
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: {
            gridcolor: '#535353',
            tickangle: -45
        },
        yaxis: {
            gridcolor: '#535353',
            range: [0, 10],
            title: 'Average Rating'
        },
        margin: { t: 20, b: 120, l: 60, r: 20 }
    };
    
    Plotly.newPlot('genreHeatmap', data, layout, { responsive: true });
}

function renderRaceChart() {
    const raceRatings = {};
    const raceCounts = {};
    
    musicData.forEach(song => {
        const races = song['Race of Artist(s)'].split('&').map(r => r.trim());
        const rating = parseRating(song.Rating);
        
        races.forEach(race => {
            if (!raceRatings[race]) {
                raceRatings[race] = [];
                raceCounts[race] = 0;
            }
            raceRatings[race].push(rating);
            raceCounts[race]++;
        });
    });
    
    const races = Object.keys(raceRatings);
    const avgRatings = races.map(r => {
        const ratings = raceRatings[r];
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    });
    
    const data = [{
        type: 'bar',
        x: races,
        y: avgRatings,
        marker: {
            color: '#1DB954',
            line: { color: '#1ed760', width: 2 }
        },
        text: avgRatings.map(r => r.toFixed(2)),
        textposition: 'outside'
    }];
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: { gridcolor: '#535353' },
        yaxis: {
            gridcolor: '#535353',
            range: [0, 10],
            title: 'Average Rating'
        },
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('raceChart', data, layout, { responsive: true });
}

function renderGenderChart() {
    const genderRatings = {};
    const genderCounts = {};
    
    musicData.forEach(song => {
        const genders = song['Gender of Artist(s)'].split('&').map(g => g.trim());
        const rating = parseRating(song.Rating);
        
        genders.forEach(gender => {
            if (!genderRatings[gender]) {
                genderRatings[gender] = [];
                genderCounts[gender] = 0;
            }
            genderRatings[gender].push(rating);
            genderCounts[gender]++;
        });
    });
    
    const genders = Object.keys(genderRatings);
    const avgRatings = genders.map(g => {
        const ratings = genderRatings[g];
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    });
    
    const data = [{
        type: 'bar',
        x: genders,
        y: avgRatings,
        marker: {
            color: '#1DB954',
            line: { color: '#1ed760', width: 2 }
        },
        text: avgRatings.map(r => r.toFixed(2)),
        textposition: 'outside'
    }];
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: { gridcolor: '#535353' },
        yaxis: {
            gridcolor: '#535353',
            range: [0, 10],
            title: 'Average Rating'
        },
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('genderChart', data, layout, { responsive: true });
}

function renderExpectationGap() {
    // Analyze sentiment in reviews vs actual rating
    const positiveWords = ['good', 'great', 'best', 'love', 'amazing', 'excellent', 'nice', 'strong', 'pleasant'];
    const negativeWords = ['bad', 'worst', 'hate', 'terrible', 'annoying', 'boring', 'weird', 'trash', 'awful'];
    
    const gaps = musicData.map(song => {
        const review = (song.Review || '').toLowerCase();
        const rating = parseRating(song.Rating);
        
        const positiveCount = positiveWords.filter(word => review.includes(word)).length;
        const negativeCount = negativeWords.filter(word => review.includes(word)).length;
        const sentimentScore = (positiveCount - negativeCount) + 5; // Scale 0-10
        
        return {
            title: song.Title,
            artist: song['Artist(s)'],
            gap: rating - sentimentScore,
            rating: rating,
            sentiment: sentimentScore
        };
    }).sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap)).slice(0, 15);
    
    const data = [{
        type: 'bar',
        x: gaps.map(g => g.gap),
        y: gaps.map(g => `${g.title} - ${g.artist}`),
        orientation: 'h',
        marker: {
            color: gaps.map(g => g.gap > 0 ? '#1DB954' : '#e74c3c')
        },
        text: gaps.map(g => g.gap.toFixed(1)),
        textposition: 'outside',
        hovertemplate: '<b>%{y}</b><br>Gap: %{x:.2f}<extra></extra>'
    }];
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins', size: 10 },
        xaxis: {
            gridcolor: '#535353',
            title: 'Rating - Sentiment (positive = rated higher than expected)',
            zeroline: true,
            zerolinecolor: '#ffffff'
        },
        yaxis: { gridcolor: '#535353' },
        margin: { t: 20, b: 60, l: 250, r: 60 },
        height: 600
    };
    
    Plotly.newPlot('expectationGap', data, layout, { responsive: true });
}

function renderTrackLengthScatter() {
    const data = musicData.map(song => {
        const length = song['Length of Track'];
        const parts = length.split(':');
        const minutes = parseInt(parts[0]) + parseInt(parts[1]) / 60;
        
        return {
            x: minutes,
            y: parseRating(song.Rating),
            title: song.Title,
            artist: song['Artist(s)']
        };
    });
    
    const trace = {
        type: 'scatter',
        mode: 'markers',
        x: data.map(d => d.x),
        y: data.map(d => d.y),
        marker: {
            size: 12,
            color: data.map(d => d.y),
            colorscale: [
                [0, '#e74c3c'],
                [0.5, '#f39c12'],
                [1, '#1DB954']
            ],
            line: { color: '#ffffff', width: 1 }
        },
        text: data.map(d => `${d.title} - ${d.artist}`),
        hovertemplate: '<b>%{text}</b><br>Length: %{x:.2f} min<br>Rating: %{y:.1f}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: {
            gridcolor: '#535353',
            title: 'Track Length (minutes)'
        },
        yaxis: {
            gridcolor: '#535353',
            title: 'Rating',
            range: [0, 10]
        },
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('trackLengthScatter', [trace], layout, { responsive: true });
}

function renderLanguageRatings() {
    const languageRatings = {};
    const languageCounts = {};
    
    musicData.forEach(song => {
        const languages = song.Language.split('&').map(l => l.trim());
        const rating = parseRating(song.Rating);
        
        languages.forEach(language => {
            if (!languageRatings[language]) {
                languageRatings[language] = [];
                languageCounts[language] = 0;
            }
            languageRatings[language].push(rating);
            languageCounts[language]++;
        });
    });
    
    const languages = Object.keys(languageRatings);
    const avgRatings = languages.map(l => {
        const ratings = languageRatings[l];
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    });
    
    const data = [{
        type: 'bar',
        x: languages,
        y: avgRatings,
        marker: {
            color: avgRatings,
            colorscale: [
                [0, '#e74c3c'],
                [0.5, '#f39c12'],
                [1, '#1DB954']
            ],
            line: { color: '#1DB954', width: 2 }
        },
        text: avgRatings.map(r => r.toFixed(2)),
        textposition: 'outside'
    }];
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: { gridcolor: '#535353' },
        yaxis: {
            gridcolor: '#535353',
            range: [0, 10],
            title: 'Average Rating'
        },
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('languageRatings', data, layout, { responsive: true });
}

function renderReleaseDateGraph() {
    const yearRatings = {};
    const yearCounts = {};
    
    musicData.forEach(song => {
        const dateStr = song['Date Released'];
        const year = new Date(dateStr).getFullYear();
        const rating = parseRating(song.Rating);
        
        if (!isNaN(year)) {
            if (!yearRatings[year]) {
                yearRatings[year] = [];
                yearCounts[year] = 0;
            }
            yearRatings[year].push(rating);
            yearCounts[year]++;
        }
    });
    
    const years = Object.keys(yearRatings).sort();
    const avgRatings = years.map(y => {
        const ratings = yearRatings[y];
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    });
    
    const data = [{
        type: 'scatter',
        mode: 'lines+markers',
        x: years,
        y: avgRatings,
        line: { color: '#1DB954', width: 3 },
        marker: { size: 10, color: '#1ed760', line: { color: '#ffffff', width: 2 } },
        fill: 'tozeroy',
        fillcolor: 'rgba(29, 185, 84, 0.2)'
    }];
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: {
            gridcolor: '#535353',
            title: 'Release Year'
        },
        yaxis: {
            gridcolor: '#535353',
            title: 'Average Rating',
            range: [0, 10]
        },
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('releaseDateGraph', data, layout, { responsive: true });
}

function renderGenreVariance() {
    const genreRatings = {};
    
    musicData.forEach(song => {
        const genres = song.Genre.split('&').map(g => g.trim());
        const rating = parseRating(song.Rating);
        
        genres.forEach(genre => {
            if (!genreRatings[genre]) genreRatings[genre] = [];
            genreRatings[genre].push(rating);
        });
    });
    
    const traces = Object.keys(genreRatings).map(genre => ({
        type: 'box',
        y: genreRatings[genre],
        name: genre,
        marker: { color: '#1DB954' },
        line: { color: '#1ed760' }
    }));
    
    const layout = {
        paper_bgcolor: '#191414',
        plot_bgcolor: '#191414',
        font: { color: '#ffffff', family: 'Poppins' },
        xaxis: {
            gridcolor: '#535353',
            tickangle: -45
        },
        yaxis: {
            gridcolor: '#535353',
            title: 'Rating Distribution',
            range: [0, 10]
        },
        margin: { t: 20, b: 120, l: 60, r: 20 },
        showlegend: false
    };
    
    Plotly.newPlot('genreVariance', traces, layout, { responsive: true });
}

function renderSongCards() {
    const sortedByRating = [...musicData].sort((a, b) => parseRating(b.Rating) - parseRating(a.Rating));
    const top5 = sortedByRating.slice(0, 5);
    const bottom5 = sortedByRating.slice(-5).reverse();
    
    const container = document.getElementById('songCards');
    container.innerHTML = '';
    
    const topSection = document.createElement('div');
    topSection.className = 'card-section';
    topSection.innerHTML = '<h3>Top 5 Tracks</h3>';
    
    top5.forEach(song => {
        const card = createSongCard(song, 'top');
        topSection.appendChild(card);
    });
    
    const bottomSection = document.createElement('div');
    bottomSection.className = 'card-section';
    bottomSection.innerHTML = '<h3>Bottom 5 Tracks</h3>';
    
    bottom5.forEach(song => {
        const card = createSongCard(song, 'bottom');
        bottomSection.appendChild(card);
    });
    
    container.appendChild(topSection);
    container.appendChild(bottomSection);
}

function createSongCard(song, type) {
    const card = document.createElement('div');
    card.className = `song-card ${type}`;
    
    const rating = parseRating(song.Rating);
    const ratingClass = rating >= 7 ? 'high' : rating >= 5 ? 'mid' : 'low';
    
    card.innerHTML = `
        <div class="song-card-header">
            <h4>${song.Title}</h4>
            <span class="rating ${ratingClass}">${song.Rating}</span>
        </div>
        <p class="artist">${song['Artist(s)']}</p>
        <p class="details">${song.Genre} • ${song.Language}</p>
        <p class="review">"${song.Review}"</p>
        <div class="metadata">
            <span>${song.Album}</span>
            <span>${song['Date Released']}</span>
        </div>
    `;
    
    return card;
}