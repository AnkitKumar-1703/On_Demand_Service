import "./UserDashboard.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Card from "../../Components/Card/Card";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import { useEffect } from "react";
import NewCustomerNavbar from '../../Components/NewNavbar/NewCustomerNavbar.jsx';
import bookmark from "../../assets/bookmark.png";
import bookmarked from "../../assets/bookmarked.png";

import { ToastContainer, toast } from 'react-toastify';

import { useLocation, useNavigate } from 'react-router-dom';

import axios from "axios";

import { useTranslation } from "react-i18next";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {t}=useTranslation();

  const [providerData, setProviderData] = useState([]);
  const [favoriteList, setfavoriteList] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  
  const [filters, setFilters] = useState({
    workType: [],
    rating: 0,
    distance: 1,
  });

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="provider-complete-card-holder">
      <div className="provider-card-container">
        <div className="card skeleton-card">
          <div className="image skeleton-image"></div>
          <div className="details">
            <div className="name-age">
              <span className="name skeleton-text"></span>
              <span className="age skeleton-text skeleton-small"></span>
            </div>
            <div className="distance skeleton-text skeleton-small"></div>
            <div className="type">
              <span className="skeleton-text"></span>
              <span className="skeleton-text skeleton-rating"></span>
            </div>
          </div>
          {/* <div className="call skeleton-button"></div> */}
        </div>
        <div className="select-worker skeleton-button"></div>
      </div>
    </div>
  );
  
  // Skeleton for right component
  const SkeletonRightComponent = () => (
    <div className="right">
      <div className="details skeleton-right-panel">
        <div className="skeleton-bookmark"></div>
        <div className="skeleton-image-large"></div>
        <p className="Name skeleton-text skeleton-name-large"></p>

        <div className="details-container">
          <div className="detail-type">
            <h1 className="skeleton-text skeleton-section-title"></h1>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text"></p>
            </div>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text"></p>
            </div>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text skeleton-long"></p>
            </div>
          </div>
          <div className="detail-type">
            <h1 className="skeleton-text skeleton-section-title"></h1>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text"></p>
            </div>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text"></p>
            </div>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text"></p>
            </div>
          </div>
          <div className="detail-type">
            <h1 className="skeleton-text skeleton-section-title"></h1>
            <div className="detail">
              <p className="detail-heading skeleton-text skeleton-label"></p>
              <p className="skeleton-text skeleton-long"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleServiceChange = (e) => {
    const service = e.target.id;
    setFilters((prev) => {
      const newWorkType = prev.workType.includes(service)
        ? prev.workType.filter((s) => s !== service)
        : [...prev.workType, service];
      return { ...prev, workType: newWorkType };
    });
  };

  const handleRatingChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      rating: parseInt(e.target.id, 10),
    }));
  };

  const handleDistanceChange = (event, value) => {
    setFilters((prev) => ({
      ...prev,
      distance: value == 15 ? 1000 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(filters);
    setLoading(true); // Set loading to true when applying filters
    const url = `${import.meta.env.VITE_APP_BACKEND}/customer/auth/filterprovider?workType=${filters.workType}&distance=${filters.distance}&rating=${filters.rating}`;
    console.log(url);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Authorization: `bearer ${localStorage.getItem("customerToken")}`,
      },
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        // console.log(JSON.stringify(response.data));
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          setProviderData(response.data.provider);
          // console.log(providerData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false regardless of result
      }
    }
    makeRequest();
  };
  const marks = [
    { value: 1, label: "1 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 15, label: ">10 km" },
  ];
  function valuetext(value) {
    return `${value}km`;
  }
  const [firsttimeclick, setfirsttimeclick] = useState(false);
  const [cardData, setCardData] = useState({});

  const handleCardClick = (data) => {
    setfirsttimeclick(true);
    setCardData(data);
    // console.log(data);
  };

  useEffect(() => {
    // console.log(localStorage.getItem("customerToken"));
    setLoading(true); // Set loading to true on initial data fetch

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/customer/auth/bulkprovider`,
      headers: {
        Authorization: `bearer ${localStorage.getItem("customerToken")}`,
      },
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        // console.log(JSON.stringify(response.data));
        if (response.data.error) {
          // Handle error
        } else {
          setProviderData(response.data.provider);
          if (location.state?.info) {
            toast.info(location.state.info, {
              autoClose: 5000
            });
            window.history.replaceState({}, document.title);
          }
          if (location.state?.success) {
            toast.success(location.state.success, {
              autoClose: 5000
            });
            window.history.replaceState({}, document.title);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    let userconfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_APP_BACKEND}/customer/auth/favoriteprovider`,
      headers: {
        Authorization: `bearer ${localStorage.getItem("customerToken")}`,
      },
    };
    async function makeRequestForUser() {
      try {
        const response = await axios.request(userconfig);
        // console.log(JSON.stringify(response.data));
        if (response.data.error) {
          // console.log(response.data.error);

          navigate('/signincustomer', {
            state: {
              error: response.data.error + " Please Login Again"
            }
          })
          // alert(response.data.error);
        } else {
          const fav_provider_id = response.data.favorite.map((provider) => provider.providerId);
          setfavoriteList(fav_provider_id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false after all requests are complete
      }
    }

    Promise.all([makeRequest(), makeRequestForUser()]);
  }, []);


  useEffect(() => {
    if (!providerData.length && firsttimeclick) {
      setfirsttimeclick(false);
    }
  }, [providerData, firsttimeclick]);

  return (
    <>
      <NewCustomerNavbar setProviderData={setProviderData} setLoading={setLoading} />
      <ToastContainer position="bottom-right" autoClose={5000} theme="light" />
      <div className="user-dashboard">
        <div className="left">
          <p>{t("Filters")}</p>
          <form onSubmit={handleSubmit}>
            {/* Services Filter */}
            <div className="filtertype">
              <h2>{t("Services")}</h2>
              {["Electrician", "Plumber", "Carpenter", "Mechanic"].map(
                (service) => (
                  <div className="option" key={service}>
                    <label htmlFor={service}>
                      {t(service.charAt(0).toUpperCase() + service.slice(1))}
                    </label>
                    <input
                      type="checkbox"
                      id={service}
                      onChange={handleServiceChange}
                      checked={filters.workType.includes(service)}
                    />
                  </div>
                )
              )}
            </div>

            {/* Rating Filter */}
            <div className="filtertype">
              <h2>{t("Rating (at least)")}</h2>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div className="option" key={rating}>
                  <label htmlFor={rating}>
                    <Rating
                      name="half-rating-read"
                      defaultValue={rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                  </label>
                  <input
                    type="radio"
                    name="rating"
                    id={rating.toString()}
                    onChange={handleRatingChange}
                    checked={filters.rating === rating}
                  />
                </div>
              ))}
            </div>

            {/* Radius Filter */}
            <div className="filtertype">
              <h2>{t("Radius")}</h2>
              <Slider
                aria-label="Restricted values"
                value={filters.distance}
                onChange={handleDistanceChange}
                step={null}
                valueLabelDisplay="auto"
                marks={marks.map(mark => ({ ...mark, label: t(mark.label) }))}
                min={0}
                max={15}
              />
            </div>

            <button type="submit">{t("Apply Filters")}</button>
          </form>
        </div>
        <div className="center">
          <div className="heading">{t("Results for Search")}</div>
          <div className="card-container">
            {loading ? (
              // Show skeleton cards while loading
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : providerData.length > 0 ? (
              providerData.map((provider, index) => (
                <Card
                  key={index}
                  providerId={provider.providerId}
                  name={provider.providerName}
                  age={provider.providerAge}
                  distance={provider.providerDistanceInKm}
                  workType={provider.providerWorkType}
                  rating={provider.providerRating}
                  phoneNo={provider.providerPhone}
                  status={provider.providerStatus}
                  image={provider.photoLink || (provider.providerGender === 'Male' ? "https://randomuser.me/api/portraits/men/9.jpg" : "https://randomuser.me/api/portraits/women/19.jpg")}
                  onClick={() => handleCardClick(provider)}
                />
              ))
            ) : (
              <p>{t("No providers found")}</p>
            )}
          </div>
        </div>
        <div className="right-panel">
          {loading ? (
            <SkeletonRightComponent />
          ) : (
            firsttimeclick && (
              <RightComponent
                name={cardData.providerName}
                address={cardData.providerAddress}
                email={cardData.providerEmail}
                workType={cardData.providerWorkType}
                rating={cardData.providerRating}
                phoneNo={cardData.providerPhone}
                feedback={cardData.providerFeedback}
                providerId={cardData.providerId}
                favList={favoriteList}
                setfavoriteList={setfavoriteList}
                image={cardData.photoLink || (cardData.providerGender === 'Male' ? "https://randomuser.me/api/portraits/men/9.jpg" : "https://randomuser.me/api/portraits/women/19.jpg")}
              />
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const RightComponent = ({
  name,
  address,
  email,
  workType,
  rating,
  phoneNo,
  feedback,
  providerId,
  favList,
  setfavoriteList,
  image
}) => {



  const handleBookmark = (id, list, name) => {
    let newList;
    if (list.includes(id)) {
      newList = list;
      toast.info("To remove provider from favorites, go to favorites page");
    }
    else {
      let data = JSON.stringify({
        "providerId": id
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_APP_BACKEND}/customer/auth/favoriteprovider`,
        headers: {
          'Authorization': 'bearer ' + localStorage.getItem('customerToken'),
          'Content-Type': 'application/json'
        },
        data: data
      };

      async function makeRequest() {
        try {
          const response = await axios.request(config);
          // console.log(JSON.stringify(response.data));
          if (response.data.error) {
            console.log("error while adding to favorites");

            toast.error(response.data.error);

            setfavoriteList(list);
          } else {
            newList = [...list, id];
            // console.log(newList);
            setfavoriteList(newList);
            toast.success(`${name} added to favorites`);
          }
        }
        catch (error) {
          newList = list;
          console.log("error", error);
        }
      }

      makeRequest();

    }
  }
  const { t } = useTranslation();

  return (
    <div className="right">
      <div className="details">
        <img
          src={favList.includes(providerId) ? bookmarked : bookmark}
          alt=""
          className="bookmark"
          onClick={() => { handleBookmark(providerId, favList, name) }}
        />
        <img src={image} alt="Profile Image" className="profileimage" />
        <p className="Name">{name}</p>

        <div className="details-container">
          <div className="detail-type">
            <h1>{t("Contact Information")}</h1>
            <div className="detail">
              <p className="detail-heading">{t("Email")} : </p>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
            <div className="detail">
              <p className="detail-heading">{t("Phone")} : </p>
              <a href={`tel:${phoneNo}`}>{phoneNo}</a>
            </div>

            <div className="detail">
              <p className="detail-heading">{t("Address")} : </p>
              <p>{address}</p>
            </div>
          </div>
          <div className="detail-type">
            <h1>{t("Professional Information")}</h1>
            <div className="detail">
              <p className="detail-heading">{t("Service")} : </p>
              <p>{workType}</p>
            </div>
            <div className="detail">
              <p className="detail-heading">{t("Experience")} : </p>
              <p>5 {t("years")}</p>
            </div>
            <div className="detail">
              <p className="detail-heading">{t("Rating")} : </p>
              <p>{rating} &#127775;</p>
            </div>
          </div>

          <div className="detail-type">
            <h1>{t("Reviews & Feedbacks")}</h1>

            {feedback.length > 0 ? (
              feedback.map((feedback, index) => (
                <Feedbacks
                  key={feedback.id || index}
                  feedback={feedback.feedback}
                  index={index}
                />
              ))
            ) : (
              <p>{t("No feedbacks available")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Feedbacks = ({ feedback, index }) => {
  return (
    <div className="detail">
      <p className="detail-heading">Review {index + 1} : </p>
      <p>{feedback}</p>
    </div>
  );
};

export default UserDashboard;
