import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './MultilingualLoader.css'
import { NavbarContext } from '../../context/NavContext'
import {
  hasSeenIntroThisSession,
  markIntroSeenThisSession,
} from '../../utils/introSession'

const GREETINGS = [
  { text: 'Hello.', lang: 'en' },
  { text: 'नमस्ते।', lang: 'hi' },
  { text: 'Bonjour.', lang: 'fr' },
  { text: 'નમસ્તે.', lang: 'gu' },
]

const GREETING_DURATION = 800
const FINAL_GREETING_PAUSE = 260
const REDUCED_MOTION_DURATION = 450
const EXIT_FALLBACK_DELAY = 1000

const MultilingualLoader = () => {
  const { setIsIntroComplete } = useContext(NavbarContext)
  const [shouldShowLoader] = useState(() => !hasSeenIntroThisSession())
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const stairsRef = useRef(null)
  const hasFinishedRef = useRef(false)
  const [prefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return

    hasFinishedRef.current = true
    setIsFinished(true)
    setIsIntroComplete(true)
  }, [setIsIntroComplete])

  useEffect(() => {
    if (!shouldShowLoader) return

    markIntroSeenThisSession()
  }, [shouldShowLoader])

  useEffect(() => {
    if (!shouldShowLoader) return

    let isActive = true
    const timerIds = new Set()

    const schedule = (callback, delay) => {
      const timerId = window.setTimeout(() => {
        timerIds.delete(timerId)

        if (isActive) callback()
      }, delay)

      timerIds.add(timerId)
    }

    if (prefersReducedMotion) {
      schedule(() => setIsLeaving(true), REDUCED_MOTION_DURATION)
    } else {
      let nextGreetingIndex = 0

      const advanceGreeting = () => {
        schedule(() => {
          if (nextGreetingIndex < GREETINGS.length - 1) {
            nextGreetingIndex += 1
            setCurrentGreetingIndex(nextGreetingIndex)
            advanceGreeting()
            return
          }

          schedule(() => setIsLeaving(true), FINAL_GREETING_PAUSE)
        }, GREETING_DURATION)
      }

      advanceGreeting()
    }

    return () => {
      isActive = false
      timerIds.forEach((timerId) => window.clearTimeout(timerId))
      timerIds.clear()
    }
  }, [prefersReducedMotion, shouldShowLoader])

  useEffect(() => {
    if (!isLeaving || isFinished) return

    if (prefersReducedMotion) {
      const reducedMotionTimerId = window.setTimeout(finish, 200)

      return () => window.clearTimeout(reducedMotionTimerId)
    }

    const stairs = gsap.utils.toArray(
      '.multilingual-loader__stair',
      stairsRef.current,
    )

    const tween = gsap.to(stairs, {
      yPercent: 105,
      duration: 0.6,
      stagger: {
        amount: -0.25,
      },
      ease: 'power2.inOut',
      onComplete: finish,
    })

    const fallbackTimerId = window.setTimeout(finish, EXIT_FALLBACK_DELAY)

    return () => {
      tween.kill()
      window.clearTimeout(fallbackTimerId)
    }
  }, [finish, isFinished, isLeaving, prefersReducedMotion])

  if (!shouldShowLoader || isFinished) return null

  const greeting = GREETINGS[currentGreetingIndex]

  return (
    <div
      className={`multilingual-loader${isLeaving ? ' multilingual-loader--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Website loading"
    >
      <div ref={stairsRef} className="multilingual-loader__stairs" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="multilingual-loader__stair" />
        ))}
      </div>

      <div className="multilingual-loader__word-window">
        <p
          key={greeting.lang}
          className="multilingual-loader__word"
          lang={greeting.lang}
        >
          {greeting.text}
        </p>
      </div>
    </div>
  )
}

export default MultilingualLoader
