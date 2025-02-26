import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("videographer", "routes/positions/videographer/page.tsx"),
  route("social-media-manager", "routes/positions/social-media-manager/page.tsx"),
  route("social-media-intern", "routes/positions/social-media-intern/page.tsx"),
  route("production-assistant", "routes/positions/production-assistant/page.tsx"),
  route("content-creator", "routes/positions/content-creator/page.tsx"),
  route("business-analyst", "routes/positions/business-analyst/page.tsx"),
  route("executive-assistant", "routes/positions/executive-assistant/page.tsx"),
] satisfies RouteConfig;
