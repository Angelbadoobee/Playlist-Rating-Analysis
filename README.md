# Music Taste Bias & Surprise Analyzer

A sophisticated web application that analyzes your personal music ratings to identify bias patterns, expectation gaps, and cultural influences across multiple dimensions.

## 🎯 Core Features

### What You Think vs What You Actually Like
The analyzer compares your written review sentiment against your actual numerical ratings to discover hidden biases and surprising preferences.

### Comprehensive Analytics

#### 1. **Key Insights Dashboard**
- **Bias Score**: Measures alignment between expectations and actual ratings (0-100%)
- **Biggest Surprise**: Identifies the genre with most polarizing ratings
- **Hidden Gem**: Finds highest-rated songs with initially negative reviews

#### 2. **Geographic Analysis**
- **World Heat Map**: Interactive choropleth showing average ratings by country of origin
- Warmer colors = higher ratings
- Reveals geographic preferences and cultural biases

#### 3. **Genre Performance**
- **Genre × Rating Matrix**: Bar chart showing which genres consistently deliver
- **Genre Variance Box Plot**: Reveals which genres are most polarizing for you
- Identifies consistency patterns across different music styles

#### 4. **Demographic Insights**
- **Rating by Race**: Average ratings across artist racial demographics
- **Rating by Gender**: Gender-based rating analysis
- Uncovers unconscious biases in music preferences

#### 5. **Expectation Gap Analysis**
- Horizontal bar chart showing songs where review sentiment didn't match rating
- Green bars: Rated higher than review suggested
- Red bars: Rated lower than review suggested
- Top 15 most surprising tracks

#### 6. **Track Length Impact**
- Scatter plot correlating track length with ratings
- Answers: "Do I punish long songs?"
- Color-coded by rating (red to green gradient)

#### 7. **Language Performance**
- Bar chart showing how multilingual tracks perform
- Compares English vs non-English content
- Reveals linguistic preferences

#### 8. **Time Travel Analysis**
- Line graph showing rating trends across release years
- Identifies era preferences
- Smooth trend visualization with area fill

#### 9. **Top & Bottom Tracks**
- Beautiful card-based display of your best and worst rated songs
- Full metadata including reviews, genre, language
- Color-coded ratings (green/yellow/red)

## 📊 Data Format

Your CSV should include these columns (tab-separated):
- Title
- Artist(s)
- Genre
- Album
- Date Released
- Length of Track
- Language
- Country of Origin (artist(s))
- Rating (0-10 scale)
- Review (text)
- Race of Artist(s)
- Gender of Artist(s)

## 🎨 Design Philosophy

Maintains the iconic Spotify aesthetic:
- Dark theme (#191414 background)
- Spotify green (#1DB954) as primary accent
- Poppins font family
- Smooth animations and transitions
- Responsive design for all devices

## 🚀 How to Use

1. **Navigate to the Breakdown page**
2. **Click "Upload your CSV file"**
3. **Select your music ratings spreadsheet**
4. **Watch as visualizations populate automatically**
5. **Scroll through insights and discover your biases**

## 💡 Key Insights You'll Discover

- Are you harder on certain demographics?
- Do longer songs get unfairly rated?
- Which languages perform better than expected?
- What's your most polarizing genre?
- Do your written reviews match your ratings?
- Which countries produce music you love most?
- Are newer or older songs rated higher?

## 🎭 The "Bias Without Moralizing" Approach

This analyzer presents data objectively without judgment. It's designed to help you understand your preferences better, not to criticize them. Everyone has biases - the goal is awareness and self-knowledge.

## 📱 Responsive Features

- Adaptive grid layouts
- Mobile-optimized charts
- Touch-friendly interactions
- Scalable visualizations

## 🎬 Animation Details

- Fade-up animations for sections
- Staggered reveal timing
- Hover effects on cards and buttons
- Smooth scroll behavior
- Interactive chart tooltips

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Plotly.js for interactive charts
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Fonts**: Google Fonts (Poppins)
- **Data Parsing**: Custom CSV parser supporting tab-separated values

## 📦 File Structure

```
├── index.html              # Landing page
├── breakdown.html          # Main analysis page
├── faq.html               # FAQ page
├── download_report.html   # Report download page
├── styles.css             # All styling
└── breakdown.js           # All functionality and visualizations
```

## 🎯 Portfolio Positioning

**Resume Line**: "Built an interactive music bias analyzer using Plotly.js to visualize rating patterns across genre, language, demographics, and geography, revealing unconscious preferences through sentiment-rating gap analysis."

## 🔮 Future Enhancements

Potential additions:
- Export visualizations as images
- PDF report generation
- Comparison mode (multiple users)
- Machine learning predictions
- Spotify API integration
- Share results on social media
- Custom color themes
- Additional sentiment analysis

## 📝 Notes

- Data privacy: All processing happens client-side
- No data is uploaded to servers
- Works offline after initial load
- Supports multiple file formats (CSV, XLS, XLSX)

---

Built with ❤️ and data-driven curiosity
