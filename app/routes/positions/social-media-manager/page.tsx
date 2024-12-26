import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CreatorStation | Social Media Manager" },
    { name: "description" },
  ];
}


export default function SocialMediaManager() {
  return <div>SocialMediaManager</div>;
}
