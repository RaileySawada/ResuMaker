import { useState, type DragEvent } from "react";

export interface DraggableItemProps {
  draggable: true;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  "data-dragging": boolean;
  "data-drag-over": boolean;
}

export const useDraggableList = (
  onReorder: (sourceId: string, targetId: string) => void,
) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const getItemProps = (id: string): DraggableItemProps => ({
    draggable: true,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", id);
      setDraggedId(id);
    },
    onDragOver: (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDragOverId(id);
    },
    onDrop: (event) => {
      event.preventDefault();
      const sourceId =
        draggedId || event.dataTransfer.getData("text/plain");
      if (sourceId && sourceId !== id) onReorder(sourceId, id);
      setDraggedId(null);
      setDragOverId(null);
    },
    onDragEnd: () => {
      setDraggedId(null);
      setDragOverId(null);
    },
    "data-dragging": draggedId === id,
    "data-drag-over": dragOverId === id && draggedId !== id,
  });

  return { getItemProps };
};
