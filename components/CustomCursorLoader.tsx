"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function CustomCursorLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Hanya aktif jika perangkat memiliki pointer presisi (mouse desktop)
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (isFine) setEnabled(true);
  }, []);

  if (!enabled) return null;
  return <CustomCursor />;
}
