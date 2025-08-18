// frontend/src/utils/formatData.js
export const formatData = (data) => ({
  labels: Object.keys(data),
  datasets: [{ data: Object.values(data), backgroundColor: '#009739' }],
});