import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import TreeView from './components/TreeView/TreeView';
import { vesselHierarchyData } from './data/hierarchyData';
import type { TreeNode } from './types/types';
import './App.css';

// Deep clone helper
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

// Find and remove a node from tree, returns the removed node
const removeNode = (tree: TreeNode, nodeId: string): { tree: TreeNode; removed: TreeNode | null } => {
  const cloned = deepClone(tree);
  let removed: TreeNode | null = null;

  const findAndRemove = (node: TreeNode): boolean => {
    if (!node.children) return false;

    const index = node.children.findIndex(child => child.id === nodeId);
    if (index !== -1) {
      removed = node.children[index];
      node.children.splice(index, 1);
      return true;
    }

    return node.children.some(child => findAndRemove(child));
  };

  findAndRemove(cloned);
  return { tree: cloned, removed };
};

// Insert a node into tree at target position
const insertNode = (tree: TreeNode, targetParentId: string, nodeToInsert: TreeNode, position: number): TreeNode => {
  const cloned = deepClone(tree);

  const findAndInsert = (node: TreeNode): boolean => {
    if (node.id === targetParentId) {
      if (!node.children) node.children = [];
      node.children.splice(position, 0, nodeToInsert);
      return true;
    }
    if (node.children) {
      return node.children.some(child => findAndInsert(child));
    }
    return false;
  };

  findAndInsert(cloned);
  return cloned;
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [treeData, setTreeData] = useState<TreeNode>(() => deepClone(vesselHierarchyData));

  // Handle node move for drag & drop
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