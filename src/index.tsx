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
          <input id="radio1" type="radio" name="app" checked={this.state.selected === "https://api.atnd.org/events/?keyword_or=東京都&format=json"} 
          onChange={(e) => this.setState({ selected: e.target.value })} value="https://api.atnd.org/events/?keyword_or=東京都&format=json" />
          <label className="RadioAtnd" htmlFor='radio1'>ATND</label>
        </div>
        <div>
          <input id="radio2" type="radio" name="app" checked={this.state.selected === "https://api.doorkeeper.jp/events?q=東京都"} 
          onChange={(e) => this.setState({ selected: e.target.value })} value="https://api.doorkeeper.jp/events?q=東京都" />
          <label className="RadioDoorKeeper" htmlFor='radio2'>Doorkeeper</label>
        </div>
        <div>
          <input id="radio3" type="radio" name="app" checked={this.state.selected === "https://connpass.com/api/v1/event/?keyword_or=東京都"} 
          onChange={(e) => this.setState({ selected: e.target.value })} value="https://connpass.com/api/v1/event/?keyword_or=東京都" />
          <label className="RadioConnpass" htmlFor='radio3'>Connpass</label>
        </div>
        <div>
          <SearchButton url={this.state.selected} onSubmit={this.handleonSubmit}/>
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


export class SearchButton extends React.Component<any, any> {
  
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = ({
      eventdata: [],
      site: ""
    });
  }

  public onSubmit(){
    const url = this.props.url


    fetch(url, {mode: 'cors'})
      .then(response => response.json())
      .then(text =>{
       
        this.setState({
          eventdata: text,
          site: url
        })
      })
      
  }
  public render() {

    const url = this.state.site
    let eventlist;
    switch(url){
      case 'https://api.atnd.org/events/?keyword_or=東京都&format=json':
        eventlist = this.state.eventdata && this.state.eventdata.events && this.state.eventdata.events.map( events =>
          <li key={events.event.event_url}><a href={events.event.event_url} target="_blank">{events.event.title}</a></li>)
        break;
      case 'https://api.doorkeeper.jp/events?q=東京都':
        eventlist = this.state.eventdata && this.state.eventdata.map( events =>
          <li key={events.event.public_url}><a href={events.event.public_url} target="_blank">{events.event.title}</a></li>)
        break;
      case 'https://connpass.com/api/v1/event/?keyword_or=東京都':
        eventlist = this.state.eventdata && this.state.eventdata.events && this.state.eventdata.events.map( events =>
          <li key={events.event_url}><a href={events.event_url} target="_blank">{events.title}</a></li>)
        break;
    }    
    
    return(
      <div>
        <button type="button" name="submit" onClick={this.onSubmit}>検索</button>
        <ul>
          {eventlist}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(
  <RedioForm />,
  document.getElementById('root')
);
