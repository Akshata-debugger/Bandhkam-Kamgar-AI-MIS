import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './PublicGallery.css'

const categories = [['office','कार्यालय','Office'],['activities','उपक्रम','Activities'],['meetings','बैठका','Meetings'],['registration-camps','नोंदणी शिबिरे','Registration Camps'],['scholarships','शिष्यवृत्ती','Scholarships'],['awareness','जनजागृती','Awareness'],['events','कार्यक्रम','Events'],['festivals','सण','Festivals']]

export default function PublicGallery({ language = 'mr', records = [] }) {
  const [category, setCategory] = useState('office'); const [selected, setSelected] = useState(null)
  useEffect(() => { const escape = event => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape) }, [])
  const items = records.filter(item => item.category === category)
  return <section className="public-gallery"><div className="gallery-filters">{categories.map(([key,mr,en]) => <button key={key} className={category === key ? 'active' : ''} onClick={() => setCategory(key)}>{language === 'mr' ? mr : en}</button>)}</div>{items.length ? <div className="gallery-grid-public">{items.map(item => <button key={item.id || item.image_path} onClick={() => setSelected(item)}><img src={item.image_path} alt={language === 'mr' ? item.caption_mr || '' : item.caption_en || item.caption_mr || ''}/><span>{language === 'mr' ? item.caption_mr : item.caption_en || item.caption_mr}</span></button>)}</div> : <div className="gallery-empty"><b>▧</b><p>{language === 'mr' ? 'या विभागात अद्याप छायाचित्रे उपलब्ध नाहीत.' : 'No images available in this category.'}</p></div>}{selected && <div className="gallery-lightbox" onClick={() => setSelected(null)}><button className="gallery-close" onClick={() => setSelected(null)}><X /></button><figure onClick={event => event.stopPropagation()}><img src={selected.image_path} alt=""/><figcaption>{language === 'mr' ? selected.caption_mr : selected.caption_en || selected.caption_mr}</figcaption></figure></div>}</section>
}
