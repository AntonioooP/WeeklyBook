import React from 'react'
import './card.css'
export default function Card({ title, description, date, image}) {
    return <div className="card">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>{date}</p>
        <img src={image} alt="image"/>
    </div>
}