import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useRef, useState } from 'react'
import Footer from '../components/common/Footer'


const About = () => {

  gsap.registerPlugin(ScrollTrigger);

  const imageDivRef = useRef(null);
  const imageRef = useRef(null);
  const teamImageRef = useRef(null);
  const pageRef = useRef(null);
  const topContentRef = useRef(null);
  const teamSectionRef = useRef(null);

  const [activeTeam, setActiveTeam] = useState(null);


  const technologies = [
    { name: 'Python', category: 'Language', image: '/about/technologies/python.svg' },
    { name: 'JavaScript', category: 'Language', image: '/about/technologies/javascript.svg' },
    { name: 'TypeScript', category: 'Language', image: '/about/technologies/typescript.svg' },
    { name: 'SQL', category: 'Language', image: '/about/technologies/sql.svg' },
    { name: 'C++', category: 'Language', image: '/about/technologies/cplusplus.svg' },
    { name: 'React', category: 'UI Library', image: '/about/technologies/react.svg' },
    { name: 'Node.js', category: 'Runtime', image: '/about/technologies/nodejs.svg' },
    { name: 'Prisma', category: 'ORM', image: '/about/technologies/prisma.svg' },
    { name: 'PostgreSQL', category: 'Database', image: '/about/technologies/postgresql.svg' },
    { name: 'MongoDB', category: 'Database', image: '/about/technologies/mongodb.svg' },
    { name: 'Redis', category: 'Data Store', image: '/about/technologies/redis.svg' },
    { name: 'Git', category: 'Version Control', image: '/about/technologies/git.svg' },
    { name: 'Docker', category: 'Containers', image: '/about/technologies/docker.svg' },
    { name: 'AWS', category: 'Cloud', image: '/about/technologies/aws.svg' },
  ];

  const teamMembers = [
    { name: 'IBM', role: 'IT Field Service Technician', dates: 'Jun–Jul 2024', image: '/about/ibm.svg', caption: 'Helped set up 50+ workstations during the HSBC-to-RBC migration, tracked 100+ devices, installed UniFi and Cisco hardware, and trained 20+ colleagues in troubleshooting.' },
    { name: 'Canna Cabana', role: 'Shift Leader', dates: 'May 2025–Present', image: '/about/canna.svg', caption: 'Promoted within six months. Coached colleagues through hands-on floor leadership, helping increase team conversion by 20% and average transaction value by 12%.' },
    { name: 'Amazon', role: 'DS Associate', dates: 'Jan–Apr 2025', image: '/about/amazon.svg', caption: 'Maintained over 99% order accuracy while picking and stowing, processing approximately 200 items per hour and supporting daily fulfillment targets.' },
    { name: 'Fastenal', role: 'Picking Associate', dates: 'Jun–Aug 2025', image: '/about/fastenal.svg', caption: 'Picked and sorted 80+ orders per hour with 98% accuracy. Improved pick flow and product organization, increasing picking efficiency by 15%.' },
  ];

  const touchSelectionRef = useRef(false);

  useGSAP(function() {
    gsap.to(imageDivRef.current, {
      scrollTrigger: {
        trigger: imageDivRef.current,
        start:'top 27%',
        end:'top -160%',
        pin: true,
        pinSpacing: true,
        pinSpacers: true,
        pinType: 'transform',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (elem)=>{
          let imageIndex;
          if(elem.progress < 1) {
            imageIndex = Math.floor(elem.progress * technologies.length)
          } else {
            imageIndex = technologies.length - 1
          }
          imageRef.current.src = technologies[imageIndex].image
          imageRef.current.alt = `${technologies[imageIndex].name} — ${technologies[imageIndex].category}`
      }
    }
    })
  })

  useEffect(() => {
    if (activeTeam === null || !teamImageRef.current) return;

    const tween = gsap.fromTo(
      teamImageRef.current,
      {
        opacity: 0,
        scale: 1.035,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: true,
      }
    );
    return () => tween.kill();
  }, [activeTeam]);

  useGSAP(() => {
    const page = pageRef.current;
    const topContent = topContentRef.current;
    const teamSection = teamSectionRef.current;

    if (!page || !topContent || !teamSection) return undefined;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: teamSection,
        start: 'top 100%',
        end: 'top 40%',
        scrub: 1,
        invalidateOnRefresh: true,
        onEnter: () => document.body.classList.add('logo-white'),
        onLeaveBack: () => document.body.classList.remove('logo-white'),
        onRefresh: (self) => {
          if (self && self.progress > 0) {
            document.body.classList.add('logo-white');
          } else {
            document.body.classList.remove('logo-white');
          }
        },
      },
    });

    timeline.to(
      page,
      {
        backgroundColor: '#050505',
        ease: 'none',
      },
      0
    );

    timeline.to(
      topContent,
      {
        color: '#ffffff',
        ease: 'none',
      },
      0
    );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      document.body.classList.remove('logo-white');
    };
  }, []);


  return (
    <div ref={pageRef} className="agency-page">
      <style>{`
        .agency-page {
          min-height: 100%;
          background: #ffffff;
          color: #050505;
          will-change: background-color;
        }

        .agency-page-top {
          color: #050505;
          will-change: color;
        }

        .agency-team-section {
          --agency-team-lime: #d3fd51;
          --experience-preview-width: clamp(300px, 26vw, 470px);
          position: relative;
          min-height: 100vh;
          overflow: clip;
          padding: 0 0 clamp(168px, 19vh, 240px);
          background: #050505;
          color: white;
        }

        /*
         * Reserve the full card height for sticky containment, then offset it
         * in flow so the rows keep their position and the card clears the footer.
         */
        .agency-team-preview-anchor {
          position: sticky;
          top: clamp(64px, 7vh, 108px);
          z-index: 10;
          height: calc(var(--experience-preview-width) * 1.5);
          margin-bottom: 0;
          pointer-events: none;
        }

        .agency-team-preview {
          position: absolute;
          top: 0;
          left: clamp(250px, 27.5vw, 535px);
          width: var(--experience-preview-width);
          aspect-ratio: 2 / 3;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: clamp(20px, 1.8vw, 34px);
          background: #151515;
        }

        .agency-team-preview img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .about-experience-heading {
          margin: 0;
          padding: clamp(48px, 7vw, 100px) clamp(14px, 1.4vw, 28px) clamp(32px, 4vw, 60px);
          font-family: 'Lausanne', Arial, Helvetica, sans-serif;
          font-size: clamp(2.2rem, 8.5vw, 9rem);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -0.055em;
          text-transform: uppercase;
        }

        .agency-team-list {
          margin-top: calc(1px - var(--experience-preview-width) * 1.5);
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255, 255, 255, 0.55);
        }

        .agency-team-row {
          position: relative;
          display: grid;
          width: 100%;
          min-height: clamp(92px, 7.4vw, 132px);
          grid-template-columns:
            clamp(210px, 28vw, 540px)
            minmax(0, 1fr)
            auto;
          gap: clamp(12px, 1.5vw, 28px);
          align-items: center;
          overflow: hidden;
          padding: 0 clamp(14px, 1.4vw, 28px);
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.55);
          background: transparent;
          color: white;
          text-align: left;
          cursor: pointer;
          isolation: isolate;
        }

        .agency-team-row::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background: var(--agency-team-lime);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 420ms cubic-bezier(.16, 1, .3, 1);
          will-change: transform;
        }

        .agency-team-row:hover::before,
        .agency-team-row:focus-visible::before,
        .agency-team-row.is-active::before {
          transform: scaleY(1);
          transform-origin: top;
        }

        .agency-team-role,
        .agency-team-name,
        .agency-team-arrow {
          position: relative;
          z-index: 1;
          transition:
            color 180ms ease,
            transform 380ms cubic-bezier(.16, 1, .3, 1);
        }

        .agency-team-role {
          color: rgba(255, 255, 255, 0.8);
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(0.8rem, 1vw, 1.25rem);
          font-weight: 500;
          line-height: 1.1;
        }

        .agency-team-name {
          min-width: 0;
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(2rem, 3.5vw, 4.8rem);
          font-weight: 400;
          line-height: 0.88;
          letter-spacing: -0.055em;
          text-align: right;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .agency-team-arrow {
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(1.35rem, 1.7vw, 2rem);
          line-height: 1;
        }

        .agency-team-row:hover .agency-team-role,
        .agency-team-row:hover .agency-team-name,
        .agency-team-row:hover .agency-team-arrow,
        .agency-team-row:focus-visible .agency-team-role,
        .agency-team-row:focus-visible .agency-team-name,
        .agency-team-row:focus-visible .agency-team-arrow,
        .agency-team-row.is-active .agency-team-role,
        .agency-team-row.is-active .agency-team-name,
        .agency-team-row.is-active .agency-team-arrow {
          color: #050505;
        }

        .agency-team-row:hover .agency-team-name,
        .agency-team-row:focus-visible .agency-team-name,
        .agency-team-row.is-active .agency-team-name {
          transform: translateX(-10px);
        }

        .agency-team-row:hover .agency-team-arrow,
        .agency-team-row:focus-visible .agency-team-arrow,
        .agency-team-row.is-active .agency-team-arrow {
          transform: translate(-3px, -3px);
        }

        @media (max-width: 1100px) {
          .agency-team-section { --experience-preview-width: clamp(280px, 30vw, 390px); }
          .agency-team-preview {
            left: 25vw;
            width: var(--experience-preview-width);
          }

          .agency-team-row {
            grid-template-columns:
              clamp(170px, 25vw, 300px)
              minmax(0, 1fr)
              auto;
          }

          .agency-team-name {
            font-size: clamp(1.8rem, 3.5vw, 3.8rem);
          }
        }

        @media (max-width: 820px) {
          .agency-team-list { margin-top: 0; }
          .agency-team-section {
            padding: 54px 14px clamp(128px, 16vh, 180px);
            overflow: hidden;
          }

          .agency-team-preview-anchor {
            position: relative;
            top: auto;
            height: auto;
            margin-bottom: 34px;
          }

          .agency-team-preview {
            position: relative;
            top: auto;
            left: auto;
            width: min(78vw, 430px);
            margin: 0 auto;
          }

          .agency-team-row {
            min-height: 108px;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 10px;
            padding: 0 4px;
          }

          .agency-team-role {
            grid-column: 1;
            align-self: end;
            padding-top: 18px;
            font-size: 0.78rem;
          }

          .agency-team-name {
            grid-column: 1;
            align-self: start;
            padding-bottom: 18px;
            font-size: clamp(2rem, 10vw, 4rem);
            text-align: left;
            white-space: normal;
          }

          .agency-team-arrow {
            grid-column: 2;
            grid-row: 1 / 3;
            align-self: center;
          }

          .agency-team-row:hover .agency-team-name,
          .agency-team-row:focus-visible .agency-team-name,
          .agency-team-row.is-active .agency-team-name {
            transform: translateX(8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .agency-team-row::before,
          .agency-team-role,
          .agency-team-name,
          .agency-team-arrow {
            transition-duration: 1ms;
          }
        }

        .about-technology-card { z-index: 0; }
        .about-technology-card img { background: url("/about/technology-background-clean.png") center / cover no-repeat; }
        .about-intro-wrap { padding-left: 40%; padding-right: 2%; }
        .about-intro { font-size: 3.75rem; line-height: 1.08; text-indent: 8vw; }
        .about-dates { display: block; margin-top: 8px; font-size: 0.85em; opacity: 0.8; }
        .about-preview-caption {
          position: absolute; inset: auto 0 0; margin: 0; padding: clamp(18px, 2vw, 28px);
          background: linear-gradient(transparent, rgba(5,5,5,.97) 20%);
          padding-top: 48px; color: white; font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(0.9rem, 1.1vw, 1.05rem); line-height: 1.5;
        }
        @media (max-width: 820px) {
          .about-intro-wrap { padding-left: 8%; padding-right: 6%; }
          .about-intro { font-size: clamp(1.5rem, 5vw, 3rem); text-indent: 8vw; }
          .agency-team-preview-anchor { min-height: calc(min(78vw, 430px) * 1.5); }
          .agency-team-name { font-size: clamp(1.65rem, 8vw, 4rem); }
        }
      `}</style>

      <div ref={topContentRef} className="agency-page-top">
        <div className='section1 py-1'>
          <div ref={imageDivRef} className='about-technology-card h-[20vw] rounded-3xl w-[14vw] absolute top-45 left-[31vw] bg-[#151515]'>
            <img ref={imageRef} className='h-full w-full object-cover rounded-3xl' src={technologies[0].image} alt="Python — Language" />
          </div>

          <div className='relative z-10 font-[Lausanne]'>
            <div className='mt-[30vw]'>
              <h1 className='text-[19vw] text-center leading-[17vw]'>MY <br />
                JOURNEY</h1>
            </div>

            <div className='about-intro-wrap'>
              <p className='about-intro'>I’m a Software Engineering Technology graduate from Conestoga College, building my path into software engineering. Through independent projects, IT deployment work at IBM, and leading a retail team, I’ve developed a practical approach to solving problems and working with people. I’m looking for an entry-level software engineering role where I can contribute, learn, and grow.</p>
            </div>
          </div>
        </div>

        <div>
          <div className='section2 h-[50vh]'></div>
        </div>
      </div>

    <section ref={teamSectionRef} className="agency-team-section" aria-labelledby="work-experience-heading">
      <h2 id="work-experience-heading" className="about-experience-heading">Work experience</h2>
      <div className="agency-team-preview-anchor">
        {activeTeam !== null && (
          <div className="agency-team-preview" id="experience-preview" role="status" aria-live="polite">
            <img
              key={teamMembers[activeTeam].image}
              ref={teamImageRef}
              src={teamMembers[activeTeam].image}
              alt=""
            />
            <p className="about-preview-caption">{teamMembers[activeTeam].caption}</p>
          </div>
        )}
      </div>

      <div className="agency-team-list">
        {teamMembers.map((member, index) => (
          <button
            key={member.name}
            type="button"
            className={`agency-team-row ${activeTeam === index ? 'is-active' : ''}`}
            onPointerDown={(event) => { touchSelectionRef.current = event.pointerType !== 'mouse'; }}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') { touchSelectionRef.current = false; setActiveTeam(index); }
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse' && document.activeElement !== event.currentTarget) setActiveTeam(null);
            }}
            onFocus={() => { if (!touchSelectionRef.current) setActiveTeam(index); }}
            onBlur={() => { if (!touchSelectionRef.current) setActiveTeam(null); }}
            onClick={() => {
              if (touchSelectionRef.current) setActiveTeam((current) => current === index ? null : index);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setActiveTeam(null);
              if (event.key === 'Enter' || event.key === ' ') { touchSelectionRef.current = false; setActiveTeam(index); }
            }}
            aria-controls={activeTeam !== null ? 'experience-preview' : undefined}
            aria-expanded={activeTeam === index}
            aria-label={`${member.name}, ${member.role}, ${member.dates}. ${member.caption}`}
          >
            <span className="agency-team-role">{member.role}<span className="about-dates">{member.dates}</span></span>
            <span className="agency-team-name">{member.name}</span>
            <span className="agency-team-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </section>

    <Footer />
    </div>
  )
}


export default About
