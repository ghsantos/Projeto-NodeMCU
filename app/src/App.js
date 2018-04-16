import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const url = process.env.NODE_ENV === 'production' ? "/api/" : "http://localhost:5000/api/";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      luminosidade: '',
      temperatura: '',
      umidade: '',
      led1on: false,
      led2on: false,
    }
  }

  componentDidMount() {
    this.getClima();
    this.getStatus();
  }

  getStatus() {
    axios.get(`${url}status`)
    .then((res) => {
        const response = res.data;
        console.log(response);

        const { led1on, led2on } = response;

        this.setState({ led1on, led2on });
    }).catch((err) => {
        console.log(err);
    });
  }

  getClima() {
    axios.get(`${url}clima`)
    .then((res) => {
        const response = res.data;
        console.log(response);

        const { luminosidade, temperatura, umidade } = response;

        this.setState({ luminosidade, temperatura, umidade });
    }).catch((err) => {
        console.log(err);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <div>
          <span>Temperatura: {this.state.temperatura} °C</span>
        </div>

        <div>
          <span>Umidade: {this.state.umidade}%</span>
        </div>

        <div>
          <span>Luminosidade: {this.state.luminosidade}%</span>
        </div>

        <div>
          <button onClick={() => this.getStatus()}>status</button>
          <button onClick={() => this.getClima()}>clima</button>
        </div>

        <div>
          <button onClick={() => this.getStatus()}>
            Led 1 {this.state.led1on ? 'ligado' : 'desligado'}
          </button>
          <button onClick={() => this.getStatus()}>
            Led 2 {this.state.led2on ? 'ligado' : 'desligado'}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
