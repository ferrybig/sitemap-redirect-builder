import { useState } from 'react'
import parseSitemap from './parseSitemap'
import Replacements from './Replacements'
import { Replacement } from './types'
import Output from './Output'
import classes from './App.module.css'


function App() {
  const [oldSitemap, setOldSitemap] = useState("")
  const [newSitemap, setNewSitemap] = useState("")
  const [replacements, setReplacements] = useState<Replacement[]>([])
  const parsedOldSitemap = parseSitemap(oldSitemap);
  const parsedNewSitemap = parseSitemap(newSitemap);
  return (
    <>
      <div className={classes.sitemap}>
        <h2>Old sitemap</h2>
        <textarea value={oldSitemap} onChange={e => setOldSitemap(e.currentTarget.value)} placeholder='Place old sitemap here'/>
        <p style={{ color: parsedOldSitemap.type==='error' ? 'red' : ''}}>{parsedOldSitemap.error ?? parsedOldSitemap.urls.length + " url's loaded"}</p>
      </div>
      <div className={classes.sitemap}>
        <h2>New sitemap</h2>
        <textarea value={newSitemap} onChange={e => setNewSitemap(e.currentTarget.value)} placeholder='Place new sitemap here'/>
        <p style={{ color: parsedNewSitemap.type==='error' ? 'red' : ''}}>{parsedNewSitemap.error ?? parsedNewSitemap.urls.length + " url's loaded"}</p>
      </div>
      <div className={classes.left}>
        <h2>Replacements</h2>
        <Replacements oldSitemap={parsedOldSitemap} newSitemap={parsedNewSitemap} replacements={replacements} onChange={setReplacements}/>
      </div>
      <div className={classes.output}>
        <h2>Output</h2>
        <Output replacements={replacements}/>
      </div>
    </>
  )
}

export default App
