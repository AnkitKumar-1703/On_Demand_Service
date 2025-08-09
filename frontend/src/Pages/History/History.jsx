import React, { useState, useEffect } from 'react';
import NewCustomerNavbar from '../../Components/NewNavbar/NewCustomerNavbar.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import axios from 'axios';
import HistoryCard from '../../Components/HistoryCard/HistoryCard.jsx';
import { 
  FaListAlt, 
  FaHourglassHalf, 
  FaRegClock, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle 
} from 'react-icons/fa';
import './History.css';
import ChatBox from '../../Components/Chatbox/Chatbox.jsx';

import { useTranslation } from 'react-i18next';

const History = () => {

const {t}=useTranslation();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [unaccepted, setUnaccepted] = useState([]);
  const [partialCompleted, setPartialCompleted] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const newData = JSON.stringify({ userId: localStorage.getItem("currentUser") });
        const url = `http://localhost:5000/customer/auth/orderhistory`;
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: url,
          headers: {
            Authorization: `bearer ${localStorage.getItem("customerToken")}`
          },
          data: newData,
        };
        const response = await axios.request(config);
        setHistory(response.data['orders']);

        // Partition orders into respective arrays
        let pendingOrders = [];
        let completedOrders = [];
        let rejectedOrders = [];
        let unacceptedOrders = [];
        let partialCompleteOrders = [];

        response.data['orders'].forEach((order) => {
          if (order.orderState === 'COMPLETED' && order.orderCompleted === true) {
            completedOrders.push(order);
          } else if (order.orderState === 'PENDING') {
            pendingOrders.push(order);
          } else if (order.orderState === 'COMPLETED') {
            partialCompleteOrders.push(order);
          } else if (order.orderState === 'REJECTED') {
            rejectedOrders.push(order);
          } else {
            unacceptedOrders.push(order);
          }
        });
        setPending(pendingOrders);
        setCompleted(completedOrders);
        setRejected(rejectedOrders);
        setUnaccepted(unacceptedOrders);
        setPartialCompleted(partialCompleteOrders);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderCards = () => {
    
    if(activeTab === 'all') {
      return (
        <>
          {[...pending, ...unaccepted, ...completed, ...rejected, ...partialCompleted].map((order) => (
            <HistoryCard key={order.id} order={order} tab={order.orderState.toLowerCase()} />
          ))}
        </>
      );
    } else if(activeTab === 'pending') {
      return pending.map(order => <HistoryCard key={order.id} order={order} tab="pending" />);
    } else if(activeTab === 'unaccepted') {
      return unaccepted.map(order => <HistoryCard key={order.id} order={order} tab="unaccepted" />);
    } else if(activeTab === 'completed') {
      return completed.map(order => <HistoryCard key={order.id} order={order} tab="completed" />);
    } else if(activeTab === 'rejected') {
      return rejected.map(order => <HistoryCard key={order.id} order={order} tab="rejected" />);
    } else if(activeTab === 'partialcompleted') {
      return partialCompleted.map(order => <HistoryCard key={order.id} order={order} tab="partialcompleted" />);
    }
  };

  return (
    <>
      <NewCustomerNavbar />
      <div className="history-page">
        <h1>{t("History")}</h1>
        <div className="historycontainer">
          {!loading ? (
            <>
              <div className="history-tabs">
                <button 
                  className={`all ${activeTab === 'all' ? 'clicked' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <FaListAlt className="tab-icon" /> {t("All")}
                </button>
                <button 
                  className={`partialcompleted ${activeTab === 'partialcompleted' ? 'clicked' : ''}`}
                  onClick={() => setActiveTab('partialcompleted')}
                >
                  <FaHourglassHalf className="tab-icon" /> {t("Partial Completed")}
                </button>
                <button 
                  className={`pending ${activeTab === 'pending' ? 'clicked' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <FaRegClock className="tab-icon" /> {t("Pending")}
                </button>
                <button 
                  className={`unaccepted ${activeTab === 'unaccepted' ? 'clicked' : ''}`}
                  onClick={() => setActiveTab('unaccepted')}
                >
                  <FaExclamationTriangle className="tab-icon" /> {t("Unaccepted")}
                </button>
                <button 
                  className={`completed ${activeTab === 'completed' ? 'clicked' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  <FaCheck className="tab-icon" /> {t("Completed")}
                </button>
                <button 
                  className={`rejected ${activeTab === 'rejected' ? 'clicked' : ''}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  <FaTimes className="tab-icon" /> {t("Rejected")}
                </button>
              </div>
              {renderCards()}
            </>
          ) : (
            <>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default History;
