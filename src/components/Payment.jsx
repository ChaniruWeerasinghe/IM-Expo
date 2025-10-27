import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
import "../pages/card.css";


const useQuery = () => new URLSearchParams(useLocation().search);

const Payment = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const seller = query.get("seller");
  const plan = query.get("plan") || "Starter";
  const creditsParam = query.get("credits");
  const credits = creditsParam ? Number(creditsParam) : plan === "Pro" ? 10 : plan === "Starter" ? 5 : 1;

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [currentCardBackground] = useState(Math.floor(Math.random() * 25 + 1));
  const minCardYear = new Date().getFullYear();

  const refs = {
    cardNumber: useRef(null),
    cardName: useRef(null),
    cardDate: useRef(null),
  };

  useEffect(() => {
    if (refs.cardNumber.current) refs.cardNumber.current.focus();
  }, []);

  const isCardValid = () => {
    if (!cardName || !cardNumber || !cardMonth || !cardYear || !cardCvv) return false;
    if (cardNumber.replace(/\s+/g, "").length < 12) return false;
    if (cardCvv.length < 3) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCardValid()) {
      alert("Please fill out valid card details (dummy validation).");
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 1000));

      const now = new Date();
      const planEnd = new Date();
      planEnd.setMonth(planEnd.getMonth() + 1);

      const payload = {
        plan: plan,
        credits: credits,
        maxCredits: credits,
        planStart: now.toISOString(),
        planEnd: planEnd.toISOString(),
        status: "active",
        updatedAt: now.toISOString(),
      };

      if (!seller) {
        alert("Seller ID not found — please sign in again.");
        navigate("/login");
        return;
      }

      await set(ref(db, `subscriptions/sellers/${seller}`), payload);
      alert("Payment successful! Subscription activated ✅");
      navigate(`/seller/${seller}`);
    } catch (err) {
      console.error("Payment/DB error:", err);
      alert("Payment failed (simulated). Try again.");
    }
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="wrapper" style={{ padding: 40 }}>
      <div className="card-form" id="app">
        {/* Credit Card Visual */}
        <div className="card-list">
          <div className={`card-item ${isCardFlipped ? "-active" : ""}`}>
            {/* Front */}
            <div className="card-item__side -front">
              <div className="card-item__cover">
                <img
                  src={`/assets/images/${currentCardBackground}.jpeg`}
                  alt="bg"
                  className="card-item__bg"
                />
              </div>
              <div className="card-item__wrapper">
                <div className="card-item__top">
                  <img
                    src="/assets/images/chip.png"
                    alt="chip"
                    className="card-item__chip"
                  />
                  <div className="card-item__type">
                    <img
                      src="/assets/images/visa.png"
                      alt="card-type"
                      className="card-item__typeImg"
                    />
                  </div>
                </div>
                <label className="card-item__number" ref={refs.cardNumber}>
                  {cardNumber ? (
                    cardNumber.split("").map((ch, i) => (
                      <div key={i} className="card-item__numberItem">
                        {ch}
                      </div>
                    ))
                  ) : (
                    <span className="card-item__numberItem">#### #### #### ####</span>
                  )}
                </label>

                <div className="card-item__content">
                  <label className="card-item__info" ref={refs.cardName}>
                    <div className="card-item__holder">Card Holder</div>
                    <div className="card-item__name">
                      {cardName ? cardName.toUpperCase() : "FULL NAME"}
                    </div>
                  </label>
                  <div className="card-item__date" ref={refs.cardDate}>
                    <label className="card-item__dateTitle">Expires</label>
                    <label className="card-item__dateItem">
                      <span>{cardMonth || "MM"}</span>
                    </label>
                    /
                    <label className="card-item__dateItem">
                      <span>{cardYear ? String(cardYear).slice(2, 4) : "YY"}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="card-item__side -back">
              <div className="card-item__cover">
                <img
                  src={`/assets/images/${currentCardBackground}.jpeg`}
                  alt="bg"
                  className="card-item__bg"
                />
              </div>
              <div className="card-item__band" />
              <div className="card-item__cvv">
                <div className="card-item__cvvTitle">CVV</div>
                <div className="card-item__cvvBand">
                  {cardCvv ? "*".repeat(cardCvv.length) : "###"}
                </div>
                <div className="card-item__type">
                  <img
                    src="/assets/images/visa.png"
                    alt="type"
                    className="card-item__typeImg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form className="card-form__inner" onSubmit={handleSubmit}>
          <div className="card-input">
            <label htmlFor="cardNumber" className="card-input__label">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="card-input__input"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onFocus={() => setIsCardFlipped(false)}
              placeholder="1234 5678 9012 3456"
              autoComplete="off"
            />
          </div>

          <div className="card-input">
            <label htmlFor="cardName" className="card-input__label">
              Card Holder
            </label>
            <input
              type="text"
              id="cardName"
              className="card-input__input"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={() => setIsCardFlipped(false)}
              placeholder="Full Name"
              autoComplete="off"
            />
          </div>

          <div className="card-form__row">
            <div className="card-form__col">
              <div className="card-form__group">
                <label htmlFor="cardMonth" className="card-input__label">
                  Expiration Date
                </label>
                <select
                  id="cardMonth"
                  className="card-input__input -select"
                  value={cardMonth}
                  onChange={(e) => setCardMonth(e.target.value)}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const n = i + 1;
                    return (
                      <option key={n} value={n < 10 ? `0${n}` : String(n)}>
                        {n < 10 ? `0${n}` : n}
                      </option>
                    );
                  })}
                </select>
                <select
                  id="cardYear"
                  className="card-input__input -select"
                  value={cardYear}
                  onChange={(e) => setCardYear(e.target.value)}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const y = minCardYear + i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="card-form__col -cvv">
              <div className="card-input">
                <label htmlFor="cardCvv" className="card-input__label">
                  CVV
                </label>
                <input
                  type="password"
                  id="cardCvv"
                  className="card-input__input"
                  value={cardCvv}
                  onFocus={() => setIsCardFlipped(true)}
                  onBlur={() => setIsCardFlipped(false)}
                  onChange={(e) =>
                    setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="123"
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Plan:</strong> {plan} — <strong>Credits:</strong> {credits}
            {seller && <span> — seller: {seller}</span>}
          </div>

          <button className="card-form__button" type="submit">
            Pay & Activate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
