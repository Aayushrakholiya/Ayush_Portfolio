import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";

import Home from "./pages/Home.jsx";
import AboutMe from "./pages/AboutMe.jsx";
import Project from "./pages/project.jsx";
import Contact from "./pages/Contact.jsx";
import Resume from "./pages/Resume.jsx";
import NotFound from "./pages/NotFound.jsx";

const Blog = lazy(() => import("./pages/Blog.jsx"));

import Logo from "./components/Navigation/Logo.jsx";
import Navbar from "./components/Navigation/Navbar.jsx";
import FullScreenNav from "./components/Navigation/FullScreenNav.jsx";
import Stairs from "./components/common/stairs.jsx";
import ProjectHoverBar from "./components/Navigation/ProjectHoverBar.jsx";
import MultilingualLoader from "./components/common/MultilingualLoader.jsx";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({ anchors: true });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="text-white">
      <MultilingualLoader />

      {/* Fixed interface: never transformed by Stairs */}
      <Logo />
      <Navbar />
      <ProjectHoverBar />
      <FullScreenNav />

      {/* Only page content receives transition animations */}
      <Stairs>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/project" element={<Project />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<Resume />} />
          <Route
            path="/blog"
            element={
              <Suspense
                fallback={
                  <main
                    className="min-h-screen bg-[#050505]"
                    aria-label="Loading blog"
                  />
                }
              >
                <Blog />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Stairs>
    </div>
  );
};

export default App;
