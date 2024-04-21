// app/web-vitals.js
"use client";
import { useReportWebVitals } from "next/web-vitals";
import { usePostHog } from "posthog-js/react";

export function WebVitals() {
  const posthog = usePostHog();

  useReportWebVitals((metric) => {
    // posthog.capture(metric.name, metric);
    switch (metric.name) {
        case 'FCP': {
          if (metric.value > 3000) {
            console.warn("FCP is above the recommended range: 1-3s", metric);
          } else {
            console.log("First Contentful Paint: 1-3s", metric);
          }
          break;
        }
        case 'LCP': {
          if (metric.value > 2500) {
            console.warn("LCP is above the recommended maximum of 2.5s", metric);
          } else {
            console.log("Large Contentful Paint: Should be < 2.5s", metric);
          }
          break;
        }
        case 'CLS': {
          if (metric.value > 0.25) {
            console.warn("CLS is above the recommended range: 0.1-0.25", metric);
          } else {
            console.log("Cumulative Layout Shift: 0.1-0.25", metric);
          }
          break;
        }
        case 'FID': {
          if (metric.value > 300) {
            console.warn("FID is above the recommended range: 100ms - 300ms", metric);
          } else {
            console.log("First Input Delay: 100ms - 300ms", metric);
          }
          break;
        }
        case 'TTFB': {
          if (metric.value > 600) {
            console.warn("TTFB is above the recommended maximum of 600ms", metric);
          } else {
            console.log("TTFB: Time To First Byte < 600ms", metric);
          }
          break;
        }
        case 'INP': {
          if (metric.value > 300) {
            console.warn("INP is above the recommended range: 100-300ms", metric);
          } else {
            console.log("INP: 100-300ms", metric);
          }
          break;
        }
      }
  });

  return null;
}