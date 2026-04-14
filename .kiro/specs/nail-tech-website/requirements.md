# Requirements Document

## Introduction

A full-stack modern website for a Nail Technician business built with Next.js (App Router), React, Tailwind CSS, and MongoDB. The website enables customers to browse nail services, book appointments, and leave reviews — all without requiring account creation. An admin dashboard allows the business owner to manage bookings. The site features a feminine, elegant UI built with shadcn/ui components for a professional, polished appearance, optimized for mobile and desktop, and is deployment-ready for Vercel.

## Glossary

- **Website**: The full-stack Next.js application described in this document.
- **Customer**: A visitor to the Website who browses services, books appointments, or leaves reviews.
- **Admin**: The business owner or operator who accesses the admin dashboard to manage bookings.
- **Booking**: A scheduled appointment created by a Customer, stored in the database.
- **Service**: A nail treatment offered by the business (e.g., Acrylic, Gel, Pedicure, Nail Art).
- **Review**: A comment and optional star rating submitted by a Customer.
- **Navbar**: The sticky navigation bar displayed at the top of every page.
- **BookingForm**: The form Customers use to create a Booking.
- **ReviewForm**: The form Customers use to submit a Review.
- **ContactForm**: The form Customers use to send a contact message.
- **AdminDashboard**: The protected page where the Admin manages Bookings.
- **API**: The Next.js API Routes that handle data operations.
- **Database**: The MongoDB instance accessed via Mongoose.
- **Toast**: A transient on-screen notification shown after a user action.
- **shadcn/ui**: The open-source component library (https://ui.shadcn.com) used to provide accessible, professionally styled UI primitives.
- **shadcn_Component**: Any UI element sourced from the shadcn/ui library (e.g., Button, Card, Input, Select, Textarea, Badge, Sheet, Separator, Avatar).

---

## Requirements

### Requirement 1: Navigation

**User Story:** As a Customer, I want a sticky navigation bar with smooth scrolling, so that I can quickly jump to any section of the page without losing my place.

#### Acceptance Criteria

1. THE Navbar SHALL be visible and fixed to the top of the viewport on all screen sizes at all times.
2. THE Navbar SHALL contain links to the following sections in order: Home, Services, Book, Reviews, About, Contact.
3. WHEN a Customer clicks a Navbar link, THE Website SHALL scroll smoothly to the corresponding section.
4. WHEN the viewport width is below 768px, THE Navbar SHALL collapse navigation links into a hamburger menu.
5. WHEN the hamburger menu is open and a Customer clicks a link, THE Navbar SHALL close the menu and scroll to the selected section.

---

### Requirement 2: Hero Section

**User Story:** As a Customer, I want an eye-catching landing section, so that I immediately understand the business and am encouraged to book an appointment.

#### Acceptance Criteria

1. THE Website SHALL display a Hero section as the first visible section on the homepage.
2. THE Hero section SHALL display the business name, a tagline, and a "Book Now" call-to-action button.
3. WHEN a Customer clicks the "Book Now" button, THE Website SHALL scroll smoothly to the Booking section.
4. THE Hero section SHALL display at least one high-quality nail image as a background or featured visual.
5. THE Hero section SHALL apply entrance animations to the headline, tagline, and button on initial page load.

---

### Requirement 3: Services Section

**User Story:** As a Customer, I want to browse available nail services with pricing and duration, so that I can choose the right service before booking.

#### Acceptance Criteria

1. THE Website SHALL display a Services section listing all available nail services.
2. THE Services section SHALL display each Service in a card containing: service name, price, duration, and an image.
3. THE Services section SHALL arrange Service cards in a responsive grid layout (minimum 1 column on mobile, 2 columns on tablet, 3 columns on desktop).
4. WHEN a Customer hovers over a Service card, THE Website SHALL apply a visible hover effect (e.g., shadow elevation or scale transform).
5. THE Services section SHALL include at minimum the following services: Acrylic, Gel, Pedicure, and Nail Art.

---

### Requirement 4: Booking System

**User Story:** As a Customer, I want to book an appointment without creating an account, so that I can schedule a visit quickly and conveniently.

#### Acceptance Criteria

1. THE Website SHALL display a Booking section containing the BookingForm.
2. THE BookingForm SHALL include the following fields: full name, phone number, service selection (dropdown), preferred date, preferred time, and optional notes.
3. WHEN a Customer submits the BookingForm with all required fields valid, THE API SHALL save the Booking to the Database with a default status of "pending".
4. WHEN a Customer submits the BookingForm with one or more required fields empty or invalid, THE BookingForm SHALL display inline validation error messages without submitting to the API.
5. WHEN the API receives a booking request for a date and time that already has an existing confirmed Booking for the same service, THE API SHALL return a 409 conflict response.
6. WHEN the BookingForm submission succeeds, THE Website SHALL display a success Toast notification and reset the BookingForm to its empty state.
7. WHEN the BookingForm submission fails due to a server error, THE Website SHALL display an error Toast notification with a descriptive message.
8. WHEN the BookingForm submission fails due to a double-booking conflict, THE Website SHALL display an error Toast notification informing the Customer that the selected time slot is unavailable.

---

### Requirement 5: Admin Dashboard

**User Story:** As an Admin, I want a dashboard to view and manage all bookings, so that I can keep track of appointments and update their status.

#### Acceptance Criteria

1. THE Website SHALL provide an AdminDashboard page accessible at the `/admin` route.
2. THE AdminDashboard SHALL fetch and display all Bookings from the Database in a tabular or card layout.
3. THE AdminDashboard SHALL display the following fields for each Booking: customer name, phone number, service, date, time, notes, and current status.
4. WHEN the Admin clicks "Mark as Completed" on a Booking, THE API SHALL update that Booking's status to "completed" in the Database and THE AdminDashboard SHALL reflect the updated status without a full page reload.
5. WHEN the Admin clicks "Mark as Pending" on a Booking, THE API SHALL update that Booking's status to "pending" in the Database and THE AdminDashboard SHALL reflect the updated status without a full page reload.
6. WHEN the Admin clicks "Delete" on a Booking, THE API SHALL remove that Booking from the Database and THE AdminDashboard SHALL remove the Booking entry from the displayed list without a full page reload.
7. WHILE the AdminDashboard is loading Bookings, THE AdminDashboard SHALL display a loading indicator.
8. IF the API returns an error when fetching Bookings, THEN THE AdminDashboard SHALL display a descriptive error message.

---

### Requirement 6: Review System

**User Story:** As a Customer, I want to leave a review without creating an account, so that I can share my experience with others.

#### Acceptance Criteria

1. THE Website SHALL display a Reviews section on the homepage showing all submitted Reviews.
2. THE Reviews section SHALL contain the ReviewForm allowing Customers to submit a new Review.
3. THE ReviewForm SHALL include the following fields: name (required), message (required), and star rating (optional, 1–5 stars).
4. WHEN a Customer submits the ReviewForm with all required fields valid, THE API SHALL save the Review to the Database with a createdAt timestamp.
5. WHEN a Customer submits the ReviewForm with required fields empty, THE ReviewForm SHALL display inline validation error messages without submitting to the API.
6. WHEN the ReviewForm submission succeeds, THE Website SHALL display a success Toast notification and reset the ReviewForm to its empty state.
7. WHEN the ReviewForm submission fails due to a server error, THE Website SHALL display an error Toast notification with a descriptive message.
8. THE Reviews section SHALL display each Review with: reviewer name, message, star rating (if provided), and submission date.
9. THE Reviews section SHALL display Reviews in reverse chronological order (newest first).

---

### Requirement 7: About Section

**User Story:** As a Customer, I want to learn about the nail technician's background and specialties, so that I can feel confident choosing this business.

#### Acceptance Criteria

1. THE Website SHALL display an About section containing the business story, years of experience, and listed specialties.
2. THE About section SHALL display an image of the nail technician alongside the descriptive text.
3. THE About section SHALL be responsive, stacking the image and text vertically on mobile and displaying them side-by-side on desktop.

---

### Requirement 8: Contact Section

**User Story:** As a Customer, I want to find contact information and send a message, so that I can reach the business with questions or special requests.

#### Acceptance Criteria

1. THE Website SHALL display a Contact section containing the business phone number, a WhatsApp link, and an Instagram link.
2. THE Contact section SHALL contain the ContactForm with the following fields: name (required) and message (required).
3. WHEN a Customer submits the ContactForm with all required fields valid, THE API SHALL store or forward the contact message and THE Website SHALL display a success Toast notification.
4. WHEN a Customer submits the ContactForm with required fields empty, THE ContactForm SHALL display inline validation error messages without submitting to the API.
5. WHERE a map embed is configured, THE Contact section SHALL display an embedded location map.

---

### Requirement 9: Backend API — Bookings

**User Story:** As a developer, I want a RESTful API for bookings, so that the frontend can create, read, update, and delete booking records reliably.

#### Acceptance Criteria

1. THE API SHALL expose a `POST /api/bookings` endpoint that creates a new Booking in the Database.
2. THE API SHALL expose a `GET /api/bookings` endpoint that returns all Bookings from the Database.
3. THE API SHALL expose a `PATCH /api/bookings/[id]` endpoint that updates the status of a Booking identified by its Database ID.
4. THE API SHALL expose a `DELETE /api/bookings/[id]` endpoint that removes a Booking identified by its Database ID from the Database.
5. WHEN a `POST /api/bookings` request is received with missing required fields, THE API SHALL return a 400 response with a descriptive error message.
6. WHEN a `POST /api/bookings` request is received for a time slot already occupied by an existing Booking for the same service, THE API SHALL return a 409 response.
7. WHEN a `PATCH` or `DELETE` request references a Booking ID that does not exist in the Database, THE API SHALL return a 404 response.
8. IF the Database connection fails during any API request, THEN THE API SHALL return a 500 response with a descriptive error message.

---

### Requirement 10: Backend API — Reviews

**User Story:** As a developer, I want a RESTful API for reviews, so that the frontend can create and retrieve review records reliably.

#### Acceptance Criteria

1. THE API SHALL expose a `POST /api/comments` endpoint that creates a new Review in the Database.
2. THE API SHALL expose a `GET /api/comments` endpoint that returns all Reviews from the Database sorted by createdAt descending.
3. WHEN a `POST /api/comments` request is received with missing required fields (name or message), THE API SHALL return a 400 response with a descriptive error message.
4. WHEN a `POST /api/comments` request is received with a rating value outside the range 1–5, THE API SHALL return a 400 response with a descriptive error message.
5. IF the Database connection fails during any API request, THEN THE API SHALL return a 500 response with a descriptive error message.

---

### Requirement 11: Database Models

**User Story:** As a developer, I want well-defined Mongoose schemas, so that data is consistently structured and validated at the database layer.

#### Acceptance Criteria

1. THE Database SHALL contain a Booking model with the following fields: name (String, required), phone (String, required), service (String, required), date (String, required), time (String, required), notes (String, optional), status (String, enum: ["pending", "completed"], default: "pending").
2. THE Database SHALL contain a Review model with the following fields: name (String, required), message (String, required), rating (Number, optional, min: 1, max: 5), createdAt (Date, default: Date.now).
3. THE Database SHALL use the `MONGODB_URI` environment variable to establish the connection string.
4. WHEN the application starts, THE Database connection module SHALL reuse an existing connection if one is already established (connection pooling / singleton pattern).

---

### Requirement 12: Design and User Experience

**User Story:** As a Customer, I want a visually elegant and mobile-responsive website, so that I have a pleasant browsing experience on any device.

#### Acceptance Criteria

1. THE Website SHALL use a feminine, elegant color palette (e.g., soft pinks, rose, blush, cream, or mauve tones).
2. THE Website SHALL be fully responsive across viewport widths from 320px to 1440px and above.
3. THE Website SHALL apply smooth CSS transitions and hover effects to interactive elements (buttons, cards, links).
4. THE Website SHALL use modern, readable typography with clear visual hierarchy (distinct heading, subheading, and body text styles).
5. THE Website SHALL display loading states (spinners or skeleton placeholders) while asynchronous data is being fetched.
6. THE Website SHALL display Toast notifications for all user-initiated actions that result in success or failure.

---

### Requirement 13: Deployment and Configuration

**User Story:** As a developer, I want the application to be deployment-ready for Vercel, so that it can be shipped to production with minimal configuration.

#### Acceptance Criteria

1. THE Website SHALL read the MongoDB connection string exclusively from the `MONGODB_URI` environment variable.
2. THE Website SHALL include a `.env.example` file listing all required environment variables with placeholder values.
3. THE Website SHALL produce no build errors when `next build` is executed with valid environment variables set.
4. THE Website SHALL handle missing or invalid environment variables at startup by logging a descriptive error message.

---

### Requirement 14: shadcn/ui Component Integration

**User Story:** As a developer, I want all UI components rebuilt using shadcn/ui primitives, so that the website has a consistent, professional, and accessible appearance out of the box.

#### Acceptance Criteria

1. THE Website SHALL install and configure shadcn/ui with the `new-york` style variant and a rose/pink primary color theme compatible with the existing Tailwind CSS v4 setup.
2. THE Navbar SHALL use the shadcn/ui `Button` component (variant `ghost`) for navigation links and the shadcn/ui `Sheet` component for the mobile hamburger drawer.
3. THE HeroSection SHALL use the shadcn/ui `Button` component (variant `default`) for the "Book Now" call-to-action.
4. THE ServicesSection SHALL use the shadcn/ui `Card`, `CardHeader`, `CardContent`, and `CardFooter` components to render each service, and the shadcn/ui `Badge` component for price and duration labels.
5. THE BookingSection SHALL use the shadcn/ui `Card` component as the form container, `Input` for text and date/time fields, `Select` for the service dropdown, `Textarea` for the notes field, `Button` for the submit action, and `Label` for all field labels.
6. THE ReviewsSection SHALL use the shadcn/ui `Card` component for each review card and for the ReviewForm container, `Input` for the name field, `Textarea` for the message field, and `Button` for the submit action.
7. THE AboutSection SHALL use the shadcn/ui `Card` component for the content container, `Avatar` for the technician image placeholder, `Badge` for specialty tags, and `Separator` to divide content regions.
8. THE ContactSection SHALL use the shadcn/ui `Card` component for the contact info and form containers, `Input` for the name field, `Textarea` for the message field, and `Button` for the submit action.
9. THE AdminDashboard SHALL use the shadcn/ui `Card` component for each booking entry, `Badge` for the booking status indicator, and `Button` components for the "Mark as Completed", "Mark as Pending", and "Delete" actions.
10. THE Toast system SHALL be replaced with the shadcn/ui `Sonner` (or `Toast`) component, preserving the existing `showToast(message, type)` API so no call sites require changes.
11. WHEN shadcn/ui components are used, THE Website SHALL preserve all existing `data-testid` attributes on the rendered output so that no existing tests require modification.
12. THE Website SHALL produce no TypeScript or build errors after shadcn/ui components are integrated.
