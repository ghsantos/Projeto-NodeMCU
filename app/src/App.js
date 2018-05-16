import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

//const url = 'http://localhost:5000';
const url = 'http://10.60.165.39:5000';
const uri = process.env.NODE_ENV === 'production' ? "/api/" : `${url}/api/`;

const style = {
  margin: 12,
  width: 180,
};

const paperStyle = {
  height: 240,
  width: 450,
  margin: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = socketIOClient(url);

    this.state = {
      luminosidade: '68',
      temperatura: '25.3',
      umidade: '78',
      led1on: 0,
      led2on: 0,
    }
  }

  componentDidMount() {
    this.socket.on('status', data => this.setState({ ...data }));
    this.socket.on('clima', data => this.setState({ ...data }));
  }

  send() {
    this.socket.emit('setStatus', { led1on: this.state.led1on, led2on: this.state.led2on });
  }

  render() {
    return (
      <div>
        <AppBar
          title="NodeMCU App"
          showMenuIconButton={false}
        />

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

          <Paper zDepth={2} style={paperStyle}>
              <div>
                <span style={{fontSize: 90}}>{this.state.temperatura} °C</span>
              </div>

              <div>
                <span style={{fontSize: 23}}>Umidade: {this.state.umidade}%</span>
              </div>

              <div>
                <span style={{fontSize: 23}}>Luminosidade: {this.state.luminosidade}%</span>
              </div>
          </Paper>

          <div>
            <RaisedButton
              label={`Led 1 ${this.state.led1on ? 'ligado' : 'desligado'}`}
              primary={true}
              style={style}
              onClick={() => {
                this.setState(
                  { led1on: this.state.led1on === 1 ? 0 : 1 },
                  () => this.send()
                );
              }}
            />

            <RaisedButton
              label={`Led 2 ${this.state.led2on ? 'ligado' : 'desligado'}`}
              primary={true}
              style={style}
              onClick={() => {
                this.setState(
                  { led2on: this.state.led2on === 1 ? 0 : 1 },
                  () => this.send()
                );
              }}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
