import { useEffect, useMemo, useState } from "react";

const KEY = "trendythreads_wishlist_v1";

export default function useWishlist() {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const set = useMemo(() => new Set(ids.map(String)), [ids]);

  const isWished = (id) => set.has(String(id));

  const toggle = (id) => {
    const s = String(id);
    setIds((prev) => {
      const prevSet = new Set(prev.map(String));
      if (prevSet.has(s)) {
        prevSet.delete(s);
        return Array.from(prevSet);
      }
      prevSet.add(s);
      return Array.from(prevSet);
    });
  };

  return { ids, isWished, toggle };
}
