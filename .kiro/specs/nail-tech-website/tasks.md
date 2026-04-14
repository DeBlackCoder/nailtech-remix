# Implementation Plan: shadcn/ui Overhaul

## Overview

Migrate all UI components to shadcn/ui primitives (new-york style, rose theme, Tailwind CSS v4 compatible). Tasks are ordered to install and configure shadcn/ui first, then migrate the Toast system, then migrate each component, and finally add property-based tests for data-testid preservation.

## Tasks

- [x] 1. Install and configure shadcn/ui
  - Run `npx shadcn@latest init` inside `nailtech/` choosing: style=new-york, base color=rose, CSS variables=yes, TypeScript=yes, components path=components/ui, utils path=lib/utils
  - Run `npx shadcn@latest add button card input label select textarea badge sheet separator avatar sonner` to install all required primitives
  - Verify `nailtech/components/ui/` contains: button.tsx, card.tsx, input.tsx, label.tsx, select.tsx, textarea.tsx, badge.tsx, sheet.tsx, separator.tsx, avatar.tsx, sonner.tsx
  - Verify `nailtech/lib/utils.ts` was created with the `cn()` helper (clsx + tailwind-merge)
  - _Requirements: 14.1_

- [x] 2. Configure Tailwind CSS v4 + shadcn/ui CSS variables
  - Extend `nailtech/app/globals.css` with the shadcn/ui `:root` CSS variable block (--primary, --secondary, --muted, --accent, --destructive, --border, --input, --ring, --radius, --card, --popover and their -foreground variants) using the rose/pink values from the design document
  - Ensure the existing nail-tech palette variables (--background, --foreground) are preserved
  - _Requirements: 14.1, 12.1_

- [x] 3. Migrate Toast system to Sonner
  - [x] 3.1 Add `<Toaster />` from `sonner` to `nailtech/app/layout.tsx` (place it inside `<ToastProvider>` after `{children}`)
    - _Requirements: 14.10_

  - [x] 3.2 Update `nailtech/lib/toast-context.tsx` to call `toast.success()` / `toast.error()` / `toast()` from `sonner` internally while keeping the `showToast(message, type: ToastType)` signature identical; remove the manual toast queue state and the fixed-position container div
    - _Requirements: 14.10_

  - [x] 3.3 Keep `nailtech/components/ui/Toast.tsx` and its `ToastType` export unchanged so `Toast.test.tsx` continues to pass without modification
    - _Requirements: 14.11_

- [ ] 4. Checkpoint — Toast migration
  - Ensure all existing tests still pass (`npm test` in `nailtech/`), ask the user if questions arise.

- [x] 5. Migrate Navbar to shadcn/ui Sheet + Button
  - Replace the manual `menuOpen` state and mobile dropdown `<ul>` with a shadcn/ui `<Sheet>` + `<SheetTrigger>` + `<SheetContent>` drawer
  - Replace each desktop `<button>` nav link with `<Button variant="ghost">` from shadcn/ui
  - Replace each mobile nav link inside the Sheet with `<Button variant="ghost">` that calls `scrollTo()` and closes the sheet via a controlled `open`/`onOpenChange` prop
  - Preserve all link labels and scroll targets unchanged
  - _Requirements: 14.2, 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6. Migrate HeroSection to shadcn/ui Button
  - Replace the `<button data-testid="hero-cta">` with `<Button data-testid="hero-cta" variant="default" size="lg">` from shadcn/ui
  - Preserve `onClick={scrollToBooking}`, all animation styles, and decorative blobs unchanged
  - _Requirements: 14.3, 2.3_

- [x] 7. Migrate ServicesSection to shadcn/ui Card + Badge
  - Replace each service `<div data-testid="service-card">` with `<Card data-testid="service-card" className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">`
  - Wrap service name in `<CardHeader><CardTitle data-testid="service-name">` and description in `<CardContent>`
  - Move price and duration into `<CardFooter>` using `<Badge data-testid="service-price" variant="secondary">` and `<Badge data-testid="service-duration" variant="outline">`
  - Preserve the image area div with `aria-label` and emoji unchanged inside the Card before CardHeader
  - _Requirements: 14.4, 3.2, 3.4_

- [x] 8. Migrate BookingSection to shadcn/ui form primitives
  - Wrap the form in `<Card><CardContent>` as the visual container (replacing the `bg-white/80 ... rounded-3xl` div)
  - Replace each `<label>` with `<Label htmlFor="...">` from shadcn/ui
  - Replace each `<input>` with `<Input data-testid="field-*" ...>` from shadcn/ui; preserve all `name`, `type`, `value`, `onChange`, and error-state class logic
  - Replace the native `<select>` with shadcn/ui `<Select>` controlled via `value`/`onValueChange`; place `data-testid="field-service"` on `<SelectTrigger>`; wrap options in `<SelectContent>` with `<SelectItem>` per service
  - Replace `<textarea>` with `<Textarea data-testid="field-notes" ...>` from shadcn/ui
  - Replace the submit `<button>` with `<Button data-testid="submit-button" type="submit" disabled={submitting}>`
  - Preserve all validation logic, error `<p>` elements with their `data-testid` attributes, and all fetch/toast logic unchanged
  - _Requirements: 14.5, 4.1, 4.2, 4.4_

- [x] 9. Migrate ReviewsSection to shadcn/ui Card + form primitives
  - Wrap the review form in `<Card><CardContent>` (replacing the `bg-white/80 ... rounded-3xl` form wrapper)
  - Replace `<input data-testid="review-field-name">` with `<Input data-testid="review-field-name" ...>`
  - Replace `<textarea data-testid="review-field-message">` with `<Textarea data-testid="review-field-message" ...>`
  - Replace the submit `<button data-testid="review-submit">` with `<Button data-testid="review-submit" ...>`
  - Replace each review `<div data-testid="review-card">` with `<Card data-testid="review-card"><CardContent>`; preserve `data-testid="review-name"`, `data-testid="review-date"`, `data-testid="review-message"`, and `data-testid="review-rating"` on their inner elements
  - Keep `StarRating` component and all fetch/toast/validation logic unchanged
  - _Requirements: 14.6, 6.8_

- [x] 10. Migrate AboutSection to shadcn/ui Card + Avatar + Badge + Separator
  - Wrap the text-side content in `<Card><CardContent>`
  - Replace the image placeholder div with `<Avatar className="w-72 h-80 rounded-3xl"><AvatarFallback>💅</AvatarFallback></Avatar>`
  - Replace each specialty `<li>` with `<Badge variant="outline">` inside a flex-wrap container
  - Add a `<Separator>` between the bio paragraphs and the specialties heading
  - Replace the years-of-experience inline div with `<Badge variant="secondary" className="text-3xl ...">5+</Badge>` alongside the label text
  - _Requirements: 14.7, 7.1, 7.2, 7.3_

- [x] 11. Migrate ContactSection to shadcn/ui Card + form primitives
  - Wrap the contact info block in `<Card><CardContent>` (replacing the `bg-white/80 ... rounded-3xl` div)
  - Wrap the contact form block in `<Card><CardContent>` (replacing the second `bg-white/80 ... rounded-3xl` div)
  - Replace `<input data-testid="contact-field-name">` with `<Input data-testid="contact-field-name" ...>`
  - Replace `<textarea data-testid="contact-field-message">` with `<Textarea data-testid="contact-field-message" ...>`
  - Replace the submit `<button data-testid="contact-submit">` with `<Button data-testid="contact-submit" ...>`
  - Preserve all phone/WhatsApp/Instagram links, map iframe, validation logic, and error `<p>` elements unchanged
  - _Requirements: 14.8, 8.1, 8.2, 8.4_

- [x] 12. Migrate AdminDashboard to shadcn/ui Card + Badge + Button
  - Replace each booking `<div data-testid="booking-card">` with `<Card data-testid="booking-card"><CardContent>`
  - Replace the status `<span data-testid="booking-status">` with `<Badge data-testid="booking-status" variant={booking.status === "completed" ? "default" : "secondary"} className={...}>`; preserve the green/rose color logic via className override
  - Replace "Mark as Completed" `<button>` with `<Button data-testid={\`btn-complete-${booking._id}\`} variant="default" size="sm">`
  - Replace "Mark as Pending" `<button>` with `<Button data-testid={\`btn-pending-${booking._id}\`} variant="secondary" size="sm">`
  - Replace "Delete" `<button>` with `<Button data-testid={\`btn-delete-${booking._id}\`} variant="outline" size="sm">`
  - Preserve `data-testid="admin-loading"`, `data-testid="admin-error"`, and all field-level `data-testid` attributes (booking-name, booking-phone, booking-service, booking-date, booking-time, booking-notes) unchanged
  - _Requirements: 14.9, 5.3, 5.4, 5.5, 5.6_

- [x] 13. Checkpoint — Component migration complete
  - Ensure all existing tests still pass (`npm test` in `nailtech/`), ask the user if questions arise.

- [ ] 14. Add property-based tests for data-testid preservation (Properties 14–17)
  - [ ] 14.1 Write property test for service card data-testid preservation (Property 14)
    - Create `nailtech/test/shadcn-ui.property.test.tsx`
    - **Property 14: shadcn/ui service cards preserve all required data-testid attributes**
    - Use `fc.constantFrom(...services)` to render each service via `ServicesSection` and assert `data-testid="service-card"`, `data-testid="service-name"`, `data-testid="service-price"`, `data-testid="service-duration"` are present with correct values
    - **Validates: Requirements 14.4, 14.11**

  - [ ]* 14.2 Write property test for review card data-testid preservation (Property 15)
    - Add to `nailtech/test/shadcn-ui.property.test.tsx`
    - **Property 15: shadcn/ui review cards preserve all required data-testid attributes**
    - Use `fc.record({ _id: fc.string({minLength:1}), name: fc.string({minLength:1}), message: fc.string({minLength:1}), createdAt: fc.date().map(d => d.toISOString()), rating: fc.option(fc.integer({ min: 1, max: 5 })) })` to render a mocked `ReviewsSection` reviews list and assert `data-testid="review-card"`, `data-testid="review-name"`, `data-testid="review-message"`, `data-testid="review-date"` are present; assert `data-testid="review-rating"` is present when rating is non-null
    - **Validates: Requirements 14.6, 14.11**

  - [ ]* 14.3 Write property test for admin booking card data-testid preservation (Property 16)
    - Add to `nailtech/test/shadcn-ui.property.test.tsx`
    - **Property 16: shadcn/ui admin booking cards preserve all required data-testid attributes**
    - Use `fc.array(fc.record({ _id: fc.string({minLength:1}), name: fc.string({minLength:1}), phone: fc.string({minLength:1}), service: fc.constantFrom("Acrylic","Gel","Pedicure","Nail Art"), date: fc.string({minLength:1}), time: fc.string({minLength:1}), notes: fc.option(fc.string()), status: fc.constantFrom("pending","completed") }), { minLength: 1 })` to mock the fetch response and render `AdminDashboard`; assert `data-testid="booking-card"`, `data-testid="booking-name"`, `data-testid="booking-phone"`, `data-testid="booking-service"`, `data-testid="booking-date"`, `data-testid="booking-time"`, `data-testid="booking-notes"`, `data-testid="booking-status"` are present for each booking
    - **Validates: Requirements 14.9, 14.11**

  - [ ]* 14.4 Write property test for Toast API contract preservation (Property 17)
    - Add to `nailtech/test/shadcn-ui.property.test.tsx`
    - **Property 17: Toast API contract is preserved across Sonner migration**
    - Use `fc.tuple(fc.string({minLength:1}), fc.constantFrom("success","error","info"))` to call `showToast(message, type)` via the `useToast()` hook rendered inside a `ToastProvider`; assert the call does not throw and the Sonner `toast` function is invoked with the correct message
    - **Validates: Requirements 14.10**

- [x] 15. Final checkpoint — Ensure all tests pass
  - Run `npm test` in `nailtech/` and confirm all existing tests (Navbar, HeroSection, ServicesSection, BookingSection, ReviewsSection, AdminDashboard, Toast) plus the new shadcn-ui property tests pass with zero failures.
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- The `nailtech/` subdirectory is the Next.js project root; run all commands from inside it
- shadcn/ui components accept arbitrary `data-*` attributes and forward them to the underlying DOM element — no existing test selectors should break
- The shadcn/ui `Select` component requires `value=""` (not `undefined`) for controlled usage; `BookingSection` already initializes `service: ""`
- Property tests use `fc.assert(fc.property(...), { numRuns: 100 })` minimum and are tagged `// Feature: nail-tech-website, Property N: <property_text>`
- The legacy `Toast.tsx` component is kept intact; only `toast-context.tsx` internals change
