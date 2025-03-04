import { _ } from "../../shared/deps.ts"
import { SpotifyLoc, SpotifyURI } from "../../shared/util.ts"

import { CONFIG } from "./settings.ts"

const { URI, ContextMenu } = Spicetify
const { History, RootlistAPI } = Spicetify.Platform

const createAnonRadio = (uri: SpotifyURI) => {
    const sse = new EventSource(`https://open.spoqify.com/anonymize?url=${uri.substring(8)}`)
    sse.addEventListener("done", e => {
        sse.close()
        const anonUri = URI.fromString(e.data)

        History.push(anonUri.toURLPath(true))
        RootlistAPI.add([anonUri.toURI()], SpotifyLoc.after.fromUri(CONFIG.anonymizedRadiosFolderUri))
    })
}

new ContextMenu.Item(
    "Create anonymized radio",
    ([uri]) => createAnonRadio(uri),
    ([uri]) => _.overSome([URI.isAlbum, URI.isArtist, URI.isPlaylistV1OrV2, URI.isTrack])(uri),
    "podcasts",
).register()

new ContextMenu.Item(
    "Choose for Anonymized Radios",
    ([uri]) => (CONFIG.anonymizedRadiosFolderUri = uri),
    ([uri]) => URI.isFolder(uri),
    "playlist-folder",
).register()
