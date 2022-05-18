import React from "react";

const Footer = () => {
    return (
        <footer>
            <nav>
                <ul>
                    <li>
                        <a href="https://www.github.com/tboyer32">
                            <img src="/images/github.png" />github.com/tboyer32
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/tiffany-boyer">
                            <img src="/images/linkedin.png" />linkedin.com/in/tiffany-boyer
                        </a>
                    </li>
                </ul>
            </nav>
            <aside>
            <p>
                The first river you paddle runs through the rest of your life. 
                It bubbles up in pools and eddies to remind you who you are.<br />
                <span className="author">~Lynn Culbreath Noel</span>
            </p>
            <p className="hb">Made at Hackbright. Katherine cohort 2022</p>
            </aside>
        </footer>
    )
};

export default Footer;
