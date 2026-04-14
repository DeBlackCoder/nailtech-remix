"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/StarRating";
import { toast } from "sonner";

interface Review { _id: string; name: string; message: string; rating?: number; createdAt: string; }

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [msgErr, setMsgErr] = useState("");

  useEffect(() => {
    fetch("/api/comments").then(r => r.json()).then(d => { if (Array.isArray(d)) setReviews(d); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameErr(""); setMsgErr("");
    let valid = true;
    if (!name.trim()) { setNameErr("Name is required"); valid = false; }
    if (!message.trim()) { setMsgErr("Message is required"); valid = false; }
    if (!valid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, rating }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to submit review"); return; }
      toast.success("Review submitted! Thank you.");
      setReviews(r => [data, ...r]);
      setName(""); setMessage(""); setRating(null);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-[#f2f2f2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-3">Reviews</h2>
          <p className="text-[#6a6a6a] text-lg">What our clients say</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader><CardTitle>Leave a Review</CardTitle></CardHeader>
            <CardContent>
              <form data-testid="review-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Hidden input for compat */}
                <input type="hidden" data-testid="review-field-name" value={name} readOnly />

                <div className="relative">
                  <input
                    id="r-name"
                    value={name}
                    onChange={e => { setName(e.target.value); setNameErr(""); }}
                    placeholder=" "
                    className="peer w-full rounded-lg border border-[#c1c1c1] bg-white px-3 pt-5 pb-2 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#ff385c]"
                  />
                  <label htmlFor="r-name" className="absolute left-3 top-3 text-xs text-[#6a6a6a] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs pointer-events-none">
                    Your Name *
                  </label>
                  {nameErr && <p className="text-xs text-red-500 mt-1">{nameErr}</p>}
                </div>

                <div>
                  <p className="text-xs text-[#6a6a6a] mb-1 font-medium">Rating</p>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div className="relative">
                  <textarea
                    data-testid="review-field-message"
                    id="r-message"
                    value={message}
                    onChange={e => { setMessage(e.target.value); setMsgErr(""); }}
                    placeholder=" "
                    rows={4}
                    className="peer w-full rounded-lg border border-[#c1c1c1] bg-white px-3 pt-5 pb-2 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#ff385c] resize-none"
                  />
                  <label htmlFor="r-message" className="absolute left-3 top-3 text-xs text-[#6a6a6a] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs pointer-events-none">
                    Your Review *
                  </label>
                  {msgErr && <p className="text-xs text-red-500 mt-1">{msgErr}</p>}
                </div>

                <Button data-testid="review-submit" type="submit" variant="brand" className="w-full rounded-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews list */}
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <div className="text-center text-[#6a6a6a] py-12">No reviews yet. Be the first!</div>
            ) : (
              reviews.map(r => (
                <Card key={r._id} data-testid="review-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p data-testid="review-name" className="font-semibold text-[#222222]">{r.name}</p>
                        <p data-testid="review-date" className="text-xs text-[#6a6a6a]">
                          {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      {r.rating && (
                        <div data-testid="review-rating" className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-sm ${s <= r.rating! ? "text-amber-400" : "text-gray-200"}`}>★</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p data-testid="review-message" className="text-sm text-[#6a6a6a] leading-relaxed">{r.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
