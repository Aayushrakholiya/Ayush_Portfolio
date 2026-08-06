import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'

const HomeBottomText = () => {
  const linksRef = useRef(null)

  useEffect(() => {
    if (!linksRef.current) return

    const links = Array.from(linksRef.current.children)

    gsap.set(links, {
      opacity: 0,
      y: 80,
    })

    gsap.to(links, {
      opacity: 1,
      y: 0,
      delay: 1.3,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.3,
    })
  }, [])

  return (
    <div>
      <div ref={linksRef} className='font-[Lausanne] flex items-center justify-center gap-5 pb-[10px] hover:border-[#D3FD50]'>
        <Link className='text-[6.5vw] leading-[5.5vw] border-3 pt-[10px] border-white rounded-full px-8 uppercase font-extrabold hover:border-[#d3fd51] hover:text-[#d3fd51]' to='/project'>Work</Link>
        <Link className='text-[6.5vw] leading-[5.5vw] border-3 pt-[10px] border-white rounded-full px-8 uppercase font-black hover:border-[#d3fd51] hover:text-[#d3fd51]' to='/agence'>Agence</Link>
      </div>
    </div>
  )
}

export default HomeBottomText
