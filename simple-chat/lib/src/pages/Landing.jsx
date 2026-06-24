import "../styles/Landing.css";
import {
  FaBell,
  FaBookOpen,
  FaCircleQuestion,
  FaHeadset,
  FaImage,
  FaRegComments,
} from "react-icons/fa6";
import girl from "../assets/girl.png";
import boy from "../assets/boy.png";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const Navigate = useNavigate();
  return (
    <div className="page">
      <nav className="nav">
        <div className="logo">
          <label></label>
          CONVOS
        </div>

        <div className="menu">
          <a href="#features">Features</a>

          <a href="#help-center">Help Center</a>
        </div>
      </nav>

      <section className="home">
        <div className="text">
          <h1>
            Stay Connected with <label>Messenger</label>
          </h1>

          <p>
            Secure messaging built for everyday conversations. Fast, simple, and
            always available.
          </p>

          <button onClick={() => Navigate("/Login")}>Start Chatting</button>
        </div>

        <div className="preview">
          <div className="person left">
            <img src={girl} alt="girl" />
            <div className="msg one">Still online?</div>
            <div className="msg two">Yes, I'm here</div>
          </div>

          <div className="person right">
            <img src={boy} alt="boy" />
            <div className="msg three">Call me later</div>
            <div className="msg four">Sure 👍</div>
          </div>
        </div>
      </section>

      <section
        className="features"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="features-heading">
          <span className="features-mark" aria-hidden="true">
            ✦
          </span>
          <h2 id="features-title">Everything You Need to Stay Connected</h2>
          <p>
            Made for conversations that feel effortless, wherever your day takes
            you.
          </p>
        </div>

        <div className="feature-list">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <div className="feature-icon">
              <FaRegComments />
            </div>
            <h3>Real-time messaging</h3>
            <p>
              Send messages instantly and keep every conversation flowing
              naturally.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-number">02</span>
            <div className="feature-icon">
              <FaImage />
            </div>
            <h3>Easy media sharing</h3>
            <p>
              Share photos and memorable moments with the people who matter
              most.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-number">03</span>
            <div className="feature-icon">
              <FaBell />
            </div>
            <h3>Smart notifications</h3>
            <p>Stay in the loop with timely updates that keep you connected.</p>
          </article>
        </div>
      </section>

      <section
        className="help-center"
        id="help-center"
        aria-labelledby="help-center-title"
      >
        <div className="help-center-intro">
          <span className="help-center-kicker">HELP CENTER</span>
          <h2 id="help-center-title">How can we help?</h2>
          <p>
            Find clear answers and practical guidance for getting the most from
            Convos.
          </p>
        </div>

        <div className="help-center-list">
          <article className="help-center-card">
            <FaBookOpen className="help-center-icon" aria-hidden="true" />
            <h3>Getting started</h3>
            <p>
              Set up your profile, start a chat, and learn the essentials in
              minutes.
            </p>
          </article>

          <article className="help-center-card">
            <FaCircleQuestion className="help-center-icon" aria-hidden="true" />
            <h3>Common questions</h3>
            <p>
              Find quick answers about accounts, messages, media, and
              notifications.
            </p>
          </article>

          <article className="help-center-card">
            <FaHeadset className="help-center-icon" aria-hidden="true" />
            <h3>Contact support</h3>
            <p>
              Need more help? Our support team is ready to point you in the
              right direction.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Landing;
