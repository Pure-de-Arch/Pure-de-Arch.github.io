const environments = [
  {
    id: "gnome",
    name: "GNOME",
    type: "de",
    category: "wayland",
    subtype: "stacking",
    cpu: 8,
    ram: 1800,
    hdd: 350,
    description: "Modern, Wayland-alapú, integrált desktop környezet.",
    homepage: "https://www.gnome.org/",
    image: "/assets/images/gnome.png"
  },
  {
    id: "kde",
    name: "KDE Plasma",
    type: "de",
    category: "wayland",
    subtype: "stacking",
    cpu: 6,
    ram: 1500,
    hdd: 500,
    description: "Rendkívül testreszabható, gyors és modern DE.",
    homepage: "https://kde.org/",
    image: "/assets/images/kde.png"
  },
  {
    id: "i3",
    name: "i3 WM",
    type: "wm",
    category: "xorg",
    subtype: "tiling",
    cpu: 1,
    ram: 120,
    hdd: 20,
    description: "Minimalista, gyors, tiling window manager.",
    homepage: "https://i3wm.org/",
    image: "/assets/images/i3.png"
  }
];
