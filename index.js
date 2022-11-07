const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var red = $(".red")
var yellow = $(".yellow")
var green = $(".green")
var sum = $(".sum")

fetch("https://api.thingspeak.com/channels/1909224/feeds.json?results=5")
    .then(res => res.json())
    .then(res => {
        console.log(res.feeds[0].field1)
        a = parseInt(res.feeds[0].field1)
        b = parseInt(res.feeds[0].field2)
        c = parseInt(res.feeds[0].field3)
        red.innerHTML = a
        green.innerHTML = b
        yellow.innerHTML = c
        sum.innerHTML = a+b+c
    })

setInterval(()=> {
    fetch("https://api.thingspeak.com/channels/1909224/feeds.json?results=5")
    .then(res => res.json())
    .then(res => {
        console.log(res.feeds[0].field1)
        a = parseInt(res.feeds[0].field1)
        b = parseInt(res.feeds[0].field2)
        c = parseInt(res.feeds[0].field3)
        red.innerHTML = a
        green.innerHTML = b
        yellow.innerHTML = c
        sum.innerHTML = a+b+c
    })
},5000)