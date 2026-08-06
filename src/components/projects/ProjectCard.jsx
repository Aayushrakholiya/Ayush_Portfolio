import React, { useContext } from "react";
import { NavbarContext } from "../../context/NavContext";

const ProjectCard = (props) => {
  const { setActiveProject } = useContext(NavbarContext);

  const handleProjectEnter = (project) => {
    setActiveProject(project);
  };

  const handleProjectLeave = () => {
    setActiveProject(null);
  };

  return (
    <div className="flex h-full w-full gap-2">
      {/* First project image */}
      <div
        className="group relative h-full w-1/2"
        onMouseEnter={() =>
          handleProjectEnter(props.project1)
        }
        onMouseLeave={handleProjectLeave}
      >
        <img
          src={props.image1}
          alt={`project-${props.index}-1`}
          className="
            h-full w-full object-cover
            transition-all duration-150
            hover:rounded-[50px]
            group-hover:brightness-80
          "
        />

        <div
          className="
            pointer-events-none
            absolute inset-0
            flex items-center justify-center
            opacity-0
            transition-opacity duration-150
            group-hover:opacity-100
          "
        >
          <h2
            className="
              rounded-[50px] border-2
              px-5 pt-2
              font-[Lausanne] text-6xl
              uppercase text-white
            "
          >
            View Project
          </h2>
        </div>
      </div>

      {/* Second project image */}
      {props.image2 && (
        <div
          className="group relative h-full w-1/2"
          onMouseEnter={() =>
            handleProjectEnter(props.project2)
          }
          onMouseLeave={handleProjectLeave}
        >
          <img
            src={props.image2}
            alt={`project-${props.index}-2`}
            className="
              h-full w-full object-cover
              transition-all duration-150
              hover:rounded-[50px]
              group-hover:brightness-80
            "
          />

          <div
            className="
              pointer-events-none
              absolute inset-0
              flex items-center justify-center
              opacity-0
              transition-opacity duration-150
              group-hover:opacity-100
            "
          >
            <h2
              className="
                rounded-[50px] border-2
                px-5 pt-2
                font-[Lausanne] text-6xl
                uppercase text-white
              "
            >
              View Project
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
