export type NavItem = { href: string; label: string};

export const NAV: NavItem[] = [
  { href: "/home",  label: "home"},
  { href: "/it",    label: "IT Consulting"},
  { href: "/print", label: "3D-Druck"},
  { href: "/chili", label: "Chili & Saatgut"},
  { href: "/met",   label: "Met & Braukunst"},
];

// "/" soll wie diese Sektion behandelt werden:
export const HOME_ALIAS = "/home";
