export interface Variety {
  id: string
  name: string
  unit: string
  localPrice: number
  intlPrice: number
  change: number // percent
  grade?: string
}

export interface Commodity {
  id: string
  name: string
  icon: string
  varieties: Variety[]
  category: 'beverage' | 'spice' | 'ingredient'
}

export const COMMODITIES: Commodity[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    icon: '☕',
    category: 'beverage',
    varieties: [
      { id: 'arabica_sca', name: 'Arabica SCA 85+', unit: 'kg', localPrice: 480, intlPrice: 580, change: 2.4, grade: 'Specialty' },
      { id: 'arabica_premium', name: 'Arabica Premium', unit: 'kg', localPrice: 420, intlPrice: 510, change: 1.8, grade: 'Premium' },
      { id: 'robusta', name: 'Robusta', unit: 'kg', localPrice: 280, intlPrice: 340, change: -0.8, grade: 'Commercial' },
      { id: 'cherry', name: 'Green Bean', unit: 'kg', localPrice: 320, intlPrice: 390, change: 1.2, grade: 'Unroasted' },
    ],
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    icon: '🍫',
    category: 'ingredient',
    varieties: [
      { id: 'fine_flavor', name: 'Fine Flavor Beans', unit: 'kg', localPrice: 520, intlPrice: 640, change: 4.2, grade: 'Fine' },
      { id: 'beans', name: 'Cocoa Beans', unit: 'kg', localPrice: 320, intlPrice: 390, change: 2.1, grade: 'Bulk' },
      { id: 'butter', name: 'Cocoa Butter', unit: 'kg', localPrice: 890, intlPrice: 1050, change: 2.0, grade: 'Food Grade' },
      { id: 'powder', name: 'Cocoa Powder', unit: 'kg', localPrice: 280, intlPrice: 340, change: 1.4, grade: 'Dutch Process' },
    ],
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    icon: '🫛',
    category: 'spice',
    varieties: [
      { id: 'green_bold', name: 'Green Bold', unit: 'kg', localPrice: 1600, intlPrice: 1900, change: 5.1, grade: 'AGEB' },
      { id: 'green_card', name: 'Green Premium', unit: 'kg', localPrice: 1400, intlPrice: 1650, change: 2.8, grade: 'AGB' },
      { id: 'bleached', name: 'Bleached', unit: 'kg', localPrice: 1200, intlPrice: 1420, change: 1.5, grade: 'Export' },
    ],
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    icon: '🌿',
    category: 'spice',
    varieties: [
      { id: 'grade_a', name: 'Grade A Pods', unit: 'kg', localPrice: 4200, intlPrice: 5100, change: 1.1, grade: 'Gourmet' },
      { id: 'grade_b', name: 'Grade B Pods', unit: 'kg', localPrice: 2800, intlPrice: 3400, change: 0.8, grade: 'Extraction' },
      { id: 'extract', name: 'Pure Extract', unit: 'litre', localPrice: 1800, intlPrice: 2200, change: 0.4, grade: 'Food Grade' },
    ],
  },
  {
    id: 'pepper',
    name: 'Pepper',
    icon: '🌶️',
    category: 'spice',
    varieties: [
      { id: 'black_malabar', name: 'Malabar Black', unit: 'kg', localPrice: 720, intlPrice: 840, change: 3.1, grade: 'Premium' },
      { id: 'black', name: 'Black Pepper', unit: 'kg', localPrice: 680, intlPrice: 780, change: 1.8, grade: 'Standard' },
      { id: 'white', name: 'White Pepper', unit: 'kg', localPrice: 920, intlPrice: 1050, change: 1.5, grade: 'Premium' },
    ],
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    icon: '🟡',
    category: 'spice',
    varieties: [
      { id: 'alleppey', name: 'Alleppey Finger', unit: 'kg', localPrice: 145, intlPrice: 175, change: 2.3, grade: '6% Curcumin' },
      { id: 'finger', name: 'Finger Turmeric', unit: 'kg', localPrice: 115, intlPrice: 140, change: -1.5, grade: 'Standard' },
      { id: 'powder', name: 'Turmeric Powder', unit: 'kg', localPrice: 180, intlPrice: 215, change: 0.9, grade: 'Food Grade' },
    ],
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    icon: '🪵',
    category: 'spice',
    varieties: [
      { id: 'ceylon', name: 'Ceylon (True)', unit: 'kg', localPrice: 820, intlPrice: 980, change: 1.7, grade: 'Alba' },
      { id: 'cassia', name: 'Cassia', unit: 'kg', localPrice: 340, intlPrice: 410, change: 0.6, grade: 'Grade A' },
    ],
  },
  {
    id: 'tea',
    name: 'Tea',
    icon: '🍵',
    category: 'beverage',
    varieties: [
      { id: 'darjeeling', name: 'Darjeeling First Flush', unit: 'kg', localPrice: 1200, intlPrice: 1500, change: 3.2, grade: 'FTGFOP1' },
      { id: 'assam_ctc', name: 'Assam CTC', unit: 'kg', localPrice: 280, intlPrice: 340, change: 0.4, grade: 'BOP' },
      { id: 'green', name: 'Green Tea', unit: 'kg', localPrice: 520, intlPrice: 630, change: 1.9, grade: 'Premium' },
    ],
  },
]
