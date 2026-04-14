# Design Document: Nail Tech Website

## Overview

A full-stack Next.js (App Router) website for a nail technician business. Customers can browse services, book appointments, and leave reviews — all without an account. An admin dashboard lets the business owner manage bookings. The UI is feminine, elegant, and fully mobile-responsive, built with **shadcn/ui** components on top of Tailwind CSS v4. Data is persisted in MongoDB via Mongoose, and the app is deployed on Vercel.

### Key Design Goals

- Single-page feel with smooth scroll navigation between sections
- No authentication required for customers or admin (simple `/admin` route)
- Optimistic UI updates in the admin dashboard (no full page reloads)
- Toast notification system for all async feedback (powered by shadcn/ui Sonner)
- Double-booking prevention enforced at the API layer
- Consistent, accessible UI primitives via shadcn/ui (new-york style, rose/pink theme)
- All existing `data-testid` attributes preserved — zero test modifications required

---

## Architecture

The application follows Next.js App Router conventions with a clear separation between the frontend (React Server/Client Components) and the backend (Route Handlers).

```mermaid
graph TD
    Browser["Browser (Customer / Admin)"]
    NextApp["Next.js App Router"]
    APIRoutes["API Route Handlers\n/api/bookings\n/api/comments"]
    Mongoose["Mongoose ODM"]
    MongoDB["MongoDB Atlas"]

    Browser -->|HTTP / RSC| NextApp
    NextApp -->|fetch()| APIRoutes
    APIRoutes --> Mongoose
    Mongoose --> MongoDB
```

### Directory Structure

```
nailtech/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, ToastProvider)
│   ├── page.tsx                # Homepage (all public sections)
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/
│       ├── bookings/
│       │   ├── route.ts        # GET, POST /api/bookings
│       │   └── [id]/
│       │       └── route.ts    # PATCH, DELETE /api/bookings/[id]
│       └── comments/
│           └── route.ts        # GET, POST /api/comments
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ServicesSection.tsx
│   ├── BookingSection.tsx
│   ├── ReviewsSection.tsx
│   ├── AboutSection.tsx
│   ├── ContactSection.tsx
│   ├── AdminDashboard.tsx
│   └── ui/                     # shadcn/ui generated primitives + custom
│       ├── button.tsx          # shadcn/ui Button
│       ├── card.tsx            # shadcn/ui Card, CardHeader, CardContent, CardFooter
│       ├── input.tsx           # shadcn/ui Input
│       ├── label.tsx           # shadcn/ui Label
│       ├── select.tsx          # shadcn/ui Select
│       ├── textarea.tsx        # shadcn/ui Textarea
│       ├── badge.tsx           # shadcn/ui Badge
│       ├── sheet.tsx           # shadcn/ui Sheet (mobile nav drawer)
│       ├── separator.tsx       # shadcn/ui Separator
│       ├── avatar.tsx          # shadcn/ui Avatar
│       ├── sonner.tsx          # shadcn/ui Sonner (toast)
│       ├── StarRating.tsx      # Custom interactive star selector (unchanged)
│       └── Toast.tsx           # Legacy wrapper — delegates to Sonner
├── lib/
│   ├── mongodb.ts              # Connection singleton
│   ├── toast-context.tsx       # showToast() API — delegates to Sonner internally
│   └── validations.ts          # Shared validation helpers
├── models/
│   ├── Booking.ts
│   └── Comment.ts
└── .env.example
```

---

## shadcn/ui Installation and Configuration

### Installation

shadcn/ui is installed via its CLI into the existing Next.js + Tailwind CSS v4 project:

```bash
npx shadcn@latest init
```

Configuration choices:
- **Style**: `new-york`
- **Base color**: `rose` (maps to the existing rose/pink palette)
- **CSS variables**: enabled (integrates with Tailwind CSS v4 `@theme` block)
- **TypeScript**: yes
- **Components path**: `components/ui`
- **Utils path**: `lib/utils`

Individual components are added on demand:

```bash
npx shadcn@latest add button card input label select textarea badge sheet separator avatar sonner
```

### Tailwind CSS v4 Compatibility

Tailwind CSS v4 uses a CSS-first configuration (`@theme` in `globals.css`) rather than `tailwind.config.js`. shadcn/ui's CSS variable approach is compatible: the generated CSS variables (`--primary`, `--secondary`, `--destructive`, etc.) are declared in the `:root` block and consumed by Tailwind utility classes.

The existing `globals.css` is extended with shadcn/ui's required CSS variable block:

```css
@import "tailwindcss";

:root {
  /* Existing nail-tech palette */
  --background: #fff5f7;
  --foreground: #4a1942;

  /* shadcn/ui CSS variables — rose/pink theme */
  --primary: 346 77% 49%;          /* rose-500 equivalent */
  --primary-foreground: 0 0% 100%;
  --secondary: 340 82% 96%;        /* rose-50 */
  --secondary-foreground: 346 77% 30%;
  --muted: 340 60% 96%;
  --muted-foreground: 346 40% 50%;
  --accent: 340 82% 93%;
  --accent-foreground: 346 77% 30%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 340 30% 88%;
  --input: 340 30% 88%;
  --ring: 346 77% 49%;
  --radius: 0.75rem;               /* matches existing rounded-xl/rounded-2xl aesthetic */
  --card: 0 0% 100%;
  --card-foreground: 346 77% 20%;
  --popover: 0 0% 100%;
  --popover-foreground: 346 77% 20%;
}
```

A `lib/utils.ts` file is created by the CLI providing the `cn()` helper (merges Tailwind classes with `clsx` + `tailwind-merge`).

---

## Components and Interfaces

### Navbar

**shadcn/ui components used**: `Button` (variant `ghost`), `Sheet`, `SheetContent`, `SheetTrigger`

- Sticky (`position: fixed`, `top: 0`, full width, `z-50`)
- Desktop: each nav link rendered as `<Button variant="ghost">` with `onClick` scroll handler
- Mobile (< 768px): hamburger icon wrapped in `<SheetTrigger>` opens a `<Sheet>` drawer from the left/right; each link inside the Sheet is also a `<Button variant="ghost">` that closes the sheet on click
- Client Component (`"use client"`) — Sheet open/close state managed internally by shadcn/ui Sheet

**Migration delta from current implementation**:
- Replace `<button className="...">` nav links → `<Button variant="ghost">`
- Replace manual `menuOpen` state + dropdown → `<Sheet>` + `<SheetContent>`
- All scroll behavior and link order unchanged

### HeroSection

**shadcn/ui components used**: `Button` (variant `default`)

- Full-viewport-height section with gradient background (unchanged)
- Decorative blobs (unchanged)
- "Book Now" CTA: `<Button variant="default" size="lg">` with `onClick={scrollToBooking}`
- Entrance animations via CSS keyframes (unchanged)
- `data-testid="hero-cta"` placed on the `<Button>` element

**Migration delta**: Replace `<button className="...">` → `<Button variant="default" size="lg">`

### ServicesSection

**shadcn/ui components used**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`, `Badge`

- Static services data array unchanged
- Responsive grid unchanged (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Each service rendered as:
  ```
  <Card data-testid="service-card">
    <div> {/* image area */} </div>
    <CardHeader>
      <CardTitle data-testid="service-name">{service.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{service.description}</p>
    </CardContent>
    <CardFooter>
      <Badge data-testid="service-price" variant="secondary">{service.price}</Badge>
      <Badge data-testid="service-duration" variant="outline">⏱ {service.duration}</Badge>
    </CardFooter>
  </Card>
  ```
- Hover effect applied via `className` on the `<Card>`: `hover:shadow-xl hover:scale-105 transition-all duration-300`

### BookingSection (Client Component)

**shadcn/ui components used**: `Card`, `CardContent`, `Input`, `Label`, `Select` + `SelectTrigger` + `SelectContent` + `SelectItem`, `Textarea`, `Button`

- Section background gradient unchanged
- Form wrapped in `<Card><CardContent>`
- Each field: `<Label htmlFor="...">` + `<Input data-testid="field-name" ...>` (or Select/Textarea)
- Service dropdown: shadcn/ui `Select` (controlled via `value`/`onValueChange`)
- Submit: `<Button data-testid="submit-button" type="submit" disabled={submitting}>`
- Inline validation error `<p>` elements with `data-testid` preserved beneath each field
- All form logic, validation, and API calls unchanged

**Note on shadcn/ui Select**: The shadcn/ui `Select` component uses a different controlled API than a native `<select>`. The `value` and `onValueChange` props replace `value`/`onChange`. The `data-testid="field-service"` attribute is placed on the `<SelectTrigger>`.

### ReviewsSection (Client Component)

**shadcn/ui components used**: `Card`, `CardContent`, `Input`, `Textarea`, `Button`

- Review form container: `<Card><CardContent>`
  - Name field: `<Input data-testid="review-field-name">`
  - Message field: `<Textarea data-testid="review-field-message">`
  - Submit: `<Button data-testid="review-submit">`
- Each review card: `<Card data-testid="review-card"><CardContent>`
  - `data-testid="review-name"`, `data-testid="review-date"`, `data-testid="review-message"`, `data-testid="review-rating"` all preserved
- `StarRating` component unchanged (custom, not a shadcn/ui primitive)
- All fetch logic, validation, and state management unchanged

### AboutSection

**shadcn/ui components used**: `Card`, `CardContent`, `Avatar`, `AvatarFallback`, `Badge`, `Separator`

- Two-column layout unchanged
- Image placeholder replaced with `<Avatar>` + `<AvatarFallback>` (emoji 💅)
- Content wrapped in `<Card><CardContent>`
- Specialty tags: each `<li>` replaced with `<Badge variant="outline">`
- `<Separator>` between the bio paragraphs and the specialties list
- Years-of-experience badge: `<Badge variant="secondary">` with large text

### ContactSection (Client Component)

**shadcn/ui components used**: `Card`, `CardContent`, `Input`, `Textarea`, `Button`

- Contact info card: `<Card><CardContent>` (phone, WhatsApp, Instagram links unchanged)
- Contact form card: `<Card><CardContent>`
  - Name: `<Input data-testid="contact-field-name">`
  - Message: `<Textarea data-testid="contact-field-message">`
  - Submit: `<Button data-testid="contact-submit">`
- Map iframe unchanged (conditional on env var)
- All validation logic and toast calls unchanged

### AdminDashboard (Client Component)

**shadcn/ui components used**: `Card`, `CardContent`, `Badge`, `Button`

- Each booking rendered as `<Card data-testid="booking-card"><CardContent>`
  - All `data-testid` attributes on name, phone, service, date, time, notes, status preserved
  - Status indicator: `<Badge data-testid="booking-status" variant={booking.status === "completed" ? "default" : "secondary"}>` (green for completed, rose for pending via className override)
  - "Mark as Completed": `<Button data-testid={btn-complete-${id}} variant="default" size="sm">`
  - "Mark as Pending": `<Button data-testid={btn-pending-${id}} variant="secondary" size="sm">`
  - "Delete": `<Button data-testid={btn-delete-${id}} variant="outline" size="sm">`
- Loading spinner: custom CSS spinner (unchanged) or shadcn/ui skeleton — `data-testid="admin-loading"` preserved
- Error state: `data-testid="admin-error"` preserved

### Toast System (Sonner)

**shadcn/ui components used**: `Sonner` (via `sonner` package)

The existing `showToast(message, type)` API is **fully preserved** — no call sites change.

**Migration approach**:
1. Install `sonner` package (pulled in by `npx shadcn@latest add sonner`)
2. Add `<Toaster />` from `sonner` to `app/layout.tsx` (replaces the manual toast container)
3. Update `lib/toast-context.tsx` to call `toast.success()` / `toast.error()` / `toast()` from `sonner` internally, while keeping the `showToast(message, type)` signature identical
4. The existing `components/ui/Toast.tsx` and `ToastType` export are kept for backward compatibility with `Toast.test.tsx`

```typescript
// lib/toast-context.tsx (updated internals, same public API)
import { toast } from "sonner";

const showToast = useCallback((message: string, type: ToastType) => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else toast(message);
}, []);
```

---

## Data Models

### Booking (Mongoose Schema)

```typescript
interface IBooking {
  _id: ObjectId;
  name: string;        // required
  phone: string;       // required
  service: string;     // required, one of: "Acrylic" | "Gel" | "Pedicure" | "Nail Art"
  date: string;        // required, ISO date string "YYYY-MM-DD"
  time: string;        // required, "HH:MM" 24-hour
  notes?: string;      // optional
  status: "pending" | "completed";  // default: "pending"
}
```

Double-booking check: before inserting, query for an existing booking where `service === req.service && date === req.date && time === req.time && status !== "completed"`. If found, return 409.

### Comment (Mongoose Schema)

```typescript
interface IComment {
  _id: ObjectId;
  name: string;        // required
  message: string;     // required
  rating?: number;     // optional, 1–5
  createdAt: Date;     // default: Date.now
}
```

### MongoDB Connection Singleton (`lib/mongodb.ts`)

```typescript
// Reuses existing connection across hot-reloads in dev and across requests in prod
let cached = global.mongoose ?? { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Service card renders all required fields

*For any* service in the services data array, the rendered service card SHALL contain the service name, price, duration, and an image element.

**Validates: Requirements 3.2**

---

### Property 2: Valid booking submission saves with "pending" status

*For any* valid booking payload (non-empty name, phone, service, date, time), submitting `POST /api/bookings` SHALL persist a record to the database with `status === "pending"` and return a 201 response containing the saved booking.

**Validates: Requirements 4.3, 9.1**

---

### Property 3: Invalid booking payload returns 400

*For any* booking payload with one or more required fields (name, phone, service, date, time) missing or empty, `POST /api/bookings` SHALL return a 400 response with a descriptive error message and SHALL NOT persist any record.

**Validates: Requirements 4.4, 9.5**

---

### Property 4: Duplicate booking returns 409

*For any* booking that already exists in the database (same service, date, and time with non-completed status), a second `POST /api/bookings` request for the same slot SHALL return a 409 response and SHALL NOT create a duplicate record.

**Validates: Requirements 4.5, 9.6**

---

### Property 5: Booking status update round-trip

*For any* existing booking and any valid target status (`"pending"` or `"completed"`), calling `PATCH /api/bookings/[id]` with that status SHALL update the booking's status in the database to the requested value, and a subsequent `GET /api/bookings` SHALL reflect the updated status.

**Validates: Requirements 5.4, 5.5, 9.3**

---

### Property 6: Booking deletion removes record

*For any* existing booking, calling `DELETE /api/bookings/[id]` SHALL remove that booking from the database such that a subsequent `GET /api/bookings` no longer contains a record with that ID.

**Validates: Requirements 5.6, 9.4**

---

### Property 7: Non-existent booking ID returns 404

*For any* ID that does not correspond to an existing booking in the database, both `PATCH /api/bookings/[id]` and `DELETE /api/bookings/[id]` SHALL return a 404 response.

**Validates: Requirements 9.7**

---

### Property 8: Admin dashboard renders all booking fields

*For any* set of bookings returned by the API, the AdminDashboard SHALL render each booking with all required fields visible: customer name, phone number, service, date, time, notes, and status.

**Validates: Requirements 5.3**

---

### Property 9: Valid review submission saves with timestamp

*For any* valid review payload (non-empty name and message, optional rating in 1–5), submitting `POST /api/comments` SHALL persist a record to the database with a `createdAt` timestamp and return a 201 response containing the saved review.

**Validates: Requirements 6.4, 10.1**

---

### Property 10: Reviews are displayed in reverse chronological order

*For any* set of reviews with distinct `createdAt` timestamps, `GET /api/comments` SHALL return them sorted by `createdAt` descending (newest first), and the ReviewsSection SHALL render them in that order.

**Validates: Requirements 6.9, 10.2**

---

### Property 11: Review card renders all required fields

*For any* review in the reviews list, the rendered review card SHALL contain the reviewer name, message, submission date, and star rating (when provided).

**Validates: Requirements 6.8**

---

### Property 12: Invalid comment payload returns 400

*For any* comment payload with missing required fields (name or message) OR a rating value outside the range 1–5, `POST /api/comments` SHALL return a 400 response with a descriptive error message and SHALL NOT persist any record.

**Validates: Requirements 10.3, 10.4**

---

### Property 13: Database connection is reused (idempotence)

*For any* number of calls to `connectDB()` within the same process, the function SHALL return the same Mongoose connection instance without opening additional connections.

**Validates: Requirements 11.4**

---

### Property 14: shadcn/ui service cards preserve all required data-testid attributes

*For any* service object rendered as a shadcn/ui Card, the rendered output SHALL contain `data-testid="service-card"`, `data-testid="service-name"`, `data-testid="service-price"`, and `data-testid="service-duration"` attributes with the correct values.

**Validates: Requirements 14.4, 14.11**

---

### Property 15: shadcn/ui review cards preserve all required data-testid attributes

*For any* review object rendered as a shadcn/ui Card, the rendered output SHALL contain `data-testid="review-card"`, `data-testid="review-name"`, `data-testid="review-message"`, `data-testid="review-date"`, and (when rating is present) `data-testid="review-rating"` attributes.

**Validates: Requirements 14.6, 14.11**

---

### Property 16: shadcn/ui admin booking cards preserve all required data-testid attributes

*For any* booking object rendered as a shadcn/ui Card in the AdminDashboard, the rendered output SHALL contain `data-testid="booking-card"` and all field-level `data-testid` attributes (name, phone, service, date, time, notes, status), plus the appropriate action Button `data-testid` attributes based on the booking's current status.

**Validates: Requirements 14.9, 14.11**

---

### Property 17: Toast API contract is preserved across Sonner migration

*For any* valid `(message, type)` pair where `type ∈ { "success", "error", "info" }`, calling `showToast(message, type)` SHALL trigger a visible toast notification displaying the correct message, regardless of the underlying toast implementation.

**Validates: Requirements 14.10**

---

## Error Handling

### API Layer

| Scenario | HTTP Status | Response Body |
|---|---|---|
| Missing required fields | 400 | `{ error: "Missing required fields: ..." }` |
| Duplicate booking slot | 409 | `{ error: "This time slot is already booked" }` |
| Record not found (PATCH/DELETE) | 404 | `{ error: "Booking not found" }` |
| Database connection failure | 500 | `{ error: "Database connection failed" }` |
| Unexpected server error | 500 | `{ error: "Internal server error" }` |

### Client Layer

- All `fetch` calls are wrapped in `try/catch`
- HTTP 4xx/5xx responses are detected via `response.ok`
- 409 responses trigger a specific "time slot unavailable" toast
- All other failures trigger a generic error toast
- Loading states are shown while requests are in-flight

### shadcn/ui Component Error Boundaries

- shadcn/ui components are pure presentational primitives with no internal async behavior — no additional error boundaries are needed beyond what already exists
- The `Select` component from shadcn/ui requires controlled usage; if `value` is `undefined` (not `""`), it renders in an uncontrolled state — the BookingSection initializes `service: ""` to avoid this

### Environment Variables

- `connectDB()` checks for `MONGODB_URI` at call time and throws a descriptive error if missing
- A `.env.example` file documents all required variables

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

Focus on specific examples, edge cases, and component rendering. All existing unit tests continue to pass without modification because `data-testid` attributes are preserved.

New unit tests added for shadcn/ui migration:
- Navbar renders shadcn/ui Sheet for mobile menu (SheetTrigger present)
- HeroSection CTA button has correct shadcn/ui Button attributes
- BookingSection renders shadcn/ui Input, Select, Textarea, Label, Button components
- AboutSection renders Avatar, Badge, and Separator elements
- ContactSection renders shadcn/ui Card containers, Input, Textarea, Button

### Property-Based Tests (fast-check)

Property-based testing is appropriate for the API layer (pure validation/transformation logic) and for component rendering that varies with input data. Each property test runs a minimum of 100 iterations.

**Library**: [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, works with Vitest)

Each test is tagged:
```
// Feature: nail-tech-website, Property N: <property_text>
```

New property tests for shadcn/ui migration (Properties 14–17):

| Property | Test Focus | fast-check Arbitraries |
|---|---|---|
| P14: Service card data-testid preservation | Render each service card with shadcn/ui Card | `fc.constantFrom(...services)` |
| P15: Review card data-testid preservation | Render each review card with shadcn/ui Card | `fc.record({ name: fc.string({minLength:1}), message: fc.string({minLength:1}), createdAt: fc.date(), rating: fc.option(fc.integer({ min: 1, max: 5 })) })` |
| P16: Admin booking card data-testid preservation | Render each booking card with shadcn/ui Card | `fc.array(fc.record({ name: fc.string({minLength:1}), ..., status: fc.constantFrom("pending","completed") }), { minLength: 1 })` |
| P17: Toast API contract | showToast with any valid (message, type) | `fc.tuple(fc.string({minLength:1}), fc.constantFrom("success","error","info"))` |

Existing properties (P1–P13) are unchanged and continue to pass.

### Smoke Tests

- `next build` produces zero TypeScript and build errors after shadcn/ui integration (Requirement 14.12)
- shadcn/ui components directory (`components/ui/`) contains all required primitive files (Requirement 14.1)

### Test Configuration

```typescript
// vitest.config.ts (unchanged)
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  }
}
```

Property tests use `fc.assert(fc.property(...), { numRuns: 100 })` minimum.

### Migration Compatibility Guarantee

The shadcn/ui migration is designed to be **test-transparent**: every existing `data-testid` attribute is forwarded through the shadcn/ui component's `className` or spread props mechanism. shadcn/ui components accept arbitrary HTML attributes (including `data-*`) and forward them to the underlying DOM element, so no existing test selectors break.
