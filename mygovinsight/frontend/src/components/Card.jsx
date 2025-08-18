const Card = ({ children }) => {
  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      {children}
    </div>
  );
};

export default Card;