export type Flavor = {
  id: 'chocolate-chip' | 'snickerdoodle';
  name: string;
  description: string;
  // Allergen list from the owner, e.g. ['milk', 'eggs', 'wheat']. Leave it out until
  // she sends it: the card then asks visitors to check with her. Never guess.
  contains?: string[];
};

// id of the order form's quantity <select> for a flavor. The cookie cards focus it
// after the jump to #order, so OrderForm must render exactly these ids.
export const quantitySelectId = (id: Flavor['id']) => `qty-${id}`;

export const flavors: Flavor[] = [
  {
    id: 'chocolate-chip',
    name: 'Chocolate chip',
    description: 'Golden edges, melty chocolate and a pinch of flaky salt on top.',
  },
  {
    id: 'snickerdoodle',
    name: 'Snickerdoodle',
    description: 'The classic, rolled in cinnamon sugar.',
  },
];
