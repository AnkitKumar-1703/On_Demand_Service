import "./WorkerDashboard.css";

import NewNavbar from "../../Components/NewNavbar/NewTradesmanNavbar.jsx";
import Footer from "../../Components/Footer/Footer";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import available from "../../assets/available.png";
import unavailable from "../../assets/unavailable.png";
import {Link} from "react-router-dom";
import { useTranslation } from "react-i18next";
import chat_icon from "../../assets/chat_icon.png";

const WorkerDashboard = () => {
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState({});
  const [seeDetail, setSeeDetail] = useState({});
  const [ClickedButton, setClickedButton] = useState({
    profile: true,
    acceptedTask: false,
    availableTask: false,
    completedTask: false,
    feedback: false,
  });

  const [tasks, setTasks] = useState();
  const [value, setValue] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChatClickButton = (task) => {
    console.log("Chat button clicked for task:", task);
    navigate("/provider/dashboard/ChatWithCustomer", {
      state: {
        taskId: task.id
      }
    });
  };

  const handleSeeDetail = (taskId) => {
    setSeeDetail((prevState) => {
      return {
        [taskId]: !prevState[taskId] || false,
      };
    });
  };

  const calculateAge = (date) => {
    const birthDate = new Date(date);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleClickedButton = async (buttonName) => {
    setClickedButton((prevState) => ({
      ...prevState,
      profile: false,
      acceptedTask: false,
      availableTask: false,
      completedTask: false,
      [buttonName]: true,
    }));
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/${buttonName}`,
      headers: {
        Authorization: `bearer ${localStorage.getItem("providerToken")}`,
      },
    };
    try {
      let result = await axios.request(config);
      setTasks(result.data);
      // console.log(result.data["acceptedTask"]);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const maskAadharNumber = (aadhar) => {
    if (!aadhar) return "";

    // Remove any spaces or dashes if present
    const cleanAadhar = aadhar.replace(/[\s-]/g, "");

    // Make sure we have a valid length
    if (cleanAadhar.length < 4) return aadhar;

    // Return masked number (XXXX XXXX XXXX format where only last 4 digits are visible)
    const lastFour = cleanAadhar.slice(-4);
    return `XXXX XXXX ${lastFour}`;
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/profile`,
      headers: {
        Authorization: `bearer ${localStorage.getItem("providerToken")}`,
      },
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        // console.log(JSON.stringify(response.data));
        if (response.data.error) {
          navigate("/signintradesman", {
            state: {
              error: response.data.error + " Please Login Again",
            },
          });
        } else {
          // toast.success("Profile Data Fetched Successfully");
          setProfileData(response.data);
          if (location.state?.info) {
            toast.info(location.state.info, {
              autoClose: 5000,
            });
            window.history.replaceState({}, document.title);
          }
          if (location.state?.success) {
            toast.success(location.state.success, {
              autoClose: 5000,
            });
            window.history.replaceState({}, document.title);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest();
  }, []);

  return (
    <>
      <NewNavbar />
      <ToastContainer position="bottom-right" />
      <div className="WorkerDashboard">
        <div className="left-panel">
          <div className="profile">
            <img
              src="https://randomuser.me/api/portraits/men/43.jpg"
              alt="profile not visible"
            />
            <h3>
              {profileData.firstName} {profileData.lastName}
            </h3>
            <p>{t("Tradesman")}</p>
          </div>
          <div className="options">
            <p
              onClick={() => {
                handleClickedButton("profile");
              }}
            >
              {t("Profile")}
            </p>
            <p
              onClick={() => {
                handleClickedButton("availableTask");
              }}
            >
              {t("Available Task")}
            </p>
            <p
              onClick={() => {
                handleClickedButton("acceptedTask");
              }}
            >
              {t("Accepted Task")}
            </p>
            <p
              onClick={() => {
                handleClickedButton("completedTask");
              }}
            >
              {t("Completed Task")}
            </p>
          </div>
        </div>
        <div className="right-panel">
          {ClickedButton["profile"] && (
            <div className="profile">
              <div className="status-container">
                <h2>
                  {t("Hi")} {profileData.firstName} !
                </h2>
                <select
                  className="status"
                  value={profileData.available ? "available" : "unavailable"}
                  onChange={(e) => {
                    const newStatus = e.target.value === "available";

                    setProfileData({ ...profileData, available: newStatus });

                    let data = JSON.stringify({
                      available: newStatus,
                    });

                    let config = {
                      method: "patch",
                      maxBodyLength: Infinity,
                      url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/updateStatus`,
                      headers: {
                        Authorization: `bearer ${localStorage.getItem(
                          "providerToken"
                        )}`,
                        "Content-Type": "application/json",
                      },
                      data: data,
                    };

                    axios
                      .request(config)
                      .then((response) => {
                        toast.success(
                          t("Status updated to") +
                            " " +
                            (newStatus ? t("Available") : t("Unavailable"))
                        );
                        console.log(response.data);
                      })
                      .catch((error) => {
                        console.error(error);
                        setProfileData({
                          ...profileData,
                          available: !newStatus,
                        });
                        toast.error(t("Failed to update status"));
                      });
                  }}
                >
                  <option value="available" className="available">
                    {t("Available")}
                  </option>
                  <option value="unavailable" className="unavailable">
                    {t("Unavailable")}
                  </option>
                </select>
              </div>
              <h3>{t("Welcome to your profile section")}</h3>
              <div className="worker-detail">
                <b>{t("Full Name")}</b>
                <p>
                  {profileData.firstName} {profileData.lastName}
                </p>
              </div>
              <div className="worker-detail">
                <b>{t("Email")}</b>
                <p>{profileData.email}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Phone Number")}</b>
                <p>{profileData.phoneNumber}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Address")}</b>
                <p>
                  {profileData.address
                    ? `${profileData.address.houseNumber}, ${profileData.address.streetName}, ${profileData.address.state}, ${profileData.address.country}, ${profileData.address.pincode}`
                    : t("Address loading...")}
                </p>
              </div>
              <div className="worker-detail">
                <b>{t("Date of Birth")}</b>
                <p>{profileData.dob ? formatDate(profileData.dob) : ""}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Age")}</b>
                <p>{calculateAge(profileData.dob)}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Aadhar Card Number")}</b>
                <p>{maskAadharNumber(profileData.aadharNumber)}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Experience")}</b>
                <p>5 {t("years")}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Skills")}</b>
                <p>{profileData.workType}</p>
              </div>
              <div className="worker-detail">
                <b>{t("Rating")}</b>
                <p>{profileData.rating?.toFixed(2)} &#127775;</p>
              </div>
            </div>
          )}
          {ClickedButton["acceptedTask"] && (
            <div className="accepted-task">
              <h2>{t("Accepted Task")}</h2>
              {tasks?.acceptedTask?.map((task) => {
                return (
                  <div className="Task-Card" key={task.id}>
                  <div className="task-details">
                    <h3>
                    {task?.askedBy?.firstName} {task?.askedBy?.lastName}
                    </h3>
                    <p>
                    {task?.askedBy?.address?.houseNumber}{" "}
                    {task?.askedBy?.address?.streetName}{" "}
                    {task?.askedBy?.address?.state}{" "}
                    {task?.askedBy?.address?.country}
                    </p>
                    <p>{task?.taskName}</p>
                    <p>{formatDate(task?.updatedAt)}</p>
                    <button
                    onClick={() => {
                      setValue(task.id);
                      handleSeeDetail(task.id);
                    }}
                    >
                    {seeDetail[value] && value === task.id
                      ? t("Close Detail")
                      : t("See Detail")}
                    </button>

                    <button
                    onClick={() => {
                      let data = JSON.stringify({
                      orderId: task.id,
                      });

                      let config = {
                      method: "patch",
                      maxBodyLength: Infinity,
                      url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/completeOrder`,
                      headers: {
                        Authorization:
                        "bearer " +
                        localStorage.getItem("providerToken"),
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
                        toast.success(
                          t("Task") +
                          " " +
                          task.taskName +
                          " " +
                          t("Completed Successfully")
                        );
                        setTasks((prevTasks) => ({
                          ...prevTasks,
                          acceptedTask: prevTasks.acceptedTask.filter(
                          (t) => t.id !== task.id
                          ),
                        }));
                        }
                      } catch (error) {
                        console.log(error);
                      }
                      }

                      makeRequest();
                    }}
                    >
                    {t("Complete")}
                    </button>
                    <div id="WorkerChatButton">
                      <img 
                      src={chat_icon} 
                      alt="chat" 
                      onClick={() => handleChatClickButton(task)} 
                      />
                    </div>
                  </div>
                  {seeDetail[value] && value === task.id && (
                    <div className="Task-description">
                    {task?.description}
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          )}

          {ClickedButton["availableTask"] && (
            <div className="available-task">
              <h2>{t("Available Task")}</h2>
              {tasks?.availableTask?.map((task) => {
                return (
                  <div className="Task-Card" key={task.id}>
                    <div className="task-details">
                      <h3>
                        {task?.askedBy?.firstName} {task?.askedBy?.lastName}
                      </h3>
                      <p>
                        {task?.askedBy?.address?.houseNumber}{" "}
                        {task?.askedBy?.address?.streetName}{" "}
                        {task?.askedBy?.address?.state}{" "}
                        {task?.askedBy?.address?.country}
                      </p>
                      <p>{task?.taskName}</p>
                      <p>{formatDate(task?.updatedAt)}</p>
                      <button
                        onClick={() => {
                          setValue(task.id);
                          handleSeeDetail(task.id);
                        }}
                      >
                        {seeDetail[value] && value === task.id
                          ? t("Close Detail")
                          : t("See Detail")}
                      </button>
                      <button
                        onClick={() => {
                          let data = JSON.stringify({
                            orderId: task.id,
                          });

                          let config = {
                            method: "patch",
                            maxBodyLength: Infinity,
                            url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/acceptOrder`,
                            headers: {
                              Authorization:
                                "bearer " +
                                localStorage.getItem("providerToken"),
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
                                toast.success(
                                  t("Task") +
                                    " " +
                                    task.taskName +
                                    " " +
                                    t("Accepted Successfully")
                                );
                                setTasks((prevTasks) => ({
                                  ...prevTasks,
                                  availableTask: prevTasks.availableTask.filter(
                                    (t) => t.id !== task.id
                                  ),
                                }));
                              }
                            } catch (error) {
                              console.log(error);
                            }
                          }

                          makeRequest();
                        }}
                      >
                        {t("Accept")}
                      </button>

                      <button
                        onClick={() => {
                          let data = JSON.stringify({
                            orderId: task.id,
                          });

                          let config = {
                            method: "patch",
                            maxBodyLength: Infinity,
                            url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/rejectOrder`,
                            headers: {
                              Authorization:
                                "bearer " +
                                localStorage.getItem("providerToken"),
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
                                toast.success(
                                  t("Task") +
                                    " " +
                                    task.taskName +
                                    " " +
                                    t("Rejected Successfully")
                                );
                                setTasks((prevTasks) => ({
                                  ...prevTasks,
                                  availableTask: prevTasks.availableTask.filter(
                                    (t) => t.id !== task.id
                                  ),
                                }));
                              }
                            } catch (error) {
                              console.log(error);
                            }
                          }

                          makeRequest();
                        }}
                      >
                        {t("Reject")}
                      </button>
                    </div>
                    {seeDetail[value] && value === task?.id && (
                      <div className="Task-description">
                        {task?.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {ClickedButton["completedTask"] && (
            <div className="completed-task">
              <h2>{t("Completed Task")}</h2>
              {tasks?.completedTask?.map((task) => {
                return (
                  <div className="Task-Card" key={task.id}>
                    <div className="task-details">
                      <h3>
                        {task?.askedBy?.firstName} {task?.askedBy?.lastName}
                      </h3>
                      <p>
                        {task?.askedBy?.address?.houseNumber}{" "}
                        {task?.askedBy?.address?.streetName}{" "}
                        {task?.askedBy?.address?.state}{" "}
                        {task?.askedBy?.address?.country}
                      </p>
                      <p>{task?.taskName}</p>
                      <p>{formatDate(task?.updatedAt)}</p>
                      {!task.completed && (
                        <button
                          onClick={() => {
                            let data = JSON.stringify({
                              orderId: task.id,
                            });

                            let config = {
                              method: "patch",
                              maxBodyLength: Infinity,
                              url: `${import.meta.env.VITE_APP_BACKEND}/provider/auth/redoOrder`,
                              headers: {
                                Authorization:
                                  "bearer " +
                                  localStorage.getItem("providerToken"),
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
                                  toast.success(
                                    t("Task") +
                                      " " +
                                      task.taskName +
                                      " " +
                                      t("ReDo Successfully")
                                  );
                                  setTasks((prevTasks) => ({
                                    ...prevTasks,
                                    completedTask:
                                      prevTasks.completedTask.filter(
                                        (t) => t.id !== task.id
                                      ),
                                  }));
                                }
                              } catch (error) {
                                console.log(error);
                              }
                            }

                            makeRequest();
                          }}
                        >
                          {t("ReDo")}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setValue(task?.id);
                          handleSeeDetail(task?.id);
                        }}
                      >
                        {seeDetail[value] && value === task?.id
                          ? t("Close Detail")
                          : t("See Detail")}
                      </button>
                    </div>
                    {seeDetail[value] && value === task?.id && (
                      <div className="Task-description">
                        {task?.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default WorkerDashboard;
