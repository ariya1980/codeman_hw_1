const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const sampleSize = require('lodash.samplesize')

app.use(express.static('public'))

const urlencodedParser = bodyParser.urlencoded({extended: true})

const loveScoreMatrix = {
    flower:   [-1,  0,  2],
    ring:     [ 2, -1,  1],
    necklace: [ 0,  3,  0],
    tea:      [ 5,  5,  5]
  }
  
let loveScoure = 0
let dayLeft = 15
let limitScoure =  25
const calF = function() {
    return(`<div><h1>Love Score: </h1><label>${loveScoure}</label></div>
            <div><h1>Day Left: </h1><label>${dayLeft}</label></div>`)

}

const image = `
 <div>
    <img src="/pic1.png" alt="Smiley face" height="180" width="180" />
 </div>
`
const conForm = function() {
    const temp = sampleSize(Object.keys(loveScoreMatrix), 3)
    let str = `<div><h1>What do you want to give?</h1></div><form action="/give" method="post">`
    for(let i = 0; i < temp.length;i+=1){
      str += `<div><input type="submit" id="thing" name ="thing" value="`+ temp[i] +`"></input></div>`
    }
    str +=  `</form>`
    return(str)
}

const successForm = function() {
    loveScoure = 0
    dayLeft = 15
    let str = `<div><h1>Congratulation!!!</h1></div>
              <form action="/" method="get">
               <div><button type="submit">Play Again!!!</button></div>
               </form>`
    return(str)
}

const gameOverForm = function() {
    loveScoure = 0
    dayLeft = 15
    let str = `<div><h1>Game Over!!!</h1></div>
               <form action="/" method="get">
               <div><button type="submit">Play Again!!!</button></div>
               </form>`
    return(str)
}

app.get('/',function(request, response) {
    console.log('/');
    response.send(`<h1>Dating Simulator</h1>${calF()}${image}${conForm()}`)
})

app.post('/give',urlencodedParser,function(request, response) {
    console.log('/give');
    const { thing }   = request.body
    console.log(' btn : ' + thing);
    console.log(' dayLeft : ' + dayLeft);
    const keyPoint = dayLeft%3
    console.log(' keyPoint : ' + keyPoint);
    const point = loveScoreMatrix[thing][keyPoint]
    console.log(' point : ' + point);
    loveScoure += point
    dayLeft -= 1
    if(loveScoure < limitScoure && dayLeft == 0){
        response.send(`<h1>Dating Simulator</h1>${calF()}${image}${gameOverForm()}`)
    }else if(loveScoure >= limitScoure && dayLeft >= 0){
        response.send(`<h1>Dating Simulator</h1>${calF()}${image}${successForm()}`)
    }else{
        response.send(`<h1>Dating Simulator</h1>${calF()}${image}${conForm()}`)
    }
})

app.all('*',function(request, response) {
    response.redirect('/')
})

app.listen(3001)