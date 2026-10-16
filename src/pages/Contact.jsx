import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import LikeButton from '../components/contact/LikeButton';
import BookingCalendar from '../components/contact/BookingCalendar';
import { contact } from '../data/contact';
import { useContactPresentation } from '../hooks/useContactPresentation';
import './Contact.css';

export default function Contact() {
  const ref = useRef(null);
  useContactPresentation(ref, 'Let’s talk | Ayush Rakholiya');
  return <main ref={ref} className="contact-page">
    <section className="contact-hero" data-logo-color="white">
      <div className="contact-eyebrow" data-contact-intro><span>Contact / Ayush Rakholiya</span><span className="contact-small-note">Good things start with a hello.</span></div>
      <h1 className="contact-title" data-contact-intro>LET’S <span>TALK<span className="contact-title-dot">.</span></span></h1>
      <div className="contact-hero__bottom">
        <div className="contact-introduction" data-contact-intro>
          <p>Something caught your eye? Let’s work together—email me or book a chat. Just exploring? Leave a like.</p>
          <div className="contact-actions"><a className="contact-pill contact-pill--lime" href={contact.emailHref}>Send an email <span aria-hidden="true">↗</span></a><Link className="contact-pill" to="/resume">View résumé <span aria-hidden="true">↗</span></Link></div>
        </div>
        <div data-contact-intro><LikeButton /></div>
      </div>
      <a className="contact-scroll-link" href="#book-a-chat">Or, let’s put something on the calendar <span aria-hidden="true">↓</span></a>
    </section>
    <section className="contact-booking" id="book-a-chat" data-logo-color="black" aria-labelledby="booking-title">
      <div className="contact-booking-copy" data-contact-reveal>
        <p className="contact-eyebrow">01 / Make a connection</p>
        <h2 id="booking-title">LET’S <br />FIND <br />A TIME<span>.</span></h2>
        <p className="contact-booking-description">A 30-minute chat about opportunities, ideas, or working together.</p>
        <p className="contact-booking-aside">Recruiters, collaborators,<br />and curious minds—welcome.</p>
      </div>
      <BookingCalendar />
    </section>
    <div data-logo-color="white"><Footer /></div>
  </main>;
}
