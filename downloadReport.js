document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.querySelector(".download-btn");

    downloadBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Check if there's data in localStorage from the breakdown page
        const storedData = localStorage.getItem('musicData');
        
        if (!storedData) {
            alert("No data found! Please upload your CSV file on the Breakdown page first.");
            window.location.href = "breakdown.html";
            return;
        }

        alert("Generating your personalized report... this may take a few seconds.");

        try {
            const musicData = JSON.parse(storedData);
            await generatePDFReport(musicData);
        } catch (error) {
            console.error("Error generating report:", error);
            alert("There was an error generating your report. Please try again.");
        }
    });
});

// Helper function to parse rating
function parseRating(ratingStr) {
    if (!ratingStr) return 0;
    const parts = ratingStr.toString().split('/');
    const rating = parseFloat(parts[0]);
    return isNaN(rating) ? 0 : rating;
}

async function generatePDFReport(musicData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    let yPosition = margin;

    // === PAGE 1: COVER & OVERVIEW ===
    
    // Title Section
    pdf.setFillColor(29, 185, 84); // Spotify Green
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont(undefined, 'bold');
    pdf.text('Your Music Breakdown', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'normal');
    pdf.text('Personalized Listening Analysis', pageWidth / 2, 45, { align: 'center' });
    
    yPosition = 80;
    
    // Calculate key statistics
    const totalSongs = musicData.length;
    const ratings = musicData.map(d => parseRating(d.Rating)).filter(r => r > 0);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    
    const genreSet = new Set();
    musicData.forEach(song => {
        const genres = song.Genre.split('&').map(g => g.trim());
        genres.forEach(g => genreSet.add(g));
    });
    const totalGenres = genreSet.size;
    
    const artistSet = new Set();
    musicData.forEach(song => {
        const artists = song['Artist(s)'].split('&').map(a => a.trim());
        artists.forEach(a => artistSet.add(a));
    });
    const totalArtists = artistSet.size;
    
    // Overview stats
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('Quick Stats', margin, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    
    const stats = [
        `Total Songs Analyzed: ${totalSongs}`,
        `Average Rating: ${avgRating.toFixed(2)}/10`,
        `Unique Artists: ${totalArtists}`,
        `Genres Explored: ${totalGenres}`,
    ];
    
    stats.forEach(stat => {
        pdf.text(stat, margin + 5, yPosition);
        yPosition += 8;
    });
    
    yPosition += 10;
    
    // Top 5 Songs
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('Your Top 5 Tracks', margin, yPosition);
    yPosition += 10;
    
    const sortedByRating = [...musicData].sort((a, b) => parseRating(b.Rating) - parseRating(a.Rating));
    const top5 = sortedByRating.slice(0, 5);
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    top5.forEach((song, index) => {
        const rating = parseRating(song.Rating);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${index + 1}. ${song.Title}`, margin + 5, yPosition);
        yPosition += 6;
        
        pdf.setFont(undefined, 'normal');
        pdf.text(`   ${song['Artist(s)']} • ${rating.toFixed(1)}/10`, margin + 5, yPosition);
        yPosition += 6;
        
        // Review snippet (truncated)
        const review = song.Review || '';
        const reviewShort = review.length > 60 ? review.substring(0, 60) + '...' : review;
        pdf.setTextColor(80, 80, 80);
        pdf.text(`   "${reviewShort}"`, margin + 5, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;
    });
    
    // === PAGE 2: GENRE ANALYSIS ===
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFillColor(29, 185, 84);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('Genre Analysis', pageWidth / 2, 25, { align: 'center' });
    
    yPosition = 60;
    
    // Calculate genre ratings
    const genreRatings = {};
    const genreCounts = {};
    
    musicData.forEach(song => {
        const genres = song.Genre.split('&').map(g => g.trim());
        const rating = parseRating(song.Rating);
        
        genres.forEach(genre => {
            if (!genreRatings[genre]) {
                genreRatings[genre] = [];
                genreCounts[genre] = 0;
            }
            genreRatings[genre].push(rating);
            genreCounts[genre]++;
        });
    });
    
    const genreAvgs = Object.keys(genreRatings).map(genre => ({
        genre,
        avg: genreRatings[genre].reduce((a, b) => a + b, 0) / genreRatings[genre].length,
        count: genreCounts[genre]
    })).sort((a, b) => b.avg - a.avg);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Top Rated Genres', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    genreAvgs.slice(0, 10).forEach(({ genre, avg, count }) => {
        pdf.text(`${genre}`, margin + 5, yPosition);
        pdf.text(`${avg.toFixed(2)}/10 (${count} songs)`, pageWidth - margin - 40, yPosition);
        yPosition += 8;
    });
    
    yPosition += 10;
    
    // Genre variance (most polarizing)
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Most Polarizing Genres', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('(Genres where your ratings varied the most)', margin + 5, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 10;
    
    const genreVariances = Object.keys(genreRatings).map(genre => {
        const ratings = genreRatings[genre];
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length;
        return { genre, variance, count: genreCounts[genre] };
    }).filter(g => g.count >= 3).sort((a, b) => b.variance - a.variance);
    
    pdf.setFontSize(11);
    genreVariances.slice(0, 5).forEach(({ genre, variance }) => {
        pdf.text(`${genre}`, margin + 5, yPosition);
        pdf.text(`Variance: ${variance.toFixed(2)}`, pageWidth - margin - 40, yPosition);
        yPosition += 8;
    });
    
    // === PAGE 3: DEMOGRAPHICS ===
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFillColor(29, 185, 84);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('Artist Demographics', pageWidth / 2, 25, { align: 'center' });
    
    yPosition = 60;
    
    // Race breakdown
    const raceRatings = {};
    const raceCounts = {};
    
    musicData.forEach(song => {
        const race = song['Race of Artist(s)'];
        const rating = parseRating(song.Rating);
        
        if (race) {
            if (!raceRatings[race]) {
                raceRatings[race] = [];
                raceCounts[race] = 0;
            }
            raceRatings[race].push(rating);
            raceCounts[race]++;
        }
    });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Ratings by Artist Race', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    Object.keys(raceRatings).forEach(race => {
        const avg = raceRatings[race].reduce((a, b) => a + b, 0) / raceRatings[race].length;
        pdf.text(`${race}`, margin + 5, yPosition);
        pdf.text(`${avg.toFixed(2)}/10 (${raceCounts[race]} songs)`, pageWidth - margin - 40, yPosition);
        yPosition += 8;
    });
    
    yPosition += 10;
    
    // Gender breakdown
    const genderRatings = {};
    const genderCounts = {};
    
    musicData.forEach(song => {
        const gender = song['Gender of Artist(s)'];
        const rating = parseRating(song.Rating);
        
        if (gender) {
            if (!genderRatings[gender]) {
                genderRatings[gender] = [];
                genderCounts[gender] = 0;
            }
            genderRatings[gender].push(rating);
            genderCounts[gender]++;
        }
    });
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Ratings by Artist Gender', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    Object.keys(genderRatings).forEach(gender => {
        const avg = genderRatings[gender].reduce((a, b) => a + b, 0) / genderRatings[gender].length;
        pdf.text(`${gender}`, margin + 5, yPosition);
        pdf.text(`${avg.toFixed(2)}/10 (${genderCounts[gender]} songs)`, pageWidth - margin - 40, yPosition);
        yPosition += 8;
    });
    
    // === PAGE 4: INSIGHTS ===
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFillColor(29, 185, 84);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('Key Insights', pageWidth / 2, 25, { align: 'center' });
    
    yPosition = 60;
    
    pdf.setTextColor(0, 0, 0);
    
    // Bottom 5 songs
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Your Bottom 5 Tracks', margin, yPosition);
    yPosition += 10;
    
    const bottom5 = sortedByRating.slice(-5).reverse();
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    bottom5.forEach((song, index) => {
        const rating = parseRating(song.Rating);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${index + 1}. ${song.Title}`, margin + 5, yPosition);
        yPosition += 6;
        
        pdf.setFont(undefined, 'normal');
        pdf.text(`   ${song['Artist(s)']} • ${rating.toFixed(1)}/10`, margin + 5, yPosition);
        yPosition += 6;
        
        const review = song.Review || '';
        const reviewShort = review.length > 60 ? review.substring(0, 60) + '...' : review;
        pdf.setTextColor(80, 80, 80);
        pdf.text(`   "${reviewShort}"`, margin + 5, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;
    });
    
    yPosition += 10;
    
    // Language analysis
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
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Language Preferences', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    Object.keys(languageRatings).forEach(language => {
        const avg = languageRatings[language].reduce((a, b) => a + b, 0) / languageRatings[language].length;
        pdf.text(`${language}`, margin + 5, yPosition);
        pdf.text(`${avg.toFixed(2)}/10 (${languageCounts[language]} songs)`, pageWidth - margin - 40, yPosition);
        yPosition += 8;
    });
    
    // Footer on last page
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by Your Music Breakdown', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save the PDF
    pdf.save('Music_Breakdown_Report.pdf');
    
    alert('Your report has been downloaded successfully!');
}
