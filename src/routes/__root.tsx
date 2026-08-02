import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a5f3f" },
      { title: "Tumaini Gardens Isinya — Resort, Lodge & Event Venue, Kajiado" },
      { name: "description", content: "Tumaini Gardens Isinya (Tumaini Gardens Resort) in Isinya, Kajiado — accommodation, weddings, conferences & organic farm-to-table dining, 60 km from Nairobi. Book Kenya's serene garden resort." },
      { name: "keywords", content: "Tumaini Gardens Isinya, Tumaini Gardens Isinya resort, Tumaini Gardens Resort Isinya, Tumaini Gardens Resort, Resort in Kenya, Accommodation in Kenya, Hotel booking Kenya, Vacation resort Kenya, Kajiado resort, Isinya lodge, Nairobi day trip, wedding venue Kenya, conference venue Kajiado, organic farm resort Kenya" },
      { name: "author", content: "Tumaini Gardens Resort" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "geo.region", content: "KE-45" },
      { name: "geo.placename", content: "Isinya, Kajiado" },
      { name: "geo.position", content: "-1.6833;36.85" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Tumaini Gardens Resort" },
      { property: "og:locale", content: "en_KE" },
      { property: "og:title", content: "Tumaini Gardens Isinya — Resort & Event Venue, Kajiado, Kenya" },
      { property: "og:description", content: "Serene lodge, weddings, conferences & organic farm-to-table dining 60 km from Nairobi." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tumaini Gardens Isinya — Resort in Kenya" },
      { name: "twitter:description", content: "Serene lodge, weddings, conferences & organic farm-to-table dining 60 km from Nairobi." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "dns-prefetch", href: "https://translate.google.com" },
      { rel: "dns-prefetch", href: "https://api.open-meteo.com" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Resort",
        "@id": "https://tumainigardensresortisinya.co.ke/#resort",
        name: "Tumaini Gardens Resort",
        alternateName: ["Tumaini Gardens Isinya", "Tumaini Gardens Resort Isinya"],
        description: "Serene garden resort, lodge and event venue 60 km from Nairobi along the Nairobi-Namanga Highway.",
        url: "https://tumainigardensresortisinya.co.ke",
        telephone: "+254759473510",
        priceRange: "KES 7,500 – 22,000",
        image: [
          "https://tumainigardensresortisinya.lovable.app/__l5e/assets-v1/ed0bf124-d13d-41f9-8613-78b01b8b9b4e/tumaini-4.jpg",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Off Nairobi-Namanga Highway, near Merishaw School",
          addressLocality: "Isinya",
          addressRegion: "Kajiado",
          postalCode: "00209",
          addressCountry: "KE",
        },
        geo: { "@type": "GeoCoordinates", latitude: -1.6833, longitude: 36.85 },
        sameAs: [
          "https://www.facebook.com/100064759146824",
          "https://www.instagram.com/tumaini.gardens.resort/",
          "https://www.tiktok.com/@tumainigardensresort",
        ],
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Swimming Pool", value: true },
          { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
          { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
          { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
          { "@type": "LocationFeatureSpecification", name: "Organic Farm", value: true },
          { "@type": "LocationFeatureSpecification", name: "Conference Facilities", value: true },
        ],
      }),
    }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
