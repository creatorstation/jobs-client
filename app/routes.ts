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
] satisfies RouteConfig;
