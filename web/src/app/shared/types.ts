export const categoryNames = [
  'Miyuki',
  'Διάφορες χάντρες',
  'Ημιπολύτιμες',
  'Macrame',
  'Plexiglass',
  'Διάφορα',
  'Εποχιακά',
] as const;

export const categoriesObject = {
  mijuki: { name: 'Mijuki' },
  various_beads: {
    name: 'Διάφορες χάντρες',
    subcategories: {
      glass: { name: 'Γυάλινες' },
      crystals: { name: 'Κρυσταλλάκια' },
      pearls: { name: 'peals' },
    },
  },
  macrame: { name: 'Macrame' },
  plexiglass: { name: 'Plexiglass' },
};

export interface Product {
  id: string;
  name: string;
  description: string;
  pieces: string;
  imageUrl?: string;
  // category:
}
