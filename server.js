
const express = require('express')
const hbs = require('express-handlebars')

const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express()

// #############HBS Setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/',
    partialsDir: __dirname + '/views/partials'
}))

app.set('view engine', 'hbs')

// CSS
app.use('/css', express.static(__dirname + '/public/css/'))
const jsonParser = bodyParser.json()

// GET
app.get('/', (req, res) => {
    fetch('http://localhost:3004/messages').then((response => {
        response.json().then(json => {
            res.render('home', {
                articles: json
            })
        }).catch(error => {
            console.log(error)
        })
    }))
})

app.get('/add_note', (req, res) => {
    res.render('add_note')
})
app.get('/edit_note/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    fetch(`http://localhost:3004/messages/${id}`).then((response) => {

        response.json().then(json => {
            console.log(json)
            // 小心這裡render出去的東西要對應render出的template檔案
            res.render('edit_note', {
                articles: json
            })
        })

    })

})
// POST
app.post('/api/add_note', jsonParser, (req, res) => {
    // req會收到user填入前端form的資料
    // console.log(req.body)

    fetch('http://localhost:3004/messages', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json'
        }
    }) // 當server收到client傳來的資料後，便會回傳訊息給user
        .then((response) => {
            res.status(200).send()
        })
})

// Delete
app.delete('/api/delete/:id', (req, res) => {
    console.log(req.params.id)
    const id = req.params.id
    fetch(`http://localhost:3004/messages/${id}`, {
        method: 'DELETE'
    }).then((response) => {
        res.status(200).send()
    })
})

// Update
app.patch('/api/edit_note/:id', jsonParser, (req, res) => {
    const id = req.params.id
    fetch(`http://localhost:3004/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        res.status(200).send()
    })
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server up on port ${port}`)
})