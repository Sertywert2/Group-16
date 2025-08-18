// frontend/src/components/KPI.jsx
const KPI = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-2">
    <div className="card p-1 text-center">
      <h3 className="font-bold">Users</h3>
      <p className="text-lg">1,234</p>
    </div>
    <div className="card p-1 text-center">
      <h3 className="font-bold">Feedback</h3>
      <p className="text-lg">567</p>
    </div>
    <div className="card p-1 text-center">
      <h3 className="font-bold">Services</h3>
      <p className="text-lg">89</p>
    </div>
  </div>
);

export default KPI;