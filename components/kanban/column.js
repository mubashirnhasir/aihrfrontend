import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import Tasks from './tasks'

const Column = ({ tasks }) => {
    return (
        <div className='w-[400px] h-[90vh] flex flex-col gap-2 bg-gray-100 rounded-lg border border-gray-200 p-2' >
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                   <Tasks id={task.id} title={task.title} key={task.id}  />
                ))}
            </SortableContext>
        </div>
    )
}

export default Column