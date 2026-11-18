# 🏠 RentWise - Project Presentation & Demonstration Guide

RentWise is a full-stack real estate and rental platform connecting **Property Owners/Landlords** (listing properties) with **Tenants/Customers** (searching, inspecting, and inquiring about rentals).

---

## 🚀 Quick Start for Presentation

### 1. Start the Spring Boot Backend (Port 8080)
```powershell
cd Backend
mvn spring-boot:run
```
* **Base API URL:** `http://localhost:8080/api/v1`
* **Swagger OpenAPI Documentation:** `http://localhost:8080/swagger-ui/index.html`
* **H2 Database Console:** `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/rentwisedb`, User: `sa`, Password: empty)

### 2. Start the Angular Frontend (Port 4200)
```powershell
cd Frontend
npm run start
```
* **Frontend Application:** `http://localhost:4200`

---

## 🔑 Pre-Seeded Presentation Test Accounts

| Account Role | Email | Password | What to Demo |
| :--- | :--- | :--- | :--- |
| **🏡 Property Owner** | `owner@rentwise.com` | `password123` | Log in, list new properties, prefilled contact details, unlist properties when deal is done |
| **🔍 Tenant / Customer** | `renter@rentwise.com` | `password123` | Search rentals by city/budget, view details, send direct inquiries to owners |
| **👑 Admin** | `admin@rentwise.com` | `admin123` | Full administrative platform access |

> **Pro Tip:** In the frontend Login modal, there are **"1-Click Test Credentials"** buttons (`🏡 Owner Account` & `🔍 Tenant Account`) for instant demonstration during your presentation without typing!

---

## 🎯 Step-by-Step Presentation Demonstration Script

### Flow 1: Customer / Tenant (Search & Inquire)
1. Open `http://localhost:4200`.
2. Browse pre-seeded listings across Pune, Mumbai, Bangalore, Delhi NCR, and Hyderabad.
3. Use the search bar (filter by city e.g. **Pune**, budget, or bedrooms).
4. Click on any property card to open the **Property Details Modal** (photo gallery, specs, amenities, fair rent estimate).
5. Click **"Contact Owner"** to open the inquiry modal:
   - Direct WhatsApp / Mailto links.
   - Message inquiry form connected to `POST /api/v1/inquiries`.

### Flow 2: Property Owner (JWT Login & Listing)
1. Click **"Log In"** in the top navigation.
2. Click **"🏡 Owner Account"** and click **"Log In"**.
3. Point out the top bar:
   - Authenticated JWT session.
   - **`Sunita Kulkarni (Owner)`** chip with **`OWNER`** badge.
4. Click **"+ List Your Property"**:
   - Step 1: Basic Info (Title, City, Locality, Type, Bedrooms, Bathrooms, Area).
   - Step 2: Terms (Rent, Deposit, Furnishing, Availability).
   - Step 3: Amenities selection.
   - Step 4: Contact details (auto-populated with owner's profile).
   - Step 5: Review & Publish.
5. Click **"Publish Listing"** &rarr; saved to Spring Boot database via `POST /api/v1/properties`.
6. See the new listing appear live in the marketplace!

### Flow 3: Deal Completed & Unlisting Listing
1. Open the newly listed property details.
2. Point out the **"Deal Done? Unlist Listing"** action button available exclusively for the owner.
3. Click the button and confirm &rarr; `DELETE /api/v1/properties/{id}` is executed.
4. Success toast confirms: *"Deal finalized! Listing unlisted and removed from RentWise."*

### Flow 4: Backend Architecture & Swagger API
1. Open `http://localhost:8080/swagger-ui/index.html`.
2. Demonstrate live interactive API documentation:
   - `POST /api/v1/auth/login` & `register` (JWT Token generation)
   - `GET /api/v1/properties` (Specification-based dynamic filtering)
   - `POST /api/v1/properties` (Authenticated property creation)
   - `DELETE /api/v1/properties/{id}` (Owner unlisting)
   - `POST /api/v1/inquiries` (Inquiry capture)

---

## 🛠️ Technical Architecture

### Backend:
- **Framework:** Spring Boot 3.3.5
- **Security:** Spring Security 6 with stateless JWT authentication (`io.jsonwebtoken:jjwt:0.12.6`)
- **Database:** H2 Database (file-backed at `./data/rentwisedb`, zero manual DB setup needed)
- **Data Access:** Spring Data JPA + Hibernate with `JpaSpecificationExecutor` for dynamic filtering
- **API Documentation:** SpringDoc OpenAPI 3 (Swagger UI)
- **Password Security:** BCrypt hashing

### Frontend:
- **Framework:** Angular 22 (Standalone Components, Signals, Reactive Forms)
- **HTTP Layer:** Angular `HttpClient` with `authInterceptor` (automatic JWT Bearer header attachment)
- **Routing & State:** Reactive signals store (`PropertyStoreService`, `AuthService`)
