import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import TreeNodeComponent from '../TreeNode/TreeNode';
import type { TreeNode, ExpandedState } from '../../types/types';
import './TreeView.css';

interface TreeViewProps {
    data: TreeNode;
    searchQuery: string;
}

// Recursive function to find matching nodes and their parent paths
const findMatchingNodes = (
    node: TreeNode,
    query: string,
    parentPath: string[] = []
): { matchedIds: Set<string>; pathIds: Set<string> } => {
    const matchedIds = new Set<string>();
    const pathIds = new Set<string>();
    const lowerQuery = query.toLowerCase();

    const searchNode = (currentNode: TreeNode, currentPath: string[]) => {
        const isMatch = currentNode.name.toLowerCase().includes(lowerQuery);

        if (isMatch) {
            matchedIds.add(currentNode.id);
            // Add all parents to path
            currentPath.forEach(id => pathIds.add(id));
        }

        if (currentNode.children) {
            currentNode.children.forEach(child => {
                searchNode(child, [...currentPath, currentNode.id]);
            });
        }
    };

    searchNode(node, parentPath);
    return { matchedIds, pathIds };
};

// Get all node IDs for initial expansion
const getAllIds = (node: TreeNode): string[] => {
    const ids = [node.id];
    if (node.children) {
        node.children.forEach(child => {
            ids.push(...getAllIds(child));
        });
    }
    return ids;
};

const TreeView: React.FC<TreeViewProps> = ({ data, searchQuery }) => {
    const [expandedState, setExpandedState] = useState<ExpandedState>({});
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Toggle node expansion
    const handleToggle = useCallback((nodeId: string) => {
        setExpandedState(prev => ({
            ...prev,
            [nodeId]: !prev[nodeId]
        }));
    }, []);

    // Compute matched nodes for search
    const { matchedIds, pathIds } = useMemo(() => {
        if (!searchQuery.trim()) {
            return { matchedIds: new Set<string>(), pathIds: new Set<string>() };
        }
        return findMatchingNodes(data, searchQuery);
    }, [data, searchQuery]);

    // Auto-expand nodes that match search
    useEffect(() => {
        if (searchQuery.trim() && pathIds.size > 0) {
            const newExpanded: ExpandedState = { ...expandedState };
            pathIds.forEach(id => {
                newExpanded[id] = true;
            });
            setExpandedState(newExpanded);
        }
    }, [searchQuery, pathIds]);

    // Zoom controls
    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.1, 0.3));
    };

    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Pan functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left click
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale(prev => Math.max(0.3, Math.min(2, prev + delta)));
        }
    };

    // Expand all nodes
    const handleExpandAll = () => {
        const allIds = getAllIds(data);
        const newExpanded: ExpandedState = {};
        allIds.forEach(id => {
            newExpanded[id] = true;
        });
        setExpandedState(newExpanded);
    };

    // Collapse all nodes
    const handleCollapseAll = () => {
        setExpandedState({});
    };

    return (
        <div className="tree-view-wrapper">
            <div
                className="tree-view-container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <div
                    className="tree-view-content"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'top left'
                    }}
                >
                    <TreeNodeComponent
                        node={data}
                        expandedState={expandedState}
                        onToggle={handleToggle}
                        searchQuery={searchQuery}
                        matchedNodeIds={matchedIds}
                        parentPathIds={pathIds}
                        isRoot={true}
                    />
                </div>
            </div>

            {/* Zoom controls */}
            <div className="tree-controls">
                <button onClick={handleExpandAll} title="Expand All" className="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16v16H4z" />
                        <path d="M9 9h6M12 9v6" />
                    </svg>
                </button>
                <button onClick={handleCollapseAll} title="Collapse All" className="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16v16H4z" />
                        <path d="M9 12h6" />
                    </svg>
                </button>
                <div className="control-divider"></div>
                <button onClick={handleZoomIn} title="Zoom In" className="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                </button>
                <button onClick={handleZoomOut} title="Zoom Out" className="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35M8 11h6" />
                    </svg>
                </button>
                <button onClick={handleResetZoom} title="Reset View" className="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                </button>
            </div>

            {/* Scale indicator */}
            <div className="scale-indicator">
                {Math.round(scale * 100)}%
            </div>
        </div>
    );
};

export default TreeView;
