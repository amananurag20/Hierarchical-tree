import React, { useRef, useState } from 'react';
import { TreeNodeLevel } from '../../types/types';
import type { TreeNode as TreeNodeType, ExpandedState } from '../../types/types';
import './TreeNode.css';

interface TreeNodeProps {
    node: TreeNodeType;
    expandedState: ExpandedState;
    onToggle: (nodeId: string) => void;
    searchQuery: string;
    matchedNodeIds: Set<string>;
    parentPathIds: Set<string>;
    isRoot?: boolean;
    isLastChild?: boolean;
    parentHasMoreChildren?: boolean;
    // Drag & Drop props
    onDragStart?: (nodeId: string) => void;
    onDragEnd?: () => void;
    onDragOver?: (nodeId: string, position: 'before' | 'after' | 'inside') => void;
    onDragLeave?: () => void;
    onDrop?: (targetNodeId: string, position: 'before' | 'after' | 'inside') => void;
    draggedNodeId?: string | null;
    dropTargetId?: string | null;
    dropPosition?: 'before' | 'after' | 'inside' | null;
}

// Get the color class based on node level
const getNodeColorClass = (level: TreeNodeLevel): string => {
    switch (level) {
        case TreeNodeLevel.EQUIPMENT_TYPE:
            return 'node-equipment-type';
        case TreeNodeLevel.EQUIPMENT:
            return 'node-equipment';
        case TreeNodeLevel.ASSEMBLY:
            return 'node-assembly';
        case TreeNodeLevel.SUB_ASSEMBLY:
            return 'node-sub-assembly';
        case TreeNodeLevel.SUB_ASSEMBLY_2:
            return 'node-sub-assembly-2';
        case TreeNodeLevel.SUB_ASSEMBLY_3:
            return 'node-sub-assembly-3';
        case TreeNodeLevel.COMPONENT:
            return 'node-component';
        default:
            return 'node-default';
    }
};

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
    node,
    expandedState,
    onToggle,
    searchQuery,
    matchedNodeIds,
    parentPathIds,
    isRoot,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    draggedNodeId,
    dropTargetId,
    dropPosition,
}) => {
    const isExpanded = expandedState[node.id] ?? false;
    const hasChildren = node.children && node.children.length > 0;
    const colorClass = getNodeColorClass(node.level);
    const nodeRef = useRef<HTMLDivElement>(null);
    const [localDropPosition, setLocalDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

    // Determine if this node matches the search
    const isMatch = matchedNodeIds.has(node.id);
    const isInPath = parentPathIds.has(node.id);

    // Drag state
    const isBeingDragged = draggedNodeId === node.id;
    const isDropTarget = dropTargetId === node.id;
    const currentDropPosition = isDropTarget ? dropPosition : localDropPosition;

    // If searching and node is not in path or match, hide it
    if (searchQuery && !isMatch && !isInPath) {
        return null;
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(node.id);
    };

    // Calculate drop position from mouse Y
    // 45% top = before, 45% bottom = after, 10% middle = inside (as child)
    const getDropPosition = (e: React.DragEvent): 'before' | 'after' | 'inside' => {
        const rect = nodeRef.current?.getBoundingClientRect();
        if (!rect) return 'inside';

        const y = e.clientY - rect.top;
        const height = rect.height;

        if (y < height * 0.45) return 'before';
        if (y > height * 0.55) return 'after';
        return 'inside';
    };

    // Drag handlers
    const handleDragStart = (e: React.DragEvent) => {
        if (isRoot) {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', node.id);
        onDragStart?.(node.id);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.stopPropagation();
        setLocalDropPosition(null);
        onDragEnd?.();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedNodeId && draggedNodeId !== node.id) {
            e.dataTransfer.dropEffect = 'move';
            const position = getDropPosition(e);
            setLocalDropPosition(position);
            onDragOver?.(node.id, position);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.stopPropagation();
        setLocalDropPosition(null);
        onDragLeave?.();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedNodeId || draggedNodeId === node.id) return;

        const position = getDropPosition(e);
        onDrop?.(node.id, position);
        setLocalDropPosition(null);
    };

    // Determine visual classes
    const showDropBefore = isDropTarget && currentDropPosition === 'before';
    const showDropAfter = isDropTarget && currentDropPosition === 'after';
    const showDropInside = isDropTarget && currentDropPosition === 'inside';

    return (
        <div
            className={`tree-node-container ${isBeingDragged ? 'dragging' : ''}`}
            ref={nodeRef}
        >
            {/* Drop indicator line - BEFORE */}
            {showDropBefore && (
                <div className="drop-indicator drop-indicator-before">
                    <div className="drop-indicator-dot"></div>
                    <div className="drop-indicator-line"></div>
                </div>
            )}

            <div className="tree-node-row">
                {/* The node pill */}
                <div
                    className={`tree-node-pill ${colorClass} ${isMatch ? 'search-match' : ''} ${showDropInside ? 'drop-target-inside' : ''} ${isBeingDragged ? 'being-dragged' : ''}`}
                    onClick={handleToggle}
                    draggable={!isRoot}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {!isRoot && (
                        <span className="drag-handle" title="Drag to reorder">
                            ⋮⋮
                        </span>
                    )}
                    <span className="node-label">{node.name}</span>
                    {hasChildren && (
                        <button
                            className="expand-btn"
                            onClick={handleToggle}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                            {isExpanded ? '−' : '+'}
                        </button>
                    )}
                </div>

                {/* Connecting line to children */}
                {hasChildren && isExpanded && (
                    <div className="horizontal-line"></div>
                )}

                {/* Children container */}
                {hasChildren && isExpanded && (
                    <div className="children-container">
                        <div className="vertical-connector"></div>
                        <div className="children-nodes">
                            {node.children!.map((child, index) => (
                                <div key={child.id} className="child-wrapper">
                                    <div className="child-horizontal-line"></div>
                                    <TreeNodeComponent
                                        node={child}
                                        expandedState={expandedState}
                                        onToggle={onToggle}
                                        searchQuery={searchQuery}
                                        matchedNodeIds={matchedNodeIds}
                                        parentPathIds={parentPathIds}
                                        isLastChild={index === node.children!.length - 1}
                                        onDragStart={onDragStart}
                                        onDragEnd={onDragEnd}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        draggedNodeId={draggedNodeId}
                                        dropTargetId={dropTargetId}
                                        dropPosition={dropPosition}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Drop indicator line - AFTER */}
            {showDropAfter && (
                <div className="drop-indicator drop-indicator-after">
                    <div className="drop-indicator-dot"></div>
                    <div className="drop-indicator-line"></div>
                </div>
            )}
        </div>
    );
};

export default TreeNodeComponent;
