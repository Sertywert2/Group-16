import Sidebar from '../components/Sidebar';
import ListItem from '../components/ListItem';
import ChartBar from '../components/ChartBar';
import Footer from '../components/Footer';
import { useState } from 'react';

const SplitView = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <ListItem />
        <ChartBar />
        <Footer />
      </div>
    </div>
  );
};

export default SplitView;