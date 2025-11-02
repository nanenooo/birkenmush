async function loadData() {
    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyN_VagbGUeZD7ktFjF-ScLjZuVL7X9vvZSZj9ssCAQ6oGoYZIjZ8wFeuggrfE2cwVD/exec"
    )
    const events = await response.json()

    elements.tempValue.textContent = events[0].toFixed(2) + '°C'
    elements.humidityValue.textContent = events[1].toFixed(2) + '%'
    elements.maxTemp.textContent = events[3].toFixed(2) + '°C'
    elements.minTemp.textContent =events[4].toFixed(2) + '°C'
    elements.avgTemp.textContent = events[2].toFixed(2) + '°C'
    elements.maxHumidity.textContent = events[6].toFixed(2) + '%'
    elements.minHumidity.textContent = events[7].toFixed(2) + '%'
    elements.avgHumidity.textContent = events[5].toFixed(2) + '%'

    setTimeout(loadData, 2000)
}

async function loadList() {
    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwqR7D-aP5BPeUYRpzbX6v4MY2_w6jxUg2sMC3wMIlwkKgnIsf27adbSGHmPOBvzW8Z/exec"
    )
    const events = await response.text()
    document.getElementById("data_list").innerHTML = events

    //setTimeout(loadList, 2000)
}

loadData()
loadList()