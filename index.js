const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const newspapers = [
    {
        name: 'forex',
        address: 'https://www.forex.com/ie/',
        base: 'https://www.forex.com',
    },
    {
        name: 'forexfactory',
        address: 'https://www.forexfactory.com/news',
        base: 'https://www.forexfactory.com',
    }
]

const articles = []

newspapers.forEach(newspapers => {
    axios.get(newspapers.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("USD")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newspapers.name
                })
            })
        }).catch((err) => console.log(err))
})

app.get('/hello', (req, res) => {
    res.json('Welcome to my Forex Stock API!')
})


app.get('/all', (req, res) => {
    res.json(articles)
})

app.get('/all/:newspapersId', (req, res) => {
    const newspapersId = req.params.newspapersId

    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspapersId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspapersId[0].base)

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("EUR")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspapersId
                })
            })
            res.json(specificArticles)
        }).catch((err) => console.log(err))
})


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))