# Security Review — FC Tracker

**Reviewer:** SecAgent (secure-by-design)  
**Scope:** Backend (Go/Gin), Frontend (React), Auth, API, Config  
**Threat model:** Data exfiltration, privilege escalation, account takeover, DoS, information disclosure

---

## SECURITY FINDINGS

### Critical

**1. JWT algorithm verification not enforced**

- **Vulnerability:** In `handler/auth.go`, `jwt.ParseWithClaims` accepts any signing method unless explicitly restricted. An attacker could attempt algorithm confusion (e.g. `alg: none` or HMAC vs RSA) if the library accepts multiple methods.
- **Explanation:** Without restricting valid methods, token validation may accept tokens signed with an unexpected algorithm, leading to bypass or forgery.
- **Recommended fix:** Use `jwt.WithValidMethods([]string{"HS256"})` (or the equivalent in your JWT library) when parsing, so only the intended algorithm is accepted.

```go
// handler/auth.go - validateToken
token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
    }
    return jwtSecret, nil
})
```

Ensure the library rejects `alg: none` and other methods; document and test.

---

### High

**2. Internal errors and stack traces exposed to clients**

- **Vulnerability:** Many handlers return `err.Error()` in JSON responses (e.g. `handlers.go` lines 51, 67, 73, 122, 150, 162, 174, 208, 219, 239, 248, 257, 266, 283, 301; `auth.go` line 163).
- **Explanation:** Database and runtime errors can include paths, collection names, and implementation details. Attackers use these for reconnaissance and targeted attacks.
- **Recommended fix:** Log the full error server-side; return a generic message to the client (e.g. "Something went wrong"). Use a single error-response helper and avoid sending `err.Error()` in production.

**3. JWT lifetime too long**

- **Vulnerability:** Tokens expire in 72 hours (`auth.go` line 41: `time.Now().Add(72 * time.Hour)`).
- **Explanation:** Long-lived tokens increase impact of token theft (e.g. via XSS or device loss) and reduce effectiveness of revocation.
- **Recommended fix:** Shorten access token expiry (e.g. 15–60 minutes) and implement refresh tokens (stored server-side or in httpOnly cookie, rotated on use). Optionally add logout/revocation.

**4. JWT and user data in localStorage (XSS-friendly)**

- **Vulnerability:** Frontend stores token and user in `localStorage` (`AuthContext.tsx`: `fctracker_token`, `fctracker_user`).
- **Explanation:** Any XSS can read localStorage and exfiltrate the token, leading to account takeover. React’s default escaping reduces but does not eliminate XSS risk (e.g. third-party scripts, dependencies).
- **Recommended fix:** Prefer session cookies with `HttpOnly`, `Secure`, `SameSite=Strict` (or Lax) for the token so JavaScript cannot read it. If you keep JWTs in the frontend, document the XSS risk and harden CSP and dependency hygiene.

---

### Medium

**5. User enumeration on registration**

- **Vulnerability:** Register returns `err.Error()` on conflict (`auth.go` line 163), e.g. "a user with this email already exists".
- **Explanation:** Attackers can distinguish existing emails from non-existing ones, enabling enumeration and targeted phishing or credential stuffing.
- **Recommended fix:** Return the same HTTP status and a generic message for “email already registered” and “registration failed” (e.g. "Registration failed. If this email is already in use, check your inbox or try signing in."). Log the real reason server-side.

**6. No rate limiting on auth and API**

- **Vulnerability:** Login, register, and other API routes have no rate limiting.
- **Explanation:** Enables brute-force login, credential stuffing, and DoS via request volume.
- **Recommended fix:** Add rate limiting (per IP and optionally per account) on `/api/auth/login`, `/api/auth/register`, and sensitive or expensive endpoints. Use middleware (e.g. gin middleware with in-memory or Redis store). Consider lockout or backoff after repeated failures.

**7. Missing security headers**

- **Vulnerability:** No HSTS, X-Content-Type-Options, Content-Security-Policy, or similar headers in the Go server.
- **Explanation:** Increases risk of protocol downgrade, MIME sniffing, and certain XSS/clickjacking vectors.
- **Recommended fix:** Add middleware that sets at least:
  - `Strict-Transport-Security: max-age=...; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (or SAMEORIGIN if you need framing)
  - `Content-Security-Policy` (tune for your frontend and APIs)
  - `Referrer-Policy: strict-origin-when-cross-origin` (or stricter)

**8. Seed endpoint available to any authenticated user**

- **Vulnerability:** `POST /api/seed` is protected only by auth (`server.go`); any logged-in user can trigger it.
- **Explanation:** Can cause data duplication or overwrite; should be restricted to admin or disabled in production.
- **Recommended fix:** Remove or disable the seed route in production, or protect it with an admin role/API key and enforce it server-side.

**9. Weak password policy**

- **Vulnerability:** Only check is length ≥ 6 (`auth.go` line 156).
- **Explanation:** Very weak passwords are allowed, increasing risk of brute force and credential stuffing.
- **Recommended fix:** Enforce minimum length (e.g. 10–12), and consider complexity (upper, lower, digit, symbol) and rejection of common passwords (e.g. blocklist or zxcvbn-style check).

---

### Low

**10. No email format validation**

- **Vulnerability:** Login/register accept any non-empty string as email; no format or domain check.
- **Explanation:** Enables invalid or abuse-prone addresses and can complicate account recovery and communication.
- **Recommended fix:** Validate email format (regex or library) and optionally normalise (lowercase, trim). Consider domain allow/block list for high-risk environments.

**11. Input validation and type consistency**

- **Vulnerability:** Handlers pass query/body values (e.g. `goals`, `games_played`, `age`) as strings into the DB layer; some fields are stored or used as other types.
- **Explanation:** Can cause inconsistent data or unexpected behaviour; no centralised length/format/type checks.
- **Recommended fix:** Validate and parse all inputs (type, range, length) at the API layer; use a single schema/validation approach (e.g. struct tags + validator). Reject invalid input with 400 and a generic message.

**12. CORS and credentials**

- **Current state:** CORS uses `AllowCredentials: true` and configurable `AllowOrigins` from env—good.
- **Recommendation:** Ensure production `ALLOWED_ORIGINS` is set to exact frontend origins (no wildcards when using credentials). Document that .env is not committed (already in .gitignore).

**13. Health endpoint information**

- **Current state:** `GET /health` returns `{"status":"healthy"}` and is public.
- **Recommendation:** Acceptable for most deployments. If you need to hide that the service is Go/Gin, avoid adding version or stack info to this response.

---

## Positive findings

- **Password hashing:** bcrypt used in `db.CreateUser` / `CheckPassword`; no plaintext or weak hashes.
- **Auth enforcement:** Sensitive routes are behind `AuthMiddleware()`; JWT is validated and user context is set.
- **Secrets:** JWT secret from env (`JWT_SECRET`); `.env` in .gitignore; no hardcoded secrets observed.
- **MongoDB:** Queries use BSON/parameterised structures; IDs validated with `ObjectIDFromHex`; no raw string concatenation into queries.
- **Update allowlist:** `updatePlayer` restricts updatable fields via an allowlist, reducing mass-assignment risk.
- **Login errors:** Generic "Invalid email or password" on login (no user enumeration there).
- **Frontend:** No `dangerouslySetInnerHTML` or obvious XSS sinks in the reviewed code; React’s default escaping helps.
- **Timeouts:** Server uses `ReadTimeout` / `WriteTimeout`; good for resilience.

---

## SECURE IMPLEMENTATION (high-impact fixes)

### 1. Enforce JWT signing method (auth.go)

```go
token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
    }
    return jwtSecret, nil
})
```

### 2. Stop leaking internal errors (example helper)

```go
// In handler or a small pkg
func respondError(c *gin.Context, status int, publicMsg string, err error) {
    if err != nil {
        log.Printf("[%s] %v", publicMsg, err)
    }
    c.JSON(status, gin.H{"error": publicMsg})
}
// Use: respondError(c, http.StatusInternalServerError, "Failed to process request", err)
```

### 3. Generic register conflict message (auth.go)

```go
if err != nil {
    c.JSON(http.StatusConflict, gin.H{"error": "Registration failed. This email may already be in use."})
    return
}
// Do not return err.Error() to the client.
```

### 4. Security headers middleware (server.go)

```go
router.Use(func(c *gin.Context) {
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("X-Frame-Options", "DENY")
    c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
    c.Next()
})
// Add HSTS in production only (e.g. when TLS is guaranteed).
```

### 5. Shorter JWT expiry + refresh (design)

- Reduce `ExpiresAt` to e.g. 15–60 minutes.
- Implement refresh token (stored server-side or in httpOnly cookie; short-lived access token in memory or cookie).
- Optionally add logout/revocation for refresh tokens.

### 6. Rate limiting (design)

- Add middleware for `/api/auth/login` and `/api/auth/register` (e.g. 5–10 requests per minute per IP).
- Optionally rate limit the whole `/api` group or expensive endpoints.

---

## Summary

| Severity | Count |
|----------|--------|
| Critical | 1 (JWT alg verification) |
| High     | 3 (error leakage, JWT lifetime, localStorage) |
| Medium   | 5 (enumeration, rate limit, headers, seed, password policy) |
| Low      | 4 (email validation, input validation, CORS, health) |

**Priority order:** Fix JWT algorithm verification and error leakage first; then shorten token lifetime and move toward httpOnly cookies or refresh flow; add rate limiting and security headers; then tighten registration messaging, seed access, and password policy.

This review follows secure-by-design principles: minimise trust in input, fail safely, apply defence in depth, and avoid exposing internals to clients.
