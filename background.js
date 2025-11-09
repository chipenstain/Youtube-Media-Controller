let prevCmdPressCount = 0;
let prevHandler = null;

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
                prevCmdPressCount++;

                if (prevCmdPressCount === 1) {
                    prevHandler = setTimeout(() => {
                        prevCmdPressCount = 0;
                        chrome.scripting.executeScript({
                            target: {tabId: tab},
                            func: goToBegin
                        });
                    }, 100);
                } else {
                    clearTimeout(prevHandler);
                    chrome.scripting.executeScript({
                        target: {tabId: tab},
                        func: prevTrack
                    });
                }
                break;
            default:
                break;
        }
    }
});

function playPause() {
    const video = document.querySelector("video");
    if (video)
    {
        video.paused ? video.play() : video.pause();
    } else {
        // Youtube Shorts
        const shortsPlayButton = document.querySelector("button[aria-label='Play'], button[aria-label='Pause']");
        shortsPlayButton?.click();
    }
}

function nextTrack() {
    const nextButton = document.querySelector(".ytp-next-button") || document.querySelector("button[aria-label='Next']");
    nextButton?.click();
}

function prevTrack() {
    const prevButton = document.querySelector(".ytp-prev-button") || document.querySelector("button[aria-label='Previous']");
    prevButton?.click();
}

function goToBegin(){
    if (location.pathname.startsWith("/shorts/")) {
        prevTrack();
    }

    const video = document.querySelector("video");
    if (video)
    {
        video.currentTime = 0;
    }
}