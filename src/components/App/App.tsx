import React, { useMemo, useState, useCallback } from 'react';
import type { Node, ExtNode } from 'relatives-tree/lib/types';
import treePackage from 'relatives-tree/package.json';
import ReactFamilyTree from 'react-family-tree';
import { SourceSelect } from '../SourceSelect/SourceSelect';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NodeDetails } from '../NodeDetails/NodeDetails';
import { NODE_WIDTH, NODE_HEIGHT, SOURCES, DEFAULT_SOURCE } from '../const';
import { getNodeStyle } from './utils';

import css from './App.module.css';

export default React.memo(
  function App() {
    const [source, setSource] = useState(DEFAULT_SOURCE);
    const [nodes, setNodes] = useState(SOURCES[source]);

    // Create separate trees for unrelated families
    const familyTrees = useMemo(() => {
      const visited = new Set<string>();
      const trees: Node[][] = [];
      
      // Find all connected nodes starting from a root node
      const getConnectedNodes = (startNode: Node): Node[] => {
        const connected: Node[] = [];
        const queue = [startNode];
        
        while (queue.length > 0) {
          const node = queue.shift()!;
          if (visited.has(node.id)) continue;
          
          visited.add(node.id);
          connected.push(node);
          
          // Add all related nodes to queue
          nodes.forEach(relatedNode => {
            if (!visited.has(relatedNode.id)) {
              const isRelated = 
                node.parents.some(p => p.id === relatedNode.id) ||
                node.children.some(c => c.id === relatedNode.id) ||
                node.siblings.some(s => s.id === relatedNode.id) ||
                node.spouses.some(s => s.id === relatedNode.id) ||
                relatedNode.parents.some(p => p.id === node.id) ||
                relatedNode.children.some(c => c.id === node.id) ||
                relatedNode.siblings.some(s => s.id === node.id) ||
                relatedNode.spouses.some(s => s.id === node.id);
              
              if (isRelated) {
                queue.push(relatedNode);
              }
            }
          });
        }
        
        return connected;
      };
      
      // Process all nodes to create separate family trees
      nodes.forEach(node => {
        if (!visited.has(node.id)) {
          const connectedNodes = getConnectedNodes(node);
          trees.push(connectedNodes);
        }
      });
      
      return trees;
    }, [nodes]);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [selectId, setSelectId] = useState<string>();
    const [hoverId, setHoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    const changeSourceHandler = useCallback(
      (value: string, nodes: readonly Readonly<Node>[]) => {
        setRootId(nodes[0].id);
        setNodes(nodes);
        setSource(value);
        setSelectId(undefined);
        setHoverId(undefined);
      },
      [],
    );

    const selected = useMemo(() => (
      nodes.find(item => item.id === selectId)
    ), [nodes, selectId]);

    return (
      <div className={css.root}>
        <div className={css.controls}>
          <select 
            className={css.fileSelect}
            value={source} 
            onChange={(ev) => changeSourceHandler(ev.target.value, SOURCES[ev.target.value])}
          >
            {Object.keys(SOURCES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
    
          {rootId !== firstNodeId && (
            <button className={css.reset} onClick={resetRootHandler}>
              Reset
            </button>
          )}
        </div>
        <div className={css.treeContainer}>
          <PinchZoomPan min={0.5} max={2.5} captureWheel className={css.wrapper}>
            {familyTrees.map((treeNodes, index) => (
              <ReactFamilyTree
                key={treeNodes[0].id}
                nodes={treeNodes}
                rootId={treeNodes[0].id}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                className={css.tree}
                renderNode={(node: Readonly<ExtNode>) => (
                  <FamilyNode
                    key={node.id}
                    node={node}
                    isRoot={node.id === rootId}
                    isHover={node.id === hoverId}
                    onClick={setSelectId}
                    onSubClick={setRootId}
                    style={getNodeStyle(node)}
                  />
                )}
              />
            ))}
          </PinchZoomPan>
        </div>
        {rootId !== firstNodeId && (
          <button className={css.reset} onClick={resetRootHandler}>
            Reset
          </button>
        )}
        {selected && (
          <NodeDetails
            node={selected}
            className={css.details}
            onSelect={setSelectId}
            onHover={setHoverId}
            onClear={() => setHoverId(undefined)}
          />
        )}
      </div>
    );
  },
);
