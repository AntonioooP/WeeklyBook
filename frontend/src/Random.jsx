import {useState, useEffect} from 'react'
import Card from './components/Card/card'
import Nav from './components/Nav/nav'
import './App.css'

export default function Random() {
	const [data, setData] = useState([])
	const [images, setImages] = useState({})
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:4200/random')
				const data = await response.json()

				const imageResponse = await fetch(`http://localhost:4200/image/${data.id}`)
				const imageBlob = await imageResponse.blob()
				const imageUrl = URL.createObjectURL(imageBlob)

				setData([data])
				setImages([imageUrl])
			} catch (error) {
				console.error('Error fetching data or images:', error)
			}
		}

		fetchData()
	}, [])
	return (
		<>
			<Nav></Nav>
			<div className='content'>{data.length ? data.map((item, index) => <Card key={index} title={item.title} description={item.description} date={item.date} image={images[0]}></Card>) : <h1>Cargando...</h1>}</div>
		</>
	)
}
