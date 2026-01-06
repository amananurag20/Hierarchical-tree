import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import TreeView from './components/TreeView/TreeView';
import { vesselHierarchyData } from './data/hierarchyData';
import './App.css';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-area">
          <div className="search-section">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
            />
          </div>
          <div className="tree-section">
            <TreeView
              data={vesselHierarchyData}
              searchQuery={searchQuery}
            />
          </div>
        </div>
        <footer className="footer">
          <span className="footer-brand">3S</span>
          <span className="footer-text">Smart Ship Solutions © 2025</span>
        </footer>
      </main>
    </div>
  );
};

export default App;