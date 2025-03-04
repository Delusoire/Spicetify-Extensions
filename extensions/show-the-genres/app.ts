import { fetchLastFMTrack, spotifyApi } from "../../shared/api.ts"
import { pMchain } from "../../shared/fp.ts"
import { SpotifyURI, waitForElement } from "../../shared/util.ts"

import { CONFIG } from "./settings.ts"

import "./assets/styles.scss"
import "./components.ts"
import { fetchArtistRelated } from "../../shared/GraphQL/fetchArtistRelated.ts"
import { onHistoryChanged, onSongChanged } from "../../shared/listeners.ts"
import { _ } from "../../shared/deps.ts"

const { URI } = Spicetify

const fetchLastFMTags = async (uri: SpotifyURI) => {
    const uid = URI.fromString(uri).id
    if (!uid) return []
    const { name, artists } = await spotifyApi.tracks.get(uid)
    const artistNames = artists.map(artist => artist.name)
    const track = await fetchLastFMTrack(CONFIG.LFMApiKey, artistNames[0], name)
    const tags = track.toptags.tag.map(tag => tag.name)

    const deletedTagRegex = /^-\d{13}$/
    const blacklistedTags = ["MySpotigramBot"]
    return tags.filter(tag => !deletedTagRegex.test(tag) && !blacklistedTags.includes(tag))
}

const nowPlayingGenreContainerEl = document.createElement("genre-container")
nowPlayingGenreContainerEl.fetchGenres = fetchLastFMTags
nowPlayingGenreContainerEl.className += " ellipsis-one-line main-type-finale"
nowPlayingGenreContainerEl.style.gridArea = "genres"
;(async () => {
    const trackInfoContainer = await waitForElement("div.main-trackInfo-container")
    trackInfoContainer.appendChild(nowPlayingGenreContainerEl)
})()

onSongChanged(state => {
    nowPlayingGenreContainerEl.uri = state.item?.uri
})

const getArtistsGenresOrRelated = async (artistsUris: SpotifyURI[]) => {
    const getArtistsGenres = async (artistsUris: SpotifyURI[]) => {
        const ids = artistsUris.map(uri => URI.fromString(uri).id)
        const artists = await spotifyApi.artists.get(_.compact(ids))
        const genres = new Set(artists.flatMap(artist => artist.genres))
        return Array.from(genres)
    }

    const allGenres = await getArtistsGenres(artistsUris)

    if (allGenres.length) return allGenres

    const relatedArtists = await fetchArtistRelated(artistsUris[0])

    relatedArtists.map(artist => artist.uri)

    if (allGenres.length) return allGenres

    const artistRelated = await fetchArtistRelated(artistsUris[0])

    return _.chunk(
        artistRelated.map(a => a.uri),
        5,
    ).reduce(
        async (acc, arr5uris) => ((await acc).length ? await acc : await getArtistsGenres(arr5uris)),
        Promise.resolve([] as string[]),
    )
}

const updateArtistPage = async (uri: SpotifyURI) => {
    const artistGenreContainerEl = document.createElement("genre-container")
    artistGenreContainerEl.name = "Artist Genres"
    artistGenreContainerEl.uri = uri.toString()
    artistGenreContainerEl.fetchGenres = uri => getArtistsGenresOrRelated([uri])

    const lastHeaderTextEl = document.querySelector("div.main-entityHeader-headerText")
    const headerTextEl = await waitForElement(
        "div.main-entityHeader-headerText",
        undefined,
        undefined,
        lastHeaderTextEl,
    )
    const headerTextDetailsEl = await waitForElement("span.main-entityHeader-detailsText")
    headerTextEl.insertBefore(artistGenreContainerEl, headerTextDetailsEl)
}

onHistoryChanged(uri => URI.isArtist(uri), updateArtistPage)
