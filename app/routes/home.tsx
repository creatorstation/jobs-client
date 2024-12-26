import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CreatorStation" },
    { name: "description" },
  ];
}

export default function Home() {
  return <div>
    Hello
  </div>
}
