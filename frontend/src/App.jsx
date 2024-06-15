import {useState, useEffect} from 'react'
import Card from './components/Card/card'
import Nav from './components/Nav/nav'
import './App.css'

export default function App() {
	const [data, setData] = useState([])
	const [images, setImages] = useState({})
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:4200/books')
				const ids = await response.json()

				const dataPromises = ids.map(async (id) => {
					const dataResponse = await fetch(`http://localhost:4200/bookData/${id}`)
					const data = await dataResponse.json()

					const imageResponse = await fetch(`http://localhost:4200/image/${id}`)
					const imageBlob = await imageResponse.blob()
					const imageUrl = URL.createObjectURL(imageBlob)

					return {id, data, imageUrl}
				})

				const allData = await Promise.all(dataPromises)

				const data = allData.map((item) => item.data)
				const images = Object.fromEntries(allData.map((item) => [item.id, item.imageUrl]))

				setData(data)
				setImages(images)
			} catch (error) {
				console.error('Error fetching data or images:', error)
			}
		}

		fetchData()
	}, [])
	return (
		<>
			<Nav></Nav>
            <div className='content'>{ data.length ? data.map((item, index) => <Card key={ index } title={ item.title } description={ item.description } date={ item.date } image={ images[ item.id ] }></Card>) :
            <h1>Cargando...</h1> }</div>
		</>
	)
}
