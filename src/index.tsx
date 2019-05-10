import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';

interface IRedioFormState {
   selected: string

}

class RedioForm extends React.Component<any,IRedioFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: ''
    };

    this.handleonSubmit = this.handleonSubmit.bind(this);
  }

  render() {
    return (
      <div>
      <h3>東京都のイベント検索</h3>
      <form>
        <div>
          <input type="radio" name="app" checked={this.state.selected === "https://api.atnd.org/events/?keyword_or=東京都&format=json"} 
          onChange={(e) => this.setState({ selected: e.target.value })} value="https://api.atnd.org/events/?keyword_or=東京都&format=json" />
          ATND
        </div>
        <div>
          <input type="radio" name="app" checked={this.state.selected === "https://api.doorkeeper.jp/events?q=東京都"} 
          onChange={(e) => this.setState({ selected: e.target.value })} value="https://api.doorkeeper.jp/events?q=東京都" />
          Doorkeeper
        </div>
        <div>
          <input type="radio" name="app" checked={this.state.selected === "https://connpass.com/api/v1/event/?keyword_or=東京都"} 
          onChange={(e) => this.setState({ selected: e.target.value })} value="https://connpass.com/api/v1/event/?keyword_or=東京都" />
          Connpass
        </div>
        <div>
          <EventList url={this.state.selected} onSubmit={this.handleonSubmit}/>
        </div>
      </form>
      </div>
    );
  }


  handleonSubmit(){
    const ur = this.state.selected;

      fetch(ur, {mode: 'cors'})
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return Promise.reject(new Error('エラーです！'));
          }
        })
        .then(text => {
          console.log(text);
          return(
            <div>{text}</div>
          );
        })
        .catch(e => {
          return(
            <div>読み取りエラー</div>
          );
        });
          }
}


export class EventList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = ({
      eventdata: []
    });
  }
  public onSubmit(){
    const url = this.props.url

    fetch(url, {mode: 'cors'})
      .then(response => response.json())
      .then(text =>{
        this.setState({
          eventdata: text
        })
        console.log(this.state)
      })
      .catch(e =>{
        console.log(e);
      })
    
    }
  public render() {
    const eventlists = this.state.eventdata.events.map(x=> console.log(x.event_url))

    return(
      <div>
        <p>{this.props.url}</p>
        <button type="button" name="submit" onClick={this.onSubmit}>検索する</button>
        <ul>
          <li>{eventlists}</li>
        </ul>
      </div>

    );
  }
}
ReactDOM.render(
  <RedioForm />,
  document.getElementById('root')
);