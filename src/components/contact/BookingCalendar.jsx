import { useState } from 'react';
import { contact } from '../../data/contact';

export default function BookingCalendar() {
  const [loaded, setLoaded] = useState(false);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your local time zone';
  const url = contact.bookingUrl ? new URL(contact.bookingUrl) : null;
  if (url) {
    url.searchParams.set('embed', 'true');
    url.searchParams.set('theme', 'light');
    url.searchParams.set('layout', 'month_view');
  }

  return <div className="contact-booking-panel">
    <div className="contact-booking-panel__top"><span>30 min / Video chat with Ayush</span><span aria-hidden="true">↗</span></div>
    {url ? <>
      <p className="contact-timezone">Your time zone: {timezone}. Check the selected time zone in the calendar before confirming.</p>
      {!loaded && <p role="status" className="contact-calendar-loading">Loading available times…</p>}
      <iframe className="contact-calendar" title="Book a 30-minute chat with Ayush" src={url.href} onLoad={() => setLoaded(true)} />
      <p className="contact-booking-help">Calendar not loading? <a href={contact.bookingUrl} target="_blank" rel="noreferrer">Open booking page ↗</a> or <a href={contact.emailHref}>email me</a>.</p>
    </> : <div className="contact-booking-empty">
      <span className="contact-calendar-mark" aria-hidden="true">↗</span>
      <h3>A good conversation<br />starts with hello.</h3>
      <p>Online booking is coming soon. Send me an email and we’ll find a time that works.</p>
      <a className="contact-pill contact-pill--dark" href={contact.emailHref}>Let’s find a time <span aria-hidden="true">↗</span></a>
    </div>}
    <div className="contact-booking-panel__bottom"><span>No pitch needed. Just say hello.</span><span aria-hidden="true">✳</span></div>
  </div>;
}
