import React from 'react'
import { Link } from 'react-router-dom'

const dashboard = () => {
  return (
    <div>
        <p>this is dashboard</p>
        <Link to="/EnviPolicy">go to projects</Link>
    </div>
  )
}

export default dashboard