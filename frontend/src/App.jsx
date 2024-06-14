import { useState } from 'react'
import Card from './components/Card/card'
import Nav from './components/Nav/nav'
import './App.css'

export default function App() {
    return (
        <>
            <Nav></Nav>
            <div className="content">
                <Card title={"Test"} description="test test" date="13-06-2024" image={"https://avatars.githubusercontent.com/u/75284544?v=4"}></Card>
                <Card title={"Test"} description="test test" date="13-06-2024" image={"https://avatars.githubusercontent.com/u/75284544?v=4"}></Card>
                <Card title={"Test"} description="test test" date="13-06-2024" image={"https://avatars.githubusercontent.com/u/75284544?v=4"}></Card>
            </div>
        </>
    )
}