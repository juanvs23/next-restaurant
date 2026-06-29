import { Pages } from "@/components/frontend";

export default async function Home() {
  return (
    <main className="mt-10">
      <Pages.Hero />
      <Pages.AboutUs />
      <Pages.MenuHome />
      <Pages.OurChef />
      <Pages.HomeGallery />
      <Pages.AwardComponent />
      <Pages.FindUs />
    </main>
  );
}
