import { useContext, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Video from './Video'
import { NavbarContext } from '../../context/NavContext'

gsap.registerPlugin(SplitText)

const HomeHeroText = () => {
  const textRef = useRef(null)
  const { isPageRevealStarted } = useContext(NavbarContext)

  useEffect(() => {
    if (!isPageRevealStarted || !textRef.current) return

    let cancelled = false
    let split
    let tween

    const initSplitText = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      if (cancelled || !textRef.current) return

      split = SplitText.create(textRef.current, {
        type: 'lines',
        mask: 'lines',
      })

      tween = gsap.fromTo(
        split.lines,
        {
          autoAlpha: 0,
          yPercent: -100,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
        },
      )
    }

    initSplitText()

    return () => {
      cancelled = true
      tween?.kill()
      split?.revert()
    }
  }, [isPageRevealStarted])

  return (
    <div ref={textRef} className='allText font-[Lausanne] text-center pt-5'>
      <div className='text-[9.5vw] justify-center flex items-center uppercase leading-[8vw]'>The spark for</div>
      <div className='text-[9.5vw] justify-center flex items-center uppercase leading-[8vw]'>all
        <div className='h-[7vw] w-[16vw] rounded-full overflow-hidden'>
          <Video />
        </div>
        things</div>
      <div className='text-[9.5vw] justify-center flex items-center uppercase leading-[8vw]'>creative</div>
    </div>
  )
}

export default HomeHeroText
