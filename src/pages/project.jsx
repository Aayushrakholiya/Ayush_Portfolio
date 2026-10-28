import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useContext, useEffect, useRef } from "react";

import ProjectCard from "../components/projects/ProjectCard";
import Footer from "../components/common/Footer";
import { NavbarContext } from "../context/NavbarContext";
import { PROJECT_DESKTOP_QUERY } from "../components/projects/projectMedia";
import "./Project.css";

gsap.registerPlugin(ScrollTrigger);

const Project = () => {
  const pageRef = useRef(null);
  const { isPageTransitionComplete } = useContext(NavbarContext);

  useEffect(() => {
    if (!isPageTransitionComplete) return;

    // The entrance scales the page; measure triggers only after it settles.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [isPageTransitionComplete]);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(
      `${PROJECT_DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`,
      () => {
        gsap.utils.toArray(".project-item-slot").forEach((slot) => {
          gsap.fromTo(
            slot.querySelector(".project-item"),
            { height: "20vh" },
            {
              height: "70vh",
              ease: "none",
              scrollTrigger: {
                trigger: slot,
                start: "top 90%",
                end: "+=500",
                scrub: true,
                invalidateOnRefresh: true,
                pinSpacing: false,
              },
            },
          );
        });
      },
    );
    return () => media.revert();
  }, { scope: pageRef });

  const projects = [
    {
      "image1": "/ecommerce_pic.png",
      "project1": {
        "title": "E-Commerce User Behaviour Analytics",
        "year": "2026",
        "url": "https://github.com/Aayushrakholiya/ecommerce-funnel-analytics.git",
        "client": "Project One"
      },
      "image2": "/dayflow.png",
      "project2": {
        "client": "Project Two",
        "title": "Dayflow.",
        "year": "2026",
        "url": "https://dayflow-frontend.vercel.app/"
      }
    },
    {
      "image1": "/flight-management.png",
      "project1": {
        "client": "Project Three",
        "title": "Flight Data Management System",
        "year": "2025",
        "url": "https://github.com/Aayushrakholiya/Flight-Data-Management-System-FDMS-.git"
      },
      "image2": "/manufacturing-dashboard.png",
      "project2": {
        "client": "Project Four",
        "title": "YoYo Manufacturing Analytics (Business Intelligence)",
        "year": "2026",
        "url": "https://github.com/Aayushrakholiya/YoYo-Manufacturing-Analytics-Business-Intelligence.git"
      }
    },
    {
      "image1": "/canadian-workforce-analytics.png",
      "project1": {
        "client": "Project Five",
        "title": "Big Data Analytics",
        "year": "2026",
        "url": "https://github.com/Aayushrakholiya/Big-Data.git"
      },
      "image2": "/parcel-manager.png",
      "project2": {
        "client": "Project Six",
        "title": "Parcel Manager",
        "year": "2024",
        "url": "https://github.com/Aayushrakholiya/Parcel-Manager.git"
      }
    },
    {
      "image1": "/snapcanvas.png",
      "project1": {
        "client": "Project Seven",
        "title": "Snap Canvas",
        "year": "2025",
        "url": "https://snapcanvas-five.vercel.app/"
      },
      "image2": "/orbitlab-solar-system.png",
      "project2": {
        "client": "Project Eight",
        "title": "Solar Sandbox",
        "year": "2025",
        "url": "https://solar-sandbox-three.vercel.app/"
      }
    },
    {
      "image1": "/mqtt-cloud-iot-showcase.png",
      "project1": {
        "client": "Project Nine",
        "title": "MQTT Sensor Hub",
        "year": "2025",
        "url": "https://github.com/Aayushrakholiya/MQTT-Sensor-Hub.git"
      }
    }
  ];

  return (
    <div ref={pageRef} className="work-page-shell">
      <main className="work-page">
        <header className="work_text_container">
          <h1>
            Work
          </h1>
        </header>

        <div className="all_imagesCards_container">
          {projects.map((elem, idx) => {
            return (
              <div
                key={idx}
                className="project-item-slot"
              >
                <div className="project-item">
                  <ProjectCard
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
      </main>

      <Footer />
    </div>
  );
};

export default Project;
