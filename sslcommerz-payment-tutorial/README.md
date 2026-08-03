# SSLCommerz Payment Gateway Integration (MERN Stack) — Full Beginner Tutorial

A complete step-by-step guide to adding **SSLCommerz** (Bangladesh's most popular payment gateway) to a MERN (MongoDB, Express, React, Node.js) project.

---

## Table of Contents

1. [What is SSLCommerz?](#1-what-is-sslcommerz)
2. [How the Payment Flow Works](#2-how-the-payment-flow-works)
3. [Prerequisites](#3-prerequisites)
4. [Step 1: Create a Sandbox Account](#4-step-1-create-a-sandbox-account)
5. [Step 2: Backend Setup (Node.js + Express)](#5-step-2-backend-setup-nodejs--express)
6. [Step 3: Initialize a Payment](#6-step-3-initialize-a-payment)
7. [Step 4: Handle Success / Fail / Cancel / IPN](#7-step-4-handle-success--fail--cancel--ipn)
8. [Step 5: Frontend (React) Integration](#8-step-5-frontend-react-integration)
9. [Step 6: Validate the Payment (Very Important!)](#9-step-6-validate-the-payment-very-important)
10. [Step 7: Test with Sandbox Cards](#10-step-7-test-with-sandbox-cards)
11. [Step 8: Going Live](#11-step-8-going-live)
12. [Common Errors & Fixes](#12-common-errors--fixes)
13. [References](#13-references)

---

## 1. What is SSLCommerz?

SSLCommerz is a payment gateway used in Bangladesh that lets your website accept:

- Debit/Credit cards (Visa, MasterCard, Amex)
- Mobile banking (bKash, Nagad, Rocket, Upay)
- Internet banking (City Bank, DBBL, etc.)

You send the customer to SSLCommerz's secure hosted page, the customer pays there, and SSLCommerz redirects them back to your site and tells your server whether the payment succeeded.

---

## 2. How the Payment Flow Works

```
[React Frontend]                [Your Node Server]              [SSLCommerz]
      |                                |                             |
      |--- 1. POST /order ------------>|                             |
      |                                |--- 2. Init payment -------->|
      |                                |<-- 3. GatewayPageURL -------|
      |<-- 4. Send GatewayPageURL -----|                             |
      |--- 5. Redirect user to GatewayPageURL --------------------->|
      |                                |                             |
      |        (customer pays on SSLCommerz hosted page)             |
      |                                |                             |
      |                                |<-- 6. POST success_url -----|
      |                                |--- 7. Validate payment ---->|
      |                                |<-- 8. VALID/VALIDATED ------|
      |<-- 9. Redirect to success page |                             |
```

Key idea for beginners: **the payment happens on SSLCommerz's page, not yours.** Your job is only to (a) start the session, (b) redirect the user, and (c) verify the result.

---

## 3. Prerequisites

- Node.js v18+ installed
- MongoDB (local or Atlas)
- Basic knowledge of Express and React
- A working MERN project (or create a fresh one following steps below)

---

## 4. Step 1: Create a Sandbox Account

1. Go to the sandbox registration page: <https://developer.sslcommerz.com/registration/>
2. Fill in your details (any business name works for testing).
3. Check your email — you will receive:
   - **Store ID** (e.g., `teststore686xxxxxx`)
   - **Store Password** (e.g., `teststore686xxxxxx@ssl`)
4. Sandbox merchant panel login: <https://sandbox.sslcommerz.com/manage/>

> ⚠️ Sandbox credentials only work with sandbox URLs. Live credentials come later after real merchant verification.

---

## 5. Step 2: Backend Setup (Node.js + Express)

### 5.1 Create the server project

```bash
mkdir server && cd server
npm init -y
npm install express cors dotenv mongodb axios sslcommerz-lts
```

> `sslcommerz-lts` is the official-style Node library for SSLCommerz. You can also call the REST API directly with `axios` — both approaches are shown below.

### 5.2 Create `.env`

```env
PORT=5000
DB_URI=mongodb://localhost:27017/paymentDB
STORE_ID=your_sandbox_store_id
STORE_PASSWORD=your_sandbox_store_password
IS_LIVE=false
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit `.env` to GitHub. Add it to `.gitignore`.

### 5.3 Basic `index.js`

```js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
// SSLCommerz sends success/fail data as form-urlencoded:
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.DB_URI);
const orderCollection = client.db("paymentDB").collection("orders");

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

---

## 6. Step 3: Initialize a Payment

### 6.1 Using the `sslcommerz-lts` package

```js
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.IS_LIVE === "true"; // false = sandbox

app.post("/order", async (req, res) => {
  const order = req.body; // { name, email, phone, address, amount, ... }

  // 1. Generate a UNIQUE transaction id
  const tran_id = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const data = {
    total_amount: order.amount,
    currency: "BDT",
    tran_id: tran_id,                      // must be unique per attempt
    success_url: `${process.env.SERVER_URL}/payment/success/${tran_id}`,
    fail_url: `${process.env.SERVER_URL}/payment/fail/${tran_id}`,
    cancel_url: `${process.env.SERVER_URL}/payment/cancel/${tran_id}`,
    ipn_url: `${process.env.SERVER_URL}/payment/ipn`,
    shipping_method: "Courier",
    product_name: order.productName || "General Product",
    product_category: "General",
    product_profile: "general",
    cus_name: order.name,
    cus_email: order.email,
    cus_add1: order.address,
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: order.phone,
    ship_name: order.name,
    ship_add1: order.address,
    ship_city: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  // 2. Save the order with status "pending" BEFORE redirecting
  await orderCollection.insertOne({
    ...order,
    tran_id,
    status: "pending",
    createdAt: new Date(),
  });

  // 3. Ask SSLCommerz for the payment page URL
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  // 4. Send URL to frontend
  res.send({ url: apiResponse.GatewayPageURL });
});
```

### 6.2 Alternative: direct REST API call with axios (no package)

```js
const axios = require("axios");
const qs = require("querystring");

const response = await axios.post(
  "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
  qs.stringify({ ...data, store_id, store_passwd }),
  { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
);
// response.data.GatewayPageURL
```

Live endpoint: `https://securepay.sslcommerz.com/gwprocess/v4/api.php`

---

## 7. Step 4: Handle Success / Fail / Cancel / IPN

SSLCommerz **POSTs** to your URLs, then you redirect the browser back to the React app.

```js
// SUCCESS
app.post("/payment/success/:tranId", async (req, res) => {
  const { tranId } = req.params;

  // req.body contains val_id, amount, card_type, status etc.
  const result = await orderCollection.updateOne(
    { tran_id: tranId },
    { $set: { status: "paid", paidAt: new Date(), val_id: req.body.val_id } }
  );

  if (result.modifiedCount > 0) {
    res.redirect(`${process.env.CLIENT_URL}/payment/success/${tranId}`);
  }
});

// FAIL
app.post("/payment/fail/:tranId", async (req, res) => {
  await orderCollection.updateOne(
    { tran_id: req.params.tranId },
    { $set: { status: "failed" } }
  );
  res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
});

// CANCEL
app.post("/payment/cancel/:tranId", async (req, res) => {
  await orderCollection.updateOne(
    { tran_id: req.params.tranId },
    { $set: { status: "cancelled" } }
  );
  res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
});

// IPN (Instant Payment Notification) — server-to-server, most reliable
app.post("/payment/ipn", async (req, res) => {
  console.log("IPN received:", req.body);
  // Validate here too (see Step 6)
  res.status(200).send("IPN received");
});
```

> 💡 **Why IPN?** If the user closes the browser right after paying, `success_url` may never fire — but IPN always does, because SSLCommerz calls your server directly. In production, treat IPN as the source of truth.

---

## 8. Step 5: Frontend (React) Integration

### 8.1 Checkout form component

```jsx
// Checkout.jsx
import { useState } from "react";

const Checkout = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", amount: 500,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    // Redirect the WHOLE window to SSLCommerz page:
    window.location.replace(data.url);
  };

  return (
    <form onSubmit={handlePayment}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="amount" type="number" value={form.amount} onChange={handleChange} required />
      <button type="submit">Pay with SSLCommerz</button>
    </form>
  );
};

export default Checkout;
```

### 8.2 Success page + routes (React Router)

```jsx
// PaymentSuccess.jsx
import { useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const { tranId } = useParams();
  return (
    <div>
      <h1>✅ Payment Successful!</h1>
      <p>Transaction ID: {tranId}</p>
    </div>
  );
};
export default PaymentSuccess;
```

```jsx
// router
{ path: "/payment/success/:tranId", element: <PaymentSuccess /> },
{ path: "/payment/fail", element: <PaymentFail /> },
{ path: "/payment/cancel", element: <PaymentCancel /> },
```

---

## 9. Step 6: Validate the Payment (Very Important!)

Never trust the redirect alone — anyone can POST to your success URL. Always verify with SSLCommerz's **Order Validation API** using the `val_id` you received:

```js
app.post("/payment/success/:tranId", async (req, res) => {
  const { val_id } = req.body;

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });

  if (validation.status === "VALID" || validation.status === "VALIDATED") {
    await orderCollection.updateOne(
      { tran_id: req.params.tranId },
      { $set: { status: "paid", validation } }
    );
    return res.redirect(`${process.env.CLIENT_URL}/payment/success/${req.params.tranId}`);
  }
  res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
});
```

Also check that `validation.amount` matches the amount you stored — attackers may try paying a smaller amount.

Validation REST endpoint (sandbox):
`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=XXXX&store_id=XXXX&store_passwd=XXXX&format=json`

---

## 10. Step 7: Test with Sandbox Cards

On the sandbox payment page, use SSLCommerz test cards:

| Card Type  | Number              | Expiry     | CVV |
|------------|---------------------|------------|-----|
| VISA       | 4111111111111111    | 12/25 (any future) | 111 |
| MasterCard | 5111111111111111    | 12/25      | 111 |
| Amex       | 371111111111111     | 12/25      | 111 |
| Failed txn | 4111111111111112    | 12/25      | 111 |

Mobile banking options in sandbox also work with the on-screen test OTP (usually `111111` or shown on the page).

**Test checklist:**

- [ ] Successful payment → order status becomes `paid`
- [ ] Failed card → status `failed`, user lands on fail page
- [ ] User clicks Cancel → status `cancelled`
- [ ] Amount tampering blocked by validation check

---

## 11. Step 8: Going Live

1. Register a real merchant account at <https://sslcommerz.com> (needs trade license, bank account, NID).
2. After approval, you get **live Store ID & Password**.
3. Change in `.env`: `IS_LIVE=true` and swap credentials.
4. Endpoints automatically switch to `https://securepay.sslcommerz.com/...` (the `sslcommerz-lts` package handles this via the third constructor argument).
5. Use HTTPS on your own domain — SSLCommerz requires it in production.
6. Set your real domain in `success_url`, `fail_url`, `cancel_url`, `ipn_url`.

---

## 12. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Store Credential Error Or Store is De-active` | Wrong Store ID/Password, or using live creds on sandbox | Double-check `.env`; sandbox creds ↔ sandbox URL |
| `GatewayPageURL` is `undefined` | Required fields missing (e.g. `cus_name`, `total_amount`) | Log `apiResponse` and fill all required fields |
| Success handler never fires | Server not reachable from internet (localhost) for IPN | success/fail redirects work on localhost; IPN needs a public URL (use [ngrok](https://ngrok.com) for testing) |
| `req.body` empty in success route | Missing `express.urlencoded()` middleware | Add `app.use(express.urlencoded({ extended: true }))` |
| CORS error on `/order` | cors middleware missing | `app.use(cors())` |
| Duplicate `tran_id` rejected | Reused transaction id | Generate a fresh unique id per attempt |

---

## 13. References

- Official Developer Docs: <https://developer.sslcommerz.com/doc/v4/>
- Sandbox Registration: <https://developer.sslcommerz.com/registration/>
- Sandbox Merchant Panel: <https://sandbox.sslcommerz.com/manage/>
- `sslcommerz-lts` npm package: <https://www.npmjs.com/package/sslcommerz-lts>
- Order Validation API docs: <https://developer.sslcommerz.com/doc/v4/#order-validation-api>
- IPN docs: <https://developer.sslcommerz.com/doc/v4/#ipn-listener>
- ngrok (expose localhost for IPN testing): <https://ngrok.com>

---

*Happy coding! Test everything in sandbox before going live.* 🚀
