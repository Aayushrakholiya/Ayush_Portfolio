import { useContext, useEffect } from "react";
import { NavbarContext } from "../../context/NavbarContext";
import { PROJECT_DESKTOP_QUERY } from "./projectMedia";

const ProjectCard = ({ image1, image2, project1, project2 }) => {
  const { setActiveProject } = useContext(NavbarContext);

  useEffect(() => {
    const media = window.matchMedia(PROJECT_DESKTOP_QUERY);
    const clearProject = () => setActiveProject(null);
    media.addEventListener("change", clearProject);
    return () => {
      media.removeEventListener("change", clearProject);
      clearProject();
    };
  }, [setActiveProject]);

  const showProject = (project) => {
    if (window.matchMedia(PROJECT_DESKTOP_QUERY).matches) {
      setActiveProject(project);
    }
  };

  return (
    <div className="project-pair">
      {[{ image: image1, project: project1 }, { image: image2, project: project2 }]
        .filter(({ image, project }) => image && project)
        .map(({ image, project }) => (
          <a
            key={project.title}
            href={project.url}
            aria-label={`View ${project.title}`}
            className="work-card"
            onMouseEnter={() => showProject(project)}
            onMouseLeave={() => setActiveProject(null)}
            onFocus={() => showProject(project)}
            onBlur={() => setActiveProject(null)}
          >
            <div className="work-card__image">
              <img src={image} alt={project.title} decoding="async" />
              <div className="work-card__overlay" aria-hidden="true">
                <span>View Project</span>
              </div>
            </div>
            <div className="work-card__details">
              <div className="work-card__meta">
                <span>{project.client}</span>
                <span>{project.year}</span>
              </div>
              <h2>{project.title}</h2>
              <span className="work-card__link" aria-hidden="true">View project ↗</span>
            </div>
          </a>
        ))}
    </div>
  );
};

export default ProjectCard;
