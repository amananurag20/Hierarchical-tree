import { TreeNode, TreeNodeLevel } from '../types/types';

// Complete vessel hierarchy data based on Figma designs
export const vesselHierarchyData: TreeNode = {
    id: 'equipments',
    name: 'Equipments',
    level: TreeNodeLevel.EQUIPMENT_TYPE,
    children: [
        {
            id: 'engine',
            name: 'Engine',
            level: TreeNodeLevel.EQUIPMENT,
            children: [
                {
                    id: 'main-engine-propulsion',
                    name: 'Main Engine & Propulsion',
                    level: TreeNodeLevel.ASSEMBLY,
                    children: [
                        {
                            id: 'main-engine',
                            name: 'Main Engine',
                            level: TreeNodeLevel.SUB_ASSEMBLY,
                            children: [
                                {
                                    id: 'air-exhaust-system',
                                    name: 'Air & Exhaust System',
                                    level: TreeNodeLevel.SUB_ASSEMBLY_2,
                                    children: [
                                        {
                                            id: 'me-turbocharger',
                                            name: 'ME Turbocharger',
                                            level: TreeNodeLevel.SUB_ASSEMBLY_3,
                                            children: [
                                                { id: 'spare-parts-box', name: 'Spare Parts Box', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal', name: 'Seal', level: TreeNodeLevel.COMPONENT },
                                                { id: 'o-ring', name: 'O-Ring', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-turbine-side', name: 'Seal -Turbine Side', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-compressor-side', name: 'Seal -Compressor Side', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-engine-mount', name: 'Seal -Engine Mount', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-exhaust-flange', name: 'Seal -Exhaust Flange', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-oil-pan', name: 'Seal -Oil Pan', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-intake-manifold', name: 'Seal -Intake Manifold', level: TreeNodeLevel.COMPONENT },
                                                { id: 'seal-transmission-case', name: 'Seal -Transmission Case', level: TreeNodeLevel.COMPONENT },
                                            ],
                                        },
                                        {
                                            id: 'aux-blower',
                                            name: 'Aux Blower',
                                            level: TreeNodeLevel.SUB_ASSEMBLY_3,
                                        },
                                        {
                                            id: 'aux-blower-2',
                                            name: 'Aux Blower 2',
                                            level: TreeNodeLevel.SUB_ASSEMBLY_3,
                                        },
                                        {
                                            id: 'charge-air-cooler',
                                            name: 'Charge Air Cooler',
                                            level: TreeNodeLevel.SUB_ASSEMBLY_3,
                                        },
                                        {
                                            id: 'exhaust-valve-complete',
                                            name: 'Exhaust Valve Complete',
                                            level: TreeNodeLevel.SUB_ASSEMBLY_3,
                                        },
                                    ],
                                },
                                {
                                    id: 'control-safety-system',
                                    name: 'Control & Safety System',
                                    level: TreeNodeLevel.SUB_ASSEMBLY_2,
                                },
                                {
                                    id: 'fuel-system',
                                    name: 'Fuel System',
                                    level: TreeNodeLevel.SUB_ASSEMBLY_2,
                                },
                                {
                                    id: 'cooling-water-system',
                                    name: 'Cooling Water System',
                                    level: TreeNodeLevel.SUB_ASSEMBLY_2,
                                },
                                {
                                    id: 'cylinder-liner-lubrication',
                                    name: 'Cylinder Liner & Lubrication',
                                    level: TreeNodeLevel.SUB_ASSEMBLY_2,
                                },
                            ],
                        },
                        {
                            id: 'propeller',
                            name: 'Propeller',
                            level: TreeNodeLevel.SUB_ASSEMBLY,
                        },
                        {
                            id: 'shafting',
                            name: 'Shafting',
                            level: TreeNodeLevel.SUB_ASSEMBLY,
                        },
                    ],
                },
                {
                    id: 'power-generation',
                    name: 'Power Generation',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'aux-boiler',
                    name: 'Aux boiler',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'aux-machinery',
                    name: 'Aux machinery',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'electrical-automation',
                    name: 'Electrical & Automation',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'tank-systems',
                    name: 'Tank Systems',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'dp-system',
                    name: 'DP System',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'others-engine',
                    name: 'Others',
                    level: TreeNodeLevel.ASSEMBLY,
                },
            ],
        },
        {
            id: 'deck',
            name: 'Deck',
            level: TreeNodeLevel.EQUIPMENT,
            children: [
                {
                    id: 'deck-machinery',
                    name: 'Deck Machinery',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'cargo',
                    name: 'Cargo',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'lsa-ffa',
                    name: 'LSA/FFA',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'radio-navigation',
                    name: 'Radio & Navigation',
                    level: TreeNodeLevel.ASSEMBLY,
                },
                {
                    id: 'others-deck',
                    name: 'Others',
                    level: TreeNodeLevel.ASSEMBLY,
                },
            ],
        },
        {
            id: 'accommodation',
            name: 'Accomodation',
            level: TreeNodeLevel.EQUIPMENT,
        },
        {
            id: 'misc',
            name: 'Misc.',
            level: TreeNodeLevel.EQUIPMENT,
        },
    ],
};

// Helper function to get all node IDs recursively
export const getAllNodeIds = (node: TreeNode): string[] => {
    const ids = [node.id];
    if (node.children) {
        node.children.forEach((child) => {
            ids.push(...getAllNodeIds(child));
        });
    }
    return ids;
};

// Helper function to find a node by ID
export const findNodeById = (node: TreeNode, id: string): TreeNode | null => {
    if (node.id === id) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
    }
    return null;
};

// Helper function to get node level depth
export const getNodeDepth = (node: TreeNode, targetId: string, depth = 0): number => {
    if (node.id === targetId) return depth;
    if (node.children) {
        for (const child of node.children) {
            const foundDepth = getNodeDepth(child, targetId, depth + 1);
            if (foundDepth !== -1) return foundDepth;
        }
    }
    return -1;
};
