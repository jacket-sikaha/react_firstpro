import React, { Component, createContext } from "react";
const { Provider, Consumer } = createContext();
function App() {
  function ss(params) {
    console.log("@", this);
  }

  let dss = (e, msg) => {
    console.log("777", e, msg);
  };
  return (
    <div onClick={(e) => dss(e, "ttt")}>
      ddddd
      <Consumer>{(value) => <h3>{value}这里使用consumer无效</h3>}</Consumer>
      <A>
        <C>
          <div>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          </div>
          <div>
            <ol>
              <li>12</li>
              <li>22</li>
              <li>34</li>
            </ol>
          </div>
          ddd
        </C>
      </A>
    </div>
  );
}

function C(props) {
  return (
    <>
      <Consumer>{(value) => <h1>{value}</h1>}</Consumer>
      <div>C------{props.children}</div>
    </>
  );
}

class A extends Component {
  state = { a: 1 };
  test = (e, msg) => {
    console.log("$", msg, e, this.q);
    this.setState({ a: 444 });
  };

  ss(params) {
    console.log(this);
  }
  render() {
    return (
      <>
        <Provider value={this.state.a}>
          <div onClick={this.test}>SSS</div>
          <input
            type={"text"}
            value={this.state.a}
            onChange={(e) => {
              this.setState({ a: e.target.value });
            }}
          />
          <p>{this.state.a}</p>
          <button onClick={this.test} ref={(c) => (this.q = c)}>
            test
          </button>
          <h3>{this.props.children}</h3>
        </Provider>
      </>
    );
  }
}

export default App;
