import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Video from './Video'

gsap.registerPlugin(SplitText)

const HomeHeroText = () => {
  const textRef = useRef(null)
  const splitRef = useRef(null)

  useEffect(() => {
    if (!textRef.current) return

    const initSplitText = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      splitRef.current = SplitText.create(textRef.current, {
        type: 'lines',
      })

      gsap.set(splitRef.current.lines, {
        opacity: 0,
        y: -120,
      })

      gsap.to(splitRef.current.lines, {
        opacity: 1,
        y: 0,
        delay: 1.3,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
      })
    }

    initSplitText()

    return () => {
      splitRef.current?.revert()
    }
  }, [])

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
