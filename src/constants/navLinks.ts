// src/constants/navLinks.ts

// Define the NavLink interface
interface NavLink {
  name: string;
  path: string;
}

// Define the array of navigation links
export const navLinks: NavLink[] = [
  { name: "Home", path: "/" },
  { name: "Section's-CPC", path: "/section_cpc" },
  { name: "Section's-CRPC", path: "/section_crpc" },
  { name: "Section's-HMA", path: "/section_hma" },
  { name: "Section's-IDA", path: "/section_ida" },
  { name: "Section's-IEA", path: "/section_iea" },
  { name: "Section's-IPC", path: "/section_ipc" },
  { name: "Section's-MVA", path: "/section_mva" },
  { name: "Section's-NIA", path: "/section_nia" },
  { name: "Constitution_of_india", path: "/constitution_articles" },
  { name: "Tasks/Notes", path: "/forum" }
];

// Define the Sublink type
interface Sublink {
  name: string;
  path: string;
}

// Define a default NavLink for fallback
const defaultNavLink: NavLink = { name: "Default", path: "#" };

// Separate the home link
export const homeLink: NavLink = navLinks.find(link => link.name === "Home") ?? defaultNavLink;
export const constitutionLink: NavLink = navLinks.find(link => link.name === "Constitution_of_india") ?? defaultNavLink;
export const forumLink: NavLink = navLinks.find(link => link.name === "Tasks/Notes") ?? defaultNavLink;

// Filter and map to create a list of sublinks for sections
export const sectionSublinks: Sublink[] = navLinks
  .filter(link => link.name.startsWith("Section's"))
  .map(link => ({
    name: link.name,
    path: link.path
  }));
