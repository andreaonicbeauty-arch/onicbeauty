# ONIC Beauty Website Implementation Plan

## Source

Primary content source: https://www.treatwell.es/establecimiento/onic-beauty/

This brief adapts public-facing salon information into a modern, mobile-first website. Verify final business details, direct booking URL, WhatsApp number, and image permissions before launch.

## Business Snapshot

- Brand: ONIC Beauty
- Category: Beauty salon specializing in brows, lashes, facial treatments, microblading, micropigmentation, and rejuvenation treatments.
- Location: Calle de Lombia 6, Madrid, 28009, Spain
- Nearby transit: About 5 minutes walking from Goya metro station.
- Rating: 5.0 based on 12 Treatwell reviews.
- Team highlight: Andreia, rated 5.0.
- Languages: Spanish and English.
- Payment methods: Cash, credit card, debit card.
- Opening hours:
  - Monday to Friday: 11:00-20:00
  - Saturday and Sunday: 11:00-18:00

## Website Goals

1. Make ONIC Beauty feel premium, expert, warm, and trustworthy within the first screen.
2. Convert mobile visitors quickly through WhatsApp, booking, and service browsing.
3. Present services in a scannable way without copying the dense marketplace layout.
4. Use imagery as proof of craft: salon, brows, lashes, skin results, treatment atmosphere.
5. Make location, hours, reviews, and pricing easy to find.

## Mobile-First Strategy

Design from a 360px-wide viewport upward, then enhance for tablet and desktop.

- Sticky top bar on mobile with compact logo/name and primary booking action.
- Floating WhatsApp button fixed at the bottom right on every viewport.
- Bottom spacing on mobile so the WhatsApp button never covers footer actions or text.
- Single-column content on mobile.
- Two-column service/detail sections from tablet upward.
- Wider desktop layout should feel editorial and spacious, not like a marketplace clone.

## Suggested Tech Stack

Use whichever stack is already preferred for the project. If starting from scratch:

- Vite + React + TypeScript
- CSS modules or Tailwind CSS
- lucide-react for interface icons
- Swiper, Embla Carousel, or a lightweight custom carousel for the image slideshow
- Deployed as a static site unless booking/payment logic is added later

If this is intended as a plain static website, use semantic HTML, modern CSS, and a small JavaScript carousel.

## Visual Direction

Style keywords: refined, clean, luminous, expert, beauty studio, Madrid boutique.

Recommended palette:

- Ivory: `#FAF7F2`
- Warm white: `#FFFDFC`
- Ink: `#211D1B`
- Soft clay: `#C8957A`
- Rose taupe: `#B9838F`
- Sage accent: `#7E9278`
- Fine border: `#E8DED7`

Avoid an overly beige or monochrome look by using rose/taupe and sage as functional accents. Keep cards subtle, with radius at 8px or less.

Typography:

- Headings: elegant serif or high-quality display face, for example `Playfair Display`, `Cormorant Garamond`, or similar.
- Body/UI: clean sans-serif, for example `Inter`, `Manrope`, or system sans-serif.
- Do not scale type directly with viewport width.
- Keep letter spacing at `0`.

## Page Structure

### 1. Header

Mobile:

- Brand text: ONIC Beauty
- Compact menu button
- Primary action: Reservar

Desktop:

- Brand
- Navigation links: Servicios, Resultados, Opiniones, Ubicacion, Horario
- CTA button: Reservar ahora

### 2. Hero

Purpose: Immediate trust and conversion.

Content:

- H1: ONIC Beauty
- Supporting copy: Belleza especializada en cejas, pestanas, faciales y micropigmentacion en Madrid.
- Trust row: 5.0 rating, 12 opiniones, Goya/WiZink Center area.
- CTAs:
  - Reservar ahora
  - Escribir por WhatsApp

Visual:

- Full-width image or slideshow, not a decorative SVG.
- Use real salon or treatment imagery where possible.
- On mobile, image appears first or directly behind a readable hero overlay.
- Keep the next section slightly visible below the first viewport.

### 3. Image Slideshow

Use a modern carousel with:

- Swipe support on mobile
- Previous/next icon buttons on desktop
- Pagination dots
- Autoplay optional, but pause on interaction
- Descriptive `alt` text for every image
- Fixed aspect ratios to prevent layout shift

Initial image categories:

- Salon interior or treatment room
- Brow/lash close-up
- Facial treatment atmosphere
- Before/after style result image, only if client-approved

Do not hotlink third-party images in production unless the business owns or licenses them.

### 4. Popular Services

Highlight 5 source services:

- Combo: Brow Lami + Lash Lift + diseno + tinte + Fluid Nutritive
  - Duration: 2h 15m
  - Price: 92 EUR
  - Previous price: 108 EUR
- Diseno de Cejas + depilacion con pinzas + Fluid Nutritive
  - Duration: 45m
  - Price: 15 EUR
- Peeling Natural
  - Duration: 50m
  - Price: 125 EUR
- Lami Brow: laminacion de cejas + tinte + depilacion con pinza + Fluid Nutritive
  - Duration: 1h 30m
  - Price: 49 EUR
- Lash Lift: rizado de pestanas + tinte + Fluid Nutritive
  - Duration: 1h 20m
  - Price: 49 EUR

Card behavior:

- Each card includes name, duration, price, and a small treatment category label.
- Primary action on each card: Reservar.
- Keep card text compact and readable on mobile.

### 5. Service Categories

Use grouped, expandable sections on mobile and a tabbed/category layout on desktop.

Categories from source:

- Phibrows: microblading y micropigmentacion de cejas, desde 125 EUR
- Perfect Brows, 15 EUR
- Philiner: micropigmentacion del delineado de ojos, 290 EUR
- Perfect Lashes, 49 EUR
- Glass Skin, 65 EUR
- Maquillaje y micropigmentacion, 420 EUR
- Lifting y rejuvenecimiento facial, 165 EUR
- Cejas, pestanas y extensiones, desde 49 EUR
- Tratamientos faciales clasicos, 125 EUR

### 6. About

Suggested copy:

ONIC Beauty es un salon de belleza en Madrid especializado en realzar cejas, pestanas y piel con tratamientos precisos, cuidados y personalizados. Su enfoque combina tecnica, detalle y una experiencia cercana para que cada visita se sienta comoda y profesional.

Include short highlights:

- Ambiente acogedor y amigable
- Especialistas en belleza
- Atencion en castellano e ingles
- A pocos minutos del metro Goya

### 7. Reviews

Show:

- Large rating: 5.0
- 12 opiniones verificadas
- Short review excerpts:
  - "Muy contenta con el resultado!"
  - "Muy buena experiencia"
  - "Me ha encantado el resultado"

Use small review cards or a horizontal slider on mobile.

### 8. Team

Feature Andreia:

- Name: Andreia
- Rating: 5.0
- 8 opinions
- Services: facial and beauty treatments

If a photo is unavailable, use a polished placeholder block with initials rather than generic stock portraiture.

### 9. Location And Hours

Include:

- Address: Calle de Lombia 6, Madrid, 28009
- Map embed or static map link
- Metro note: A 5 min a pie de Goya
- Weekly hours
- Buttons:
  - Como llegar
  - Reservar ahora

### 10. Footer

Include:

- ONIC Beauty
- Address
- Booking link
- WhatsApp link
- Social links if provided
- Legal links if this becomes a production site

## Floating WhatsApp Button

Requirement: The WhatsApp icon must always appear floating in the bottom right corner.

Implementation notes:

- Use `position: fixed`
- Place at `right: 16px; bottom: 16px` on mobile
- Increase to `right: 24px; bottom: 24px` on tablet/desktop
- Use `z-index` above content and below modal overlays
- Add `aria-label="Escribir por WhatsApp"`
- Link format: `https://wa.me/<PHONE_NUMBER>?text=<ENCODED_MESSAGE>`
- Replace `<PHONE_NUMBER>` with the verified international number, for example `34XXXXXXXXX`
- Add safe-area padding for iOS:
  - `bottom: calc(16px + env(safe-area-inset-bottom))`

Suggested default message:

Hola ONIC Beauty, me gustaria pedir informacion o reservar una cita.

## Booking Behavior

Until a direct booking system is provided:

- "Reservar ahora" should link to the Treatwell listing.
- WhatsApp should be the fastest human contact channel.
- Service card buttons can either link to Treatwell or prefill WhatsApp text with the selected service.

## Accessibility Requirements

- Semantic headings in order.
- Buttons and links have clear accessible names.
- Carousel controls must be keyboard accessible.
- Images need useful `alt` text.
- Text contrast should pass WCAG AA.
- Do not rely on color alone for active states.
- Respect reduced motion by disabling autoplay/animations under `prefers-reduced-motion`.

## Performance Requirements

- Use optimized image formats: AVIF/WebP where possible.
- Lazy-load non-hero images.
- Preload the hero image if it is local and important.
- Avoid layout shift by setting image dimensions or aspect ratios.
- Keep JavaScript small; carousel should not dominate the bundle.

## SEO And Metadata

Suggested title:

ONIC Beauty Madrid | Cejas, Pestanas, Faciales y Micropigmentacion

Suggested description:

Salon de belleza en Calle de Lombia 6, Madrid. Especialistas en cejas, pestanas, faciales, microblading y micropigmentacion. Reserva tu cita en ONIC Beauty.

Suggested structured data:

- `LocalBusiness` or `BeautySalon`
- Name, address, opening hours, aggregate rating, accepted payment methods, URL, telephone when available

## Content And Asset Gaps

Need from client before final production:

- Verified WhatsApp phone number
- Approved booking URL
- Logo, if available
- Approved salon and treatment photos
- Instagram or social links
- Confirmation of prices and durations
- Legal/privacy/cookie requirements

## Implementation Steps

1. Scaffold the website with the chosen stack.
2. Create global theme tokens: colors, type, spacing, buttons, cards, focus states.
3. Build mobile-first layout sections in this order: header, hero, services, slideshow, reviews, about, team, location, footer.
4. Add floating WhatsApp component globally.
5. Implement responsive carousel with accessible controls.
6. Add service data in a structured local data file.
7. Add SEO metadata and local business schema.
8. Test at 360px, 390px, 768px, 1024px, and desktop widths.
9. Verify that no text overlaps, the WhatsApp button does not cover key content, and the slideshow is usable by touch and keyboard.
10. Replace placeholders with approved phone number, image assets, and final booking link.

## Suggested First Build Milestone

Create a polished one-page responsive website with:

- Hero
- Image slideshow
- Popular services
- Category browser
- Reviews
- About/team
- Location/hours
- Floating WhatsApp CTA

This is enough to launch a strong first version while leaving room for later additions like online booking widgets, gallery filtering, before/after sliders, or multilingual content.
