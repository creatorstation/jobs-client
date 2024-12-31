import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/layout.tsx", [
    route("videographer", "routes/positions/videographer/page.tsx"),
    route(
      "social-media-manager",
      "routes/positions/social-media-manager/page.tsx"
    ),
  ]),
] satisfies RouteConfig;
