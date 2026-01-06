// Tree node type levels based on hierarchy depth
// Tree node type levels based on hierarchy depth
export const TreeNodeLevel = {
    EQUIPMENT_TYPE: 'equipment_type',    // Root level (Green)
    EQUIPMENT: 'equipment',              // 2nd level (Blue/Purple)
    ASSEMBLY: 'assembly',                // 3rd level (Coral/Red)
    SUB_ASSEMBLY: 'sub_assembly',        // 4th level (Navy/Dark Blue)
    SUB_ASSEMBLY_2: 'sub_assembly_2',    // 5th level (Gray)
    SUB_ASSEMBLY_3: 'sub_assembly_3',    // 6th level (Gray)
    COMPONENT: 'component',              // Leaf level (Green)
} as const;

export type TreeNodeLevel = typeof TreeNodeLevel[keyof typeof TreeNodeLevel];

// Interface for tree node data
export interface TreeNode {
    id: string;
    name: string;
    level: TreeNodeLevel;
    children?: TreeNode[];
}

// Interface for expanded state
export interface ExpandedState {
    [nodeId: string]: boolean;
}

// Interface for search result with matched path
export interface SearchResult {
    matchedNodeIds: Set<string>;
    parentPathIds: Set<string>;
}
