import logo from "../../assets/LandingPageImages/Company-Logo.png";
import cart from "../../assets/LandingPageImages/cart.png";
import user from "../../assets/LandingPageImages/user.png";
import location from "../../assets/LandingPageImages/location.png";
import search from "../../assets/LandingPageImages/search.png";

import { useNavigate, Link } from "react-router-dom";


const Navbar = () => {


        const navigate = useNavigate();

        const handleSignin = () => {
                navigate('/signin');
        }
        const handleSignup = () => {
                navigate('/signup');
        }

        const handleGoHome = () => {
                navigate('/');
        }



        const handleslideoptions = () => {
                const signupsignin = document.querySelector('.signupsignin');
                console.log("hello");
                if (signupsignin.classList.contains('hide')) {
                        signupsignin.classList.remove('hide');
                        signupsignin.classList.add('show');
                }
                else {
                        signupsignin.classList.remove('show');
                        signupsignin.classList.add('hide');
                }
        }
        return (
                <>
                        <div className="LandingPage-Navbar">
                                <img src={logo} alt="" className="logo" onClick={handleGoHome}/>
                                <div className="Search-boxes">
                                        <div className="containers">
                                                <img src={location} alt="" className="placeholdericon" />
                                                <input
                                                        type="text"
                                                        className="location"
                                                        placeholder="Enter your location"
                                                />
                                        </div>
                                        <div className="containers">
                                                <img src={search} alt="" className="placeholdericon" />
                                                <input
                                                        type="text"
                                                        className="services"
                                                        placeholder="Search for Services"
                                                />
                                        </div>
                                </div>
                                <div className="icons">
                                        <img src={cart} alt="" className="cart" />
                                        <img src={user} alt="" className="user" onClick={handleslideoptions} />
                                </div>
                        </div>

                        <div className="signupsignin hide">
                                <button className="signin" onClick={handleSignin}>Sign In</button>
                                <button className="signup" onClick={handleSignup}>Sign Up</button>
                        </div>
                </>

        );
};

export default Navbar;