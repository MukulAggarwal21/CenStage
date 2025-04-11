// src/components/Sidebar.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/Sidebar.css';

const Sidebar = ({ onGoalSelect, selectedGoal, onTaskDragStart }) => {
  const goals = useSelector(state => state.goals.items);
  const tasks = useSelector(state => state.tasks.items);
  const isLoading = useSelector(state => state.goals.loading || state.tasks.loading);

  const handleGoalClick = (goal) => {
    onGoalSelect(goal);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
    onTaskDragStart(task);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h2>GOALS</h2>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ul className="goals-list">
            {goals.map(goal => (
              <li 
                key={goal.id} 
                className={`goal-item ${selectedGoal?.id === goal.id ? 'selected' : ''}`}
                style={{ borderColor: goal.color }}
                onClick={() => handleGoalClick(goal)}
              >
                <div className="color-indicator" style={{ backgroundColor: goal.color }}></div>
                <span>{goal.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <h2>TASKS</h2>
        {selectedGoal ? (
          <ul className="tasks-list">
            {tasks.map(task => (
              <li 
                key={task.id}
                className="task-item"
                style={{ borderColor: selectedGoal.color }}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                <div className="color-indicator" style={{ backgroundColor: selectedGoal.color }}></div>
                <span>{task.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-selection">Select a goal to see tasks</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;