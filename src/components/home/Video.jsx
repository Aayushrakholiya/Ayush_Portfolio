import { useContext, useEffect, useRef } from 'react'
import { NavbarContext } from '../../context/NavContext'

const Video = () => {
  const videoRef = useRef(null)
  const { isIntroComplete } = useContext(NavbarContext)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    if (!isIntroComplete) {
      video.pause()
      video.currentTime = 0
      return
    }

    video.currentTime = 0
    video.play().catch(() => undefined)
  }, [isIntroComplete])

  return (
    <div className='h-full w-full'>
      <video
        ref={videoRef}
        className='h-full w-full object-cover'
        autoPlay={isIntroComplete}
        loop
        muted
        playsInline
      >
        <source src='/hereSectionVideo.mp4' type='video/mp4' />
      </video>
    </div>
  )
}

export default Video
