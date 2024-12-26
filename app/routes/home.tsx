import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "CreatorStation" }, { name: "description" }];
}

export default function Home() {
  return <div></div>;
}
