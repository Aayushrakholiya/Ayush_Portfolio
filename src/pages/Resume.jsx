import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import { contact } from '../data/contact';
import { useContactPresentation } from '../hooks/useContactPresentation';
import './Contact.css';

export default function Resume() {
  const ref = useRef(null);
  const [status, setStatus] = useState('loading');
  useContactPresentation(ref, 'Résumé | Ayush Rakholiya');
  useEffect(() => {
    const controller = new AbortController();
    fetch(contact.resumePath, { method: 'HEAD', cache: 'no-cache', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) })
      .then(response => setStatus(response.ok && response.headers.get('content-type')?.includes('application/pdf') ? 'ready' : 'unavailable'))
      .catch(() => { if (!controller.signal.aborted) setStatus('unavailable'); });
    return () => controller.abort();
  }, []);

  return <main ref={ref} className="contact-page resume-page">
    <section className="resume-content" data-logo-color="white">
      <Link className="contact-back" to="/contact">← Back to contact</Link>
      <p className="contact-eyebrow" data-contact-intro>Ayush Rakholiya / The details</p>
      <h1 data-contact-intro>MY RÉSUMÉ<span>.</span></h1>
      <p className="resume-intro" data-contact-intro>A closer look at my experience, skills, and the work behind the website.</p>
      {status === 'ready' ? <>
        <div className="contact-actions"><a className="contact-pill contact-pill--lime" href={contact.resumePath} download="Ayush-Rakholiya-Resume.pdf">Download PDF <span aria-hidden="true">↓</span></a><a className="contact-pill" href={contact.resumePath} target="_blank" rel="noreferrer">Open PDF <span aria-hidden="true">↗</span></a></div>
        <p className="resume-preview-note">If the preview isn’t supported on your device, open or download the PDF above.</p>
        <object className="resume-preview" data={contact.resumePath} type="application/pdf" aria-label="Ayush Rakholiya résumé PDF" data-lenis-prevent><p>Preview unavailable. <a href={contact.resumePath}>Open the PDF</a>.</p></object>
      </> : <div className="resume-unavailable" role="status"><h2>{status === 'loading' ? 'Getting the details…' : 'The latest résumé is on its way.'}</h2>{status !== 'loading' && <><p>Email me and I’ll share a copy with you.</p><a className="contact-pill contact-pill--lime" href={contact.emailHref}>Request my résumé ↗</a></>}</div>}
    </section>
    <div data-logo-color="white"><Footer /></div>
  </main>;
}
