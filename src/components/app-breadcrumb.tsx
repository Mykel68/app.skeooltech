"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBreadcrumb() {
  const pathname = usePathname(); // e.g. /app/sub/123e4567-e89b-12d3-a456-426614174000

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !isUUIDorRandom(segment)); // remove UUIDs or hashes

  return (
    <Breadcrumb>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = decodeURIComponent(segment).replace(/-/g, " ");

        return (
          <BreadcrumbItem key={href}>
            {!isLast ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={href} className="capitalize">
                    {label}
                  </Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <span className="capitalize text-muted-foreground">{label}</span>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

// ✅ Utility function to ignore UUIDs / hashes
function isUUIDorRandom(segment: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const randomStringRegex = /^[0-9a-z]{10,}$/i; // e.g. short IDs, hashes, slugs
  return uuidRegex.test(segment) || randomStringRegex.test(segment);
}
