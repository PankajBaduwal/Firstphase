
import React from 'react';
import './Footer.css';


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand */}
                <div className="footer-brand">
                    <h3>AI Hire</h3>
                    <p>
                        Smart hiring powered by AI.
                        Connecting talent with opportunity.
                    </p>
                </div>

                {/* Links */}
                <div className="footer-links">
                    <h4>Platform</h4>
                    <a href="/jobs">Jobs</a>
                    <a href="/candidate/dashboard">Candidate</a>
                    <a href="/recruiter/dashboard">Recruiter</a>
                </div>

                <div className="footer-links">
                    <h4>Company</h4>
                    <a href="#">About</a>
                    <a href="#">Careers</a>
                    <a href="#">Contact</a>
                </div>

                <div className="footer-links">
                    <h4>Legal</h4>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} AI Hire. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
