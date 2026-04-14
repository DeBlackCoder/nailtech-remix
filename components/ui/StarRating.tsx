"use client";
interface StarRatingProps { value: number | null; onChange: (rating: number) => void; }
export default function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${star <= (value ?? 0) ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>
          ★
        </button>
      ))}
    </div>
  );
}
