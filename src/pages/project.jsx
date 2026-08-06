import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import React from "react";

import ProjectCard from "../components/projects/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const Project = () => {
  useGSAP(() => {
    gsap.utils
      .toArray(".project-item-slot")
      .forEach((slot) => {
        const card =
          slot.querySelector(".project-item");

        gsap.fromTo(
          card,
          {
            height: "20vh",
          },
          {
            height: "70vh",
            ease: "none",

            scrollTrigger: {
              trigger: slot,
              start: "top 90%",
              end: "+=500",
              scrub: true,
              markers: false,
              invalidateOnRefresh: true,
              pinSpacing: false,
            },
          }
        );
      });
  }, []);

  const projects = [
    {
      image1: "/Photo1.png",
      image2: "/photo2.jpg",

      project1: {
        client: "iA Financial Group",
        title: "Get ahead",
        year: "2025",
      },

      project2: {
        client: "Project Two",
        title: "Creative direction",
        year: "2025",
      },
    },

    {
      image1: "/Photo3.jpg",
      image2: "/Photo4.jpg",

      project1: {
        client: "Project Three",
        title: "New perspective",
        year: "2024",
      },

      project2: {
        client: "Project Four",
        title: "Forward together",
        year: "2024",
      },
    },

    {
      image1: "/Photo5.jpg",
      image2: "/Photo6.jpg",

      project1: {
        client: "Project Five",
        title: "Made differently",
        year: "2024",
      },

      project2: {
        client: "Project Six",
        title: "Think bigger",
        year: "2024",
      },
    },

    {
      image1: "/Photo7.jpg",
      image2: "/Photo7.jpg",

      project1: {
        client: "Project Seven",
        title: "Beyond ordinary",
        year: "2023",
      },

      project2: {
        client: "Project Eight",
        title: "New possibilities",
        year: "2023",
      },
    },
  ];

  return (
    <>
      <div className="mainContainer_till_images p-[15px]">
        <div className="work_text_container h-[71vh] pt-[40vh]">
          <h2 className="mb-[-8vh] font-[font1] text-[15vw] uppercase text-black">
            Work
          </h2>
        </div>

        <div className="all_imagesCards_container">
          {projects.map((elem, idx) => {
            return (
              <div
                key={idx}
                className="project-item-slot relative mb-2 h-[70vh]"
              >
                <div className="project-item absolute left-0 top-0 flex h-[20vh] w-full gap-2 overflow-hidden">
                  <ProjectCard
                    index={idx}
                    image1={elem.image1}
                    image2={elem.image2}
                    project1={elem.project1}
                    project2={elem.project2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="footer_container h-[400px] bg-black" />
    </>
  );
};

export default Project;