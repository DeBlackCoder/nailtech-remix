import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Work { _id: string; title: string; description: string; imageUrl: string; serviceType?: string; price?: string; }

async function getWorks(): Promise<Work[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/works`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function RecentWorksSection() {
  const works = await getWorks();
  if (!works || works.length === 0) return null;

  return (
    <section id="works" className="py-20 bg-[#f2f2f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-3">Recent Works</h2>
          <p className="text-[#6a6a6a] text-lg">A glimpse of our latest creations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {works.map((work, i) => (
            <div
              key={work._id}
              className={`relative group rounded-[20px] overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "16/9" : "1/1" }}
            >
              <Image
                src={work.imageUrl}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                <h3 className="text-white font-bold text-sm">{work.title}</h3>
                <p className="text-white/80 text-xs mt-1">{work.description}</p>
                {work.price && (
                  <Badge variant="brand" className="mt-2 w-fit">{work.price}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
