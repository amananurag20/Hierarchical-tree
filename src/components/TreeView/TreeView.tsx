import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import TreeNodeComponent from '../TreeNode/TreeNode';
import type { TreeNode, ExpandedState } from '../../types/types';
import './TreeView.css';

interface TreeViewProps {
    data: TreeNode;
    searchQuery: string;
    onMoveNode?: (draggedNodeId: string, targetParentId: string, targetIndex: number) => void;
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

// Find parent ID for a given node
const findParentId = (tree: TreeNode, targetId: string, parentId: string | null = null): string | null => {
    if (tree.id === targetId) return parentId;
    if (tree.children) {
        for (const child of tree.children) {
            const found = findParentId(child, targetId, tree.id);
            if (found !== null) return found;
        }
    }
    return null;
};

const TreeView: React.FC<TreeViewProps> = ({ data, searchQuery, onMoveNode }) => {
    const [expandedState, setExpandedState] = useState<ExpandedState>({});
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
        // Only start canvas pan if: left click, not dragging a node, and target is the container
        const target = e.target as HTMLElement;
        const isContainer = target.classList.contains('tree-view-container') ||
            target.classList.contains('tree-view-content') ||
            target.classList.contains('tree-view-wrapper');

        if (e.button === 0 && !draggedNodeId && isContainer) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && !draggedNodeId) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Global handler to ensure pan stops even if mouse leaves window
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

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

    // Export as PNG with zoom-out and padding to capture full tree nicely
    const handleExportPNG = async () => {
        if (!contentRef.current) return;

        try {
            const content = contentRef.current;

            // Save current styles
            const originalTransform = content.style.transform;
            const originalTransformOrigin = content.style.transformOrigin;
            const originalPadding = content.style.padding;

            // Reset transform, apply zoom-out, and add padding for better capture
            content.style.transform = 'scale(0.75)';
            content.style.transformOrigin = 'top left';
            content.style.padding = '40px 40px 80px 40px'; // top, right, bottom, left

            // Wait for repaint
            await new Promise(resolve => setTimeout(resolve, 150));

            // Capture with html2canvas
            const canvas = await html2canvas(content, {
                backgroundColor: '#fafafa',
                scale: 2, // High quality
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            // Restore original styles
            content.style.transform = originalTransform;
            content.style.transformOrigin = originalTransformOrigin;
            content.style.padding = originalPadding;

            // Download
            const link = document.createElement('a');
            link.download = `vessel-hierarchy-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error exporting PNG:', error);
        }
    };

    // Drag & Drop handlers
    const handleDragStart = useCallback((nodeId: string) => {
        setDraggedNodeId(nodeId);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedNodeId(null);
        setDropTargetId(null);
        setDropPosition(null);
        setIsDragging(false); // Also reset canvas pan state
    }, []);

    const handleDragOver = useCallback((targetNodeId: string, position: 'before' | 'after' | 'inside') => {
        if (draggedNodeId && draggedNodeId !== targetNodeId) {
            setDropTargetId(targetNodeId);
            setDropPosition(position);
        }
    }, [draggedNodeId]);

    const handleDragLeave = useCallback(() => {
        setDropTargetId(null);
        setDropPosition(null);
    }, []);

    const handleDrop = useCallback((targetNodeId: string, dropPosition: 'before' | 'after' | 'inside') => {
        if (!draggedNodeId || !onMoveNode || draggedNodeId === targetNodeId) return;

        let targetParentId: string;
        let targetIndex: number;

        if (dropPosition === 'inside') {
            // Drop as child of target
            targetParentId = targetNodeId;
            targetIndex = 0;
        } else {
            // Drop as sibling (before/after target)
            const parentId = findParentId(data, targetNodeId);
            if (!parentId) return; // Can't reorder root

            targetParentId = parentId;

            // Find parent node to get siblings
            const findParentNode = (node: TreeNode): TreeNode | null => {
                if (node.id === parentId) return node;
                if (node.children) {
                    for (const child of node.children) {
                        const found = findParentNode(child);
                        if (found) return found;
                    }
                }
                return null;
            };

            const parentNode = findParentNode(data);
            if (!parentNode || !parentNode.children) return;

            // Find target's current index
            const targetIdx = parentNode.children.findIndex(c => c.id === targetNodeId);
            if (targetIdx === -1) return;

            // Calculate base index
            let baseIndex = dropPosition === 'after' ? targetIdx + 1 : targetIdx;

            // Check if dragged node is in the same parent and comes BEFORE the target
            const draggedIdx = parentNode.children.findIndex(c => c.id === draggedNodeId);
            if (draggedIdx !== -1 && draggedIdx < baseIndex) {
                // Dragged node will be removed first, so adjust index down by 1
                baseIndex = baseIndex - 1;
            }

            targetIndex = baseIndex;
        }

        onMoveNode(draggedNodeId, targetParentId, targetIndex);
        handleDragEnd();
    }, [draggedNodeId, onMoveNode, data, handleDragEnd]);

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
                    ref={contentRef}
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
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        draggedNodeId={draggedNodeId}
                        dropTargetId={dropTargetId}
                        dropPosition={dropPosition}
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
                <div className="control-divider"></div>
                {/* Export button - PNG */}
                <button onClick={handleExportPNG} title="Download as PNG" className="control-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>

            {/* Scale indicator */}
            <div className="scale-indicator">
                {Math.round(scale * 100)}%
            </div>

            {/* Drag indicator */}
            {draggedNodeId && (
                <div className="drag-indicator">
                    Dragging... Drop on a node to reorder
                </div>
            )}
        </div>
    );
};

export default TreeView;
