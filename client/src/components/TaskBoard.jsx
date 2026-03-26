import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTask } from "../context/TaskContext.jsx";
import Modal from "./Modal.jsx";
import { FiEye, FiCalendar, FiActivity, FiClock } from "react-icons/fi";

const TaskBoard = ({ boardId, tasks }) => {
  const { updateTaskStatus } = useTask();
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    updateTaskStatus(draggableId, destination.droppableId, boardId, boardId);
  };

  const columns = ["Todo", "In Progress", "Done"];

  const getPriorityStyle = (priority) => {
    if (priority === "High")
      return "bg-red-50 text-red-700 border border-red-200";
    if (priority === "Medium")
      return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 w-full h-[60vh] items-start ">
          {columns.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);

            return (
              <div
                key={status}
                className="flex-none w-85 bg-slate-50/80 backdrop-blur-md rounded-3xl flex flex-col border border-slate-200/60 shadow-sm h-full overflow-hidden transition-colors"
              >
                <div className="p-5 border-b border-slate-200/60 flex justify-between items-center bg-white/60">
                  <h3 className="font-extrabold text-slate-800 flex items-center gap-2.5 text-[15px] uppercase tracking-wide">
                    {status === "Todo" ? (
                      <span className="p-1.5 bg-slate-100 rounded-lg text-sm">
                        📌
                      </span>
                    ) : status === "In Progress" ? (
                      <span className="p-1.5 bg-amber-100 rounded-lg text-sm animate-pulse">
                        ⏳
                      </span>
                    ) : (
                      <span className="p-1.5 bg-emerald-100 rounded-lg text-sm">
                        ✅
                      </span>
                    )}
                    {status}
                  </h3>
                  <span className="px-3 py-1 bg-slate-200/70 text-slate-600 rounded-xl text-xs font-black shadow-inner border border-slate-200">
                    {columnTasks.length}
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-4 pb-8 overflow-y-auto  transition-all duration-300 flex flex-col gap-4 min-h-50 ${
                        snapshot.isDraggingOver
                          ? "bg-indigo-50/50 ring-2 ring-inset ring-indigo-500/20"
                          : "bg-transparent"
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={`group bg-white p-5 rounded-2xl border flex flex-col gap-3.5 transition-all duration-300 ease-out cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-accent/30 ${
                                snapshot.isDragging
                                  ? "shadow-2xl scale-[1.02] rotate-2 z-50 border-accent opacity-95 ring-4 ring-accent/20"
                                  : "shadow-sm border-slate-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
                              }`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-[10px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase ${getPriorityStyle(task.priority)}`}
                                >
                                  {task.priority}
                                </span>
                                <div className="flex gap-1.5">
                                  <span className="text-slate-300 group-hover:text-accent transition-colors opacity-50 group-hover:opacity-100 flex items-center gap-1 text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-md">
                                    <FiEye className="w-3.5 h-3.5" />
                                    View
                                  </span>
                                </div>
                              </div>

                              <h4 className="text-base font-bold text-slate-800 leading-snug tracking-tight group-hover:text-accent transition-colors">
                                {task.title}
                              </h4>

                              <div className="flex justify-between items-end mt-2 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                  <FiCalendar className="w-4 h-4" />
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(
                                        undefined,
                                        { month: "short", day: "numeric" },
                                      )
                                    : "-"}
                                </div>

                                <div className="flex -space-x-2">
                                  {task.assignedUser ? (
                                    <div
                                      className="w-8 h-8 rounded-full bg-linear-to-br from-accent to-indigo-600 text-white flex items-center justify-center text-[11px] font-black shadow-md border-2 border-white ring-2 ring-transparent transition-all group-hover:ring-accent/30"
                                      title={task.assignedUser.name}
                                    >
                                      {task.assignedUser.name
                                        ? task.assignedUser.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "?"}
                                    </div>
                                  ) : (
                                    <div
                                      className="w-8 h-8 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center text-[12px] font-bold shadow-sm"
                                      title="Unassigned"
                                    >
                                      +
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Task Details & Activity History Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Task Overview"
      >
        {selectedTask && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[11px] px-3 py-1 rounded-lg font-black tracking-widest uppercase ${getPriorityStyle(selectedTask?.priority)}`}
                >
                  {selectedTask?.priority} Priority
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {selectedTask?.status}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 leading-tight mb-3">
                {selectedTask?.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60 shadow-inner">
                {selectedTask?.description?.length > 200
                  ? `${selectedTask?.description.slice(0, 200)}...`
                  : selectedTask?.description ||
                    "No detailed description provided for this task."}
              </p>
            </div>

            <div className="flex gap-4 border-t border-slate-100 pt-5">
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Assigned To
                </h4>
                {selectedTask?.assignedUser ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-accent to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                      {selectedTask?.assignedUser?.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {selectedTask?.assignedUser?.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-slate-400 italic">
                    Unassigned
                  </span>
                )}
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Due Date
                </h4>
                <span className="text-sm font-bold text-slate-700 block mt-1">
                  {selectedTask?.dueDate
                    ? new Date(selectedTask?.dueDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "-"}
                </span>
              </div>
            </div>

            <div className="mt-2 border-t border-slate-200 pt-6">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                <FiActivity className="w-4 h-4 text-accent" />
                Activity History
              </h4>

              <div className="max-h-60 overflow-y-auto  pr-3 space-y-4">
                {selectedTask?.activityHistory &&
                selectedTask?.activityHistory.length > 0 ? (
                  selectedTask?.activityHistory
                    .slice()
                    .reverse()
                    .map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 items-start relative group"
                      >
                        {idx !== selectedTask?.activityHistory.length - 1 && (
                          <div className="absolute left-4 top-8 -bottom-4 w-0.5 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 text-slate-500 text-xs shadow-sm shadow-slate-200/50">
                          {idx === selectedTask?.activityHistory.length - 1
                            ? "🎉"
                            : "📝"}
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl rounded-tl-sm border border-slate-100 flex-1 hover:border-slate-300 transition-colors hover:shadow-sm">
                          <p className="text-sm font-bold text-slate-700">
                            {activity.action}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mt-1.5 tracking-wider flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {new Date(
                              activity.date || activity.createdAt || Date.now(),
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                    <div className="text-2xl mb-2 grayscale opacity-50">📭</div>
                    <p className="text-sm text-slate-500 font-semibold mb-1">
                      No activity
                    </p>
                    <p className="text-xs text-slate-400">
                      Task history will appear here once modified.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Close Overview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TaskBoard;
