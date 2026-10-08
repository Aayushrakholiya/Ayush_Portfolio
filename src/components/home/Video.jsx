import { useContext, useEffect, useRef } from 'react'
import { NavbarContext } from '../../context/NavbarContext'

const Video = ({ paused = false }) => {
  const videoRef = useRef(null)
  const { isIntroComplete } = useContext(NavbarContext)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    if (!isIntroComplete || paused) {
      video.pause()
      return
    }

    video.play().catch(() => undefined)
    return () => video.pause()
  }, [isIntroComplete, paused])

  return (
      <video
        ref={videoRef}
        className='block h-full w-full object-cover'
        autoPlay={isIntroComplete && !paused}
        preload='metadata'
        aria-hidden='true'
        tabIndex={-1}
        loop
        muted
        playsInline
      >
        <source src='/hereSectionVideo.mp4' type='video/mp4' />
      </video>
  )
}

export default Video
