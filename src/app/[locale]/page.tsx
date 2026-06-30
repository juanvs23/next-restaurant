import { Pages } from "@/components/frontend";
import { getBaseUrl } from "@/utils/getBaseUrl";

export default async function Home() {
  // Fetch gallery images server-side for SEO
  let galleryImages: { src: string; width?: number; height?: number; title?: string }[] = [];
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/frontend/media?category=gallery&category=home&limit=8`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      galleryImages = data.map((m: any) => ({
        src: m.url,
        width: m.width || 400,
        height: m.height || 400,
        title: m.title,
      }));
    }
  } catch {}

  return (
    <main className="mt-10">
      <Pages.Hero />
      <Pages.AboutUs />
      <Pages.MenuHome />
      <Pages.OurChef />
      <Pages.HomeGallery initialImages={galleryImages} />
      <Pages.AwardComponent />
      <Pages.FindUs />
    </main>
  );
}
