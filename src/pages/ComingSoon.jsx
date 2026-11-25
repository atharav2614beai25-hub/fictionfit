import { Link } from 'react-router-dom'

// Used for the "page not found" screen.
export default function ComingSoon({ title, phase }) {
  return (
    <section className="soon">
      <h1>{title}</h1>
      {phase
        ? <p>This page is built in Phase {phase}.</p>
        : <p>That address does not exist. Head back to the homepage.</p>}
      <Link className="btn" to="/">Back to home</Link>
    </section>
  )
}
