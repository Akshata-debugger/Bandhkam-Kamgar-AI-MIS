import { useEffect, useState } from 'react'
import {
  ArrowRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
  Clock3, Globe2, FileText, HeartHandshake, Camera, Mail, MapPin,
  Menu, Phone, Send, ShieldCheck, UsersRound, X,
} from 'lucide-react'
import { gallery, heroSlides, schemes } from '../data/siteContent'

const stats = [
  ['12,500+', 'Registered workers'], ['28+', 'Service centres'], ['35+', 'Welfare initiatives'], ['24/7', 'Information access'],
]

function SectionHeading({ eyebrow, title, copy, centered = false }) {
  return <div className={`section-heading ${centered ? 'centered' : ''}`}>
    <p>{eyebrow}</p><h2>{title}</h2>{copy && <span>{copy}</span>}
  </div>
}

export default function HomePage({ onOpenDashboard }) {
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  useEffect(() => { const timer = setInterval(() => setSlide((item) => (item + 1) % heroSlides.length), 6000); return () => clearInterval(timer) }, [])
  const current = heroSlides[slide]
  const changeSlide = (direction) => setSlide((slide + direction + heroSlides.length) % heroSlides.length)
  return <div className="public-site">
    <header className="site-header">
      <a className="site-brand" href="#home"><span className="brand-seal"><ShieldCheck size={27} /></span><span><b>Bandhkam Kamgar</b><small>Welfare & Services Portal</small></span></a>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'open' : ''}><a href="#about">About</a><a href="#schemes">Schemes</a><a href="#news">News</a><a href="#contact">Contact</a><button onClick={onOpenDashboard}>Staff login <ArrowRight size={16} /></button></nav>
    </header>

    <main>
      <section className="hero" id="home" style={{ backgroundImage: `linear-gradient(90deg, rgba(44, 6, 13, .88), rgba(44, 6, 13, .37)), url(${current.image})` }}>
        <div className="hero-content"><p>{current.eyebrow}</p><h1>{current.title}</h1><span>{current.text}</span><div className="hero-actions"><a href="#schemes">Explore services <ArrowRight size={18} /></a><button onClick={onOpenDashboard}>Staff portal</button></div></div>
        <div className="hero-controls"><button onClick={() => changeSlide(-1)} aria-label="Previous slide"><ChevronLeft /></button><div>{heroSlides.map((_, i) => <button className={i === slide ? 'active-dot' : ''} onClick={() => setSlide(i)} aria-label={`Show slide ${i + 1}`} key={i} />)}</div><button onClick={() => changeSlide(1)} aria-label="Next slide"><ChevronRight /></button></div>
      </section>

      <section className="welcome-section shell"><div className="welcome-art"><div><HeartHandshake size={46} /><span>Welfare • Dignity • Progress</span></div></div><div><SectionHeading eyebrow="Welcome" title="Committed to the welfare of construction workers." copy="This portal is being developed to make important welfare services clearer, simpler and easier to access for every eligible worker." /><a className="text-link" href="#about">Know our work <ArrowRight size={17} /></a></div></section>
      <section className="stat-band">{stats.map(([number, label]) => <div key={label}><b>{number}</b><span>{label}</span></div>)}</section>
      <section className="shell split-section" id="about"><div><SectionHeading eyebrow="About us" title="A people-first welfare organization." copy="Placeholder content: this space will introduce the organization, its jurisdiction, service approach and commitment to construction-worker welfare." /><p>Our focus is to bring vital support closer to workers and their families through transparent services and a respectful experience.</p></div><div className="mission-grid"><article><span><HeartHandshake /></span><h3>Our mission</h3><p>To support worker welfare through accessible, responsive and reliable services.</p></article><article><span><UsersRound /></span><h3>Our vision</h3><p>A secure and empowered future for every construction worker family.</p></article></div></section>
      <section className="scheme-section" id="schemes"><div className="shell"><SectionHeading centered eyebrow="Government schemes" title="Services designed around worker needs." copy="Scheme details and eligibility will be updated here by the organization." /><div className="scheme-grid">{schemes.map((scheme, i) => <article key={scheme.title}><span>{i === 0 ? <FileText /> : i === 1 ? <Clock3 /> : <HeartHandshake />}</span><h3>{scheme.title}</h3><p>{scheme.text}</p><a href="#contact">Learn more <ArrowRight size={16} /></a></article>)}</div></div></section>
      <section className="shell gallery-section"><SectionHeading eyebrow="Gallery" title="Connecting through service." /><div className="gallery-grid">{gallery.map((item) => <figure key={item.title}><img src={item.image} alt={item.title} /><figcaption>{item.title}</figcaption></figure>)}</div></section>
      <section className="news-section" id="news"><div className="shell two-column"><div><SectionHeading eyebrow="News & announcements" title="Stay informed." /><div className="announcement"><CalendarDays /><div><small>UPDATE • AUGUST 2026</small><h3>Welcome to the new Bandhkam Kamgar portal</h3><p>Important announcements, notices and service updates will appear here.</p></div></div><div className="announcement"><FileText /><div><small>NOTICE • PLACEHOLDER</small><h3>Information for applications and renewals</h3><p>Check this area for upcoming dates, required documents and guidance.</p></div></div></div><aside className="timing-card"><Clock3 /><p>Office timings</p><h3>Monday – Saturday</h3><b>10:00 AM – 6:00 PM</b><span>Sunday & public holidays: Closed</span></aside></div></section>
      <section className="contact-section shell" id="contact"><div><SectionHeading eyebrow="Contact us" title="We are here to help." /><div className="contact-list"><p><MapPin /> Office address will be updated here</p><p><Phone /> +91 00000 00000</p><p><Mail /> contact@bandhkam.gov.in</p></div><div className="socials"><a href="#facebook" aria-label="Facebook"><Globe2 size={19} /></a><a href="#instagram" aria-label="Instagram"><Camera size={19} /></a></div><div className="map-placeholder"><MapPin size={30} /><span>Google Maps location placeholder</span></div></div><form className="feedback-form" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><h3>Send feedback</h3><p>Help us improve the services you need.</p><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="Your email" /></label><label>Message<textarea required placeholder="How can we help?" rows="4" /></label><button type="submit">{sent ? 'Thank you for your feedback' : <>Send feedback <Send size={17} /></>}</button></form></section>
    </main>
    <footer><div className="shell footer-content"><div><a className="site-brand" href="#home"><span className="brand-seal"><ShieldCheck size={25} /></span><span><b>Bandhkam Kamgar</b><small>Welfare & Services Portal</small></span></a><p>Building a more supported future for Maharashtra’s construction workers.</p></div><div><b>Quick links</b><a href="#about">About us</a><a href="#schemes">Schemes</a><a href="#contact">Contact us</a></div><div><b>Important</b><a href="#privacy">Privacy policy</a><a href="#terms">Terms of use</a><a href="#accessibility">Accessibility</a></div></div><div className="copyright">© 2026 Bandhkam Kamgar Welfare Portal. All rights reserved.</div></footer>
  </div>
}
