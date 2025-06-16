# 🧠 Front-End Mental Model

## Step 0: User Initiates Request in Chrome

### 🎯 Action
The user opens Chrome and types a URL like:

- `life-nervous-system.com` (production)  
- `http://localhost:3000` or `http://127.0.0.1:3000` (local dev)

...then presses **Enter**.

---

### 🔍 Chrome: Initial Handling

1. **Scheme Handling**
   - If the user types a **full URL** (e.g. `https://...` or `http://...`), Chrome uses it as-is.
   - If the user types just a **domain** (e.g. `life-nervous-system.com`), Chrome decides whether to use HTTP or HTTPS.

2. **HSTS Enforcement Checks**
   - **HSTS Preload List**
     - Chrome checks its **internal HSTS preload list**.
     - This list is **maintained by Google** and shared via [https://hstspreload.org](https://hstspreload.org).
     - Other major browsers (Firefox, Safari, Edge, etc.) **import this list** to ensure consistent HTTPS enforcement across platforms.
     - If the domain is found in this list, Chrome **automatically upgrades** the request to `https://` without ever trying `http://`.
   - **Local HSTS State**
     - Chrome checks if this domain previously sent a `Strict-Transport-Security` header on a past HTTPS response.
     - If so, Chrome remembers this and **forces HTTPS** for this request as well.
   - ✅ In practice, nearly all public-facing domains are served over HTTPS.

3. **Local Cache Check**
   - Chrome checks:
     - **DNS cache**: Is the IP address already resolved?
     - **HTTP cache**: Is a valid HTTP response cached?

Only **after** these checks does Chrome proceed to DNS resolution.

# Step 1: DNS Resolution (Domain Name System)

## 🎯 Action  
Chrome needs an IP address for a domain like `life-nervous-system.com`. It uses DNS to turn the name into a number.

---

## 🌐 DNS: Step-by-Step

### 1. Browser Cache Check  
Chrome first checks its own DNS cache.  
If it finds a valid IP, it uses it right away.

### 2. Delegates to OS  
If not cached, Chrome asks the OS to resolve the name.  
This is a built-in OS function that contacts a DNS server.

### 3. DNS Resolution Chain  
The DNS server looks it up in steps:
- 🏛 **Root Server** → says who handles `.com`  
- 🧭 **TLD Server** → says who handles `life-nervous-system.com`  
- 🧠 **Authoritative Server** → returns the IP address

### 4. Return Path  
The DNS server sends the answer to the OS →  
the OS gives it to Chrome →  
Chrome now has the IP and moves on to make a connection.

Step 2: Making a Secure Connection to the Server
🎯 Action
Now that Chrome knows the IP address of the server (e.g. 99.88.77.66), it needs to talk to that server.
First, it creates a connection. Then, if the website uses HTTPS (HyperText Transfer Protocol Secure), it sets up encryption so nobody can spy on the data.

🔗 First: Set Up a Connection (TCP)
Chrome uses a basic "conversation rule" called TCP (Transmission Control Protocol).
It’s how two computers agree to talk clearly and reliably.

🪜 1. Chrome says: "Can we talk?"
Chrome sends a message called SYN to the server's IP address, asking to start a conversation.

🪜 2. Server replies: "Sure, I’m listening"
The server sends back SYN-ACK, saying “yes, go ahead.”

🪜 3. Chrome replies: "Great, let’s go"
Chrome sends one more message: ACK.
Now both sides agree — the connection is ready.

🔒 Then: Make It Secure (TLS)
Since the site uses HTTPS, Chrome wants to encrypt everything — so hackers, Wi-Fi snoops, or bad routers can’t read the data.

This uses a security system called TLS (Transport Layer Security) — it runs on top of TCP.
That just means: first they talk, then they make it private.

🔐 4. Chrome says: "Let’s talk privately"
Chrome sends a ClientHello message. It says:

“Here are the kinds of encryption I understand”
“Here’s the website I want to talk to”
“Here’s a random number to help create a secret”
🧾 5. Server replies: "Okay — here’s who I am"
The server responds with:

A certificate (like a digital ID card) to prove who it is
A matching random number
Its own encryption info
🕵️ 6. Chrome checks the certificate
It makes sure:

The website name matches
The certificate is signed by a trusted company
It’s not expired or fake
If everything checks out, Chrome trusts the server.

🔑 7. They create a secret code
Using the random numbers and some clever math, Chrome and the server agree on a secret key.
They never send this key over the internet — they both just calculate it.

✅ 8. They say: "Ready to go!"
They each send a final message (encrypted using the new secret key) that says:

“I’m ready”
“Let’s start sending real data”
Now the connection is secure.

✅ Result
Chrome and the server can now talk privately and securely.
Next, Chrome sends the actual request:
“Give me the homepage, please.”

# Step 2: Making a Secure Connection to the Server

## 🎯 Action  
Now that Chrome knows the IP address of the server (e.g. `99.88.77.66`), it needs to talk to that server.  
First, it creates a connection. Then, if the website uses **HTTPS (HyperText Transfer Protocol Secure)**, it sets up **encryption** so nobody can spy on the data.

---

## 🔗 First: Set Up a Connection (TCP)

Chrome uses a basic "conversation rule" called **TCP (Transmission Control Protocol)**.  
It’s how two computers agree to talk clearly and reliably.

### 🪜 1. Chrome says: "Can we talk?"  
Chrome sends a message called **SYN** to the server's IP address, asking to start a conversation.

### 🪜 2. Server replies: "Sure, I’m listening"  
The server sends back **SYN-ACK**, saying “yes, go ahead.”

### 🪜 3. Chrome replies: "Great, let’s go"  
Chrome sends one more message: **ACK**.  
Now both sides agree — the **connection is ready**.

---

## 🔒 Then: Make It Secure (TLS)

Since the site uses **HTTPS**, Chrome wants to **encrypt** everything — so hackers, Wi-Fi snoops, or bad routers can’t read the data.

This uses a security system called **TLS (Transport Layer Security)** — it runs *on top of TCP*.  
That just means: first they talk, **then they make it private**.

### 🔐 4. Chrome says: "Let’s talk privately"  
Chrome sends a **ClientHello** message. It says:
- “Here are the kinds of encryption I understand”
- “Here’s the website I want to talk to”
- “Here’s a random number to help create a secret”

### 🧾 5. Server replies: "Okay — here’s who I am"  
The server responds with:
- A **certificate** (like a digital ID card) to prove who it is  
- A matching random number  
- Its own encryption info

### 🕵️ 6. Chrome checks the certificate  
It makes sure:
- The website name matches  
- The certificate is signed by a trusted company  
- It’s not expired or fake  

If everything checks out, **Chrome trusts the server**.

### 🔑 7. They create a secret code  
Using the random numbers and some clever math, Chrome and the server **agree on a secret key**.  
They never send this key over the internet — they both just **calculate it**.

### ✅ 8. They say: "Ready to go!"  
They each send a final message (encrypted using the new secret key) that says:
- “I’m ready”
- “Let’s start sending real data”

Now the **connection is secure**.

---

## ✅ Result  
Chrome and the server can now **talk privately and securely**.  
Next, Chrome sends the actual request:  
**“Give me the homepage, please.”**

# 📡 Step 3: Browser Sends HTTP Request

## 🎯 What’s Happening  
Now that the connection is secure, Chrome sends a message to the server saying:

> “Here’s what I want.”

This might be:
- A page (`GET /`)
- A file (`GET /style.css`)
- An API call (`POST /api/data`)
- A form submission (`POST /signup`)

---

## 🧾 What the Message Looks Like

```
GET / HTTP/1.1                     # I want the homepage
Host: life-nervous-system.com      # This is for life-nervous-system.com
User-Agent: Mozilla/5.0 (...)      # I’m Chrome (or another browser)
Accept: text/html                  # I can read HTML
Accept-Encoding: gzip, br          # You can compress your reply
Connection: keep-alive             # Keep this connection open for more
```

---

## 🔒 It’s All Encrypted  
This entire message is locked with TLS.  
No one in the middle (Wi-Fi, ISP, hacker) can see what’s inside — only the server can.

---

## 🚀 Sent Over the Internet  
Chrome sends the encrypted request to the server’s IP address.  
The server gets it, decrypts it, and prepares a response.

---

## ✅ Result  
The server now knows exactly what you want — and it's ready to respond.
