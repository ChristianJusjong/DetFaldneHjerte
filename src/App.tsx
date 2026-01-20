import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AIOracle } from './components/AIOracle';
import { SearchModal } from './components/SearchModal';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { SoundController } from './components/SoundController';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <SoundController />
        <Sidebar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <AIOracle />
        <SearchModal />
      </div>
    </Router>
  );
};

export default App;
