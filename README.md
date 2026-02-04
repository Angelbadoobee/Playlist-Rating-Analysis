# Playlist Rating Dissection

A client-side music analytics dashboard that analyzes personal playlist ratings to uncover bias patterns, expectation gaps, and cultural influences across genre, geography, language, and demographics.

Rather than focusing on recommendation systems, this project treats *subjective taste itself* as data—exploring how written reviews, numeric ratings, and contextual metadata interact.

---

## Overview

Most music platforms show *what* you listen to, but not *why* you feel the way you do.  
This project bridges that gap by comparing written sentiment with numeric ratings and surfacing inconsistencies, surprises, and long-term patterns in personal music evaluation.

All analysis runs entirely in the browser. No accounts, no tracking, no external APIs.

---

## Core Features

### 1. Key Insights Dashboard
- **Bias Score**  
  Measures alignment between written sentiment and numeric ratings (0–100%)
- **Biggest Surprise**  
  Identifies the genre with the most rating volatility
- **Hidden Gem**  
  Finds highly rated tracks with initially negative reviews

---

### 2. Geographic Analysis
- Interactive world choropleth showing average ratings by country of artist origin
- Highlights geographic preferences and cultural trends
- Hover tooltips reveal average rating and track count

---

### 3. Genre Performance
- **Genre × Rating Matrix**  
  Visualizes which genres consistently perform well
- **Genre Variance Analysis**  
  Reveals which genres are most polarizing over time

---

### 4. Demographic Insights
- Average ratings grouped by:
  - Artist race
  - Artist gender
- Designed for reflective analysis, not ranking or judgment
- All demographic fields are user-defined

---

### 5. Expectation Gap Analysis
- Horizontal bar chart comparing review sentiment vs numeric rating
- Highlights tracks where emotion and score diverge
- Focuses on the top 15 most surprising discrepancies

---

### 6. Track Length Impact
- Scatter plot correlating track duration with rating
- Explores whether longer tracks are penalized
- Color-graded by rating intensity

---

### 7. Language Performance
- Rating breakdown by language
- Compares English and non-English tracks
- Surfaces multilingual listening patterns

---

### 8. Time-Based Trends
- Rating trends across release years
- Identifies era preferences
- Smooth line visualization with area fill

---

### 9. Top & Bottom Tracks
- Card-based display of highest- and lowest-rated songs
- Includes review excerpts and metadata
- Color-coded ratings for quick scanning

---

## Screenshots

<img width="1891" height="864" alt="image" src="https://github.com/user-attachments/assets/b083b7d6-2de2-44d4-b5b5-8f708ad560cf" />
<img width="1850" height="911" alt="image" src="https://github.com/user-attachments/assets/2c562466-fb84-4dc7-b9f5-bfdfe7bea316" />
<img width="1816" height="809" alt="image" src="https://github.com/user-attachments/assets/abbb62dd-1b40-44fa-90ca-864b99631d7e" />
<img width="1841" height="794" alt="image" src="https://github.com/user-attachments/assets/b3b3d4b4-0a8d-4d75-baef-21e08ce92b98" />
<img width="1843" height="846" alt="image" src="https://github.com/user-attachments/assets/ed3c1f24-9596-4f0d-a1f4-f1fe678b8bbd" />
<img width="1828" height="829" alt="image" src="https://github.com/user-attachments/assets/20d57453-75c6-4dce-afcb-384664143b2e" />
<img width="1845" height="801" alt="image" src="https://github.com/user-attachments/assets/aa3bdd7c-0e48-4652-9ad7-7c42574b18f2" />
<img width="1779" height="756" alt="image" src="https://github.com/user-attachments/assets/472fcb52-cfde-47a1-b3b6-9776b0c4ef25" />
<img width="1811" height="786" alt="image" src="https://github.com/user-attachments/assets/e23dc781-d1b3-42a1-b696-d5cce66612e1" />
<img width="1806" height="551" alt="image" src="https://github.com/user-attachments/assets/3ccc1df7-5919-4171-a818-782a0d5e3d74" />
<img width="1739" height="839" alt="image" src="https://github.com/user-attachments/assets/b6f062e9-c05c-4115-9bf2-f698eb955aa3" />
<img width="1626" height="665" alt="image" src="https://github.com/user-attachments/assets/76febfbd-a78a-49f7-878e-6fdb4421c6a1" />


/screenshots
├── landing-page.png
├── key-insights.png
├── world-map.png
├── genre-analysis.png
├── expectation-gap.png

```bash

Example usage in Markdown:
```md
![Key Insights Dashboard](screenshots/key-insights.png)
```

## Data Format

- Upload a CSV file containing the following columns:
- Title
- Artist(s)
- Genre
- Album
- Date Released
- Length of Track
- Language
- Country of Origin (artist(s))
- Rating (0–10 scale)
- Review (text)
- Race of Artist(s)
- Gender of Artist(s)

Notes:
- Supports tab-separated and comma-separated CSVs
- Multiple values can be separated using &
- All data is cleared on refresh

## Design Philosophy

Inspired by the Spotify aesthetic while remaining neutral and analytical:
- Dark theme with high contrast
- Minimal color palette anchored by Spotify green
- Clear typography using Poppins
- Focus on readability and exploration over decoration
- Responsive layout for desktop and mobile

## How to Use

- Open the Breakdown page
- Click Upload your CSV file
- Select your playlist ratings spreadsheet
- Visualizations render automatically
- Explore trends, inconsistencies, and long-term patterns

## Privacy & Ethics

- All processing happens client-side
- No data is uploaded or stored externally
- No user accounts or tracking
- Designed for self-reflection, not evaluation of artists
- This project treats bias as signal, not error.

## Tech Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
- Visualization: Plotly.js
- Styling: CSS Grid, Flexbox
- Fonts: Google Fonts (Poppins)
- Data Parsing: Custom CSV parser (supports quoted fields)

## Future Enhancements

- Export charts as images
- PDF report generation
- Cross-playlist comparison
- Advanced sentiment analysis
- Spotify API integration (optional)
- Custom theming


