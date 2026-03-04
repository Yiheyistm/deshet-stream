import { Link } from 'react-router-dom'
import '../css/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand-section">
          <Link to="/" className="footer-brand d-flex align-items-center gap-2">
            <img src="/logo.png" alt="Deshet Tech" style={{ height: '30px' }} />
            <span>DESHET TECH</span>
          </Link>
          <p className="footer-description">
            Experience the best in entertainment with ultra-high quality
            streaming. Discover thousands of movies and TV shows instantly.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/Yiheyistm"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="GitHub"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/yiheyis-tamir-b56aa8300"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                alt="LinkedIn"
              />
            </a>
            <a
              href="https://yiheyis-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
                alt="Portfolio"
              />
            </a>
          </div>
        </div>

        <div className="footer-links-container">
          <div className="footer-section">
            <h4>Content</h4>
            <Link to="/">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/library">My Library</Link>
            <Link to="/ratings">Ratings</Link>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>yiheyisyt23@gmail.com</p>
            <p>+251 923 895 809</p>
            <div className="app-badges">
              <div className="app-badge">App Store</div>
              <div className="app-badge">Google Play</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} DESHET TECH. All rights reserved.</p>
        <p className="powered-by">
          Powered by <span className="tmdb-logo">TMDB</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
