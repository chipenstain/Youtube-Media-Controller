chrome.commands.onCommand.addListener(async (command) => {
    const tabs = await chrome.tabs.query({ url: "*://www.youtube.com/*" });
    if (tabs.length) {
        const tab = (tabs.sort((a, b) => b.lastAccessed - a.lastAccessed))[0].id;

        switch (command) {
            case "play-pause":
                chrome.scripting.executeScript({
                    target: {tabId: tab},
                    func: playPause
                });
                break;
            case "next-track":
                chrome.scripting.executeScript({
                    target: {tabId: tab},
                    func: nextTrack
                });
                break;
            case "prev-track":
                chrome.scripting.executeScript({
                    target: {tabId: tab},
                    func: prevTrack
                });
                break;
            default:
                break;
        }
    }
});

function playPause() {
    if (location.pathname.startsWith("/shorts/")) {
        const shortsPlayButton = document.querySelector("#play-pause-button-shape button");
        shortsPlayButton?.click();
    } else {
        const video = document.querySelector("#ytd-player video");
        if (video)
        {
            video.paused ? video.play() : video.pause();
        }
    }
}

function nextTrack() {
    if (location.pathname.startsWith("/shorts/")) {
        const nextButton = document.querySelector("#navigation-button-down button");
        nextButton?.click();
    }
    const nextButton = document.querySelector(".ytp-next-button");
    nextButton?.click();
}

function prevTrack() {
    if (location.pathname.startsWith("/shorts/")) {
        const prevButton = document.querySelector("#navigation-button-up button");
        prevButton?.click();
    }
    const prevButton = document.querySelector(".ytp-prev-button");
    prevButton?.click();
}