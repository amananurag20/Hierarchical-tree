export const TreeNodeLevel = {
    EQUIPMENT_TYPE: 'equipment_type',
    EQUIPMENT: 'equipment',
    ASSEMBLY: 'assembly',
    SUB_ASSEMBLY: 'sub_assembly',
    SUB_ASSEMBLY_2: 'sub_assembly_2',
    SUB_ASSEMBLY_3: 'sub_assembly_3',
    COMPONENT: 'component',
} as const;

export type TreeNodeLevel = typeof TreeNodeLevel[keyof typeof TreeNodeLevel];

export interface TreeNode {
    id: string;
    name: string;
    level: TreeNodeLevel;
    children?: TreeNode[];
}

export interface ExpandedState {
    [nodeId: string]: boolean;
}

export interface SearchResult {
    matchedNodeIds: Set<string>;
    parentPathIds: Set<string>;
}
