import React from 'react'
import './nav.css'

export default function Nav() {
    return (
        <nav>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/random">Libro Random</a></li>
                <li><a href="/upload">Subir un Libro</a></li>
            </ul>
        </nav>
    )
}