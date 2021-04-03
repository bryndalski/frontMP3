import Vue from "vue";
import Vuex from "vuex";
import config from "../config.json";
import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playArray: [], //tablica piosenek
    coverArray: [], //tablica okładek
    directory: "", //ścieżka zmieniana w celu wywołania nowej playlisty
    currentPlay: 0, //numer odtwarzanego utworu
    playStatus: false, // przechowuje czy gra czy nie  false => nie gra true => gra
    playListMode: false, // zmienia odtwarzacz w playlistę z NEDB
    describeText: "",
    playList: [], //playlista
    playListStatus: false, // status playlisty służący do zmieniania widoku
  },
  mutations: {
    // update state
    setDirection(state, payload) {
      // ustawiam ścieżke
      state.directory = payload;
    },
    // ustawia albmy [tablice]
    setCoversArray(state, payload) {
      state.coverArray = payload;
    },
    // ustawia albym
    setDirectory(state, payload) {
      state.directory = payload;
    },
    //ustawia tablce utworów
    setMusic(state, payload) {
      state.playArray = payload;
    },
    //ustawia aktualnie graną
    setCurrentPlay(state, payload) {
      state.currentPlay = payload;
    },
    // resetuje
    resetPlaylist(state) {
      state.currentPlay = null;
      state.playStatus = false;
    },
    //ustawia status piosenki
    setPlayStatus(state) {
      state.playStatus = state.playStatus ? false : true;
    },
    //ustawia wyświeltany tekst
    setDisplayText(state, payload) {
      state.describeText = payload;
    },
    //nadaję playlistę podczas ładowania
    setPlaylist(state, payload) {
      state.playList = payload;
    },
    // dodaję do playlisty
    addToPlayList(state, payload) {
      state.playList.push(payload);
    },
    // usuwa z playlisty
    removeFromPlayList(state, payload) {
      state.playList.forEach((item, counter) => {
        if (JSON.stringify(item) == JSON.stringify(payload))
          state.playList.splice(counter, 1);
      });
    },
    //zmeinaia status play listy
    setPlayListStatus(state) {
      state.playListStatus = state.playListStatus ? false : true;
    },
  },
  actions: {
    //zapytania asynchrnoiczne
    //pobieranie artystów + albumów
    getCovers(state) {
      axios({
        url: config.getCovers,
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      }).then((response) => {
        state.commit("setCoversArray", response.data); //ustawiam tablice okładek
        state.commit("setDirectory", response.data[0].path); //ustawiam tablice okładek
      });
    },
    //pobierniae muzyki
    getMusic(state) {
      axios({
        url: config.getMusic,
        method: "POST",
        data: {
          path: state.getters.getDirectory,
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      }).then((response) => {
        console.log(response.data);
        let playArray = response.data;
        if (response.data.status != "error") {
          playArray.map((item) => {
            item.album = item.path; // album
            item.serverSource = item.source; // tylko do wysłania
            item.source = encodeURI(config.serverAdress + item.source);
            // item.cover = state.getters.getDirectory; // tytuł
          });
        }
        state.commit("setMusic", playArray);
      });
    },
    getPlayList(state) {
      axios({
        url: config.getPlayList,
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      }).then((response) => {
        let playArray = response.data;

        if (response.data.status != "error") {
          playArray.map((item) => {
            item.album = item.path; // album
            item.serverSource = item.source; // tylko do wysłania
            item.source = encodeURI(config.serverAdress + item.source);
          });
          state.commit("setPlaylist", playArray);
        }
      });
    },
  },
  getters: {
    getPlayArray: (state) => state.playArray, // zwraca playlistę
    getCoverArray: (state) => state.coverArray, // zwraca tablice okłądek
    getDirectory: (state) => state.directory, //zwraca ścieżke
    getCurrentPlay: (state) => state.currentPlay, //zwraca aktualną piosenke (numer )
    getPlayStatus: (state) => state.playStatus, // zwraca status true false odtwarzania
    getDescribeText: (state) => state.getDescribeText, // text główny
    getPlayList: (state) => state.playList, // zwraca dostępną playlistę
    getPlayListStatus: (state) => state.playListStatus,
  },
});
