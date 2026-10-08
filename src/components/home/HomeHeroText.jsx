import { useContext, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Video from './Video'
import { NavbarContext } from '../../context/NavbarContext'

const HomeHeroText = ({ videoPaused = false }) => {
  const textRef = useRef(null)
  const { isIntroComplete, isPageRevealStarted } = useContext(NavbarContext)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const lines = gsap.utils.toArray('.home-hero__line', textRef.current)
      if (!isIntroComplete || !isPageRevealStarted) {
        gsap.set(lines, { autoAlpha: 0 })
        return
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(lines,
        { autoAlpha: 0, yPercent: reduceMotion ? 0 : -100 },
        { autoAlpha: 1, yPercent: 0, duration: reduceMotion ? 0 : 1, ease: 'power4.out', stagger: reduceMotion ? 0 : 0.12 },
      )
    }, textRef)
    return () => context.revert()
  }, [isIntroComplete, isPageRevealStarted])

  return (
    <h1 ref={textRef} className='home-hero' aria-label='The spark for all things creative'>
      <span className='home-hero__mask' aria-hidden='true'>
        <span className='home-hero__line'>The spark for</span>
      </span>
      <span className='home-hero__mask' aria-hidden='true'>
        <span className='home-hero__line'>
          <span>all</span>
          <span className='home-hero__video'><Video paused={videoPaused} /></span>
          <span>things</span>
        </span>
      </span>
      <span className='home-hero__mask' aria-hidden='true'>
        <span className='home-hero__line'>creative</span>
      </span>
    </h1>
  )
}

export default HomeHeroText
