/** Things a child can find by tapping the living world and the inside of the ger. */
export interface Discovery {
  id: string
  nameMn: string
  nameEn: string
  factMn: string
  factEn: string
  /** key in src/assets/illustrations (animals) — absent for landscape features */
  art?: string
  /** CSS background-position into the world background, for landscape features without art */
  bgPos?: string
  kind: 'animal' | 'landscape' | 'object'
}

export const WORLD_DISCOVERIES: Discovery[] = [
  {
    id: 'world-horse',
    kind: 'animal',
    art: 'horse-hero',
    nameMn: 'АДУУ',
    nameEn: 'Horse',
    factMn: 'Монголчууд хүүхэд насаасаа морь унаж сурдаг. Адуу тал нутгийн хамгийн сайн анд нь.',
    factEn: 'Mongolian children learn to ride when they are very young. The horse is the steppe’s best friend.',
  },
  {
    id: 'world-sheep',
    kind: 'animal',
    art: 'sheep',
    nameMn: 'ХОНЬ',
    nameEn: 'Sheep',
    factMn: 'Хонины ноосоор эсгий хийдэг. Гэрийн ханыг эсгийгээр бүрж дулаан байлгадаг.',
    factEn: 'Wool from sheep is pressed into felt, and felt keeps the ger warm.',
  },
  {
    id: 'world-eagle',
    kind: 'animal',
    art: 'eagle',
    nameMn: 'БҮРГЭД',
    nameEn: 'Golden Eagle',
    factMn: 'Бүргэд өндөр огторгуйд нисч, газар дээрх бүхнийг хардаг. Түүнийг Монголын уулсад харж болно.',
    factEn: 'The golden eagle soars high and sees the whole land below. You can spot them over Mongolia’s mountains.',
  },
  {
    id: 'world-dog',
    kind: 'animal',
    art: 'dog',
    nameMn: 'НОХОЙ',
    nameEn: 'Herding Dog',
    factMn: 'Нохой гэрээ болон малаа харж, хоньчинтой хамт явдаг үнэнч туслах.',
    factEn: 'A loyal helper who watches over the ger and the herd.',
  },
  {
    id: 'world-river',
    kind: 'landscape',
    bgPos: '72% 66%',
    nameMn: 'ГОЛ',
    nameEn: 'River',
    factMn: 'Гол горхи тал нутгийг усаар хангана. Мал сүрэг голын эрэг дагаж бэлчдэг.',
    factEn: 'Rivers bring water to the steppe, and herds graze along their banks.',
  },
  {
    id: 'world-mountains',
    kind: 'landscape',
    bgPos: '22% 38%',
    nameMn: 'УУЛ',
    nameEn: 'Mountains',
    factMn: 'Алс холын уулс талыг тойрон зогсдог. Монголд Хангай, Алтай зэрэг олон сайхан уул бий.',
    factEn: 'Far mountains ring the steppe. Mongolia has the Khangai, the Altai and many more.',
  },
]

/** Objects inside the ger — positions are in the 848×1264 coordinate space of ger-interior.webp */
export interface GerObject extends Discovery {
  cx: number
  cy: number
  r: number
}

export const GER_OBJECTS: GerObject[] = [
  {
    id: 'ger-toono',
    kind: 'object',
    nameMn: 'ТООНО',
    nameEn: 'Toono',
    cx: 430,
    cy: 205,
    r: 92,
    factMn: 'Гэрийн оройн дугариг цонх. Өдрийн гэрэл орж, утаа гарна.',
    factEn: 'The round window at the top of the ger. Daylight comes in and smoke goes out.',
  },
  {
    id: 'ger-uni',
    kind: 'object',
    nameMn: 'УНЬ',
    nameEn: 'Roof poles',
    cx: 700,
    cy: 430,
    r: 80,
    factMn: 'Хана аас тооно хүртэл сунасан урт шонгууд. Наранд цацраг мэт харагддаг.',
    factEn: 'Long poles that stretch from the wall up to the toono, like rays of the sun.',
  },
  {
    id: 'ger-khana',
    kind: 'object',
    nameMn: 'ХАНА',
    nameEn: 'Lattice wall',
    cx: 300,
    cy: 640,
    r: 62,
    factMn: 'Уян торон хана. Гэрээ буулгахдаа нугалж хураадаг.',
    factEn: 'A folding lattice wall. When the family moves, it folds up to travel.',
  },
  {
    id: 'ger-bagana',
    kind: 'object',
    nameMn: 'БАГАНА',
    nameEn: 'Pillar',
    cx: 216,
    cy: 760,
    r: 60,
    factMn: 'Тооногийн доор зогсож, түүнийг дэмждэг будмал багана.',
    factEn: 'A painted pillar that stands under the toono and helps hold it up.',
  },
  {
    id: 'ger-zuuh',
    kind: 'object',
    nameMn: 'ЗУУХ',
    nameEn: 'Stove',
    cx: 425,
    cy: 880,
    r: 86,
    factMn: 'Гэрийн голд байдаг зуух гэрийг дулаацуулж, хоол хийхэд хэрэглэнэ.',
    factEn: 'The stove in the middle of the ger keeps everyone warm and cooks the food.',
  },
  {
    id: 'ger-khuur',
    kind: 'object',
    nameMn: 'МОРИН ХУУР',
    nameEn: 'Morin khuur',
    cx: 556,
    cy: 745,
    r: 74,
    factMn: 'Хоёр утастай, толгой нь морины хэлбэртэй хөгжмийн зэмсэг.',
    factEn: 'A two-stringed instrument whose head is carved in the shape of a horse.',
  },
  {
    id: 'ger-avdar',
    kind: 'object',
    nameMn: 'АВДАР',
    nameEn: 'Painted chest',
    cx: 200,
    cy: 800,
    r: 66,
    factMn: 'Эд зүйл хадгалдаг, хээгээр чимсэн модон авдар.',
    factEn: 'A wooden chest, decorated with patterns, for keeping things safe.',
  },
  {
    id: 'ger-tea',
    kind: 'object',
    nameMn: 'СҮҮТЭЙ ЦАЙ',
    nameEn: 'Milk tea',
    cx: 700,
    cy: 828,
    r: 70,
    factMn: 'Монгол айлд зочин ирвэл сүүтэй цай аягалж өгдөг.',
    factEn: 'When guests arrive in a Mongolian home, they are offered milk tea.',
  },
  {
    id: 'ger-eswgii',
    kind: 'object',
    nameMn: 'ЭСГИЙ ХИВС',
    nameEn: 'Felt rug',
    cx: 425,
    cy: 1055,
    r: 108,
    factMn: 'Хонины ноосоор хийсэн эсгий гэрийн шалыг дулаан, зөөлөн болгодог.',
    factEn: 'Felt made from sheep’s wool makes the floor of the ger warm and soft.',
  },
]
