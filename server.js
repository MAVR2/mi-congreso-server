const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const app = express()
const PORT = 3000
const DATA_FILE = './data/participantes.json'

app.use(cors())
app.use(bodyParser.json())

app.get('/api/listado', (req, res) => {
    const q = (req.query.q || '').toLowerCase()
    const data = JSON.parse(fs.readFileSync(DATA_FILE))
    const filtrado = q ? data.filter(p => p.nombre.toLowerCase().includes(q)) : data
    res.json(filtrado)
})

app.get('/api/participante/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE))
    const p = data.find(x => x.id === req.params.id)
    if (!p) return res.status(404).json({ error: 'No encontrado' })
    res.json(p)
})

app.post('/api/registro', (req, res) => {
    const nuevo = { id: uuidv4(), ...req.body }
    const data = JSON.parse(fs.readFileSync(DATA_FILE))
    data.push(nuevo)
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    res.status(201).json(nuevo)
})

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
