var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// shared/api.ts
import { SpotifyApi } from "https://esm.sh/@fostertheweb/spotify-web-api-ts-sdk";

// shared/deps.ts
import { default as ld } from "https://esm.sh/lodash";
import { default as ld_fp } from "https://esm.sh/lodash/fp";
var _ = ld;

// shared/api.ts
var { CosmosAsync } = Spicetify;
var spotifyApi = SpotifyApi.withAccessToken("client-id", {}, {
  // @ts-ignore
  fetch(url, opts) {
    const { method } = opts;
    return CosmosAsync.resolve(method, url);
  },
  deserializer: {
    deserialize(res) {
      return res.body;
    }
  }
});
var fetchLastFMTrack = async (LFMApiKey, artist, trackName, lastFmUsername = "") => {
  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.append("method", "track.getInfo");
  url.searchParams.append("api_key", LFMApiKey);
  url.searchParams.append("artist", artist);
  url.searchParams.append("track", trackName);
  url.searchParams.append("format", "json");
  url.searchParams.append("username", lastFmUsername);
  const res = await fetch(url).then((res2) => res2.json());
  return res.track;
};

// shared/util.ts
var { URI } = Spicetify;
var { PlayerAPI } = Spicetify.Platform;
var PermanentMutationObserver = class extends MutationObserver {
  constructor(targetSelector, callback, opts = {
    childList: true,
    subtree: true
  }) {
    super(callback);
    this.target = null;
    new MutationObserver(() => {
      const nextTarget = document.querySelector(targetSelector);
      if (nextTarget && !nextTarget.isEqualNode(this.target)) {
        this.target && this.disconnect();
        this.target = nextTarget;
        this.observe(this.target, opts);
      }
    }).observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};
var waitForElement = (selector, timeout = 5e3, location = document.body, notEl) => new Promise((resolve, reject) => {
  const onMutation = () => {
    const el = document.querySelector(selector);
    if (el) {
      if (notEl && el === notEl) {
      } else {
        observer.disconnect();
        return resolve(el);
      }
    }
  };
  const observer = new MutationObserver(onMutation);
  onMutation();
  observer.observe(location, {
    childList: true,
    subtree: true
  });
  if (timeout)
    setTimeout(() => {
      observer.disconnect();
      console.debug("waitForElement: timed out waiting for", selector);
      reject();
    }, timeout);
});
var mainElement = document.querySelector("main");
var [REACT_FIBER, REACT_PROPS] = Object.keys(mainElement);

// shared/modules.ts
var require2 = webpackChunkopen.push([[Symbol("Dummy chunk to extract require method")], {}, (require3) => require3]);
var modules = Object.keys(require2.m).map((id) => require2(id)).filter((module) => typeof module === "object");
var exportedMembers = modules.flatMap((module) => Object.values(module)).filter(Boolean);
var exportedFunctions = exportedMembers.filter((module) => typeof module === "function");
var exportedReactObjects = Object.groupBy(exportedMembers, (x) => x.$$typeof);
var exportedContexts = exportedReactObjects[Symbol.for("react.context")];
var exportedForwardRefs = exportedReactObjects[Symbol.for("react.forward_ref")];
var exportedMemos = exportedReactObjects[Symbol.for("react.memo")];
var findByStrings = (modules2, ...filters) => modules2.find(
  (f) => filters.map(
    (filter) => typeof filter === "string" ? (s) => s.includes(filter) : (s) => filter.test(s)
  ).every((filterFn) => filterFn(f.toString()))
);
var CheckedPlaylistButtonIcon = findByStrings(
  exportedFunctions,
  "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z"
);
var Highlight = findByStrings(exportedFunctions, "hightlightClassName", "textToHighlight");
var SettingColumn = findByStrings(exportedFunctions, "setSectionFilterMatchQueryValue", "filterMatchQuery");
var SettingText = findByStrings(exportedFunctions, "textSubdued", "dangerouslySetInnerHTML");
var SettingToggle = findByStrings(exportedFunctions, "condensed", "onSelected");
var curationButtonClass = exportedMembers.find((m) => m?.curationButton).curationButton;
var rs_w = exportedForwardRefs.filter((x) => x.render?.toString().includes("hasLeadingOrMedia"));

// shared/settings.tsx
var { React, ReactDOM, LocalStorage } = Spicetify;
var { ButtonSecondary } = Spicetify.ReactComponent;
var { History } = Spicetify.Platform;
if (!globalThis.__renderSettingSections) {
  globalThis.__settingSections = /* @__PURE__ */ new Map();
  globalThis.__renderSettingSections = () => Array.from(globalThis.__settingSections.values());
}
var SettingsSection = class _SettingsSection {
  constructor(name, sectionFields = {}) {
    this.name = name;
    this.sectionFields = sectionFields;
    this.pushSettings = () => {
      __settingSections.set(this.id, /* @__PURE__ */ React.createElement(this.SettingsSection, null));
    };
    this.toObject = () => new Proxy(
      {},
      {
        get: (target, prop) => _SettingsSection.getFieldValue(this.getId(prop.toString())),
        set: (target, prop, newValue) => {
          const id = this.getId(prop.toString());
          if (_SettingsSection.getFieldValue(id) === newValue)
            return false;
          _SettingsSection.setFieldValue(id, newValue);
          return true;
        }
      }
    );
    this.addButton = (props) => {
      this.addField("button" /* BUTTON */, props, this.ButtonField);
      return this;
    };
    this.addToggle = (props, defaultValue = () => false) => {
      this.addField("toggle" /* TOGGLE */, props, this.ToggleField, defaultValue);
      return this;
    };
    this.addInput = (props, defaultValue = () => "") => {
      this.addField("input" /* INPUT */, props, this.InputField, defaultValue);
      return this;
    };
    this.getId = (nameId) => ["extensions", this.id, nameId].join(":");
    this.useStateFor = (id) => {
      const [value, setValueState] = React.useState(_SettingsSection.getFieldValue(id));
      return [
        value,
        (newValue) => {
          if (newValue !== void 0) {
            setValueState(newValue);
            _SettingsSection.setFieldValue(id, newValue);
          }
        }
      ];
    };
    this.SettingsSection = () => /* @__PURE__ */ React.createElement(__SettingSection, { filterMatchQuery: this.name }, /* @__PURE__ */ React.createElement(__SectionTitle, null, this.name), Object.values(this.sectionFields));
    this.SettingField = ({ field, children }) => /* @__PURE__ */ React.createElement(SettingColumn, { filterMatchQuery: field.id }, /* @__PURE__ */ React.createElement("div", { className: "x-settings-firstColumn" }, /* @__PURE__ */ React.createElement(SettingText, { htmlFor: field.id }, field.desc)), /* @__PURE__ */ React.createElement("div", { className: "x-settings-secondColumn" }, children));
    this.ButtonField = (field) => /* @__PURE__ */ React.createElement(this.SettingField, { field }, /* @__PURE__ */ React.createElement(ButtonSecondary, { id: field.id, buttonSize: "sm", onClick: field.onClick, className: "x-settings-button" }, field.text));
    this.ToggleField = (field) => {
      const id = this.getId(field.id);
      const [value, setValue] = this.useStateFor(id);
      return /* @__PURE__ */ React.createElement(this.SettingField, { field }, /* @__PURE__ */ React.createElement(
        SettingToggle,
        {
          id: field.id,
          value: _SettingsSection.getFieldValue(id),
          onSelected: (checked) => {
            setValue(checked);
            field.onSelected?.(checked);
          },
          className: "x-settings-button"
        }
      ));
    };
    this.InputField = (field) => {
      const id = this.getId(field.id);
      const [value, setValue] = this.useStateFor(id);
      return /* @__PURE__ */ React.createElement(this.SettingField, { field }, /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "x-settings-input",
          id: field.id,
          dir: "ltr",
          value: _SettingsSection.getFieldValue(id),
          type: field.inputType,
          onChange: (e) => {
            const value2 = e.currentTarget.value;
            setValue(value2);
            field.onChange?.(value2);
          }
        }
      ));
    };
    this.id = _.kebabCase(name);
  }
  addField(type, opts, fieldComponent, defaultValue) {
    if (defaultValue !== void 0) {
      const settingId = this.getId(opts.id);
      _SettingsSection.setDefaultFieldValue(settingId, defaultValue);
    }
    const field = Object.assign({}, opts, { type });
    this.sectionFields[opts.id] = React.createElement(fieldComponent, field);
  }
  static {
    this.getFieldValue = (id) => JSON.parse(LocalStorage.get(id) ?? "null");
  }
  static {
    this.setFieldValue = (id, newValue) => LocalStorage.set(id, JSON.stringify(newValue));
  }
  static {
    this.setDefaultFieldValue = async (id, defaultValue) => {
      if (_SettingsSection.getFieldValue(id) === null)
        _SettingsSection.setFieldValue(id, await defaultValue());
    };
  }
};

// extensions/show-the-genres/settings.ts
var settings = new SettingsSection("Show The Genres").addInput(
  {
    id: "LFMApiKey",
    desc: "Last.fm API Key",
    inputType: "text"
  },
  () => "********************************"
);
settings.pushSettings();
var CONFIG = settings.toObject();

// extensions/show-the-genres/components.ts
import { LitElement, css, html } from "https://esm.sh/lit";
import { customElement, property, state } from "https://esm.sh/lit/decorators.js";
import { join } from "https://esm.sh/lit/directives/join.js";
import { map } from "https://esm.sh/lit/directives/map.js";
var { History: History2 } = Spicetify.Platform;
var _GenreLink = class extends LitElement {
  constructor() {
    super(...arguments);
    this.genre = "No Genre";
  }
  openPlaylistsSearch() {
    History2.push({ pathname: `/search/${this.genre}/playlists` });
  }
  render() {
    return html`<a href="#" @click=${this.openPlaylistsSearch}>${_.startCase(this.genre)}</a>`;
  }
};
_GenreLink.styles = css`
        :host > a {
            color: var(--spice-subtext);
            font-size: var(--genre-link-size);
        }
    `;
__decorateClass([
  property()
], _GenreLink.prototype, "genre", 2);
_GenreLink = __decorateClass([
  customElement("genre-link")
], _GenreLink);
var _ArtistGenreContainer = class extends LitElement {
  constructor() {
    super(...arguments);
    this.name = void 0;
    this.uri = void 0;
    this.genres = [];
    this.isSmall = true;
    this.fetchGenres = (uri) => Promise.resolve([uri]);
  }
  willUpdate(changedProperties) {
    if (changedProperties.has("uri")) {
      this.uri && this.fetchGenres(this.uri).then((genres) => this.genres = genres);
    }
  }
  render() {
    const artistGenreLinks = map(this.genres, (genre) => html`<genre-link genre=${genre} />`);
    const divider = () => html`<span>, </span>`;
    return html`<style>
                a {
                    --genre-link-size: ${this.isSmall ? "12px" : "1rem"};
                }
            </style>
            <div className="main-entityHeader-detailsText genre-container">
                ${this.name && html`<span>${this.name} : </span>`} ${join(artistGenreLinks, divider)}
            </div>`;
  }
};
__decorateClass([
  property()
], _ArtistGenreContainer.prototype, "name", 2);
__decorateClass([
  property()
], _ArtistGenreContainer.prototype, "uri", 2);
__decorateClass([
  state()
], _ArtistGenreContainer.prototype, "genres", 2);
__decorateClass([
  property({ type: Boolean })
], _ArtistGenreContainer.prototype, "isSmall", 2);
__decorateClass([
  property()
], _ArtistGenreContainer.prototype, "fetchGenres", 2);
_ArtistGenreContainer = __decorateClass([
  customElement("genre-container")
], _ArtistGenreContainer);

// shared/GraphQL/fetchArtistRelated.ts
var { Locale, GraphQL } = Spicetify;
var fetchArtistRelated = async (uri) => {
  const res = await GraphQL.Request(GraphQL.Definitions.queryArtistRelated, {
    uri,
    locale: Locale.getLocale()
  });
  return res.data.artistUnion.relatedContent.relatedArtists.items;
};

// extensions/star-ratings-2/util.ts
var getTrackLists = () => Array.from(document.querySelectorAll(".main-trackList-trackList.main-trackList-indexable"));
var getTrackListTracks = (trackList) => Array.from(trackList.querySelectorAll(".main-trackList-trackListRow"));

// shared/listeners.ts
var { Player, URI: URI2 } = Spicetify;
var { PlayerAPI: PlayerAPI2, History: History3 } = Spicetify.Platform;
var onHistoryChanged = (toMatchTo, callback, dropDuplicates = true) => {
  const createMatchFn = (toMatchTo2) => {
    switch (typeof toMatchTo2) {
      case "string":
        return (input) => input?.startsWith(toMatchTo2) ?? false;
      case "function":
        return toMatchTo2;
      default:
        return (input) => toMatchTo2.test(input);
    }
  };
  let lastPathname = "";
  const matchFn = createMatchFn(toMatchTo);
  const historyChanged = ({ pathname }) => {
    if (matchFn(pathname)) {
      if (dropDuplicates && lastPathname === pathname) {
      } else
        callback(URI2.fromString(pathname).toURI());
    }
    lastPathname = pathname;
  };
  historyChanged(History3.location ?? {});
  return History3.listen(historyChanged);
};
var onSongChanged = (callback) => {
  callback(PlayerAPI2._state);
  Player.addEventListener("songchange", (event) => callback(event.data));
};
var PRESENTATION_KEY = Symbol("presentation");
var onTrackListMutationListeners = new Array();
var _onTrackListMutation = (trackList, record, observer) => {
  const tracks = getTrackListTracks(trackList[PRESENTATION_KEY]);
  const reactFiber = trackList[PRESENTATION_KEY][REACT_FIBER].alternate;
  const reactTracks = reactFiber.pendingProps.children;
  const tracksProps = reactTracks.map((child) => child.props);
  tracks.forEach((track, i) => track.props = tracksProps[i]);
  const fullyRenderedTracks = tracks.filter((track) => track.props?.uri);
  onTrackListMutationListeners.map((listener) => listener(trackList, fullyRenderedTracks));
};
new PermanentMutationObserver("main", () => {
  const trackLists = getTrackLists();
  trackLists.filter((trackList) => !trackList[PRESENTATION_KEY]).forEach((trackList) => {
    trackList[PRESENTATION_KEY] = trackList.lastElementChild.firstElementChild.nextElementSibling;
    new MutationObserver(
      (record, observer) => _onTrackListMutation(trackList, record, observer)
    ).observe(trackList[PRESENTATION_KEY], { childList: true });
  });
});

// extensions/show-the-genres/app.ts
var { URI: URI3 } = Spicetify;
var fetchLastFMTags = async (uri) => {
  const uid = URI3.fromString(uri).id;
  if (!uid)
    return [];
  const { name, artists } = await spotifyApi.tracks.get(uid);
  const artistNames = artists.map((artist) => artist.name);
  const track = await fetchLastFMTrack(CONFIG.LFMApiKey, artistNames[0], name);
  const tags = track.toptags.tag.map((tag) => tag.name);
  const deletedTagRegex = /^-\d{13}$/;
  const blacklistedTags = ["MySpotigramBot"];
  return tags.filter((tag) => !deletedTagRegex.test(tag) && !blacklistedTags.includes(tag));
};
var nowPlayingGenreContainerEl = document.createElement("genre-container");
nowPlayingGenreContainerEl.fetchGenres = fetchLastFMTags;
nowPlayingGenreContainerEl.className += " ellipsis-one-line main-type-finale";
nowPlayingGenreContainerEl.style.gridArea = "genres";
(async () => {
  const trackInfoContainer = await waitForElement("div.main-trackInfo-container");
  trackInfoContainer.appendChild(nowPlayingGenreContainerEl);
})();
onSongChanged((state2) => {
  nowPlayingGenreContainerEl.uri = state2.item?.uri;
});
var getArtistsGenresOrRelated = async (artistsUris) => {
  const getArtistsGenres = async (artistsUris2) => {
    const ids = artistsUris2.map((uri) => URI3.fromString(uri).id);
    const artists = await spotifyApi.artists.get(_.compact(ids));
    const genres = new Set(artists.flatMap((artist) => artist.genres));
    return Array.from(genres);
  };
  const allGenres = await getArtistsGenres(artistsUris);
  if (allGenres.length)
    return allGenres;
  const relatedArtists = await fetchArtistRelated(artistsUris[0]);
  relatedArtists.map((artist) => artist.uri);
  if (allGenres.length)
    return allGenres;
  const artistRelated = await fetchArtistRelated(artistsUris[0]);
  return _.chunk(
    artistRelated.map((a) => a.uri),
    5
  ).reduce(
    async (acc, arr5uris) => (await acc).length ? await acc : await getArtistsGenres(arr5uris),
    Promise.resolve([])
  );
};
var updateArtistPage = async (uri) => {
  const artistGenreContainerEl = document.createElement("genre-container");
  artistGenreContainerEl.name = "Artist Genres";
  artistGenreContainerEl.uri = uri.toString();
  artistGenreContainerEl.fetchGenres = (uri2) => getArtistsGenresOrRelated([uri2]);
  const lastHeaderTextEl = document.querySelector("div.main-entityHeader-headerText");
  const headerTextEl = await waitForElement(
    "div.main-entityHeader-headerText",
    void 0,
    void 0,
    lastHeaderTextEl
  );
  const headerTextDetailsEl = await waitForElement("span.main-entityHeader-detailsText");
  headerTextEl.insertBefore(artistGenreContainerEl, headerTextDetailsEl);
};
onHistoryChanged((uri) => URI3.isArtist(uri), updateArtistPage);
(async () => {
    if (!document.getElementById("show-the-genres-css")) {
        const el = document.createElement("style")
        el.id = "show-the-genres-css"
        el.textContent = "/* extensions/show-the-genres/assets/styles.css */\n.main-nowPlayingWidget-trackInfo.main-trackInfo-container {\n  grid-template: \"title title\" \"badges subtitle\" \"genres genres\"/auto 1fr auto;\n}\n"
        document.head.appendChild(el)
    }
})()