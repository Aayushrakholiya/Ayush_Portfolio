import { useContext, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavbarContext } from '../context/NavbarContext';

gsap.registerPlugin(ScrollTrigger);

export function useContactPresentation(ref, title) {
  const { isPageTransitionComplete } = useContext(NavbarContext);
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    let frame;
    const update = () => {
      let color = 'white';
      ref.current?.querySelectorAll('[data-logo-color]').forEach(section => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= 34 && bounds.bottom > 34) color = section.dataset.logoColor;
      });
      document.body.classList.toggle('logo-black', color === 'black');
      document.body.classList.toggle('logo-white', color === 'white');
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      document.title = previous;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.body.classList.remove('logo-black', 'logo-white');
    };
  }, [ref, title]);

  useLayoutEffect(() => {
    if (!isPageTransitionComplete || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.from('[data-contact-intro]', { y: 32, opacity: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' });
      gsap.utils.toArray('[data-contact-reveal]').forEach(element => {
        gsap.from(element, { y: 24, opacity: 0, duration: 0.65, scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
      });
    }, ref);
    return () => context.revert();
  }, [isPageTransitionComplete, ref]);
}
