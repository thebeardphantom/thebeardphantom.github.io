const url = "dinner_options.txt"
const size = 650;

async function reloadDefaultOptions() {
    const r = await fetch(url);
    const t = await r.text();
    return document.querySelector("#options").value = t.trim();
}

function reloadWheelFromOptions() {
    document.querySelector("#wheel-container").innerHTML = ""
    var optionsTextBox = document.querySelector("#options")
    var optionsString = optionsTextBox.value.trim()
    var optionsArray = optionsString.split('\n')
    optionsArray.sort((a, b) => a.localeCompare(b), optionsArray)
    optionsTextBox.value = optionsArray.join("\n")
    var url = makeURL(optionsArray)
    recreateFrame(url)
}

function makeURL(options) {
    var finalURL = "https://wheeldecide.com/e.php?"
    for (var i = 0; i < options.length; i++) {
        var option = options[i]
        option = encodeURIComponent(option)
        // Remove apostrophes...
        option = option.replace(/'/g, '%27')
        finalURL += `c${(i + 1)}=${option}&`
    }
    finalURL += `col=light&time=8&width=${size}&remove=1`
    return finalURL
}

function recreateFrame(finalURL) {
    const element = `<iframe src="${finalURL}" width="${size}" height="${size}" scrolling="no" frameborder="0"></iframe>`
    document.querySelector("#wheel-container").innerHTML = element
}

window.addEventListener('load', async () => {
    await reloadDefaultOptions()
    reloadWheelFromOptions()
})