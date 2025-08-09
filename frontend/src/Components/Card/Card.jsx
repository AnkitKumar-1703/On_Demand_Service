import { IoIosCall } from "react-icons/io";
import "./Card.css";
import * as React from "react";
import Rating from "@mui/material/Rating";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import available from '../../assets/available.png';
import unavailable from '../../assets/unavailable.png';

import { useTranslation } from "react-i18next";

const Card = ({ providerId,name, age, distance, workType, rating, phoneNo, status, onClick,image }) => {

    const {t}=useTranslation();


    const [open,setOpen]=React.useState(false)
    const cardClass = distance ? "card" : "card card--no-distance";
    // console.log(image);
    
    return (
        <>
            <div className="provider-complete-card-holder">
                <img src= {(status) ? available : unavailable} alt="" className="providerStatus" />
                <div className="provider-card-container">
                    <div className={cardClass} onClick={onClick}>
                        <div className="image">
                            <img src={image} alt={name} loading="lazy" />
                        </div>
                        <div className="details">
                            <div className="name-age">
                                <span className="name">{t(name)}</span>
                                <span className="age">{age} {t("yrs")}</span>
                            </div>
                            {distance && <div className="distance">{distance} {t("km away")}</div>}
                            <div className="type">
                                {t(workType)}
                                <Rating name="half-rating-read" value={rating} precision={0.1} readOnly size="small" />
                            </div>
                        </div>
                        {/* <div className="call">
                            <IoIosCall />
                            <span>+91-{phoneNo}</span>
                        </div> */}
                    </div>
                    <button className="select-worker" onClick={()=>{setOpen(!open)}}>{t("Request Service")}</button>
                </div>
                {open && <Input setOpen={setOpen} providerId={providerId} name={name}/>}
            </div>
        </>
    );
};

const Input = ({setOpen,providerId,name}) => {

    const {t}=useTranslation();

    const [title,setTitle]=React.useState();
    const [desc,setDesc]=React.useState();
    const handleSubmit=(e)=>{
        e.preventDefault(); 
        // console.log(title,desc,providerId);
        let data = JSON.stringify({
            "name": title,
            "description": desc,
            "providerId": providerId
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/customer/auth/createOrder',
            headers: { 
                Authorization: `bearer ${localStorage.getItem("customerToken")}`, 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          async function makeRequest() {
            try {
              const response = await axios.request(config);
            //   console.log((response.data));
            if(response.data.error){
              toast.error(response.data.error);
            }else{
                toast.success("Order placed to "+name);
            }
            }
            catch (error) {
              console.log(error);
            }
            finally {
              setOpen((c)=>!c);
            }
          }
          makeRequest();
        
    }
    return (
        <div className="descriptionComponent">
            <div className="description-container">
                <h3>{t("Enter Description of Task")}</h3>
                <form onSubmit={handleSubmit} className="description-form" >
                    <input
                        type="text"
                        placeholder={t("Enter the title")}
                        value={title || ""}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder={t("Enter Description")}
                        value={desc || ""}
                        onChange={(e) => setDesc(e.target.value)}
                        cols="30"
                        rows="10"
                        required
                    ></textarea>
                    <button type="submit">{t("Submit")}</button>
                </form>
                <button className="close-button" onClick={() => setOpen(false)}>
                    {t("Close")}
                </button>
            </div>
        </div>
    )
}

export default Card;
