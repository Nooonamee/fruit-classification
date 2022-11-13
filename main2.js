const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var tb = $(".tb")
var db = []
var records = 100


fetch("https://api.thingspeak.com/channels/1909224/feeds.json?results=" + records)
    .then(res => res.json())
    .then(res => {
        var pre_r = 0
        var pre_g = 0
        var pre_y = 0
        var pre_d = new Date(res.feeds[0].created_at)
        res.feeds.forEach((entry, i) => {
            var d = new Date(entry.created_at)
            d = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+"\n"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            r = parseInt(entry.field1)
            g = parseInt(entry.field2)
            y = parseInt(entry.field3)
            if (r - pre_r < 0 || g - pre_g < 0 || y - pre_y < 0) {
                if (!isNaN(pre_y)&&pre_r+pre_g+pre_y>0) db.push([pre_d, pre_r, pre_y, pre_g])
            }
            pre_d = d
            pre_r = r
            pre_y = y
            pre_g = g
        })
        db.push([pre_d, pre_r, pre_y, pre_g])
    })
    .then(() => {
        var predict_r = 0
        var predict_y = 0
        var predict_g = 0
        db.forEach(e => {
            predict_r += e[1]
            predict_y += e[2]
            predict_g += e[3]
            tb.innerHTML += 
            `<tr>
            <td>${e[0]}</td>
            <td>${e[1]}</td>
            <td>${e[2]}</td>
            <td>${e[3]}</td>
            <td>${e[1]+e[2]+e[3]}</td>
            </tr>`
        })
        var predict_sum = predict_r + predict_g + predict_y
        tb.innerHTML += 
            `<tr>
                <td>Tổng</td>
                <td>${predict_r}</td>
                <td>${predict_y}</td>
                <td>${predict_g}</td>
                <td>${predict_sum}</td>
            </tr>`
        predict_sum /= db.length
        predict_r /= db.length
        predict_y /= db.length
        predict_g /= db.length
        tb.innerHTML += 
            `<tr>
                <td>Dự đoán mùa tiếp theo</td>
                <td>${Math.round(predict_r)}</td>
                <td>${Math.round(predict_y)}</td>
                <td>${Math.round(predict_g)}</td>
                <td>${Math.round(predict_sum)}</td>
            </tr>`
    })
