"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
  isAnchor?: boolean;
  section?: string;
}

export function useUnifiedNavigation() {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Detectar si estamos en la landing page
  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

  // Configuración de navegación unificada
  const getNavItems = (): NavItem[] => {
    if (isHomePage) {
      // Landing page: scroll a secciones
      return [
        { label: "Inicio", href: "#hero", isAnchor: true, section: "hero" },
        { label: "Servicios", href: "#servicios", isAnchor: true, section: "servicios" },
        { label: "Proceso", href: "#proceso", isAnchor: true, section: "proceso" },
        { label: "Proyectos Web", href: "#proyectos", isAnchor: true, section: "proyectos" },
        { label: "Nosotros", href: "#nosotros", isAnchor: true, section: "nosotros" },
        { label: "Testimonios", href: "#testimonios", isAnchor: true, section: "testimonios" },
        { label: "Contacto", href: "#contacto", isAnchor: true, section: "contacto" },
      ];
    } else {
      // Páginas internas: navegación entre rutas
      return [
        { label: "Inicio", href: "/", isAnchor: false },
        { label: "Servicios", href: "/#servicios", isAnchor: false },
        { label: "Proceso", href: "/#proceso", isAnchor: false },
        { label: "Proyectos Web", href: "/#proyectos", isAnchor: false },
        { label: "Nosotros", href: "/#nosotros", isAnchor: false },
        { label: "Testimonios", href: "/#testimonios", isAnchor: false },
        { label: "Contacto", href: "/#contacto", isAnchor: false },
      ];
    }
  };

  // Manejar clics de navegación
  const handleNavigation = (item: NavItem) => {
    if (item.isAnchor && isHomePage) {
      // Scroll suave a sección en landing page
      const element = document.getElementById(item.section || "");
      if (element) {
        element.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
    } else {
      // Navegación normal entre páginas
      window.location.href = item.href;
    }
  };

  // Detectar sección activa en landing page
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = [
        { id: "hero", element: document.getElementById("hero") },
        { id: "servicios", element: document.getElementById("servicios") },
        { id: "proceso", element: document.getElementById("proceso") },
        { id: "proyectos", element: document.getElementById("proyectos") },
        { id: "nosotros", element: document.getElementById("nosotros") },
        { id: "testimonios", element: document.getElementById("testimonios") },
        { id: "contacto", element: document.getElementById("contacto") }
      ];
      
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections.reverse()) {
        if (section.element && scrollPosition >= section.element.offsetTop) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  return {
    isHomePage,
    activeSection,
    navItems: getNavItems(),
    handleNavigation
  };
}
