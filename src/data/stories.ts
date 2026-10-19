import type { Story } from '../types'

export const STORIES: Story[] = [
  {
    id: 'story-horse',
    titleMn: 'АДУУНЫ ХҮЧ',
    titleEn: 'The Spirit of the Horse',
    characterId: 'horse',
    accent: '#C45A3C',
    pages: [
      { text: 'Under a wide open sky, a young herder named Baatar had a horse named Zeel.', caption: 'The steppe, at dawn' },
      { text: 'Zeel could run faster than the wind, carrying Baatar across rivers and hills to find the lost sheep.' },
      { text: 'At the Naadam festival, riders no older than Baatar raced their horses across the open steppe.' },
      { text: 'Zeel galloped harder than ever before — the crowd roared as they crossed the finish line first!' },
      { text: 'That night, Baatar brushed Zeel\'s mane under the stars and whispered thank you to his oldest friend.', caption: 'The end' },
    ],
  },
  {
    id: 'story-camel',
    titleMn: 'ТЭМЭЭНИЙ АЯЛАЛ',
    titleEn: 'The Camel\'s Long Walk',
    characterId: 'camel',
    accent: '#B07A1F',
    pages: [
      { text: 'Deep in the Gobi, a caravan of camels carried families and their gers from one grazing ground to another.', caption: 'The Gobi desert' },
      { text: 'The lead camel, Sartuul, knew the old paths by heart — paths his grandparents had walked, too.' },
      { text: 'When a sandstorm rose, Sartuul closed his long eyelashes and walked steady and calm, guiding the caravan safely.' },
      { text: 'Three days later, they reached a hidden oasis, green and cool, exactly where Sartuul remembered.' },
      { text: 'The family thanked Sartuul with fresh water and a soft blanket — the desert always rewards those who trust it.', caption: 'The end' },
    ],
  },
  {
    id: 'story-sheep',
    titleMn: 'ХОНИНЫ ДУЛААН',
    titleEn: 'The Gift of Warmth',
    characterId: 'sheep',
    accent: '#4F85A3',
    pages: [
      { text: 'Winter was coming, and little Sarnai worried her family\'s ger would be too cold.', caption: 'Autumn on the steppe' },
      { text: 'Her grandmother smiled and led the sheep herd home, their wool thick and soft after a summer of grazing.' },
      { text: 'Together, the family sheared the wool and pressed it into thick felt, layer by layer, by hand.' },
      { text: 'They wrapped the felt around the ger walls — by the first snowfall, their home was warm and snug.' },
      { text: 'Sarnai hugged the gentlest sheep and thanked her for keeping the whole family warm all winter long.', caption: 'The end' },
    ],
  },
  {
    id: 'story-goat',
    titleMn: 'ЯМААНЫ ЗОРИГ',
    titleEn: 'The Bravest Climber',
    characterId: 'goat',
    accent: '#5F7F3F',
    pages: [
      { text: 'High on a rocky mountainside, a small goat named Zolboo loved to climb where no other animal dared.', caption: 'The mountains' },
      { text: 'One day, the tastiest herbs grew on a ledge so narrow the other goats turned back.' },
      { text: 'Zolboo took a breath, found his footing, and climbed — step by careful step — right to the top.' },
      { text: 'From there, he could see the whole valley: gers, rivers, and his family waiting below.' },
      { text: 'He carried the sweetest herbs home, and his soft winter coat later became the softest cashmere scarf.', caption: 'The end' },
    ],
  },
  {
    id: 'story-cow',
    titleMn: 'ҮХЭРИЙН ӨГӨӨМӨР ЗҮРХ',
    titleEn: 'A Generous Heart',
    characterId: 'cow',
    accent: '#9C4128',
    pages: [
      { text: 'Every morning, a gentle cow named Sarlag waited patiently by the ger for milking time.', caption: 'Early morning' },
      { text: 'Her milk became warm suutei tsai for breakfast, and creamy butter for the whole family.' },
      { text: 'In summer, her milk was turned into aaruul, dried sweet and crunchy under the sun.' },
      { text: 'Nothing from Sarlag\'s gifts was ever wasted — the family used every drop with gratitude.' },
      { text: 'At sunset, the children ran to greet her, patting her softly and calling her the heart of the family.', caption: 'The end' },
    ],
  },
  {
    id: 'story-sheep-2027',
    titleMn: '2027 ХОНЬ ЖИЛИЙН ЭЗЭН',
    titleEn: 'The Keeper of 2027',
    characterId: 'sheep-2027',
    accent: '#C0553A',
    pages: [
      { text: 'Once every twelve years, a new guardian steps forward to lead Mongolia\'s zodiac cycle.', caption: 'The 12-Year Journey' },
      { text: 'In 2027, that guardian is the Sheep — gentle, patient, and a symbol of harmony and good fortune.' },
      { text: 'The Sheep Keeper welcomes every new collector to the very first year of a twelve-year adventure.' },
      { text: '"Take my hoofprint as your first stamp," the Sheep says. "Eleven more guardians are waiting for you."' },
      { text: 'And so, your 12-Year Journey across Mongolia begins — one animal, one year, one story at a time.', caption: 'The beginning' },
    ],
  },
  {
    id: 'story-erkhii-mergen',
    titleMn: 'ЭРХИЙ МЭРГЭН',
    titleEn: 'Erkhii Mergen, the Thumb Archer',
    accent: '#183F35',
    requiredCollectionId: 'five-treasures',
    pages: [
      { text: 'Long ago, the sky held not one sun, but seven — and the world burned under their fierce light.', caption: 'A Mongolian legend' },
      { text: 'A mighty archer named Erkhii Mergen boasted he could shoot down every extra sun before nightfall.' },
      { text: 'One by one, his arrows flew true — six suns fell from the sky, and the earth began to cool.' },
      { text: 'But as he aimed at the seventh, a swallow flew past and brushed his arrow — his final shot missed!' },
      { text: 'Ashamed, Erkhii Mergen hid inside a mountain and turned into a marmot — which is why marmots still hide underground to this day.' },
      { text: 'And that is why, even now, Mongolians say the marmot carries the pride — and the lesson — of the greatest archer who ever lived.', caption: 'The end' },
    ],
  },
]

export function getStory(id: string) {
  return STORIES.find((s) => s.id === id)
}
