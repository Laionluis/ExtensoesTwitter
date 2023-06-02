
if (typeof browser === "undefined") {
    var browser = chrome;
}
browser.runtime.onMessage.addListener(processRequest)

function processRequest(request) {
    switch (request.type) {
        case 'video':
            downloadVideo(request.url, request.id);
            break
    }
}

function fileExtension(url) {
    const splited = url.split('.')
    return splited[splited.length - 1].split('?')[0]
}

function downloadVideo(url, id){
    browser.storage.sync.get({
        spcificPathName: false,
        readableName: false
    }).then((items) => {
        let options = {
            url: url,
            saveAs: items.spcificPathName
        }
        if (items.readableName) {
            options.filename = id + '.' + fileExtension(url)
        }
        browser.downloads.download(options)
    })
}