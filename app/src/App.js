import React, { Component } from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';

const url = process.env.NODE_ENV === 'production' ? "/api/" : "http://10.130.1.9:5000/api/";

const style = {
  margin: 12,
  width: 180,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      luminosidade: '',
      temperatura: '',
      umidade: '',
      led1on: 0,
      led2on: 0,
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

  postStatus() {
    const { led1on, led2on } = this.state;

    axios.post(`${url}status`, {
      led1on,
      led2on
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Title"
          showMenuIconButton={false}
        />

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div>
            <div>
              <span>Temperatura: {this.state.temperatura} °C</span>
            </div>

            <div>
              <span>Umidade: {this.state.umidade}%</span>
            </div>

            <div>
              <span>Luminosidade: {this.state.luminosidade}%</span>
            </div>
          </div>

          <div>
            <RaisedButton
              label="status"
              primary={true}
              style={style}
              onClick={() => this.getStatus()}
            />
            <RaisedButton
              label="clima"
              primary={true}
              style={style}
              onClick={() => this.getClima()}
            />
          </div>

          <div>
            <RaisedButton
              label={`Led 1 ${this.state.led1on ? 'ligado' : 'desligado'}`}
              primary={true}
              style={style}
              onClick={() => {
                this.setState({ led1on: this.state.led1on === 1 ? 0 : 1 });
                this.postStatus();
              }}
            />

            <RaisedButton
              label={`Led 2 ${this.state.led2on ? 'ligado' : 'desligado'}`}
              primary={true}
              style={style}
              onClick={() => {
                this.setState({ led2on: this.state.led2on === 1 ? 0 : 1 });
                this.postStatus();
              }}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
