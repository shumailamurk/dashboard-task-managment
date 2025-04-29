
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

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Type definitions
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

// Reusable TaskTable component
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

const Dashboard: React.FC = () => {
  const [isPieTableVisible, setIsPieTableVisible] = useState<boolean>(false);
  const [isBarTableVisible, setIsBarTableVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<string>('Team Tasks');
  const [rotate, setRotate] = useState<boolean>(false);

  const tasks: Task[] = [
    { name: 'Team Tasks', total: 20, completed: 5, pending: 10, overdue: 5 },
    { name: 'Personal Tasks', total: 15, completed: 12, pending: 2, overdue: 1 },
    { name: 'Assigned Tasks', total: 22, completed: 18, pending: 3, overdue: 1 },
  ];

  // Calculate card data dynamically from tasks
  const totalTasks: number = tasks.reduce((sum, task) => sum + task.total, 0);
  const completedTasks: number = tasks.reduce((sum, task) => sum + task.completed, 0);
  const pendingTasks: number = tasks.reduce((sum, task) => sum + task.pending, 0);
  const overdueTasks: number = tasks.reduce((sum, task) => sum + task.overdue, 0);

  const taskSections: TaskSection[] = [
    { title: 'Total Tasks', value: totalTasks, logoNumber: totalTasks, valueLabel: '' },
    { title: 'Completed Tasks', value: completedTasks, logoNumber: completedTasks, valueLabel: '' },
    { title: 'Pending Tasks', value: pendingTasks, logoNumber: pendingTasks, valueLabel: '' },
    { title: 'Overdue Tasks', value: overdueTasks, logoNumber: overdueTasks, valueLabel: '' },
  ];

  const task = tasks.find((t) => t.name === selectedTask) || tasks[0];
  const total = task.completed + task.pending + task.overdue;
  const completedPercentage = (task.completed / total) * 100;
  const pendingPercentage = (task.pending / total) * 100;
  const overduePercentage = (task.overdue / total) * 100;

  const getPieChartData = (): ChartData<'pie'> => {
    return {
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
    };
  };

  const barChartData: ChartData<'bar'> = {
    labels: tasks.map((task) => task.name),
    datasets: [
      {
        label: 'Rated (Completed)',
        data: tasks.map((task) => task.completed),
        backgroundColor: '#4B5EAA',
        borderColor: '#3B4A8A',
        borderWidth: 1,
      },
      {
        label: 'Unrated (Pending + Overdue)',
        data: tasks.map((task) => task.pending + task.overdue),
        backgroundColor: '#6B7280',
        borderColor: '#4B5563',
        borderWidth: 1,
      },
    ],
  };

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
            const completedPercentage = ((completed / total) * 100).toFixed(2);
            const pendingPercentage = ((pending / total) * 100).toFixed(2);
            const overduePercentage = ((overdue / total) * 100).toFixed(2);
            return [
              `Total: ${total}`,
              `Completed: ${completed} (${completedPercentage}%)`,
              `Pending: ${pending} (${pendingPercentage}%)`,
              `Overdue: ${overdue} (${overduePercentage}%)`,
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
    elements: { arc: { borderRadius: 5 } },
    maintainAspectRatio: false,
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
          font: { size: 14, family: 'Inter, sans-serif' },
        },
        ticks: { color: '#1F2937' },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Tasks',
          color: '#1F2937',
          font: { size: 14, family: 'Inter, sans-serif' },
        },
        ticks: { color: '#1F2937' },
        beginAtZero: true,
      },
    },
    animation: { duration: 800, easing: 'easeOutCubic' },
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

  useEffect(() => {
    setRotate(true);
  }, [selectedTask]);

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
              <img src="https://placehold.co/64x64?text=Company" alt="company logo" />
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
            className={`chart pie-chart-wrapper ${isPieTableVisible ? 'half-width' : 'full-width'} ${rotate ? 'rotate' : ''}`}
            onClick={handlePieChartClick}
          >
            <div className="pie-chart-container">
              <Pie data={getPieChartData()} options={pieOptions} />
            </div>
          </div>
          {isPieTableVisible && (
            <div className="chart-table">
              <TaskTable tasks={tasks} />
            </div>
          )}
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
                aria-label={`Select ${taskName}`}
              />
              {taskName}
            </label>
          ))}
        </div>
      </div>

      <div className="chart-section">
        <h2 className="chart-title">Task Rating Overview</h2>
        <div className="chart-container">
          <div className={`chart ${isBarTableVisible ? 'half-width' : 'full-width'}`} onClick={handleBarChartClick}>
            <Bar data={barChartData} options={barOptions} />
          </div>
          {isBarTableVisible && (
            <div className="chart-table">
              <TaskTable tasks={tasks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


