import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import "./NotFound.css";

const NotFound = () => (
  <div className="not-found-page">
    <main className="not-found-content">
      <div>
        <p className="not-found-code">404 / Wrong turn</p>
        <h1 className="not-found-title">
          <span>Page not</span>
          <span>found</span>
        </h1>
      </div>
      <div className="not-found-message">
        <p>The page you are looking for could not be found.</p>
        <Link className="not-found-home" to="/">Back to home <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
