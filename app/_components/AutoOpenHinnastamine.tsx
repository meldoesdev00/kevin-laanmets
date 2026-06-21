"use client";

import { useEffect, useRef } from "react";
import { useHinnastamine } from "./HinnastamineContext";

export default function AutoOpenHinnastamine() {
  const { open } = useHinnastamine();
  const tracked = useRef(false);

  useEffect(() => {
    open();

    if (tracked.current) return;
    tracked.current = true;

    const params = new URLSearchParams(window.location.search);
    fetch("/api/hinnastamine/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        utmSource: params.get("utm_source") ?? undefined,
        utmMedium: params.get("utm_medium") ?? undefined,
        utmCampaign: params.get("utm_campaign") ?? undefined,
      }),
    }).catch(() => {});
  }, [open]);

  return null;
}
