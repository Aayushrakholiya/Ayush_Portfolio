import { useContext, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { NavbarContext } from '../../context/NavbarContext'

const HomeBottomText = () => {
  const linksRef = useRef(null)
  const { isIntroComplete, isPageRevealStarted } = useContext(NavbarContext)

  useLayoutEffect(() => {
    if (!linksRef.current) return

    const links = Array.from(linksRef.current.children)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isIntroComplete || !isPageRevealStarted) {
      gsap.set(links, {
        autoAlpha: 0,
        y: 80,
      })
      return
    }

    const tween = gsap.fromTo(
      links,
      {
        autoAlpha: 0,
        y: reduceMotion ? 0 : 80,
      },
      {
        autoAlpha: 1,
        y: 0,
        delay: reduceMotion ? 0 : 0.35,
        duration: reduceMotion ? 0 : 0.8,
        ease: 'power3.out',
        stagger: reduceMotion ? 0 : 0.3,
      },
    )

    return () => tween.kill()
  }, [isIntroComplete, isPageRevealStarted])

  return (
    <div>
      <div ref={linksRef} className='home-bottom-links font-[Lausanne] flex items-center justify-center gap-5 pb-[10px] hover:border-[#D3FD50]'>
        <Link className='text-[6.5vw] leading-[5.5vw] border-3 pt-[10px] border-white rounded-full px-8 uppercase font-extrabold hover:border-[#d3fd51] hover:text-[#d3fd51]' to='/project'>Work</Link>
        <Link className='text-[6.5vw] leading-[5.5vw] border-3 pt-[10px] border-white rounded-full px-8 uppercase font-black hover:border-[#d3fd51] hover:text-[#d3fd51]' to='/agence'>About</Link>
      </div>
    </div>
  )
}

export default HomeBottomText
