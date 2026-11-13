import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
