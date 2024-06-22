import './Footer.css';
import { SiRedux, SiPostgresql, SiExpress, SiSequelize } from "react-icons/si";
import { FaAws } from "react-icons/fa";

function Footer() {
    return (
        <div className="footer">
            <hr />
            <div className='footerSection'>
                <span className='name'><span style={{ gap: "0px" }}>&#169;<a href="https://carmenshiu.com" target="_blank" rel="noopener noreferrer">Carmen Shiu</a></span><a href="mailto:hi@carmenshiu.com" target="_blank" rel="noopener noreferrer"><i className='fa-solid fa-envelope' /></a>
                    <a href="https://linkedin.com/in/carmenshiu" target="_blank" rel="noopener noreferrer"><i className='fa-brands fa-linkedin-in' /></a></span>
                <span className='links'>
                    [ <a href="https://github.com/craftycarmen/plantera" target="_blank" rel="noopener noreferrer">GitHub Repo</a> &#8226; <a href="https://github.com/craftycarmen/plantera/wiki" target="_blank" rel="noopener noreferrer">Wiki</a> ]</span>
                <span className='logos'>
                    [ <a href='https://expressjs.com/' target="_blank" rel="noopener noreferrer">
                        <SiExpress />
                    </a>
                    <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript' target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-js fa-lg" />
                    </a>
                    <a href='https://www.postgresql.org/docs/' target="_blank" rel="noopener noreferrer">
                        <SiPostgresql />
                    </a>
                    <a href='https://sequelize.org/' target="_blank" rel="noopener noreferrer">
                        <SiSequelize />
                    </a>
                    <a href='https://react.dev/' target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-react fa-lg" />
                    </a>
                    <a href='https://redux.js.org/' target="_blank" rel="noopener noreferrer">
                        <SiRedux />
                    </a>
                    <a href='https://www.w3.org/Style/CSS/Overview.en.html' target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-html5 fa-lg" />
                    </a>
                    <a href='https://www.w3.org/Style/CSS/Overview.en.html' target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-css3-alt fa-lg" />
                    </a>
                    <a href='https://aws.amazon.com/' target="_blank" rel="noopener noreferrer">
                        <FaAws />
                    </a> ]
                </span>
            </div>
        </div>
    )
}

export default Footer
