import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);



interface Task {
  name: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface TaskSection {
  title: string;
  value: number;
  logoNumber: number;
  valueLabel: string;
}

// ------------------ Components ------------------

const TaskTable: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <div className="table-container">
    <table className="task-table">
      <thead>
        <tr>
          <th>Tasks</th>
          <th>Total</th>
          <th>Completed</th>
          <th>Pending</th>
          <th>Overdue</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index}>
            <td>{task.name}</td>
            <td>{task.total}</td>
            <td className="completed">{task.completed}</td>
            <td className="pending">{task.pending}</td>
            <td className="overdue">{task.overdue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ------------------ Main Dashboard ------------------

const Dashboard: React.FC = () => {
  const [isPieTableVisible, setIsPieTableVisible] = useState(false);
  const [isBarTableVisible, setIsBarTableVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState('Team Tasks');

  const tasks: Task[] = [
    { name: 'Team Tasks', total: 20, completed: 5, pending: 10, overdue: 5 },
    { name: 'Personal Tasks', total: 15, completed: 12, pending: 2, overdue: 1 },
    { name: 'Assigned Tasks', total: 22, completed: 18, pending: 3, overdue: 1 },
  ];

  const totalTasks = tasks.reduce((sum, task) => sum + task.total, 0);
  const completedTasks = tasks.reduce((sum, task) => sum + task.completed, 0);
  const pendingTasks = tasks.reduce((sum, task) => sum + task.pending, 0);
  const overdueTasks = tasks.reduce((sum, task) => sum + task.overdue, 0);

  const taskSections: TaskSection[] = [
    { title: 'Total Tasks', value: totalTasks, logoNumber: totalTasks, valueLabel: '' },
    { title: 'Completed Tasks', value: completedTasks, logoNumber: completedTasks, valueLabel: '' },
    { title: 'Pending Tasks', value: pendingTasks, logoNumber: pendingTasks, valueLabel: '' },
    { title: 'Overdue Tasks', value: overdueTasks, logoNumber: overdueTasks, valueLabel: '' },
  ];

  const task = tasks.find((t) => t.name === selectedTask) || tasks[0];

  const getPieChartData = (): ChartData<'pie'> => ({
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        label: 'Tasks',
        data: [task.completed, task.pending, task.overdue],
        backgroundColor: ['#4B5EAA', '#F4A261', '#E76F51'],
        hoverBackgroundColor: ['#3B4A8A', '#E68A3F', '#C95B3F'],
        borderColor: '#fff',
        borderWidth: 1.5,
      },
    ],
  });

  const pieOptions: ChartOptions<'pie'> = {
    plugins: {
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: { size: 12, weight: 'bold' },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          title: () => 'Task Details',
          label: (context: TooltipItem<'pie'>) => {
            const data = context.dataset.data as number[];
            const total = data.reduce((a, b) => a + b, 0);
            const completed = data[0];
            const pending = data[1];
            const overdue = data[2];
            return [
              `Total: ${total}`,
              `Completed: ${completed} (${((completed / total) * 100).toFixed(2)}%)`,
              `Pending: ${pending} (${((pending / total) * 100).toFixed(2)}%)`,
              `Overdue: ${overdue} (${((overdue / total) * 100).toFixed(2)}%)`,
            ];
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 12, family: 'Inter, sans-serif' },
          color: '#1F2937',
          padding: 10,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
      easing: 'easeOutCubic',
    },
    maintainAspectRatio: false,
  };

  const barChartData: ChartData<'bar'> = {
    labels: tasks.map((t) => t.name),
    datasets: [
      {
        label: 'Rated (Completed)',
        data: tasks.map((t) => t.completed),
        backgroundColor: '#4B5EAA',
        borderColor: '#3B4A8A',
        borderWidth: 1,
      },
      {
        label: 'Unrated (Pending + Overdue)',
        data: tasks.map((t) => t.pending + t.overdue),
        backgroundColor: '#6B7280',
        borderColor: '#4B5563',
        borderWidth: 1,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    plugins: {
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: { size: 12, weight: 'bold' },
        padding: 10,
        cornerRadius: 4,
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 12, family: 'Inter, sans-serif' },
          color: '#1F2937',
          padding: 10,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Task Categories',
          color: '#1F2937',
          font: { size: 14 },
        },
        ticks: { color: '#1F2937' },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Tasks',
          color: '#1F2937',
          font: { size: 14 },
        },
        ticks: { color: '#1F2937' },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutCubic',
    },
    maintainAspectRatio: false,
  };

  const handlePieChartClick = () => {
    setIsPieTableVisible((prev) => !prev);
    setIsBarTableVisible(false);
  };

  const handleBarChartClick = () => {
    setIsBarTableVisible((prev) => !prev);
    setIsPieTableVisible(false);
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Task Management Dashboard</h1>
        <p>Your complete task overview and management tools</p>
      </div>

      <div className="card-grid">
        {taskSections.map((section, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <img src="https://placehold.co/64x64?text=Logo" alt="logo" />
              <span>{section.title}</span>
            </div>
            <div className="card-value">
              <div className="value">{section.value.toLocaleString()}</div>
              {section.valueLabel && <div className="value-label">{section.valueLabel}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <div className="chart-container">
          <div
            className={`chart pie-chart-wrapper ${isPieTableVisible ? 'half-width' : 'full-width'}`}
            onClick={handlePieChartClick}
          >
            <Pie data={getPieChartData()} options={pieOptions} />
          </div>
          {isPieTableVisible && <TaskTable tasks={tasks} />}
        </div>

        <div className="radio-group">
          {['Team Tasks', 'Personal Tasks', 'Assigned Tasks'].map((taskName) => (
            <label key={taskName} className="radio-label">
              <input
                type="radio"
                name="task"
                value={taskName}
                checked={selectedTask === taskName}
                onChange={() => setSelectedTask(taskName)}
              />
              {taskName}
            </label>
          ))}
        </div>
      </div>

      <div className="chart-section">
        <h2 className="chart-title">Task Rating Overview</h2>
        <div className="chart-container" onClick={handleBarChartClick}>
          <div className={`chart ${isBarTableVisible ? 'half-width' : 'full-width'}`}>
            <Bar data={barChartData} options={barOptions} />
          </div>
          {isBarTableVisible && <TaskTable tasks={tasks} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

