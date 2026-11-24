import { useEffect, useRef, useState } from 'react'
import { mountScene } from '../three/scene'

export default function TableVisualization({ people }) {
  const hostRef = useRef(null)
  const [layout, setLayout] = useState('table')
  const [selectedPerson, setSelectedPerson] = useState(null)
  useEffect(() => mountScene(hostRef.current, people, layout, setSelectedPerson), [people, layout])
  return <section className="visualization" aria-labelledby="visualization-title">
    <div className="visualization-heading"><div><p className="eyebrow">Layout {layout === 'table' ? '01' : layout === 'sphere' ? '02' : layout === 'helix' ? '03' : '04'}</p><h2 id="visualization-title">{layout === 'table' ? 'Table · 20 × 10' : layout === 'sphere' ? 'Sphere' : layout === 'helix' ? 'Double Helix' : 'Grid · 5 × 4 × 10'}</h2></div><p>Drag to rotate. Scroll to zoom.</p></div>
    <div className="layout-controls" aria-label="Visualization layout"><button className={layout === 'table' ? 'selected' : ''} type="button" onClick={() => setLayout('table')}>Table</button><button className={layout === 'sphere' ? 'selected' : ''} type="button" onClick={() => setLayout('sphere')}>Sphere</button><button className={layout === 'helix' ? 'selected' : ''} type="button" onClick={() => setLayout('helix')}>Double Helix</button><button className={layout === 'grid' ? 'selected' : ''} type="button" onClick={() => setLayout('grid')}>Grid</button></div>
    <div className="legend" aria-label="Net worth colour legend"><span className="band red">Below $100K</span><span className="band orange">$100K–$200K</span><span className="band green">Above $200K</span></div>
    {selectedPerson && <aside className="profile-detail" aria-live="polite"><img src={selectedPerson.photo} alt="" /><div><p className="eyebrow">Selected profile</p><h3>{selectedPerson.name}</h3><p>{selectedPerson.age} years old · {selectedPerson.country}</p><p>{selectedPerson.interest}</p><strong>{selectedPerson.netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></div><button type="button" onClick={() => setSelectedPerson(null)} aria-label="Close selected profile">×</button></aside>}
    <div className="table-stage" ref={hostRef} />
  </section>
}
