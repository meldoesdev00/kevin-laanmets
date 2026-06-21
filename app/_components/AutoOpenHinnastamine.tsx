"use client";

import { useEffect } from "react";
import { useHinnastamine } from "./HinnastamineContext";

export default function AutoOpenHinnastamine() {
  const { open } = useHinnastamine();
  useEffect(() => { open(); }, [open]);
  return null;
}
