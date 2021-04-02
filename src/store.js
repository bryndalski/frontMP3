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
  },
  mutations: {
    // update state
    setDirection(state, payload) {
      // ustawiam ścieżke
      state.directory = payload;
    },

    setCoversArray(state, payload) {
      // ustawia albmy [tablice]
      state.coverArray = payload;
    },
    setDirectory(state, payload) {
      // ustawia albym
      state.directory = payload;
    },
    setMusic(state, payload) {
      //ustawia tablce utworów
      state.playArray = payload;
    },
    setCurrentPlay(state, payload) {
      //ustawia aktualnie graną
      state.currentPlay = payload;
    },
    resetPlaylist(state) {
      // resetuje
      state.currentPlay = null;
      state.playStatus = false;
    },
    setPlayStatus(state) {
      state.playStatus = state.playStatus ? false : true;
    },
    setDisplayText(state, payload) {
      state.describeText = payload;
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
      })
        .then((response) => {
          state.commit("setCoversArray", response.data); //ustawiam tablice okładek
          state.commit("setDirectory", response.data[0].path); //ustawiam tablice okładek
        })
        .catch((err) => console.log(err));
    },
    //pobierniae muzyki
    getMusic(state) {
      console.log(state);
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
      })
        .then((response) => {
          let playArray = response.data;
          if (response.data.status != "error") {
            playArray.map((item, counter) => {
              item.album = item.path; // album
              item.source = encodeURI(config.serverAdress + item.source);
              item.number = counter; //numeracja utworu => pomaga jako klucz + wysyłana do odtwarzania
              item.cover = state.directory; // tytuł
            });
          }
          state.commit("setMusic", playArray);
        })
        .catch((err) => console.log(err));
    },
  },
  getters: {
    getPlayArray: (state) => state.playArray, // zwraca playlistę
    getCoverArray: (state) => state.coverArray, // zwraca tablice okłądek
    getDirectory: (state) => state.directory, //zwraca ścieżke
    getCurrentPlay: (state) => state.currentPlay, //zwraca aktualną piosenke (numer )
    getPlayStatus: (state) => state.playStatus, // zwraca status true false odtwarzania
    getDescribeText: (state) => state.getDescribeText, // text główny
  },
});
