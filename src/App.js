import Editor from './components/Editor';
import './App.css';
import {BrowserRouter as  Router , Routes,Route , Navigate} from 'react-router-dom';
import {v4 as uuid} from 'uuid';

function App() {
  return (
      <Router>
          <Routes>
            <Route path='/' element = {<Navigate replace to = {`/doc/${uuid()}`}/> } />
            < Route path='/doc/:id'element = { <Editor/>} /> 
          </Routes>
      </Router>
  );
}

export default App;
