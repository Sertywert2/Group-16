import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChartDonut from '../components/ChartDonut';
import ChartBar from '../components/ChartBar';

const AnalyticsDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <ChartDonut />
        <ChartBar />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;