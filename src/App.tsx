import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import TreeView from './components/TreeView/TreeView';
import { vesselHierarchyData } from './data/hierarchyData';
import { deepClone, removeNode, insertNode } from './utils/treeUtils';
import type { TreeNode } from './types/types';
import './App.css';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [treeData, setTreeData] = useState<TreeNode>(() => deepClone(vesselHierarchyData));

  const handleMoveNode = useCallback((
    draggedNodeId: string,
    targetParentId: string,
    targetIndex: number
  ) => {
    setTreeData(currentTree => {
      // Don't allow dropping on itself
      if (draggedNodeId === targetParentId) return currentTree;

      // Remove the dragged node
      const { tree: treeAfterRemove, removed } = removeNode(currentTree, draggedNodeId);
      if (!removed) return currentTree;

      // Insert at new position
      const newTree = insertNode(treeAfterRemove, targetParentId, removed, targetIndex);
      return newTree;
    });
  }, []);

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
              data={treeData}
              searchQuery={searchQuery}
              onMoveNode={handleMoveNode}
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