import { useCallback, useEffect, useRef, useState } from 'react';

const storageKey = 'ayush-contact-visitor';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function LikeButton() {
  const [state, setState] = useState({ count: null, liked: false, busy: false, error: '' });
  const visitor = useRef(null);
  const busy = useRef(false);
  const sequence = useRef(0);
  const mounted = useRef(false);

  const request = useCallback(async (method = 'GET') => {
    if (busy.current) return;
    const version = ++sequence.current;
    if (method === 'POST') busy.current = true;
    setState(previous => ({ ...previous, busy: method === 'POST', error: '' }));
    try {
      if (!visitor.current) {
        const saved = localStorage.getItem(storageKey);
        const identifier = uuidPattern.test(saved || '') ? saved : crypto.randomUUID();
        localStorage.setItem(storageKey, identifier);
        visitor.current = identifier;
      }
      const response = await fetch('/api/contact/likes', {
        method,
        headers: { 'X-Visitor-Id': visitor.current },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(response.status === 429 ? 'A little too fast. Please try again in a minute.' : 'Likes are unavailable right now. Please try again.');
      const data = await response.json();
      if (!Number.isSafeInteger(data.count) || data.count < 0 || typeof data.liked !== 'boolean') throw new Error('Likes are unavailable right now. Please try again.');
      if (mounted.current && version === sequence.current) setState({ ...data, busy: false, error: '' });
    } catch (error) {
      if (mounted.current && version === sequence.current) setState(previous => ({ ...previous, busy: false, error: error.name === 'SecurityError' ? 'Allow browser storage to leave a like.' : error.message.includes('Please try') ? error.message : 'Could not connect. Please try again.' }));
    } finally {
      if (method === 'POST') busy.current = false;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    request();
    const refresh = () => { if (document.visibilityState === 'visible') request(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { mounted.current = false; window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [request]);

  return <div className="contact-appreciation">
    <button className={`contact-like ${state.liked ? 'is-liked' : ''}`} type="button" disabled={state.liked || state.busy} onClick={() => request('POST')} aria-label={state.liked ? 'You liked this website' : 'Like this website'}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
      <span>{state.busy ? 'Sending…' : state.liked ? 'Liked' : 'Leave a like'}</span>
      {state.count !== null && <span className="contact-like__count">{state.count.toLocaleString()}</span>}
    </button>
    <div className="contact-like__status" aria-live="polite" aria-atomic="true">
      {state.error || (state.liked ? 'Thanks for the love.' : 'A little love goes a long way.')}
      {state.error && <button className="contact-text-link" onClick={() => request()}>Retry connection</button>}
    </div>
  </div>;
}
