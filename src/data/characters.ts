import type { Character } from '../types'

export const CHARACTERS: Character[] = [
  {
    id: 'horse',
    animal: 'horse',
    nameMn: 'АДУУ',
    nameEn: 'Horse',
    collectionId: 'five-treasures',
    number: 1,
    rarity: 'common',
    accent: '#C45A3C',
    tagline: 'Wind of the steppe',
    taglineMn: 'Талын салхи',
    story:
      'Long before cars or trains, the horse carried Mongolia across its endless grasslands. Fast, brave and loyal, Адуу can run for hours without tiring — a true friend of every herder family.',
    storyMn:
      'Машин, галт тэрэг гарахаас өмнө Монголыг уудам талаараа даган явдаг байсан нь адуу. Хурдан, эрэлхэг, үнэнч Адуу цаг цагаар ядрахгүй давхиж чаддаг — малчин айл бүрийн жинхэнэ анд.',
    fact: 'Mongolia has more horses than people — over 4 million of them roam the steppe today.',
    factMn: 'Монголд хүнээс адуу олон байдаг — өнөөдөр 4 сая гаруй адуу талд бэлчиж байна.',
    storyId: 'story-horse',
    gameId: 'game-horse',
    qrCode: 'GN-FT-01',
  },
  {
    id: 'camel',
    animal: 'camel',
    nameMn: 'ТЭМЭЭ',
    nameEn: 'Camel',
    collectionId: 'five-treasures',
    number: 2,
    rarity: 'special',
    accent: '#C5A04A',
    tagline: 'Ship of the desert',
    taglineMn: 'Говийн хөлөг',
    story:
      'In the vast Gobi desert, nothing survives quite like Тэмээ. With two humps full of stored fat, the camel can travel for days without food or water — a true desert treasure.',
    storyMn:
      'Өргөн уудам Говь дунд Тэмээ шиг тэсвэртэй амьтан цөөхөн. Өөх дүүрэн хоёр бөхтэй тэмээ хоол ус авалгүй хэдэн өдөр аялж чаддаг — жинхэнэ говийн эрдэнэ.',
    fact: "A camel's hump does not store water — it stores fat, which helps it survive long desert journeys.",
    factMn: 'Тэмээний бөх усыг биш, өөхийг хадгалдаг — энэ нь урт говийн аяллыг даван туулахад тусалдаг.',
    storyId: 'story-camel',
    gameId: 'game-camel',
    qrCode: 'GN-FT-02',
  },
  {
    id: 'sheep',
    animal: 'sheep',
    nameMn: 'ХОНЬ',
    nameEn: 'Sheep',
    collectionId: 'five-treasures',
    number: 3,
    rarity: 'common',
    accent: '#527D8A',
    tagline: 'Gentle giver of warmth',
    taglineMn: 'Дулааны эзэн',
    story:
      'Soft and gentle, Хонь gives Mongolian families warm wool for winter deel coats and delicious milk for tea. Herds of sheep move across the land following the seasons, guided by their family.',
    storyMn:
      'Зөөлөн, дөлгөөн Хонь монгол айлд өвлийн дээлэнд зориулсан дулаан ноос, амттай сүү өгдөг. Хонин сүрэг улирлыг дагаж, айлын хамт нүүдэллэн явдаг.',
    fact: 'Mongolian felt, used to cover the ger, is made from sheep wool pressed by hand for generations.',
    factMn: 'Гэрийг бүрхэх монгол эсгий хониний ноосыг үеэс үед гараар хийсээр ирсэн.',
    storyId: 'story-sheep',
    gameId: 'game-sheep',
    qrCode: 'GN-FT-03',
  },
  {
    id: 'goat',
    animal: 'goat',
    nameMn: 'ЯМАА',
    nameEn: 'Goat',
    collectionId: 'five-treasures',
    number: 4,
    rarity: 'common',
    accent: '#275A4D',
    tagline: 'Mountain climber',
    taglineMn: 'Уулын авирагч',
    story:
      "Curious and sure-footed, Ямаа can climb the steepest mountain slopes to find the tastiest herbs. Its soft undercoat becomes cashmere — one of Mongolia's most treasured gifts to the world.",
    storyMn:
      'Хөгжилтэй, авхаалжтай Ямаа хамгийн эгц уулын энгэрээр авирч амттай ургамал олдог. Түүний зөөлөн дотоод ноос нь ноолуур болж, дэлхий дахинд Монголын үнэт бэлэг болдог.',
    fact: 'Mongolian cashmere is famous worldwide for being the softest and warmest natural fibre on Earth.',
    factMn: 'Монгол ноолуур дэлхийд хамгийн зөөлөн, дулаан байгалийн утас гэдгээрээ алдартай.',
    storyId: 'story-goat',
    gameId: 'game-goat',
    qrCode: 'GN-FT-04',
  },
  {
    id: 'cow',
    animal: 'cow',
    nameMn: 'ҮХЭР',
    nameEn: 'Cow',
    collectionId: 'five-treasures',
    number: 5,
    rarity: 'common',
    accent: '#9C4128',
    tagline: 'Heart of the family',
    taglineMn: 'Гэр бүлийн зүрх',
    story:
      'Calm and dependable, Үхэр provides milk for airag, aaruul and butter tea every single day. Families care for their cows with great love, and cows return that love with plenty.',
    storyMn:
      'Тайван, найдвартай Үхэр өдөр бүр айраг, ааруул, сүүтэй цайнд зориулж сүү өгдөг. Айл өрх үхэрээ ихээр хайрлаж, үхэр ч хайрыг элбэгээр буцаадаг.',
    fact: 'Mongolian nomads turn cow milk into more than a dozen traditional dairy foods — nothing is wasted.',
    factMn: 'Монгол нүүдэлчид үхрийн сүүгээр арваас олон төрлийн уламжлалт цагаан идээ хийдэг — юу ч дэмий үрэгддэггүй.',
    storyId: 'story-cow',
    gameId: 'game-cow',
    qrCode: 'GN-FT-05',
  },
  {
    id: 'sheep-2027',
    animal: 'sheep',
    nameMn: 'ХОНЬ ЖИЛ',
    nameEn: 'Year of the Sheep',
    collectionId: 'sheep-2027',
    number: 1,
    rarity: 'legendary',
    accent: '#D97D5C',
    tagline: '2027 Limited Edition',
    taglineMn: '2027 Хязгаарлагдмал хэвлэл',
    story:
      "Once every twelve years, the Sheep leads Mongolia's zodiac cycle. This year, Хонь Жил brings gentleness, harmony and good fortune to everyone who welcomes it — a rare guardian to begin your 12-year journey.",
    storyMn:
      '12 жил тутамд нэг удаа Хонь Монголын зурхайн мөчлөгийг тэргүүлдэг. Энэ жил Хонь Жил дөлгөөн, эв найртай, аз хийморийг авчирна — 12 жилийн аяллыг эхлүүлэх ховор хамгаалагч.',
    fact: 'In the Mongolian zodiac, the year you were born shapes a traditional description of your character — 2027 belongs to the gentle, harmonious Sheep.',
    factMn: 'Монгол зурхайд төрсөн жил чинь уламжлалт зан чанарыг тодорхойлдог — 2027 он бол дөлгөөн, эв найртай Хонь жил.',
    storyId: 'story-sheep-2027',
    gameId: 'game-sheep-2027',
    qrCode: 'GN-Y2027-01',
  },
]

export function getCharacter(id: string) {
  return CHARACTERS.find((c) => c.id === id)
}
