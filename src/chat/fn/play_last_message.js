export async function play_last_message(response = null) {
    const last_message = Array.from(document.querySelectorAll(".message")).at(-1);
    const last_media = last_message ? last_message.querySelector("audio, iframe") : null;
    if (last_media) {
        if (last_media.tagName == "IFRAME") {
            if (YT) {
                async function onPlayerReady(event) {
                    event.target.setVolume(100);
                    event.target.playVideo();
                }
                player = new YT.Player(new_media, {
                    events: {
                        'onReady': onPlayerReady,
                    }
                });
            }
        } else {
            if (response) {
                last_media.src = `data:audio/mpeg;base64,${response.choices[0].message.audio.data}`;
            }
            last_media.play();
        }
    }
}
