import logo from './logo.svg';
import './App.css';

function Subject() {
  return (
    <header>
        <h1>Web</h1>
        world wide web!
    </header>  
  );
}

function TOF() {
  return (
    <nav>
      <tl>
        <li><a href="1.html">html</a></li>
        <li><a href="2.html">css</a></li>
        <li><a href="3.html">javascript</a></li>
      </tl>
    </nav>  
  );
}

function Content() {
  return (
    <article>
      <h3>hello html!</h3>
      html is hypertext markup language
    </article>
  );
}

function App() {
  return (
    <div className="App">
      <Subject></Subject>
      <TOF></TOF>
      <Content></Content>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
