import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReverseRegex from "./util/ReverseRegex";

class App extends Component {
    state = {
        reverseRegex: new ReverseRegex(/12(23)4(.*)5/),
        groups: {},
        reinserted: '',
        reinsertedMatches: false
    };

    // constructor(props) {
    //     super(props);
    // }

    doReinsert(index, event) {
        const value = event.target.value;
        this.setState(state => {
            const updatedState = {
                groups: ({...state.groups, ...{[index]: value}})
            };
            if (Object.keys(updatedState.groups).length === state.reverseRegex.captureGroupsAt.length) {
                updatedState.reinserted = state.reverseRegex.reinsert(Object.values(updatedState.groups));
            }
            return updatedState;
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <input value={this.state.reverseRegex.source}
                       onChange={event => this.setState({reverseRegex: new ReverseRegex(event.target.value)})}/>
                {(() => {
                    if (this.state.reverseRegex) {
                        return <p className='regex-parts'>
                            {this.state.reverseRegex.parts.map((part, index) => {
                                if (this.state.reverseRegex.captureGroupsAt.includes(index)) {
                                    return <span className='regex-part regex-capture-group'>
                                    {part}
                                        <input placeholder={part} onChange={event => this.doReinsert(index, event)}/>
                            </span>
                                }
                                return <span className='regex-part'>{part}</span>;
                            })}
                        </p>;
                    } else {
                        return <span>Invalid Regex</span>
                    }
                })()}
                {(() => {
                    if (this.state.reinserted) {
                        return <div>
                            <pre>{this.state.reinserted}</pre>
                            <br/>
                            <pre>Reinserted matches: {!!this.state.reverseRegex.exec(this.state.reinserted) + ''}</pre>
                        </div>
                    }
                })()}

            </div>
        );
    }
}

export default App;
