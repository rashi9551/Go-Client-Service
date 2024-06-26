/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

export const AdminDashboard = () => {
  // Static data for the dashboard
  const dashboardData = {
    newDrivers: 10,
    totalDrivers: 150,
    blockedDrivers: 5,
    newUsers: 20,
    totalUsers: 300,
    blockedUsers: 10,
  };

  const chartData = [
    { name: 'Jan', users: 4000, drivers: 2400 },
    { name: 'Feb', users: 3000, drivers: 1398 },
    { name: 'Mar', users: 2000, drivers: 9800 },
    { name: 'Apr', users: 2780, drivers: 3908 },
    { name: 'May', users: 1890, drivers: 4800 },
    { name: 'Jun', users: 2390, drivers: 3800 },
    { name: 'Jul', users: 3490, drivers: 4300 },
  ];

  const pieChartData = [
    { name: 'Wallet Payment', value: 400 },
    { name: 'Cash in hand', value: 300 },
    { name: 'Card Payment', value: 300 },
  ];

  const COLORS = ['#0088FE', '#FFBB28', '#00C49F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }:any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-[81.5%] h-fit mx-auto my-[2.5rem] bg-gray-100 py-6 rounded-3xl drop-shadow-lg">
      <div className="w-[95%] mx-auto md:h-fit h-fit md:grid-cols-3 md:gap-8 grid gap-5">
        <div className="bg-green-200 rounded-3xl md:grid-cols-1 grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
          <div className="row-span-2 flex items-center px-3">
            <h1 className="text-2xl font-medium text-white">New Drivers</h1>
          </div>
          <div className="row-span-3 flex items-center justify-end">
            <h1 className="text-7xl px-2 text-white">{dashboardData.newDrivers}</h1>
          </div>
        </div>

        <div className="bg-green-200 rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
          <div className="row-span-2 flex items-center px-3">
            <h1 className="text-2xl font-medium text-white">Total Drivers</h1>
          </div>
          <div className="row-span-3 flex items-center justify-end">
            <h1 className="text-7xl px-2 text-white">{dashboardData.totalDrivers}</h1>
          </div>
        </div>

        <div className="bg-green-200 rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
          <div className="row-span-2 flex items-center px-3">
            <h1 className="text-2xl font-medium text-white">Blocked Drivers</h1>
          </div>
          <div className="row-span-3 flex items-center justify-end">
            <h1 className="text-7xl px-2 text-white">{dashboardData.blockedDrivers}</h1>
          </div>
        </div>

        <div className="bg-indigo-100 rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
          <div className="row-span-2 flex items-center px-3">
            <h1 className="text-2xl font-medium text-white">New Users</h1>
          </div>
          <div className="row-span-3 flex items-center justify-end">
            <h1 className="text-7xl px-2 text-white">{dashboardData.newUsers}</h1>
          </div>
        </div>

        <div className="bg-indigo-100 rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
          <div className="row-span-2 flex items-center px-3">
            <h1 className="text-2xl font-medium text-white">Total Users</h1>
          </div>
          <div className="row-span-3 flex items-center justify-end">
            <h1 className="text-7xl px-2 text-white">{dashboardData.totalUsers}</h1>
          </div>
        </div>

        <div className="bg-indigo-100 rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl px-1 pb-1">
          <div className="row-span-2 flex items-center px-3">
            <h1 className="text-2xl font-medium text-white">Blocked Users</h1>
          </div>
          <div className="row-span-3 flex items-center justify-end">
            <h1 className="text-7xl px-2 text-white">{dashboardData.blockedUsers}</h1>
          </div>
        </div>
      </div>
      <div className="mt-16 md:grid-cols-2 md:gap-8 grid">
        <div>
          <h1 className="pl-8 mb-8 font-bold">USERS AND DRIVERS REGISTRATIONS</h1>
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="drivers" stroke="#82ca9d" />
          </LineChart>
        </div>
        <div>
          <h1 className="font-bold">PAYMENT METHODS</h1>
          <PieChart width={400} height={220}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <div className="flex gap-5">
            <h1 className="text-green-500">Wallet Payment</h1>
            <h1 className="text-yellow-700">Cash in hand</h1>
            <h1 className="text-blue-700">Card Payment</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
