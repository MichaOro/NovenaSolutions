export type NavItem = { href: string; label: string; header?: string };

export const NAV: NavItem[] = [
  { href: "/me",    label: "Me",              header: "<h1>Me</h1>" },
  { href: "/it",    label: "IT Consulting",   header: "<h1>IT Consulting</h1>" },
  { href: "/print", label: "3D-Druck",        header: "<h1>3D-Druck</h1>" },
  { href: "/chili", label: "Chili & Saatgut", header: "<h1>Chilis</h1>" },
  { href: "/met",   label: "Met & Braukunst", header: "<h1>Met</h1>" },
];

// "/" soll wie diese Sektion behandelt werden:
export const HOME_ALIAS = "/me";
