# 🌌 Deshet Stream - Premium Cinematic Platform

![Deshet Stream Cover](src/screenshots/hero_movie.png)

**Deshet Stream** is a state-of-the-art movie and TV show discovery platform built for the ultimate cinematic experience. Featuring a futuristic "Deshet Cyan" aesthetic, the platform integrates real-time data from the TMDB API to provide a seamless browsing, tracking, and viewing journey.

---

## ✨ Key Features

### 🚀 Immersive Discovery

- **Dynamic Hero Carousel**: Featured content with cinematic progress bars and instant "Watch Now" integration.
- **Smart Live Search**: Debounced search with real-time suggestions and poster previews.
- **Advanced Filtering**: Filter by genres, release year, and content type (Movie/TV) with professional dropdowns.

### 🕒 Personalized Experience

- **Browsing vs. Watching Logic**: Distinguishes between peeking at details and actively started content.
- **Continue Watching**: A dedicated home-page row for titles you've actually begun watching.
- **Unified Library**: Manage your Watchlist, Favorites, and full Browsing History in one professional dashboard.

### 🎬 Premium Viewing

- **Integrated Streaming Player**: Multi-server support for high-availability playback.
- **Interactive Movie Cards**: Hover previews with cinematic animations and quick-action toolbars.
- **Actor Insights**: Deep-dive into actor biographies and their filmography.

---

## 📸 Screenshots Showcase

### 🏠 Home & Discovery

|           Home Page Hero (Movies)            |                 Trending Section                  |
| :------------------------------------------: | :-----------------------------------------------: |
| ![Home Page](src/screenshots/hero_movie.png) | ![Trending](src/screenshots/trending_section.png) |

### 📄 Comprehensive Details

|                 Movie Details Header                  |              Cast & Biography               |
| :---------------------------------------------------: | :-----------------------------------------: |
| ![Movie Detail](src/screenshots/detail_section_1.png) | ![Cast](src/screenshots/cast_biography.png) |

### Live Player & TV Shows

|                 Integrated Player                 |              TV Show Discovery               |
| :-----------------------------------------------: | :------------------------------------------: |
| ![Player](src/screenshots/stream_play_movies.png) | ![TV Show](src/screenshots/hero_tv_show.png) |

---

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom tokens & Glassmorphism)
- **State Management**: Context API
- **Navigation**: React Router v6
- **API**: [TMDB (The Movie Database)](https://www.themoviedb.org/documentation/api)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Yiheyistm/deshet-stream.git
cd deshet-stream
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add your TMDB API Key:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

---

## 🌐 Deployment (Vercel)

The easiest way to deploy **Deshet Stream** is using the [Vercel Platform](https://vercel.com/new).

### Steps:

1.  **Push your code** to a GitHub/GitLab/Bitbucket repository.
2.  **Import the project** in Vercel.
3.  **Configure Settings**:
    - **Framework Preset**: Vite (detected automatically).
    - **Root Directory**: `./`.
    - **Build Command**: `npm run build`.
    - **Output Directory**: `dist`.
4.  **Environment Variables**:
    - Add `VITE_TMDB_API_KEY` with your actual API key value.
5.  **Click Deploy**!

_Note: I've already included a `vercel.json` file to handle SPA routing correctly._

---

## 👨‍💻 Developer

**Yiheyis Tamir**
_Flutter Developer | Aspiring Backend Engineer | Tech Enthusiast_

- 🌐 [Portfolio](https://yiheyis-portfolio.vercel.app/)
- 💼 [LinkedIn](https://www.linkedin.com/in/yiheyis-tamir-b56aa8300)
- 🐙 [GitHub](https://github.com/Yiheyistm)

---

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

_Special thanks to Deshet Tech for the inspiration._
