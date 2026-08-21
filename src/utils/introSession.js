const INTRO_SESSION_KEY = 'k72-multilingual-loader-seen'

export const hasSeenIntroThisSession = () => {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export const markIntroSeenThisSession = () => {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true')
  } catch {
    // The intro remains functional when browser storage is unavailable.
  }
}
