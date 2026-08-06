import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/common/Footer'


const agency = () => {

  gsap.registerPlugin(ScrollTrigger);

  const imageDivRef = useRef(null);
  const imageRef = useRef(null);
  const teamImageRef = useRef(null);
  const pageRef = useRef(null);
  const topContentRef = useRef(null);
  const teamSectionRef = useRef(null);

  const [activeTeam, setActiveTeam] = useState(null);


  const imageArray = [
    'https://k72.ca/uploads/teamMembers/Carl_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/Olivier_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/Lawrence_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/HugoJoseph_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/ChantalG_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/MyleneS_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/SophieA_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/Claire_480x640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/Michele_480X640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/MEL_480X640-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/CAMILLE_480X640_2-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/MAXIME_480X640_2-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/MEGGIE_480X640_2-480x640.jpg',
    'https://k72.ca/uploads/teamMembers/joel_480X640_3-480x640.jpg',
  ]

  const teamMembers = [
    { name: 'Carl Godbout', role: 'Business Lead', image: imageArray[0] },
    { name: 'Olivier Duclos', role: 'Art Director', image: imageArray[1] },
    { name: 'Lawrence', role: 'Creative Director', image: imageArray[2] },
    { name: 'Hugo Joseph', role: 'Designer', image: imageArray[3] },
    { name: 'Chantal', role: 'Account Director', image: imageArray[4] },
    { name: 'Mylène', role: 'Strategist', image: imageArray[5] },
    { name: 'Sophie', role: 'Producer', image: imageArray[6] },
    { name: 'Claire', role: 'Account Supervisor', image: imageArray[7] },
    { name: 'Michèle Riendeau', role: 'Director of Strategy', image: imageArray[8] },
    { name: 'Mélanie Laviolette', role: 'Art Director', image: imageArray[9] },
    { name: 'Camille Brière', role: 'Copywriter', image: imageArray[10] },
    { name: 'Maxime', role: 'Designer', image: imageArray[11] },
    { name: 'Meggie Lavoie', role: 'Account Director', image: imageArray[12] },
    { name: 'Joël', role: 'Developer', image: imageArray[13] },
  ]

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
            imageIndex = Math.floor(elem.progress * imageArray.length)
          } else {
            imageIndex = imageArray.length - 1
          }
          imageRef.current.src = imageArray[imageIndex]
      }
    }
    })
  })

  useEffect(() => {
    if (activeTeam === null || !teamImageRef.current) return;

    gsap.fromTo(
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
      try { document.body.classList.remove('logo-white'); } catch (e) {}
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
          position: relative;
          min-height: 100vh;
          overflow: clip;
          padding: 0 0 clamp(90px, 12vh, 170px);
          background: #050505;
          color: white;
        }

        /*
         * The portrait has almost no layout height of its own.
         * It stays above the full-width team rows while the section scrolls.
         */
        .agency-team-preview-anchor {
          position: sticky;
          top: clamp(64px, 7vh, 108px);
          z-index: 10;
          height: 1px;
          pointer-events: none;
        }

        .agency-team-preview {
          position: absolute;
          top: 0;
          left: clamp(250px, 27.5vw, 535px);
          width: clamp(300px, 26vw, 470px);
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

        .agency-team-list {
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
          font-size: clamp(2.7rem, 4vw, 5.35rem);
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
          .agency-team-preview {
            left: 25vw;
            width: clamp(280px, 30vw, 390px);
          }

          .agency-team-row {
            grid-template-columns:
              clamp(170px, 25vw, 300px)
              minmax(0, 1fr)
              auto;
          }

          .agency-team-name {
            font-size: clamp(2.25rem, 4.6vw, 4.3rem);
          }
        }

        @media (max-width: 820px) {
          .agency-team-section {
            padding: 54px 14px 80px;
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
      `}</style>

      <div ref={topContentRef} className="agency-page-top">
        <div className='section1 py-1'>
          <div ref={imageDivRef} className='overflow-hidden h-[20vw] rounded-3xl w-[14vw] absolute top-45 left-[31vw] bg-red-500'>
            <img ref={imageRef} className='h-full object-cover' src="https://k72.ca/uploads/teamMembers/Carl_480x640-480x640.jpg"></img>
          </div>

          <div className='relative font-[Lausanne]'>
            <div className='mt-[30vw]'>
              <h1 className='text-[19vw] text-center leading-[17vw]'>SEVEN7Y <br />
                TWO</h1>
            </div>

            <div className='pl-[40%]'>
              <p className='text-6xl'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We’re inquisitive and open-minded, and we make sure creativity crowds out ego from every corner. A brand is a living thing, with values, a personality and a story. If we ignore that, we can achieve short-term success, but not influence that goes the distance. We bring that perspective to every brand story we help tell.</p>
            </div>
          </div>
        </div>

        <div>
          <div className='section2 h-[50vh]'></div>
        </div>
      </div>

    <section ref={teamSectionRef} className="agency-team-section" aria-label="Agency team">
      <div className="agency-team-preview-anchor">
        {activeTeam !== null && (
          <div className="agency-team-preview">
            <img
              key={teamMembers[activeTeam].image}
              ref={teamImageRef}
              src={teamMembers[activeTeam].image}
              alt={teamMembers[activeTeam].name}
            />
          </div>
        )}
      </div>

      <div className="agency-team-list">
        {teamMembers.map((member, index) => (
          <button
            key={member.name}
            type="button"
            className={`agency-team-row ${activeTeam === index ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveTeam(index)}
            onMouseLeave={() => setActiveTeam(null)}
            onFocus={() => setActiveTeam(index)}
            onBlur={() => setActiveTeam(null)}
            aria-label={`${member.name}, ${member.role}`}
          >
            <span className="agency-team-role">{member.role}</span>
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


export default agency
