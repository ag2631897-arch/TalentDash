"use client";

import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Briefcase, Building2, ArrowLeftRight } from "lucide-react";

export function Navigation() {
  return (
    <NavBar
      items={[
        { name: 'Home', url: '/', icon: Home },
        { name: 'Salaries', url: '/salaries', icon: Briefcase },
        { name: 'Companies', url: '/companies', icon: Building2 },
        { name: 'Compare', url: '/compare', icon: ArrowLeftRight },
      ]}
    />
  );
}
