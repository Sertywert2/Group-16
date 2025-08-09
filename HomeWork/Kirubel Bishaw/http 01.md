## HTTP?
**HTTP** stands for **HyperText Transfer Protocol**.  
It is the **foundation of communication** on the World Wide Web.

- When you visit a website, your browser sends a **request** to the web server using HTTP.
- The server sends back a **response** (like HTML, CSS, images, or data).
- It’s a **request–response** system.

###  How it Works
**Client (Browser)** asks the **Server** for a resource (e.g., `GET /dash.html`).
**Server** processes the request and sends back the content with a status code (e.g., `400 null`).
**Client** displays the content.


## HTTP-01?
**HTTP/1.1 
It is the most widely used HTTP version for many years and is the basis for most web communication even today.

### Key Characteristics:
**Request–Response Model:** The client sends a request, and the server replies with a response.
**Persistent Connections:** Allows multiple requests to be sent over the same connection without reopening it every time.
**Pipelining (Limited Use):** Can send multiple requests without waiting for each response, but this had limitations and was rarely used in practice.
**Text-Based Protocol:** Requests and responses are human-readable text.
**One Resource per Request:** Each file (HTML, CSS, JavaScript, image) requires its own HTTP request.
