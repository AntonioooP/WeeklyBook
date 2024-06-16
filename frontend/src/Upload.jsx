import React, {useState} from 'react'
import Nav from './components/Nav/nav'
import './upload.css'

export default function Upload() {
	const [image, setImage] = useState(null)
	const [dragging, setDragging] = useState(false)
	const [error, setError] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [password, setPassword] = useState('')

	const handleDragEnter = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setDragging(true)
	}

	const handleDragLeave = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setDragging(false)
	}

	const handleDragOver = (e) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
        setDragging(false)

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setImage(e.dataTransfer.files[0])
			e.dataTransfer.clearData()
		}
	}

	const handleImageUpload = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setImage(e.target.files[0])
		}
	}

	const handleSubmit = async () => {
		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('pass', password)
		if (image) {
			formData.append('file', image)
		}

		try {
			const response = await fetch('http://localhost:4200/upload', {
				method: 'POST',
				body: formData
			})
            if (response.ok) {
                setError(false)
				window.location.href = '/'
			} else {
                if (response.status == 401) setError('Contraseña incorrecta.')
                else setError('Error al subir el libro.')
			}
		} catch (error) {
			console.error('Upload error', error)
		}
	}

	const isFormComplete = title && description && password && image

	return (
		<>
			<Nav></Nav>
			<div className='content'>
				<div>
					<label htmlFor='title'>Título</label>
					<input type='text' autoComplete='off' id='title' name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
				</div>
				<div>
					<label htmlFor='description'>Descripción</label>
					<textarea id='description' autoCorrect='false' name='description' value={description} onChange={(e) => setDescription(e.target.value)} />
				</div>
				<div>
					<label htmlFor='password'>Contraseña</label>
					<input type='password' id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<div className={`upload-container ${dragging ? 'dragging' : ''}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
					<input type='file' id='imageUpload' style={{display: 'none'}} onChange={handleImageUpload} />
					<label htmlFor='imageUpload' className='upload-label'>
						{image ? image.name : 'Arrastra una imagen o da click para subirla'}
					</label>
				</div>
                { isFormComplete && <button onClick={ handleSubmit }>Subir</button> }
                {error && <p>{error}</p>}
			</div>
		</>
	)
}
