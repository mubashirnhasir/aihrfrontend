"use client"
import { closestCorners, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import Column from './column';

const KanbanBoard = () => {
 const [columns, setColumns] = useState({
  todo: [
    { id: "1", title: "Add text to homepage" },
    { id: "2", title: "Fix image alignment" },
    { id: "3", title: "Update footer links" }
  ],
  inProgress: [
    { id: "4", title: "Build login form" }
  ],
  completed: [
    { id: "5", title: "Write API docs" }
  ]
});


  const getTaskPos= id => tasks.findIndex(task=> task.id === id)

const handleDragEnd = ({ active, over }) => {
  if (!over || active.id === over.id) return;

  const fromColumn = findColumn(active.id);
  const toColumn = findColumn(over.id);

  if (!fromColumn) return;

  const fromIndex = columns[fromColumn].findIndex((t) => t.id === active.id);
  const movingTask = columns[fromColumn][fromIndex];

  // Remove task from original column
  const updatedFrom = [...columns[fromColumn]];
  updatedFrom.splice(fromIndex, 1);

  // If dropped in empty area (not on a task)
  if (!toColumn) {
    setColumns({
      ...columns,
      [fromColumn]: updatedFrom,
    });
    return;
  }

  const updatedTo = [...columns[toColumn]];
  const toIndex = columns[toColumn].findIndex((t) => t.id === over.id);

  // Add the task at the correct position
  updatedTo.splice(toIndex === -1 ? updatedTo.length : toIndex + 1, 0, movingTask);

  setColumns({
    ...columns,
    [fromColumn]: updatedFrom,
    [toColumn]: updatedTo,
  });
};

const findColumn = (id) =>
  Object.keys(columns).find(col => columns[col].some(task => task.id === id));


  return (
    <div className='flex items-center justify-center gap-4 w-full h-screen'>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        {Object.entries(columns).map(([columnId, tasks]) => (
  <SortableContext key={columnId} items={tasks.map(t => t.id)}>
    <Column columnId={columnId} tasks={tasks} />
  </SortableContext>
))}

      </DndContext>
    </div>
  );
};

export default KanbanBoard;
