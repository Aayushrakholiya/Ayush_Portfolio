const configuredBooking = (
  import.meta.env.VITE_CAL_BOOKING_URL ?? 'https://cal.com/ayush-rakholiya-dcatmx/30min'
).trim();
let bookingUrl = null;
try {
  const url = new URL(configuredBooking);
  if (url.protocol === 'https:' && url.hostname === 'cal.com' && url.pathname.split('/').filter(Boolean).length >= 2) {
    bookingUrl = url.href;
  }
} catch { /* An unconfigured scheduler uses the email fallback. */ }

export const contact = {
  email: 'rakholiyaayush861@gmail.com',
  emailHref: 'mailto:rakholiyaayush861@gmail.com?subject=Hi%20Ayush!',
  resumePath: '/resume/ayush-rakholiya-resume.pdf',
  bookingUrl,
};
