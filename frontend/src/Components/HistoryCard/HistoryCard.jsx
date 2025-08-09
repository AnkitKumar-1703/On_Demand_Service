import React, { useState } from "react";
import "./HistoryCard.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import ChatBox from "../Chatbox/Chatbox";

import { useTranslation } from "react-i18next";



const HistoryCard = ({
  order,
  tab,
  setUnaccepted,
  setpartialCompleted,
  setPending,
  setCompleted,
  setRejected,
}) => {

  const {t}=useTranslation();

  const [showFeedback, setShowFeedback] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRevoke = () => {
    const data = JSON.stringify({ orderId: order.orderId });
    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/customer/auth/deleteOrder",
      headers: {
        Authorization: "bearer " + localStorage.getItem("customerToken"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success("Order Revoked Successfully");
          if (tab === "unaccepted") {
            setUnaccepted((prev) =>
              prev.filter((item) => item.orderId !== order.orderId)
            );
            setRejected((prev) => [order, ...prev]);
          } else if (tab === "pending") {
            setPending((prev) =>
              prev.filter((item) => item.orderId !== order.orderId)
            );
            setRejected((prev) => [order, ...prev]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    makeRequest();
  };

  return (
    <div className ="history-card-container">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className={`historycard ${tab}`}>
        {!showFeedback && (
          <div className="history-details">
            <div className="order-details">
              <div className="detail">
                <FaCalendarAlt className="detail-icon" />
                <p><b>{t("Task ID")}:</b> {order.orderId}</p>
              </div>
              <div className="detail">
                <FaCalendarAlt className="detail-icon" />
                <p><b>{t("Date")}:</b> {formatDate(order.orderDate)}</p>
              </div>
            </div>

            <h3>{t("Task Details")}</h3>
            <div className="task-detail">
              <div className="detail">
                <b>{t("Title")}:</b>
                <p>{order.orderTitle}</p>
              </div>
              <div className="detail">
                <b>{t("Description")}:</b>
                <p className="description">{order.orderDescription}</p>
              </div>
            </div>

            <h3>{t("Worker Details")}</h3>
            <div className="worker-details">
              <div className="detail">
                <FaUser className="detail-icon" />
                <p><b>{t("Name")}:</b> {order.providerName}</p>
              </div>
              <div className="detail">
                <FaPhone className="detail-icon" />
                <p><b>{t("Phone")}:</b> {order.providerPhone}</p>
              </div>
              <div className="detail">
                <FaEnvelope className="detail-icon" />
                <p><b>{t("Email")}:</b> {order.providerEmail}</p>
              </div>
              <div className="detail">
                <b>{t("Work Type")}:</b>
                <p>{order.providerWorkType}</p>
              </div>
            </div>

            <h3>{t("Reviews")}</h3>
            <div className="detail">
              <p>
                <b>{t("Rating")}:</b> {order.orderRating} <FaStar className="star-icon" />
              </p>
            </div>
            <div className="detail">
              <b>{t("Feedback")}:</b>
              <p>{order.orderFeedback}</p>
            </div>
          </div>
        )}

        <div className="history-buttons">
          {["unaccepted", "pending"].includes(tab) && !showFeedback && (
            <button onClick={handleRevoke} className="Revoke">
              <FaTimesCircle className="btn-icon" /> {t("Revoke Request")}
            </button>
          )}
          {["partialcompleted", "pending"].includes(tab) && !showFeedback && (
            <button
              className="Complete"
              onClick={() => setShowFeedback(!showFeedback)}
            >
              <FaCheckCircle className="btn-icon" /> {t("Complete")}
            </button>
          )}
          {["pending", "partialcompleted"].includes(tab) && !showFeedback && (
            <button
            
              className={showChat ? "Close" : "Chat"}
              
              onClick={() =>
                setShowChat(!showChat)
              }
            ><IoIosChatbubbles className="btn-icon" />{showChat == true ? t("Close Chat"):t("Chat With Worker")}</button>
          )}
        </div>

        {showFeedback && (
          <Feedback
            setShowFeedback={setShowFeedback}
            setCompleted={setCompleted}
            setpartialCompleted={setpartialCompleted}
            setPending={setPending}
            tab={tab}
            order={order}
          />
        )}
      </div>
      {showChat && ['pending','partialcompleted'].includes(tab) &&  (
        <Chatwindow
          taskId={order.orderId}
        />
      )}
    </div>
  );
};

export default HistoryCard;

const Feedback = ({
  setShowFeedback,
  setpartialCompleted,
  setPending,
  setCompleted,
  tab,
  order,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const ratingInput = document.querySelector('input[name="rating"]:checked');
      if (!ratingInput) throw new Error("No rating provided");
      const rating = ratingInput.value;
      const feedback =
        document.querySelector('textarea[name="comment"]').value ||
        "No feedback provided";
      let data = JSON.stringify({
        orderId: order.orderId,
        rating: rating,
        feedback: feedback,
      });
      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: "http://localhost:5000/customer/auth/markCompletedOrder",
        headers: {
          Authorization: "bearer " + localStorage.getItem("customerToken"),
          "Content-Type": "application/json",
        },
        data: data,
      };

      let feedback_config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/predict",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }


      async function makeRequest() {
        try {
          const feedback_response = await axios.request(feedback_config);
          const requestData = JSON.parse(config.data);
          requestData.rating = feedback_response.data.score;
          config.data = JSON.stringify(requestData);
          const response = await axios.request(config);
          if (response.data.error) {
            toast.error(response.data.error);
          } else {
            order.orderRating = rating;
            order.orderFeedback = feedback;
            if (tab === "pending") {
              setPending((prev) =>
                prev.filter((item) => item.orderId !== order.orderId)
              );
              setCompleted((prev) => [order, ...prev]);
            } else if (tab === "partialcompleted") {
              setpartialCompleted((prev) =>
                prev.filter((item) => item.orderId !== order.orderId)
              );
              setCompleted((prev) => [order, ...prev]);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      makeRequest();
      setShowFeedback(false);
    } catch (error) {
      toast.info("Please provide a rating");
    }
  };

  const { t } = useTranslation();

  return (
    <div className="feedback-container">
      <form>
        <p>{t("Please rate our service out of 5")}</p>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => (
            <label key={index}>
              <input type="radio" name="rating" value={5 - index} />
              <span className="star">&#9733;</span>
            </label>
          ))}
        </div>
        <p>{t("Please give a Feedback below")}</p>
        <textarea name="comment" placeholder={t("Give your feedback")}></textarea>
        <button type="submit" onClick={handleSubmit}>
          {t("Send Feedback")}
        </button>
      </form>
    </div>
  );
};


const Chatwindow = ({ taskId }) => {
  const {t}=useTranslation();
  return (
    <div className="chat-window">
      <h2>{t("Chat with worker")}</h2>
      <ChatBox taskId={taskId}/>
    </div>
  );
}