import React from 'react';
import { TreeNode as TreeNodeType, TreeNodeLevel, ExpandedState } from '../../types/types';
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
}

// Get the color class based on node level
const getNodeColorClass = (level: TreeNodeLevel): string => {
    switch (level) {
        case TreeNodeLevel.EQUIPMENT_TYPE:
            return 'node-equipment-type'; // Green
        case TreeNodeLevel.EQUIPMENT:
            return 'node-equipment'; // Blue/Purple
        case TreeNodeLevel.ASSEMBLY:
            return 'node-assembly'; // Coral/Red
        case TreeNodeLevel.SUB_ASSEMBLY:
            return 'node-sub-assembly'; // Navy/Dark Blue
        case TreeNodeLevel.SUB_ASSEMBLY_2:
            return 'node-sub-assembly-2'; // Gray
        case TreeNodeLevel.SUB_ASSEMBLY_3:
            return 'node-sub-assembly-3'; // Muted gray
        case TreeNodeLevel.COMPONENT:
            return 'node-component'; // Green (leaf)
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
}) => {
    const isExpanded = expandedState[node.id] ?? false;
    const hasChildren = node.children && node.children.length > 0;
    const colorClass = getNodeColorClass(node.level);

    // Determine if this node matches the search
    const isMatch = matchedNodeIds.has(node.id);
    const isInPath = parentPathIds.has(node.id);

    // If searching and node is not in path or match, hide it
    if (searchQuery && !isMatch && !isInPath) {
        return null;
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(node.id);
    };

    return (
        <div className="tree-node-container">
            <div className="tree-node-row">
                {/* The node pill */}
                <div
                    className={`tree-node-pill ${colorClass} ${isMatch ? 'search-match' : ''}`}
                    onClick={handleToggle}
                >
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
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeNodeComponent;
