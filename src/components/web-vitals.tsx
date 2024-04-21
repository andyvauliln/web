// app/web-vitals.js
"use client";
import { useReportWebVitals } from "next/web-vitals";
import { usePostHog } from "posthog-js/react";

export function WebVitals() {
    const posthog = usePostHog();

    useReportWebVitals((metric) => {

        if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_IS_PROFILER_ENABLED === "true") {
            posthog.capture(metric.name, metric.rating, metric.value);
        }
        else if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_IS_PROFILER_ENABLED === "true") {

            switch (metric.name) {
                case 'FCP': {
                    if (metric.value > 3000) {
                        console.warn(`${metric.name} ${metric.rating} ${(metric.value / 1000).toFixed(4)}s: Good 1-3s`);
                    } else {
                        console.log(`${metric.name} ${metric.rating} ${(metric.value / 1000).toFixed(4)}s: Good 1-3s`);
                    }
                    break;
                }
                case 'LCP': {
                    if (metric.value > 2500) {
                        console.warn(`${metric.name} ${metric.rating} ${(metric.value / 1000).toFixed(4)}s is above the recommended maximum of 2.5s`);
                    } else {
                        console.log(`${metric.name} ${metric.rating} ${(metric.value / 1000).toFixed(4)}s: Should be < 2.5s`);
                    }
                    break;
                }
                case 'CLS': {
                    if (metric.value > 0.25) {
                        console.warn(`${metric.name} ${metric.rating} ${metric.value}: is above the recommended range: 0.1-0.25`);
                    } else {
                        console.log(`${metric.name} ${metric.rating} ${metric.value}: 0.1-0.25`);
                    }
                    break;
                }
                case 'FID': {
                    if (metric.value > 300) {
                        console.warn(`${metric.name} ${metric.rating} ${metric.value}ms is above the recommended range: 100ms - 300ms`);
                    } else {
                        console.log(`${metric.name} ${metric.rating} ${metric.value}ms: 100ms - 300ms`);
                    }
                    break;
                }
                case 'TTFB': {
                    if (metric.value > 600) {
                        console.warn(`${metric.name} ${metric.rating} ${(metric.value / 1000).toFixed(4)}s is above the recommended maximum of 600ms`);
                    } else {
                        console.log(`${metric.name} ${metric.rating} ${(metric.value / 1000).toFixed(4)}s: Time To First Byte < 600ms`);
                    }
                    break;
                }
                case 'INP': {
                    if (metric.value > 300) {
                        console.warn(`${metric.name} ${metric.rating} ${metric.value}ms is above the recommended range: 100-300ms`);
                    } else {
                        console.log(`${metric.name} ${metric.rating} ${metric.value}ms: 100-300ms`);
                    }
                    break;
                }
            }
        }
    });

    return null;
}