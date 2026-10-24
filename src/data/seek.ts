import { GER_OBJECTS, WORLD_DISCOVERIES } from './discoveries'

/** An ellipse in the 848×1264 coordinate space of a scene painting. */
export interface Area {
  cx: number
  cy: number
  rx: number
  ry: number
}

export interface SeekItem {
  id: string
  nameMn: string
  nameEn: string
  riddleMn: string
  factMn: string
  factEn: string
  /** one or more places on the painting where this can be tapped (a crowd, a pair of animals, an oasis…) */
  areas: Area[]
}

export interface SeekScene {
  id: string
  nameMn: string
  nameEn: string
  taglineMn: string
  /** key in src/assets/illustrations */
  art: string
  accent: string
  /** CSS object-position that frames the hub thumbnail */
  thumbPos: string
  items: SeekItem[]
}

export const SEEK_W = 848
export const SEEK_H = 1264
/** how many things a child looks for in one round */
export const ROUND_SIZE = 6

const a = (cx: number, cy: number, rx: number, ry: number): Area => ({ cx, cy, rx, ry })

const GER_RIDDLES: Record<string, string> = {
  'ger-toono': 'Гэрийн оройд байдаг дугариг. Гэрэл орж, утаа гардаг. Юу вэ?',
  'ger-uni': 'Оройноос ханан дээр нарны цацраг шиг сунасан урт шонгууд. Юу вэ?',
  'ger-khana': 'Нугалж хураадаг, торон гэрийн хэрэм. Юу вэ?',
  'ger-bagana': 'Тооногийн доор зогсож, түүнийг дэмждэг будмал зүйл. Юу вэ?',
  'ger-zuuh': 'Гэрийн голд байж гэрийг дулаацуулж, хоол чанадаг. Юу вэ?',
  'ger-khuur': 'Хоёр утастай, толгой нь морины хэлбэртэй хөгжим. Юу вэ?',
  'ger-avdar': 'Хээтэй, модон, эд зүйлээ хадгалдаг. Юу вэ?',
  'ger-tea': 'Зочин ирэхэд аягалж өгдөг халуун цагаан ундаа. Юу вэ?',
  'ger-eswgii': 'Хонины ноосоор хийсэн, шалан дээр дэвссэн зөөлөн зүйл. Юу вэ?',
}

const gerItems: SeekItem[] = GER_OBJECTS.map((o) => ({
  id: o.id,
  nameMn: o.nameMn,
  nameEn: o.nameEn,
  riddleMn: GER_RIDDLES[o.id] ?? 'Гэрт байдаг нэг зүйл. Юу вэ?',
  factMn: o.factMn,
  factEn: o.factEn,
  areas: [a(o.cx, o.cy, o.r, o.r)],
}))

function fromWorld(id: string, riddleMn: string, areas: Area[]): SeekItem {
  const d = WORLD_DISCOVERIES.find((w) => w.id === id)!
  return { id, nameMn: d.nameMn, nameEn: d.nameEn, riddleMn, factMn: d.factMn, factEn: d.factEn, areas }
}

export const SEEK_SCENES: SeekScene[] = [
  {
    id: 'ger',
    nameMn: 'Гэрийн дотор',
    nameEn: 'Inside the Ger',
    taglineMn: 'Гэрийн нууц булан бүрийг ол',
    art: 'ger-interior',
    accent: '#9C4128',
    thumbPos: '50% 38%',
    items: gerItems,
  },
  {
    id: 'steppe',
    nameMn: 'Тал нутаг',
    nameEn: 'The Steppe',
    taglineMn: 'Гэрийн гадаа тал дээр юу байна?',
    art: 'world-scene',
    accent: '#3F7A4F',
    thumbPos: '50% 62%',
    items: [
      fromWorld('world-eagle', 'Тэнгэрт өндөр эргэлдэж, доорх бүхнийг хардаг шувуу. Хэн бэ?', [a(245, 235, 68, 52)]),
      {
        id: 'steppe-ger',
        nameMn: 'ГЭР',
        nameEn: 'Ger',
        riddleMn: 'Цагаан эсгийгээр бүрсэн, дугуй нүүдэлчний байшин. Юу вэ?',
        factMn: 'Гэрийг нэг өдрийн дотор буулгаж, дахин барьж болдог. Хаалга нь ихэвчлэн урагшаа харсан байдаг.',
        factEn: 'A ger can be taken down and rebuilt in a single day. Its door usually faces south.',
        areas: [a(425, 655, 235, 120)],
      },
      {
        id: 'steppe-door',
        nameMn: 'ГЭРИЙН ХААЛГА',
        nameEn: 'Ger door',
        riddleMn: 'Гэрт орох улбар шар, хээтэй хаалга. Юу вэ?',
        factMn: 'Гэрийн хаалга намхан тул орохдоо бөхийж, босгыг гишгэхгүй гэж заадаг.',
        factEn: 'The ger door is low, so people bow when they enter — and never step on the threshold.',
        areas: [a(425, 745, 68, 82)],
      },
      fromWorld('world-sheep', 'Ноосоор нь эсгий хийдэг, цагаан сэвсгэр мал. Хэн бэ?', [a(115, 800, 120, 90)]),
      fromWorld('world-horse', 'Эмээлтэй, бэлчээрт өвс идэж буй хурдан мал. Хэн бэ?', [a(715, 745, 115, 125)]),
      {
        id: 'steppe-boy',
        nameMn: 'ХҮҮ',
        nameEn: 'Boy',
        riddleMn: 'Гэрийн өмнө шагай барьж, малгайтай хүү. Хэн бэ?',
        factMn: 'Монгол дээл бүсээр бүслэгддэг тул дулаахан, хөдөлгөөнд эвтэйхэн байдаг.',
        factEn: 'A Mongolian deel is tied with a sash, so it is warm and easy to move in.',
        areas: [a(320, 885, 78, 100)],
      },
      {
        id: 'steppe-girl',
        nameMn: 'ОХИН',
        nameEn: 'Girl',
        riddleMn: 'Хоёр гэзэгтэй, толгойдоо мөнгөн гоёлтой охин. Хэн бэ?',
        factMn: 'Монгол охид хээтэй дээл өмсөж, толгойгоо мөнгөн гоёлоор чимдэг заншилтай.',
        factEn: 'Mongolian girls traditionally wear patterned deels and decorate their hair with silver ornaments.',
        areas: [a(545, 905, 72, 100)],
      },
      fromWorld('world-dog', 'Гэрээ болон малаа харж, үнэнч суудаг хар цагаан амьтан. Хэн бэ?', [a(695, 1030, 105, 50)]),
      fromWorld('world-shagai', 'Хүүхдүүдийн тоглодог жижиг цагаан яс. Юу вэ?', [a(432, 1022, 98, 36)]),
      {
        id: 'steppe-flowers',
        nameMn: 'ЦЭЦЭГ',
        nameEn: 'Wildflowers',
        riddleMn: 'Зуны тал нутгийг өнгө өнгөөр чимдэг жижиг ургамал. Юу вэ?',
        factMn: 'Монгол нутагт зуны улиралд олон зуун төрлийн цэцэг ургадаг.',
        factEn: 'Hundreds of kinds of flowers bloom across Mongolia in summer.',
        areas: [a(70, 1090, 90, 150)],
      },
      fromWorld('world-river', 'Тал дундуур мурилзан урсдаг цэнгэг ус. Юу вэ?', [a(108, 648, 112, 26), a(740, 622, 112, 12)]),
      fromWorld('world-mountains', 'Алс холд цэнхэрээр харагдах өндөр толгод. Юу вэ?', [a(140, 545, 150, 40), a(620, 555, 100, 24)]),
    ],
  },
  {
    id: 'gobi',
    nameMn: 'Говь',
    nameEn: 'The Gobi',
    taglineMn: 'Элсэн цөлийн нууцыг нээ',
    art: 'seek-gobi',
    accent: '#8F6217',
    thumbPos: '50% 55%',
    items: [
      {
        id: 'gobi-eagle',
        nameMn: 'БҮРГЭД',
        nameEn: 'Golden eagle',
        riddleMn: 'Улаан хадны орой дээр суугаад холыг ажиглаж буй том шувуу. Хэн бэ?',
        factMn: 'Бүргэд өндөр хад, толгод дээр суугаад хол газрыг ажиглаж байдаг.',
        factEn: 'Eagles perch on high rocks and watch the land far below.',
        areas: [a(165, 218, 55, 62)],
      },
      {
        id: 'gobi-redrock',
        nameMn: 'УЛААН ХАД',
        nameEn: 'Red cliff',
        riddleMn: 'Нарны гэрэлд улаанаар дүрэлзэж харагдах том чулуулаг. Юу вэ?',
        factMn: 'Говийн улаан хад нарны гэрэлд дүрэлзэж харагддаг. Баянзагаас динозаврын өндөг олдож байсан.',
        factEn: 'The Gobi’s red cliffs glow in the sun. Dinosaur eggs were once found at Bayanzag.',
        areas: [a(100, 400, 125, 150)],
      },
      {
        id: 'gobi-ger',
        nameMn: 'ГЭР',
        nameEn: 'Ger',
        riddleMn: 'Алс холд утаа униргасан цагаан гэр. Юу вэ?',
        factMn: 'Говийн айлууд ус, бэлчээр хайж нүүдэг. Гэр хөнгөн тул хурдан нүүнэ.',
        factEn: 'Gobi families move to find water and grass. A ger is light, so moving is quick.',
        areas: [a(700, 305, 58, 48)],
      },
      {
        id: 'gobi-gazelle',
        nameMn: 'ЗЭЭР',
        nameEn: 'Gazelles',
        riddleMn: 'Урт хөлтэй, жижиг эвэртэй, сүргээрээ бэлчдэг хөнгөн амьтан. Хэн бэ?',
        factMn: 'Зээр маш хурдан. Цагт 60 гаруй км-ийн хурдтай гүйж чаддаг.',
        factEn: 'Gazelles are very fast — they can run over 60 km an hour.',
        areas: [a(450, 400, 135, 70)],
      },
      {
        id: 'gobi-saxaul',
        nameMn: 'ЗАГ',
        nameEn: 'Saxaul',
        riddleMn: 'Хуурай элсэнд ургадаг, нарийн мөчиртэй ногоон бут. Юу вэ?',
        factMn: 'Заг мод усгүй говьд ургаж, элсийг салхинд хөдөлгөхгүй барьж өгдөг.',
        factEn: 'Saxaul grows in the dry Gobi and helps hold the sand in place.',
        areas: [a(380, 620, 100, 80)],
      },
      {
        id: 'gobi-khulan',
        nameMn: 'ХУЛАН',
        nameEn: 'Wild ass',
        riddleMn: 'Илжигтэй төстэй боловч зэрлэг, говийн талаар явдаг хоёр амьтан. Хэн бэ?',
        factMn: 'Хулан бол Монголын говийн зэрлэг илжиг. Тэд маш хурдан гүйдэг.',
        factEn: 'The khulan is Mongolia’s wild ass of the Gobi, and it runs very fast.',
        areas: [a(650, 690, 160, 100)],
      },
      {
        id: 'gobi-camel',
        nameMn: 'ТЭМЭЭ',
        nameEn: 'Bactrian camel',
        riddleMn: 'Нуруундаа хоёр бөхтэй, элсэнд хэвтэж буй том амьтан. Хэн бэ?',
        factMn: 'Хоёр бөхт тэмээ говийн хамгийн сайн тээвэр. Усгүй олон хоног явж чаддаг.',
        factEn: 'The two-humped camel is the Gobi’s best traveller and can go many days without water.',
        areas: [a(265, 890, 205, 125)],
      },
      {
        id: 'gobi-oasis',
        nameMn: 'БУЛАГ',
        nameEn: 'Oasis',
        riddleMn: 'Элсэн дунд ногоон мод, цэнхэр усны жижиг нуур. Юу вэ?',
        factMn: 'Говьд булаг, нуурын эрэг ногоон оазис болдог. Мал, зэрлэг амьтан ус ууж ирдэг.',
        factEn: 'In the Gobi, springs make green oases where animals come to drink.',
        areas: [a(650, 1085, 230, 95), a(750, 925, 100, 80)],
      },
      {
        id: 'gobi-sun',
        nameMn: 'НАР',
        nameEn: 'Sun',
        riddleMn: 'Өдөр бүр тэнгэрт гарч, дулаан гэрэл өгдөг. Юу вэ?',
        factMn: 'Говьд нар хүчтэй гийдэг тул өдөр халуун, шөнө хүйтэн байдаг.',
        factEn: 'The Gobi sun is strong: days are hot and nights are cold.',
        areas: [a(505, 95, 55, 55)],
      },
      {
        id: 'gobi-rocks',
        nameMn: 'ХАД ЧУЛУУ',
        nameEn: 'Rocks',
        riddleMn: 'Элсэн дээр овоорсон хүрэн өнгийн том чулуунууд. Юу вэ?',
        factMn: 'Говийн хад чулууг салхи, элс олон жил цохиж янз бүрийн хэлбэртэй болгодог.',
        factEn: 'Wind and sand shape Gobi rocks over many years.',
        areas: [a(690, 490, 150, 95)],
      },
      {
        id: 'gobi-reeds',
        nameMn: 'ХУЛС',
        nameEn: 'Reeds',
        riddleMn: 'Усны ойролцоо ургадаг өндөр, шаргал өвс. Юу вэ?',
        factMn: 'Хулс ус ойрхон газар ургадаг. Хулс харагдвал ус ойрхон гэсэн үг.',
        factEn: 'Reeds grow near water — if you see them, water is close.',
        areas: [a(790, 1190, 55, 70)],
      },
    ],
  },
  {
    id: 'naadam',
    nameMn: 'Наадам',
    nameEn: 'Naadam Festival',
    taglineMn: 'Эрийн гурван наадмын талбай',
    art: 'seek-naadam',
    accent: '#B34A2F',
    thumbPos: '50% 48%',
    items: [
      {
        id: 'naadam-archer',
        nameMn: 'СУР ХАРВАГЧ',
        nameEn: 'Archer',
        riddleMn: 'Нумаа татаж, байг онох гэж байгаа дээлтэй хүн. Хэн бэ?',
        factMn: 'Сур харваа нь Эрийн гурван наадмын нэг. Нум сумаар байг онохыг хичээнэ.',
        factEn: 'Archery is one of the “three manly games” of Naadam: hit the target with a bow and arrow.',
        areas: [a(165, 435, 100, 150)],
      },
      {
        id: 'naadam-wrestlers',
        nameMn: 'БӨХ',
        nameEn: 'Wrestlers',
        riddleMn: 'Бие биеэ бариад хүчээ сорьж буй хоёр хүчтэн. Хэн бэ?',
        factMn: 'Бөх барилдаанд хөл, гараас бусад биеэрээ газар хүрсэн нь ялагдана.',
        factEn: 'In Mongolian wrestling, whoever touches the ground with anything but hands and feet loses.',
        areas: [a(425, 640, 180, 150)],
      },
      {
        id: 'naadam-jockey',
        nameMn: 'МОРЬ УНААЧ',
        nameEn: 'Young jockey',
        riddleMn: 'Хурдан мориор давхиж буй жижигхэн унаач. Хэн бэ?',
        factMn: 'Хурдан морины уралдаанд 5–13 насны хүүхдүүд морь унадаг.',
        factEn: 'In the horse races, the riders are children about 5 to 13 years old.',
        areas: [a(640, 1000, 175, 150)],
      },
      {
        id: 'naadam-banner',
        nameMn: 'ТУГ',
        nameEn: 'Banner',
        riddleMn: 'Өндөр шонгоос олон өнгийн зүүлт унжсан зүйл. Юу вэ?',
        factMn: 'Туг бол хүч чадал, нэр хүндийн бэлгэдэл. Наадмын талбайд өндөр тугнууд мандуулдаг.',
        factEn: 'A banner is a sign of pride and strength. Tall banners are raised at Naadam.',
        areas: [a(680, 170, 115, 140)],
      },
      {
        id: 'naadam-gers',
        nameMn: 'ГЭРҮҮД',
        nameEn: 'Gers',
        riddleMn: 'Алсад цуглаж зогссон цагаан гэрүүд. Юу вэ?',
        factMn: 'Наадмын газар цагаан гэрүүд мандаж, зочдыг угтдаг. Зочинд сүүтэй цай өргөдөг.',
        factEn: 'White gers rise at the festival to welcome guests, who are offered milk tea.',
        areas: [a(680, 375, 150, 50)],
      },
      {
        id: 'naadam-targets',
        nameMn: 'НИШАН',
        nameEn: 'Targets',
        riddleMn: 'Сум онох гэсэн гурван өнгөт дугуй самбар. Юу вэ?',
        factMn: 'Сур харваачид холоос ч байг ононо. Нүд, гараа маш сайн зохицуулдаг.',
        factEn: 'Archers can hit targets from far away. Their eyes and hands work together beautifully.',
        areas: [a(370, 385, 85, 45)],
      },
      {
        id: 'naadam-shagai',
        nameMn: 'ШАГАЙН ТОГЛООМ',
        nameEn: 'Shagai game',
        riddleMn: 'Зүлгэн дээр суугаад яс шидэж тоглож буй гурван хүүхэд. Хэн бэ?',
        factMn: 'Шагайн дөрвөн талыг морь, тэмээ, хонь, ямаа гэж нэрлэдэг.',
        factEn: 'The four sides of a shagai are called horse, camel, sheep and goat.',
        areas: [a(235, 1090, 190, 105)],
      },
      {
        id: 'naadam-crowd',
        nameMn: 'ХАРАГЧИД',
        nameEn: 'Spectators',
        riddleMn: 'Алга ташиж баярлан үзэж байгаа хоёр талын олон хүн. Хэн бэ?',
        factMn: 'Монголын Наадам 2010 онд ЮНЕСКО-гийн соёлын биет бус өвд бүртгэгдсэн.',
        factEn: 'In 2010, UNESCO recognised Naadam as part of humanity’s intangible cultural heritage.',
        areas: [a(85, 765, 95, 185), a(770, 690, 90, 190)],
      },
    ],
  },
  {
    id: 'winter',
    nameMn: 'Өвлийн өргөө',
    nameEn: 'Winter Camp',
    taglineMn: 'Цастай хөдөөгийн гэр',
    art: 'seek-winter',
    accent: '#3F7898',
    thumbPos: '50% 45%',
    items: [
      {
        id: 'winter-horse',
        nameMn: 'МОРЬ',
        nameEn: 'Horse',
        riddleMn: 'Хээтэй хөнжил нөмөрсөн, гэрийн хажууд зогсох хүрэн амьтан. Хэн бэ?',
        factMn: 'Монгол адуу өвлийн хүйтэнд ч гадаа бэлчиж, туурайгаараа цас ухаж өвс олдог.',
        factEn: 'Mongolian horses graze outside all winter, digging through snow with their hooves.',
        areas: [a(182, 527, 125, 118)],
      },
      {
        id: 'winter-ger',
        nameMn: 'ГЭР',
        nameEn: 'Ger',
        riddleMn: 'Цасан дунд гэрэлтэж буй цагаан бөөрөнхий байшин. Юу вэ?',
        factMn: 'Өвөлд гэрийг олон давхар эсгийгээр бүрж дулаан байлгадаг.',
        factEn: 'In winter the ger is wrapped in many layers of felt to keep it warm.',
        areas: [a(520, 555, 225, 150)],
      },
      {
        id: 'winter-door',
        nameMn: 'ХААЛГА',
        nameEn: 'Door',
        riddleMn: 'Дотроосоо шар гэрэл тусдаг улбар шар хаалга. Юу вэ?',
        factMn: 'Гэрийн хаалга урагшаа харсан байдаг тул өвөл ч нарны гэрэл түрүүлж ордог.',
        factEn: 'A ger’s door faces south, so even in winter the sunlight comes in first.',
        areas: [a(482, 630, 60, 80)],
      },
      {
        id: 'winter-argal',
        nameMn: 'АРГАЛ',
        nameEn: 'Dung fuel',
        riddleMn: 'Гэрийн хажууд овоолсон, түлээ болдог хатаасан хүрэн тоосго. Юу вэ?',
        factMn: 'Хатаасан малын баас болох аргал нь гэрийг халаах түлш болдог.',
        factEn: 'Dried animal dung, called argal, is burned to heat the ger.',
        areas: [a(260, 680, 75, 65)],
      },
      {
        id: 'winter-dog',
        nameMn: 'НОХОЙ',
        nameEn: 'Dog',
        riddleMn: 'Хаалганы дэргэд сууж буй хар цагаан манаач. Хэн бэ?',
        factMn: 'Нохой гэрээ болон малаа харж, хоньчинтой хамт явдаг үнэнч туслах.',
        factEn: 'A loyal helper who guards the ger and goes along with the herder.',
        areas: [a(607, 740, 52, 72)],
      },
      {
        id: 'winter-child',
        nameMn: 'ХҮҮХЭД',
        nameEn: 'Child',
        riddleMn: 'Үслэг малгайтай, цэнхэр дээлтэй, чарга татаж яваа хүүхэд. Хэн бэ?',
        factMn: 'Өвөл хүүхэд үслэг малгай, зузаан дээлээр хүйтнээс хамгаалагддаг.',
        factEn: 'In winter children wear fur hats and thick deels against the cold.',
        areas: [a(310, 1000, 70, 135)],
      },
      {
        id: 'winter-sled',
        nameMn: 'ЧАРГА',
        nameEn: 'Sled',
        riddleMn: 'Цасан дээр гулгаж, ачаа зөөдөг модон зүйл. Юу вэ?',
        factMn: 'Цасан дээр чарга сайхан гулгана. Хүүхдүүд чаргаар ачаа татаж, наадан гулгадаг.',
        factEn: 'Sleds glide easily on snow. Children pull loads — and play — with them.',
        areas: [a(140, 1040, 85, 60)],
      },
      {
        id: 'winter-sheep',
        nameMn: 'ХОНЬ',
        nameEn: 'Sheep',
        riddleMn: 'Модон хашаанд цуглаж, бие биеэ дулаацуулдаг сэвсгэр мал. Хэн бэ?',
        factMn: 'Хонины зузаан ноос өвлийн хүйтнээс хамгаална.',
        factEn: 'Thick wool protects sheep from the winter cold.',
        areas: [a(650, 985, 195, 110)],
      },
      {
        id: 'winter-goat',
        nameMn: 'ЯМАА',
        nameEn: 'Goat',
        riddleMn: 'Цастай хадан дээр өндөр зогсож буй сахалтай амьтан. Хэн бэ?',
        factMn: 'Ямаа хад чулуу, цастай налуу сайн авирдаг. Ямааны ноолуур зөөлөн, дулаан.',
        factEn: 'Goats are great climbers. Their cashmere is soft and warm.',
        areas: [a(732, 272, 55, 55)],
      },
      {
        id: 'winter-smoke',
        nameMn: 'УТАА',
        nameEn: 'Smoke',
        riddleMn: 'Яндангаас тэнгэр рүү мурилзан гарах цагаан зураас. Юу вэ?',
        factMn: 'Яндангаас босох утаа гэрт хүн байгааг харуулдаг.',
        factEn: 'Smoke from the chimney shows that someone is home.',
        areas: [a(600, 190, 95, 140)],
      },
      {
        id: 'winter-rock',
        nameMn: 'ХАД',
        nameEn: 'Rock',
        riddleMn: 'Цасаар хучигдсан том чулуу, түүн дээр ямаа зогсдог. Юу вэ?',
        factMn: 'Мал хад, хөндийд салхинаас хоргодож байдаг.',
        factEn: 'Animals shelter from the wind among rocks and hollows.',
        areas: [a(740, 420, 110, 90)],
      },
      {
        id: 'winter-mountains',
        nameMn: 'УУЛ',
        nameEn: 'Mountains',
        riddleMn: 'Алс холд цагаан оргилтой өндөр уулс. Юу вэ?',
        factMn: 'Өвөл уулс цасаар бүрхэгдэж цагаан болдог.',
        factEn: 'In winter the mountains turn white with snow.',
        areas: [a(250, 350, 250, 50)],
      },
    ],
  },
  {
    id: 'wild',
    nameMn: 'Зэрлэг байгаль',
    nameEn: 'Wild Mongolia',
    taglineMn: 'Уул, нуурын ан амьтад',
    art: 'seek-wild',
    accent: '#4F7236',
    thumbPos: '50% 50%',
    items: [
      {
        id: 'wild-leopard',
        nameMn: 'ЦАСАН ИРВЭС',
        nameEn: 'Snow leopard',
        riddleMn: 'Толбо толботой үслэг, өндөр хадан дээр хэвтэх ховор амьтан. Хэн бэ?',
        factMn: 'Цасан ирвэс өндөр уулын хаданд амьдардаг ховор амьтан. Урт сүүлээрээ тэнцвэр барьдаг.',
        factEn: 'The snow leopard lives high in the rocky mountains and uses its long tail for balance.',
        areas: [a(157, 198, 105, 60)],
      },
      {
        id: 'wild-eagle',
        nameMn: 'БҮРГЭД',
        nameEn: 'Golden eagle',
        riddleMn: 'Тэнгэрт далавчаа дэлгэн хөвж буй том шувуу. Хэн бэ?',
        factMn: 'Бүргэд далавчаа дэлгэхэд 2 метр орчим болдог.',
        factEn: 'A golden eagle’s wings spread about two metres wide.',
        areas: [a(468, 98, 60, 52)],
      },
      {
        id: 'wild-ibex',
        nameMn: 'ЯНГИР',
        nameEn: 'Ibex',
        riddleMn: 'Нуман том эвэртэй, огцом хадан дээр зогсох хоёр амьтан. Хэн бэ?',
        factMn: 'Янгирын эвэр насан туршдаа ургадаг. Тэд хад чулууны дээгүүр хурдан авирдаг.',
        factEn: 'An ibex’s horns keep growing all its life, and it climbs steep rocks with ease.',
        areas: [a(690, 275, 75, 90), a(748, 190, 38, 80)],
      },
      {
        id: 'wild-argali',
        nameMn: 'АРГАЛЬ',
        nameEn: 'Argali',
        riddleMn: 'Ороомог том эвэртэй зэрлэг хонь. Хэн бэ?',
        factMn: 'Аргаль бол дэлхийн хамгийн том зэрлэг хонь.',
        factEn: 'The argali is the largest wild sheep in the world.',
        areas: [a(225, 730, 120, 130)],
      },
      {
        id: 'wild-marmot',
        nameMn: 'ТАРВАГА',
        nameEn: 'Marmot',
        riddleMn: 'Нүхнийхээ дэргэд хоёр хөл дээрээ зогсох үстэй амьтан. Хэн бэ?',
        factMn: 'Тарвага өвлийг нүхэндээ унтаж өнгөрөөдөг. Аюул ойртоход чанга исгэрч бусдад мэдэгддэг.',
        factEn: 'Marmots sleep through winter in their burrows and whistle loudly to warn each other of danger.',
        areas: [a(178, 1065, 48, 100)],
      },
      {
        id: 'wild-swans',
        nameMn: 'ХУН',
        nameEn: 'Swans',
        riddleMn: 'Нуурын усан дээр сүлжиж сууж буй урт хүзүүтэй цагаан шувууд. Хэн бэ?',
        factMn: 'Ихэнх хун нэг хосоороо насан туршдаа амьдардаг.',
        factEn: 'Most swans stay with the same partner for life.',
        areas: [a(612, 780, 80, 32)],
      },
      {
        id: 'wild-flowers',
        nameMn: 'ЦЭЦЭГ',
        nameEn: 'Flowers',
        riddleMn: 'Уулын бэл дээр шар, цэнхэр, ягаан өнгөөр ургасан жижиг ургамал. Юу вэ?',
        factMn: 'Монголын уулын хөндийд зун олон зуун төрлийн цэцэг дэлгэрдэг.',
        factEn: 'In summer, hundreds of kinds of flowers bloom in Mongolia’s mountain valleys.',
        areas: [a(620, 1150, 215, 95)],
      },
      {
        id: 'wild-lake',
        nameMn: 'НУУР',
        nameEn: 'Lake',
        riddleMn: 'Уулсын хооронд цэнхэр харагдах том ус. Юу вэ?',
        factMn: 'Хөвсгөл нуур Монголын цэнгэг усны ихэнхийг агуулдаг.',
        factEn: 'Lake Khövsgöl holds most of Mongolia’s fresh water.',
        areas: [a(540, 650, 230, 80)],
      },
      {
        id: 'wild-pines',
        nameMn: 'НАРС',
        nameEn: 'Pine',
        riddleMn: 'Үргэлж ногоон, өндөр сүүдэртэй ойн мод. Юу вэ?',
        factMn: 'Монголын хойд ууланд нарс, шинэс ургасан ой бий. Ой олон амьтны гэр.',
        factEn: 'The forests of northern Mongolia are home to many animals.',
        areas: [a(55, 560, 55, 130)],
      },
      {
        id: 'wild-mountains',
        nameMn: 'УУЛ',
        nameEn: 'Mountains',
        riddleMn: 'Цагаан оргилтой, алсад цэнхэрлэн харагдах уулс. Юу вэ?',
        factMn: 'Алтайн зарим оргилд цас жилийн турш хайлдаггүй.',
        factEn: 'On some Altai peaks, snow stays all year round.',
        areas: [a(470, 270, 150, 60)],
      },
    ],
  },
]

export function getSeekScene(id: string) {
  return SEEK_SCENES.find((s) => s.id === id)
}

/** Random subset for one round, in a random order. */
export function pickRound(scene: SeekScene, size = ROUND_SIZE): SeekItem[] {
  const pool = [...scene.items]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(size, pool.length))
}

export function starsForMisses(misses: number) {
  return misses <= 2 ? 3 : misses <= 5 ? 2 : 1
}
