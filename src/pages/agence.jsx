import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useContext, useEffect, useRef, useState } from 'react'
import Footer from '../components/common/Footer'
import { NavbarContext } from '../context/NavbarContext'
import './Agency.css'


const About = () => {

  gsap.registerPlugin(ScrollTrigger);

  const imageDivRef = useRef(null);
  const imageRef = useRef(null);
  const teamImageRef = useRef(null);
  const pageRef = useRef(null);
  const topContentRef = useRef(null);
  const teamSectionRef = useRef(null);

  const [activeTeam, setActiveTeam] = useState(null);
  const [activeTechnology, setActiveTechnology] = useState(0);
  const [compactLayout, setCompactLayout] = useState(() => window.matchMedia('(width < 1024px)').matches);
  const { isPageTransitionComplete } = useContext(NavbarContext);

  useEffect(() => {
    const media = window.matchMedia('(width < 1024px)');
    const update = () => {
      setCompactLayout(media.matches);
      setActiveTeam(null);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isPageTransitionComplete) return;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [isPageTransitionComplete, compactLayout]);


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

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: imageDivRef.current,
        start: 'top 27%',
        end: 'top -160%',
        pin: true,
        pinSpacing: true,
        pinType: 'transform',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          setActiveTechnology(Math.min(technologies.length - 1, Math.floor(progress * technologies.length)));
        },
      });
    });
    media.add('(width < 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const track = pageRef.current.querySelector('.about-technology-track');
      const stage = pageRef.current.querySelector('.about-technology-stage');
      const motion = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top 96px',
          end: () => `bottom ${96 + stage.offsetHeight}px`,
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
        onUpdate() {
          setActiveTechnology(Math.min(technologies.length - 1, Math.floor(this.progress() * technologies.length)));
        },
      });
      motion.fromTo(imageDivRef.current,
        { rotation: -4, scale: 0.94 },
        { rotation: 4, scale: 1, duration: 1, ease: 'none' }
      ).to(imageDivRef.current, { rotation: 0, scale: 0.97, duration: 1, ease: 'none' });
      gsap.from('.agency-experience-item', {
        y: 24, opacity: 0, stagger: 0.09, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: '.agency-team-list', start: 'top 92%', once: true },
      });
    });
    return () => media.revert();
  }, { scope: pageRef });

  useEffect(() => {
    if (activeTeam === null || !teamImageRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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


      <div ref={topContentRef} className="agency-page-top">
        <div className='about-hero'>
            <div className='about-title-wrap'>
              <h1 className='about-title'>MY <br />
                JOURNEY</h1>
            </div>
            <div className='about-technology-panel'>
              <div className='about-technology-track'>
              <div className='about-technology-stage'>
              <div ref={imageDivRef} className='about-technology-card'>
                {compactLayout ? technologies.map((technology, index) => (
                  <img key={technology.name} className={`about-technology-layer ${activeTechnology === index ? 'is-current' : ''}`} src={technology.image} alt={activeTechnology === index ? `${technology.name} — ${technology.category}` : ''} aria-hidden={activeTechnology !== index} />
                )) : <img ref={imageRef} src={technologies[activeTechnology].image} alt={`${technologies[activeTechnology].name} — ${technologies[activeTechnology].category}`} />}
              </div>
              <div className='about-technology-scroll-caption' aria-hidden='true'>
                <span>Scroll to explore</span>
                <strong>{technologies[activeTechnology].name}</strong>
                <div className='about-technology-progress'><span style={{ transform: `scaleX(${(activeTechnology + 1) / technologies.length})` }} /></div>
                <span>{String(activeTechnology + 1).padStart(2, '0')} / {technologies.length}</span>
              </div>
              </div>
              </div>
              <div className='about-technology-controls'>
                <h2>Technologies I use</h2>
                <p>{technologies[activeTechnology].name} · {technologies[activeTechnology].category}</p>
                <div className='about-technology-options' aria-label='Choose a technology'>
                  {technologies.map((technology, index) => (
                    <button key={technology.name} type='button' aria-pressed={activeTechnology === index} onClick={() => setActiveTechnology(index)}>{technology.name}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className='about-intro-wrap'>
              <p className='about-intro'>I’m a Software Engineering Technology graduate from Conestoga College, building my path into software engineering. Through independent projects, IT deployment work at IBM, and leading a retail team, I’ve developed a practical approach to solving problems and working with people. I’m looking for an entry-level software engineering role where I can contribute, learn, and grow.</p>
            </div>
        </div>

        <div>
          <div className='about-section-gap'></div>
        </div>
      </div>

    <section ref={teamSectionRef} className="agency-team-section" aria-labelledby="work-experience-heading">
      <h2 id="work-experience-heading" className="about-experience-heading">Work experience</h2>
      {!compactLayout && <div className="agency-team-preview-anchor">
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
      </div>}

      <div className="agency-team-list">
        {teamMembers.map((member, index) => (
          <div className='agency-experience-item' key={member.name}>
          <button
            id={`experience-button-${index}`}
            type="button"
            className={`agency-team-row ${activeTeam === index ? 'is-active' : ''}`}
            onPointerDown={(event) => { touchSelectionRef.current = event.pointerType !== 'mouse'; }}
            onPointerEnter={(event) => {
              if (!compactLayout && event.pointerType === 'mouse') { touchSelectionRef.current = false; setActiveTeam(index); }
            }}
            onPointerLeave={(event) => {
              if (!compactLayout && event.pointerType === 'mouse' && document.activeElement !== event.currentTarget) setActiveTeam(null);
            }}
            onFocus={() => { if (!compactLayout && !touchSelectionRef.current) setActiveTeam(index); }}
            onBlur={() => { if (!compactLayout && !touchSelectionRef.current) setActiveTeam(null); }}
            onClick={() => {
              if (compactLayout || touchSelectionRef.current) setActiveTeam((current) => current === index ? null : index);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setActiveTeam(null);
              if (!compactLayout && (event.key === 'Enter' || event.key === ' ')) { touchSelectionRef.current = false; setActiveTeam(index); }
            }}
            aria-controls={compactLayout ? `experience-detail-${index}` : activeTeam !== null ? 'experience-preview' : undefined}
            aria-expanded={activeTeam === index}
            aria-label={`${member.name}, ${member.role}, ${member.dates}. ${member.caption}`}
          >
            <span className="agency-team-role">{member.role}<span className="about-dates">{member.dates}</span></span>
            <span className="agency-team-name">{member.name}</span>
            <span className="agency-team-arrow" aria-hidden="true">↗</span>
          </button>
          {compactLayout && <div id={`experience-detail-${index}`} className='agency-experience-detail' role='region' aria-labelledby={`experience-button-${index}`} hidden={activeTeam !== index}>
            {activeTeam === index && <>
              <img src={member.image} alt={`${member.name} experience`} />
              <p>{member.caption}</p>
            </>}
          </div>}
          </div>
        ))}
      </div>
    </section>

    <Footer />
    </div>
  )
}


export default About


