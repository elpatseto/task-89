import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {

    static get events() {
        return {
            READY: "ready",
        };
    }

    constructor() {

        super();

        this._loading = document.querySelector("progress");
        this._startLoading();

        this.emit(Application.events.READY);
    }


    _startLoading() {
        this._loading.style.visibility = "visible";
        this._load();
    }

    _stopLoading() {
        this._loading.style.visibility = "hidden";
    }

    async _load() {

        let responce = await fetch('https://swapi.boom.dev/api/planets');

        let url = "https://swapi.boom.dev/api/planets";

        function checkStatus(responce) {
            if (responce.status >= 200 && responce.status < 300) {
                return Promise.resolve(responce);
            } else {
                return Promise.reject(new Error(responce.statusText));
            }
        }

        function toJSON(responce) {
            return responce.json();
        }


        fetch(url)
            .then(checkStatus)
            .then(toJSON)
            .then((data) => {
                data.results.forEach(d => {
                    this._create(d.name, d.terrain, d.population);
                })
            })
        for (let i = 2; i <= 6; i++) {
            url = 'https://swapi.boom.dev/api/planets?page=' + 1;
            fetch(url)
                .then(checkStatus)
                .then(toJSON)
                .then((data) => {
                    data.results.forEach(d => {
                        this._create(d.name, d.terrain, d.population);
                    })
                })
        }
        this._stopLoading();


    }

    _create(name, terrain, population) {
        if (name !== undefined) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = this._render({
                name: name,
                terrain: terrain,
                population: population,
            });
            document.body.querySelector(".main").appendChild(box);
        }
    }


    _render({name, terrain, population}) {
        return `
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img src="${image}" alt="planet">
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
              <h4>${name}</h4>
                <p>
                  <span class="tag">${terrain}</span> <span class="tag">${population}</span>
                  <br>
                </p>
              </div>
            </div>
          </article>
    `;
    }
}
