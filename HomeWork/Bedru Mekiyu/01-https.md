# HTTP/1.1 vs HTTP/2 

HTTP is the foundation of data communication on the web.  
- **HTTP/1.1** was introduced in 1997 and became the dominant standard for over 15 years.  
- **HTTP/2** (published in 2015) was designed to solve inefficiencies in HTTP/1.1 and improve page load speed.

---

##  Key Differences

| Feature | HTTP/1.1 | HTTP/2 |
|---------|----------|--------|
| **Protocol Format** | Text-based | Binary-based |
| **Connections** | One request per TCP connection (unless pipelining) | Multiplexing: multiple concurrent requests on a single TCP connection |
| **Performance** | Suffering from head-of-line blocking (HOL) | Reduced HOL blocking via multiplexing |
| **Header Compression** | No (headers sent as plain text) | Yes, via **HPACK** algorithm |
| **Server Push** | Not supported | Supported – server can send resources before the client requests them |
| **Prioritization** | Limited or none | Request prioritization built in |
| **Encryption** | Optional (plain HTTP or HTTPS) | Commonly used with TLS (HTTPS), though not strictly required |
| **Compatibility** | Supported everywhere | Supported by most modern browsers & servers |

---

##  Why HTTP/2 is Faster

1. **Binary Protocol**  
   - More compact, easier for machines to parse, fewer errors.
2. **Multiplexing**  
   - Multiple requests/responses in parallel over a single connection.
3. **Header Compression (HPACK)**  
   - Reduces overhead from large, repetitive HTTP headers.
4. **Server Push**  
   - Preloads resources before the client explicitly requests them.

---

