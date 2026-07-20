# Topic 1: How the Web Works (Beginner to Interview Level)

## Introduction

Every day, we use websites like Google, Facebook, YouTube, Amazon, and ChatGPT. We simply open a browser, type a website address, and the page appears within seconds. But have you ever wondered what actually happens behind the scenes?

Understanding how the web works is one of the most important topics in web development. Before learning HTML, CSS, JavaScript, React, or any backend framework, you should understand how a browser communicates with a web server over the Internet.

---

## What is the Internet?

The Internet is a worldwide network of millions of computers connected together. These computers communicate using standard networking rules called **protocols**.

Think of the Internet like a huge road network:

* Your computer or mobile phone is a **car**.
* Roads are the **network connections**.
* Traffic rules are **protocols**.
* Websites are **buildings** located at different addresses.

Just as you need the correct address to reach a building, your browser needs the correct address (URL) to reach a website.

---

## What is a Website?

A website is a collection of web pages stored on a computer called a **web server**.

Examples:

* google.com
* youtube.com
* facebook.com
* amazon.com

A website usually contains:

* HTML files (Structure)
* CSS files (Design)
* JavaScript files (Interactivity)
* Images
* Videos
* Fonts
* Other resources

---

## What is a Web Page?

A web page is a **single page** inside a website.

For example:

Website:

```
https://example.com
```

Pages:

```
https://example.com/
https://example.com/about
https://example.com/contact
https://example.com/services
```

Each page is usually an HTML document.

---

## What is a Browser?

A browser is software that allows users to visit websites.

Popular browsers include:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari
* Brave
* Opera

The browser's job is to:

1. Request web pages from servers.
2. Download HTML, CSS, JavaScript, and images.
3. Render (display) the webpage on the screen.
4. Allow users to interact with the website.

---

## What is a URL?

A URL (**Uniform Resource Locator**) is the address of a webpage.

Example:

```
https://www.google.com/search?q=chatgpt
```

A URL has several parts:

### Protocol

```
https://
```

Tells the browser how to communicate.

### Domain Name

```
www.google.com
```

The website's human-readable name.

### Path

```
/search
```

Specifies which page or resource to open.

### Query Parameters

```
?q=chatgpt
```

Extra information sent to the server.

---

## What is DNS?

Humans remember names like:

```
google.com
```

Computers communicate using IP addresses, such as:

```
142.250.196.14
```

DNS (**Domain Name System**) acts like the Internet's **phone book**.

It converts:

```
google.com
```

into

```
142.xxx.xxx.xxx
```

without the user needing to know the IP address.

Without DNS, users would have to remember numerical IP addresses for every website.

---

## What is an IP Address?

Every device connected to the Internet has an IP (**Internet Protocol**) address.

Examples:

```
192.168.1.5
```

(Local network)

```
142.250.196.14
```

(Public Internet)

An IP address uniquely identifies a device so data knows where to go.

---

## What is HTTP?

HTTP stands for **HyperText Transfer Protocol**.

It is the communication language between browsers and web servers.

Whenever you visit a website, your browser sends an HTTP request.

Example:

```
GET /
```

The server replies with:

* HTML
* CSS
* JavaScript
* Images

This process happens every time you open or refresh a webpage.

---

## What is HTTPS?

HTTPS stands for:

**HyperText Transfer Protocol Secure**

HTTPS works exactly like HTTP but **encrypts** the communication.

Benefits:

* Protects passwords
* Protects credit card information
* Prevents attackers from reading your data
* Verifies the identity of the website

Modern websites should always use HTTPS.

---

## What is a Web Server?

A web server is a computer (or cloud server) that stores websites and responds to browser requests.

Examples of web server software:

* Nginx
* Apache
* IIS
* Caddy

When someone visits your website:

1. Browser sends a request.
2. Server receives it.
3. Server processes it.
4. Server sends the requested files back.

---

## What Happens When You Visit a Website?

Suppose you enter:

```
https://example.com
```

The following steps occur:

**Step 1** — You type the URL.

↓

**Step 2** — The browser checks whether it already knows the IP address.

↓

**Step 3** — If not, it asks the DNS server.

↓

**Step 4** — DNS returns the website's IP address.

↓

**Step 5** — The browser connects to the web server.

↓

**Step 6** — The browser sends an HTTP/HTTPS request.

↓

**Step 7** — The server processes the request.

↓

**Step 8** — The server sends back:

* HTML
* CSS
* JavaScript
* Images

↓

**Step 9** — The browser downloads everything.

↓

**Step 10** — The browser renders the webpage and displays it to the user.

---

## Frontend vs Backend

### Frontend

Everything users can **see and interact with**.

Examples:

* Buttons
* Text
* Images
* Navigation
* Forms

Technologies:

* HTML
* CSS
* JavaScript

### Backend

Runs on the **server**.

Responsibilities include:

* User authentication
* Database operations
* Business logic
* API responses
* File uploads

Common backend technologies:

* Node.js
* Django
* Laravel
* ASP.NET
* Spring Boot

---

## Client and Server

A **client** is the device requesting information.

Examples:

* Chrome
* Firefox
* Mobile app

A **server** is the computer providing the information.

Communication example:

```
Client
   │
HTTP Request
   │
Server
   │
HTTP Response
   │
Client Displays Website
```

---

## Static vs Dynamic Websites

### Static Website

Content stays the same unless the developer edits the files.

Examples:

* Portfolio
* Landing page
* Company profile

Technologies:

* HTML
* CSS
* JavaScript

### Dynamic Website

Content changes based on user actions or database data.

Examples:

* Facebook
* Amazon
* YouTube
* Gmail

Technologies:

* Frontend + Backend + Database

---

## Summary

After completing this topic, students should be able to explain:

* What the Internet is
* What a website and webpage are
* The role of a browser
* The purpose of a URL
* How DNS works
* What an IP address is
* The difference between HTTP and HTTPS
* The role of a web server
* The request–response cycle
* The difference between frontend and backend
* The difference between static and dynamic websites
* How a webpage is loaded from start to finish

These concepts form the foundation of web development. Once students understand them, learning HTML, CSS, JavaScript, Git, GitHub, backend development, APIs, and deployment becomes much easier because they know how all the pieces fit together.
