console = window.console
log = window.console.log
const touched = []
var mutationObserver = new MutationObserver((ml, ob) => {
    ml.forEach(m => {
        if (m.target.className == "gist-meta") {
            while(m.target.childNodes.length > 3)
            {
                m.target.removeChild(m.target.firstChild)
            }
        }
    })

    // const metas = document.querySelectorAll(".gist-meta")
    // metas.forEach(m => m.style.display = "none")
    // if(evt.target.classList.contains("gist"))
    // {
    //     window.console.log("yee")
    //     evt.target.addEventListener("mouseover", evt => {
    //         window.console.log("nee")
    //     })
    // }
})

// have the observer observe foo for changes in children
mutationObserver.observe(document.getRootNode(), { childList: true, subtree: true })