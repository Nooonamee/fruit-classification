const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var tb = $(".tb")
var chili_r = $(".chili_r")
var chili_y = $(".chili_y")
var chili_g = $(".chili_g")
var price = $$(".price")
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
            y = parseInt(entry.field2)
            g = parseInt(entry.field3)
            if (r - pre_r < 0 || g - pre_g < 0 || y - pre_y < 0) {
                if (!isNaN(pre_y)&&pre_r+pre_g+pre_y>0) db.push([pre_d, pre_r, pre_y, pre_g])
            }
            pre_d = d
            pre_r = r
            pre_y = y
            pre_g = g
        })
        db.push(["Vụ mùa hiện tại", pre_r, pre_y, pre_g])
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
                <td class="indam">Tổng</td>
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
                <td class="indam">Dự đoán mùa tiếp theo</td>
                <td class="indam">${Math.round(predict_r)}</td>
                <td class="indam">${Math.round(predict_y)}</td>
                <td class="indam">${Math.round(predict_g)}</td>
                <td class="indam">${Math.round(predict_sum)}</td>
            </tr>`
    })
    .then(()=> {
        var len = db.length
        var change_r
        if (db[len-1][1]-db[len-2][1] >= 0){
            change_r = "TĂNG "+(db[len-1][1]-db[len-2][1])+" quả ~"+Math.round((db[len-1][1]/db[len-2][1])*100-100)+"%"
        } else change_r = "GIẢM "+(db[len-2][1]-db[len-1][1])+" quả ~"+Math.round(100-(db[len-1][1]/db[len-2][1])*100)+"%"
        chili_r.innerHTML += change_r
        var change_y
        if (db[len-1][2]-db[len-2][2] >= 0){
            change_y = "TĂNG "+(db[len-1][2]-db[len-2][2])+" quả ~"+Math.round((db[len-1][2]/db[len-2][2])*100-100)+"%"
        } else change_y = "GIẢM "+(db[len-2][2]-db[len-1][2])+" quả ~"+Math.round(100-(db[len-1][2]/db[len-2][2])*100)+"%"
        chili_y.innerHTML += change_y
        var change_g
        if (db[len-1][3]-db[len-2][3] >= 0){
            change_g = "TĂNG "+(db[len-1][3]-db[len-2][3])+" quả ~"+Math.round((db[len-1][3]/db[len-2][3])*100-100)+"%"
        } else change_g = "GIẢM "+(db[len-2][3]-db[len-1][3])+" quả ~"+Math.round(100-(db[len-1][3]/db[len-2][3])*100)+"%"
        chili_g.innerHTML += change_g
    })
    .then(()=> {
        var len = db.length
        var pr = price[0].value
        var tong=pr*db[len-1][1] + price[1].value*db[len-1][2] + price[2].value*db[len-1][3]
        price.forEach((p, i)=>{
            p.addEventListener("change", ()=>{
                tong = tong-pr*db[len-1][i+1]/4 + p.value*db[len-1][i+1]/4
                $(".u").innerHTML=tong
                pr=p.value
            })
        })
        $(".u").innerHTML=(tong/4)
    })
