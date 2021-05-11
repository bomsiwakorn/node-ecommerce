const express = require('express')
const app = express()
const PORT = 4000
const bodyParser = require('body-parser')
const cors = require('cors');
const mysql = require('mysql')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

const db = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'b0846485675.',
  database : 'ecommerce'
});

function insertUser(username,password) {
    return new Promise((resolve,reject) => {
        const sql = `insert into users (username,password) values ('${username}','${password}')`
        db.query(sql, (error, result) => {
            if (error) return reject(error)
            return resolve()
        })
    })
}
app.post('/register', async (req,res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const insert = await insertUser(username,password)
        return res.status(201).send({
            message: 'Register successful.'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: 'Sorry, something went wrong.'
        })
    }
})

function findUser(username,password) {
    return new Promise((resolve,reject) => {
        const sql = `select * from users where username = '${username}'`
        db.query(sql, (error,result) => {
            console.log(result);
            if (error) return reject(error)
            if (result.length === 0) {
                return reject({
                    code: '001',
                    msg: 'Username is not exist.'
                })
            }
            if (result[0].password !== password) {
                return reject({
                    code: '002',
                    msg: 'Invalid password!'
                })
            }
            return resolve(result)
        })
    })
}
app.post('/login', async (req,res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const user = await findUser(username,password)
        return res.status(200).send({
            message: 'Login successful.',
            username: username
        })
    } catch (error) {
        console.log(error)
        if (error.code === '001' || error.code === '002') {
            return res.status(500).send({
                message: error.msg
            })
        }
        return res.status(500).send({
            message: 'Sorry, something went wrong.'
        })
    }
})

app.listen(PORT, () => console.log(`Server is started mdtr. Port ${PORT}.`));
