const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var red = $(".red")
var yellow = $(".yellow")
var green = $(".green")
var sum = $(".sum")
var db = []

function get_db(records) {
    fetch("https://api.thingspeak.com/channels/1909224/feeds.json?results="+records)
        .then(res => res.json())
        .then(res => {
            num_r = parseInt(res.feeds[records-1].field1)*50
            num_y = parseInt(res.feeds[records-1].field2)*50
            num_g = parseInt(res.feeds[records-1].field3)*50
            red.innerHTML = num_r
            green.innerHTML = num_g
            yellow.innerHTML = num_y
            sum.innerHTML = num_r+num_g+num_y
        })
}
get_db(1)
setInterval(()=> {
    get_db(1)
},5000)