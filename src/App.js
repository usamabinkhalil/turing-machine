/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [noOfStates, setNoOfStates] = useState(0);
  const [states, setStates] = useState([]);
  const [noOfFinalStates, setNoOfFinalStates] = useState(0);
  const [transitionRules, setTransitionRules] = useState([]);
  const [transitionRule, setTransitionRule] = useState({
    from: "",
    to: "",
    read: "0",
    write: "0",
    move: "L",
  });
  const [currentState, setCurrentState] = useState({});
  const [inputString, setInputString] = useState("");
  const [inputArray, setInputArray] = useState([]);
  const [machineIsRunning, setMachineIsRunning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let statesArray = [];
    for (var i = 0; i < noOfStates; i++) {
      statesArray = [...statesArray, { name: `q${i}`, isFinal: false }];
    }
    setStates(statesArray);
  }, [noOfStates]);

  const updateState = (state) => {
    const countFinalStates = states.filter((s) => s.isFinal).length;
    if (countFinalStates < noOfFinalStates || state.isFinal) {
      state.isFinal = !state.isFinal;
      const index = states.findIndex((x) => x.name === state.name);
      let newStates = [...states];
      newStates[index] = state;
      setStates(newStates);
    }
  };

  const onChangeRules = (e) => {
    const { name, value } = e.target;
    setTransitionRule({ ...transitionRule, [name]: value });
  };

  const addTransitionRule = () => {
    setTransitionRules([...transitionRules, transitionRule]);
  };

  const removeTransitionRule = (index) => {
    const newTransitionRules = [...transitionRules];
    newTransitionRules.splice(index, 1);
    setTransitionRules(newTransitionRules);
  };

  const startMachine = () => {
    const cs = {
      index: 0,
      name: "q0",
      value: inputArray[0],
      isFinal: false,
    };
    setCurrentState(cs);
    setMachineIsRunning(true);
  };

  // machine logic
  useEffect(() => {
    if (currentState && currentState.name) {
      const transitionRule = transitionRules.find(
        (x) => x.from === currentState.name && x.read === currentState.value
      );
      if (transitionRule) {
        const index =
          transitionRule.move === "L"
            ? currentState.index - 1
            : currentState.index + 1;
        const isFinal = states.find(
          (x) => x.name === transitionRule.to
        ).isFinal;
        const newState = {
          index: index,
          name: transitionRule.to,
          value: inputArray[index],
          isFinal: isFinal,
        };
        const newInputArray = [...inputArray];
        newInputArray[currentState.index] = transitionRule.write;
        setTimeout(() => {
          setInputArray(newInputArray);
          setCurrentState(newState);
        }, 1000);
      } else {
        setMachineIsRunning(false);
        if (currentState.isFinal) {
          if (currentState.value) {
            setMessage("Rejected");
          } else {
            setMessage("Accepted");
          }
        } else {
          setMessage("Rejected");
        }
      }
    }
  }, [currentState]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container px-5">
          <a className="navbar-brand" href="#!">
            Turing Machine
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#!">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container px-4 px-lg-5">
        <div className="d-flex flex-row  gx-4 gx-lg-5 align-items-center my-3">
          <div className=" me-3">
            <label className="form-label">No. of states</label>
            <input
              type="number"
              className="form-control"
              placeholder="No. of states"
              onChange={(event) => setNoOfStates(event.target.value)}
              value={noOfStates}
            />
          </div>
          <div className="">
            <label className="form-label">No. of final states</label>
            <input
              type="number"
              className="form-control"
              placeholder="No. of final states"
              onChange={(event) => setNoOfFinalStates(event.target.value)}
              value={noOfFinalStates}
            />
          </div>
        </div>
        <div className="d-flex align-content-start flex-wrap mb-3">
          {/* <FontAwesomeIcon icon="coffee" />
          <FontAwesomeIcon icon="fa-solid fa-square-check" /> */}
          {states.map((state) => (
            <div
              className="d-flex border border-dark me-2 mb-2 pointer justify-content-center align-items-center"
              key={`state-${state.name}`}
              onClick={() => updateState(state)}
              style={{ height: "50px", width: "50px" }}
            >
              {state.isFinal && (
                <i className="fa-solid fa-check state-icon"></i>
              )}

              {state.name}
            </div>
          ))}
        </div>
        <div className="d-flex flex-column  gx-4 gx-lg-5 my-3">
          <p>Transition Rules:</p>
          <div className="d-flex justify-content-between">
            <div className="mb-3 flex-grow-1 me-3">
              <label className="form-label">State</label>
              <select
                className="form-select"
                name="from"
                onChange={(e) => onChangeRules(e)}
              >
                <option value="">Please select</option>
                {states.map((state) => (
                  <option value={state.name} key={`from-${state.name}`}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 flex-grow-1 me-3">
              <label className="form-label">Read</label>
              <select
                className="form-select"
                name="read"
                onChange={(e) => onChangeRules(e)}
              >
                <option value="">Please select</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="x">x</option>
                <option value="y">y</option>
              </select>
            </div>
            <div className="mb-3 flex-grow-1 me-3">
              <label className="form-label">Write</label>
              <select
                className="form-select"
                name="write"
                onChange={(e) => onChangeRules(e)}
              >
                <option value="">Please select</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="x">x</option>
                <option value="y">y</option>
              </select>
            </div>
            <div className="mb-3 flex-grow-1 me-3">
              <label className="form-label">Move</label>
              <select
                className="form-select"
                name="move"
                onChange={(e) => onChangeRules(e)}
              >
                <option value="">Please select</option>
                <option value="L">L</option>
                <option value="R">R</option>
              </select>
            </div>
            <div className="mb-3 flex-grow-1 me-3">
              <label className="form-label">Next State</label>
              <select
                className="form-select"
                name="to"
                onChange={(e) => onChangeRules(e)}
              >
                <option value="">Please select</option>
                {states.map((state) => (
                  <option key={`to-${state.name}`} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 align-self-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addTransitionRule}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column  gx-4 gx-lg-5 my-3">
          {transitionRules.map((transitionRule, index) => (
            <div className="d-flex justify-content-between" key={index}>
              <div className="mb-3 flex-grow-1 me-3">{transitionRule.from}</div>
              <div className="mb-3 flex-grow-1 me-3">{transitionRule.read}</div>
              <div className="mb-3 flex-grow-1 me-3">
                {transitionRule.write}
              </div>
              <div className="mb-3 flex-grow-1 me-3">{transitionRule.move}</div>
              <div className="mb-3 flex-grow-1 me-3">{transitionRule.to}</div>
              <div className="mb-3 align-self-end">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => removeTransitionRule(index)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex flex-row  gx-4 gx-lg-5 align-items-center my-3">
          <div className=" me-3">
            <label className="form-label">Input String</label>
            <div className="input-group">
              <input
                type="string"
                className="form-control"
                placeholder="Input String"
                onChange={(event) => {
                  setInputString(event.target.value);
                  setInputArray(event.target.value.split(""));
                  setCurrentState({});
                  setMessage("");
                }}
                disabled={machineIsRunning}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={() => {
                  startMachine();
                }}
                disabled={inputString.length === 0 || machineIsRunning}
              >
                <i className="fa-solid fa-play fa-xl"></i>
              </button>
            </div>
          </div>
          <div className="me-3 align-self-end">
            <p
              className={
                message === "Accepted" ? "text-success" : "text-danger"
              }
            >
              {message}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-center flex-wrap ">
          {inputArray.map((input, index) => (
            <div
              className="d-flex border border-dark mb-2 justify-content-center align-items-center"
              key={`tape-${index}`}
              style={{ height: "50px", width: "50px" }}
            >
              {input}
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center align-items-start flex-wrap mb-3">
          {inputArray.map((input, index) => (
            <div
              className="d-flex mb-2 justify-content-center align-items-start"
              key={`tape-${index}`}
              style={{ height: "50px", width: "50px" }}
            >
              {index === currentState.index && (
                <i className="fa-solid fa-arrow-up"></i>
              )}
            </div>
          ))}
        </div>
      </div>
      <footer className="py-5 bg-dark">
        <div className="container px-4 px-lg-5">
          <p className="m-0 text-center text-white">
            Copyright &copy; Your Website 2022
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
