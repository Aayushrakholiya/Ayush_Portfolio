import { useContext, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { NavbarContext } from '../../context/NavbarContext'
import './HomeContact.css'

const HomeContact = () => {
  const contactRef = useRef(null)
  const { isIntroComplete, isPageRevealStarted } = useContext(NavbarContext)
  const isVisible = isIntroComplete && isPageRevealStarted

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const elements = gsap.utils.toArray('.home-contact__content > *', contactRef.current)
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!isVisible) {
        gsap.set(elements, { autoAlpha: 0, y: reduceMotion ? 0 : 80 })
        return
      }

      gsap.fromTo(elements,
        { autoAlpha: 0, y: reduceMotion ? 0 : 80 },
        {
          autoAlpha: 1,
          y: 0,
          delay: reduceMotion ? 0 : 0.35,
          duration: reduceMotion ? 0 : 0.8,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.12,
        },
      )
    }, contactRef)

    return () => context.revert()
  }, [isVisible])

  return (
    <section ref={contactRef} aria-label='Get in touch' className={`home-contact ${isVisible ? 'home-contact--visible' : ''}`}>
      <div className='home-contact__content'>
        <p className='home-contact__intro'>
          <span className='home-contact__spark' aria-hidden='true'>✳</span>
          Ayush here. Got a spark?
        </p>
        <a
          href='mailto:rakholiyaayush861@gmail.com?subject=Hi%20Ayush!'
          className='home-contact__link'
          tabIndex={isVisible ? undefined : -1}
        >
          <span>Say hi!</span>
          <svg className='home-contact__arrow' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
            <path d='M7 25 25 7M7 7h18v18' stroke='currentColor' strokeWidth='2' />
          </svg>
        </a>
      </div>
    </section>
  )
}

export default HomeContact
