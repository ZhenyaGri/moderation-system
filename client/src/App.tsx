import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AdsList from './components/AdsList';
import AdDetail from './components/AdDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<AdsList />} />
          <Route path="/list" element={<AdsList />} />
          <Route path="/item/:id" element={<AdDetail />} />
          {/*<Route path="/stats" element={<Stats />} />*/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;