import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseSchema, User, Category, Product, Notification, AuditLog, StoreSettings } from './types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'roka_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed categories
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-homewear',
    name: 'ملابس بيتي',
    slug: 'homewear',
    description: 'أرقى بيجامات العروسة، أرواب ستان وقطن تركي، وترنجات استقبال مريحة وأنيقة لجهازك.',
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    displayOrder: 1,
  },
  {
    id: 'cat-outwear',
    name: 'ملابس خروج',
    slug: 'outwear',
    description: 'دريسات وبليزرات وعبايات استقبال فاخرة لخروجات وشياكة العروسة بعد الزفاف.',
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    displayOrder: 2,
  },
  {
    id: 'cat-lingerie',
    name: 'لانجري',
    slug: 'lingerie',
    description: 'تشكيلة متميزة من قمصان النوم الفاخرة، أطقم الدانتيل والحرير المخصصة لليالي العروسة الأولى.',
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    displayOrder: 3,
  },
  {
    id: 'cat-appliances',
    name: 'أجهزة كهربائية',
    slug: 'electrical-appliances',
    description: 'خلاطات، محضرات طعام، مكانس، أجهزة كوي بخار، وأجهزة عناية شخصية من أفضل الماركات الأصلية.',
    image: '/src/assets/images/category_home_appliances_1791212800269.jpg',
    displayOrder: 4,
  },
  {
    id: 'cat-kitchenware',
    name: 'أدوات منزلية ومطبخ',
    slug: 'kitchenware',
    description: 'أطقم حلل جرانيت وسيراميك وتركي أصلي، أطقم عشاء بورسلين، ومستلزمات مطبخ العروسة بالكامل.',
    image: '/src/assets/images/category_home_appliances_1791212800269.jpg',
    displayOrder: 5,
  },
  {
    id: 'cat-furnishings',
    name: 'مفروشات منزلية',
    slug: 'home-furnishings',
    description: 'أطقم ملايات مطرزة قطن مصري 100%، كوفرتات وبطاطين إسباني، ولحاف العروسة الملكي الفاخر.',
    image: '/src/assets/images/category_home_linens_1791212815713.jpg',
    displayOrder: 6,
  },
];

// Initial seed products for brides
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'روب عروسة ستان حريري مطرز بالدانتيل الفرنسي - 3 قطع',
    slug: 'bridal-silk-robe-3pcs',
    categoryId: 'cat-homewear',
    categoryName: 'ملابس بيتي',
    price: 1850,
    oldPrice: 2200,
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    description: 'طقم روب عروسة ملكي مكون من 3 قطع (روب طويل، قميص ستان ناعم بحمالات قابلة للتعديل، وحزام ستان عريض). خامة ستان حريرية فائقة النعومة وتطريز دانتيل فرنسي راقي على الأكمام وأسفل القميص.',
    features: ['ستان تركي فاخر لا يسبب حساسية', 'تطريز دانتيل فرنسي ناعم', 'طقم كامل 3 قطع مناسب للصباحية', 'مقاسات مريحة وتلبيس متقن'],
    isAvailable: true,
    isFeatured: true,
    badge: 'جهاز العروسة المميز',
    trousseauTip: 'قطعة أساسية لا غنى عنها في شنطة صباحية العروسة لالتقاط أجمل الصور والترحيب بالمهنئين.',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-102',
    name: 'طقم بيجامة قطن استقبال فاخرة 4 قطع مطرزة',
    slug: 'luxury-cotton-lounge-4pcs',
    categoryId: 'cat-homewear',
    categoryName: 'ملابس بيتي',
    price: 1350,
    oldPrice: 1550,
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    description: 'طقم بيجامة استقبال عرايس 4 قطع تشمل بلوزة بأكمام دانتيل، بنطلون مريح، كارديجان شيك وتوب داخلي. قطن معالج عالي الجودة يدوم طويلاً مع الغسيل.',
    features: ['قطن 100% ناعم على البشرة', 'تصميم استقبال راقي ومريح', 'ألوان عرايسي هادئة ومميزة'],
    isAvailable: true,
    isFeatured: false,
    badge: 'الأكثر طلباً',
    trousseauTip: 'مثالي للاستقبال المنزلي والعزومات العائلية في الأسابيع الأولى بعد الزواج.',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-201',
    name: 'دريس خروج شيفون مبطن بأكمام بليسيه وتطريز هادئ',
    slug: 'chiffon-bridal-outing-dress',
    categoryId: 'cat-outwear',
    categoryName: 'ملابس خروج',
    price: 1650,
    oldPrice: 1900,
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    description: 'فستان خروج أنيق مصمم خصيصاً لخروجات العروسة والزيارات العائلية. خامة شيفون مستورد عالي الجودة مبطن بالكامل مع أكمام بليسيه أنيقة وحزام خصر متناسق.',
    features: ['قماش شيفون نخب أول غير شفاف مع بطانة كاملة', 'قصة انسيابية تخفي عيوب الجسم', 'مناسب للمناسبات والخروجات الراقية'],
    isAvailable: true,
    isFeatured: true,
    badge: 'جديد الموسم',
    trousseauTip: 'يُنصح باقتناء دريسين بألوان فاتحة وراقية ضمن دولاب خروج جهاز العروسة.',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-301',
    name: 'طقم لانجري ملكي دانتيل فرنسي مع كيمونو ستان مذهب',
    slug: 'royal-lace-lingerie-set',
    categoryId: 'cat-lingerie',
    categoryName: 'لانجري',
    price: 1200,
    oldPrice: 1450,
    image: '/src/assets/images/category_bridal_homewear_1791212788431.jpg',
    description: 'طقم لانجري فاخر من أرقى بيوت الأزياء المتخصصة في مستلزمات العروسة. خامة دانتيل بيور مع حرير ستان فائق النعومة مريح وساحر.',
    features: ['دانتيل مرن ومريح لا يسبب أي احتكاك', 'حزام وتفاصيل ناعمة أنثوية', 'تغليف هدايا راقي ومحكم'],
    isAvailable: true,
    isFeatured: true,
    badge: 'كولكشن العرايس',
    trousseauTip: 'اختاري ألوان متنوعة بين الأبيض الأوف وايت، والوردي البودري، والأحمر الداكن الكلاسيكي.',
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-401',
    name: 'محضر طعام ومفرمة متكاملة 32 وظيفة بقوة 1200 واط',
    slug: 'kitchen-food-processor-32fn',
    categoryId: 'cat-appliances',
    categoryName: 'أجهزة كهربائية',
    price: 4950,
    oldPrice: 5600,
    image: '/src/assets/images/category_home_appliances_1791212800269.jpg',
    description: 'الجهاز الأساسي لكل عروسة في مطبخها: يجمع بين محضر طعام، كبة تقطيع، خلاط عصائر، مطحنة توابل، عصارة فواكه، وعجان خفيف. شفرات فولاذية مقاومة للصدأ مع ضمان سنتين كاملتين.',
    features: ['موتور نحاسي نقي قوي 1200W', '32 وظيفة عملية تغنيك عن أجهزة متعددة', 'أوعية تريتان مضادة للكسر', 'ضمان محلي معتمد سنتين'],
    isAvailable: true,
    isFeatured: true,
    badge: 'ضمان سنتين',
    trousseauTip: 'الجهاز المفضل لكل أم وعروسة في سوهاج وجهينة لأنه يوفر مساحة في المطبخ ويخدم جميع الاستخدامات.',
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-402',
    name: 'مكواة بخار عمودية للملابس والمفروشات 2000 واط',
    slug: 'vertical-garment-steamer',
    categoryId: 'cat-appliances',
    categoryName: 'أجهزة كهربائية',
    price: 2450,
    oldPrice: 2800,
    image: '/src/assets/images/category_home_appliances_1791212800269.jpg',
    description: 'مكواة البخار العمودية السريعة لحماية فساتين السهرة، الستائر، وملايات العروسة من الحرق أو التلف. تدفق بخار مستمر وتعقيم فوري للأقمشة.',
    features: ['تسخين فائق خلال 45 ثانية فقط', 'خزان مياه كبير سعة 1.8 لتر', 'شماعة ملابس مدمجة ومريحة'],
    isAvailable: true,
    isFeatured: false,
    badge: 'حماية الأقمشة',
    trousseauTip: 'لا غنى عنها لفرد فساتين السهرة والمفروشات المطرزة بدون الحاجة لمكواة تقليدية.',
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-501',
    name: 'طقم حلل جرانيت تركي أصلي 14 قطعة طبقات مانعة للالتصاق',
    slug: 'granite-cookware-turkish-14pcs',
    categoryId: 'cat-kitchenware',
    categoryName: 'أدوات منزلية ومطبخ',
    price: 6850,
    oldPrice: 7700,
    image: '/src/assets/images/category_home_appliances_1791212800269.jpg',
    description: 'طقم طهي جرانيت تركي كامل يشمل 4 حلل بمقاسات مختلفة، طاسة قلية، صينية فرن، مقلاية كريب، وأطقم أدوات تقليب سيليكون حراري. سمك 4.5 مم مع أغطية بايركس محكمة ومقابض خشبية عازلة للحرارة.',
    features: ['جرانيت طبيعي خالي تماماً من مادة PFOA الضارة', 'توزيع حراري متساوي لقاع الحلة', 'سهل التنظيف ومقاوم للخدش'],
    isAvailable: true,
    isFeatured: true,
    badge: 'تركي أصلي 100%',
    trousseauTip: 'أهم طقم في جهاز مطبخ العروسة، تأكدي من سلامة المقابض والغطاء عند المعاينة وقت الاستلام.',
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-502',
    name: 'طقم عشاء بورسلين فاخر 66 قطعة مذهب - تصميم ملكي',
    slug: 'porcelain-dinnerware-set-66pcs',
    categoryId: 'cat-kitchenware',
    categoryName: 'أدوات منزلية ومطبخ',
    price: 9400,
    oldPrice: 10800,
    image: '/src/assets/images/category_home_appliances_1791212800269.jpg',
    description: 'طقم سفرة وعشاء فاخر نخب أول من البورسلين الصافي بإطار مذهب أنيق. يتسع لعزومة 12 فرداً بالكامل مع سرافيس التقديم وبولات الشوربة وفناجين الشاي والقهوة.',
    features: ['بورسلين عالي الجودة مقاوم للصدمات والحرارة', 'إطار ذهبي مقاوم للبهتان', 'طقم كامل للنيش والسفرة في جهاز العروسة'],
    isAvailable: true,
    isFeatured: false,
    badge: 'فخامة النيش',
    trousseauTip: 'يُحفظ بأناقة في نيش الصالون ويستخدم في العزومات والمناسبات السعيدة.',
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-601',
    name: 'لحاف عروسة ملكي مطرز 6 قطع من القطيفة والحرير',
    slug: 'royal-bridal-comforter-6pcs',
    categoryId: 'cat-furnishings',
    categoryName: 'مفروشات منزلية',
    price: 4300,
    oldPrice: 4900,
    image: '/src/assets/images/category_home_linens_1791212815713.jpg',
    description: 'لحاف سرير عروسة ملكي مكون من لحاف قطيفة ثقيل بوجه حريري مطرز بتطريزات كمبيوتر دقيقة، 2 كيس مخدة كبير، 2 كيس خدادية مربعة، وخدادية بيضاوية للتزيين. حشوة فايبر ألماني معالجة ضد الهبوط والتكتل.',
    features: ['قطيفة حريرية ناعمة جداً وثقيلة لتدفئة مثالية', 'تطريز يدوي وكمبيوتر راقي', 'ألوان شامبين وأوف وايت تناسب كل غرف النوم'],
    isAvailable: true,
    isFeatured: true,
    badge: 'تاج جهاز العروسة',
    trousseauTip: 'القطعة المركزية التي تزين سرير غرفة نوم العروسة في يوم الزفاف.',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-602',
    name: 'طقم ملايات قطن مصري 100% نخب أول 5 قطع تطريز جوبير',
    slug: 'egyptian-cotton-bedsheet-set-5pcs',
    categoryId: 'cat-furnishings',
    categoryName: 'مفروشات منزلية',
    price: 1150,
    oldPrice: 1350,
    image: '/src/assets/images/category_home_linens_1791212815713.jpg',
    description: 'طقم سرير كبير مكون من ملاية قطن مصري طويل التيلة ناعم وبارد، 2 كيس مخدة طويل و2 كيس كوشن بتطريز جوبير عريض فاخر. ثابت الألوان ولا يوبر على الإطلاق.',
    features: ['قطن مصري 100% طويل التيلة نخب أول', 'تطريز جوبير بارز أنيق وثابت', 'مقاس كبير يغطي المراتب العالية بارتياح'],
    isAvailable: true,
    isFeatured: true,
    badge: 'قطن مصري 100%',
    trousseauTip: 'احرصي على اقتناء 6 إلى 8 أطقم ملايات قطن مصري بألوان وتطريزات متنوعة.',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Store Settings
const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'روكا مول',
  tagline: 'عالم مستلزمات جهاز العروسة الراقي في صعيد مصر',
  phone: '01289778354',
  whatsappNumber: '01289778354',
  address: 'سوهاج، مركز جهينة، أمام قسم شرطة جهينة',
  city: 'جهينة',
  governorate: 'سوهاج',
  landmark: 'أمام قسم شرطة جهينة مباشرة',
  workingHours: 'يومياً من الساعة 10:00 صباحاً حتى 11:00 مساءً',
  shippingInfo: 'نوفر خدمة التوصيل المنزلي لجميع مراكز وقرى محافظة سوهاج ومحافظات الصعيد.',
  deliveryNotice: 'الدفع عند الاستلام مع إمكانية فتح الشحنة ومعاينة المنتجات للتأكد من مطابقتها قبل سداد أي مبلغ.',
  heroTitle: 'كل تفصيلة في جهازك.. بأعلى جودة وأرقى ذوق',
  heroSubtitle: 'روكا مول يجمع لكِ مستلزمات جهاز العروسة المتكامل: ملابس بيتي وخروج، لانجري، أجهزة كهربائية مضمونة، أدوات مطبخ ومفروشات تركية ومصرية فاخرة بأسعار مميزة وخدمة استلام ومعاينة موثوقة في سوهاج.',
  heroBannerImage: '/src/assets/images/hero_bridal_trousseau_1791212765901.jpg',
  privacyPolicy: `نحن في "روكا مول" نلتزم بأقصى معايير الخصوصية لحماية بيانات عملائنا الكرام. نجمع فقط المعلومات الضرورية لإتمام طلباتكم والتواصل معكم عبر واتساب أو الهاتف لتأكيد مواعيد التوصيل والاستلام (مثل الاسم، رقم الهاتف، والعنوان).

لا نقوم ببيع أو مشاركة أو تأجير أي بيانات شخصية تخص العميل لأي طرف ثالث لأغراض تسويقية. كافة البيانات المسجلة محمية ومخصصة لخدمتكم وإشعاركم بتحديثات طلبات جهاز العروسة.`,
  termsAndConditions: `مرحباً بكم في متجر "روكا مول" المتخصص في مستلزمات جهاز العروسة. باستخدامكم للموقع أو الطلب عبر خدمة واتساب فإنكم توافقون على الشروط التالية:
1. المنتجات والأسعار: نحرص على دقة عرض الأسعار بالجنيه المصري ومطابقتها للمعروض بالمتجر الفعلي أمام قسم شرطة جهينة.
2. تأكيد الطلب: يتم تأكيد الطلبات بصورة نهائية من خلال محادثة واتساب المباشرة على الرقم 01289778354 لضمان توافر الألوان والمقاسات.
3. التوصيل والدفع: يتم الدفع نقداً عند الاستلام بعد معاينة المنتجات والتأكد من مطابقتها للمواصفات المطلوبة.
4. حقوق الملكية: محتوى الموقع وتصاميمه وعلامة "روكا مول" ملك للمتجر وإدارته.`,
  returnPolicy: `في "روكا مول"، راحتكِ وثقتكِ في جهازكِ هي أولويتنا:
1. المعاينة قبل الاستلام: يحق للعميل فتح الطرد ومعاينة المنتجات بحضور مندوب الشحن قبل دفع أي مبلغ.
2. الاستبدال والاسترجاع: يمكن طلب استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام شريطة أن يكون المنتج بحالته الأصلية غير مستخدم وبغلافه الأصلي وكافة الملحقات.
3. الأجهزة الكهربائية: تخضع للضمان الرسمي المعتمد من الوكيل وفي حال وجود عيب صناعة يتم الاستبدال الفوري.
4. الملابس الداخلية واللانجري: مراعاةً للصحة والسلامة، لا يمكن استبدال أو استرجاع قطع اللانجري بعد فتح التغليف الداخلي إلا في حالة وجود عيب مصنعي مثبت عند الاستلام.
5. للتواصل بشأن الاسترجاع: تواصلوا فوراً مع خدمة العملاء على واتساب 01289778354 وسيقوم فريق العمل بخدمتكم بكل سرور.`,
};

function hashDefaultPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

const defaultAdminCreds = hashDefaultPassword('Beshara#012#');

// Two designated authorized administrators:
// Manager: بشاره ايوب (Role: manager)
// Assistant: توماس ايوب (Role: assistant)
const INITIAL_USERS: User[] = [
  {
    id: 'admin-manager-1',
    name: 'بشاره ايوب',
    email: 'bishara@rokamall.com',
    phone: '01289778354',
    role: 'manager',
    passwordHash: defaultAdminCreds.hash,
    salt: defaultAdminCreds.salt,
    isPasswordSet: true,
    address: 'سوهاج - مركز جهينة',
    city: 'جهينة',
    notes: 'المدير العام والمسؤول عن كافة الصلاحيات والإعدادات الأمنية للمتجر',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-assistant-2',
    name: 'توماس ايوب',
    email: 'thomas@rokamall.com',
    phone: '01289778354',
    role: 'assistant',
    passwordHash: defaultAdminCreds.hash,
    salt: defaultAdminCreds.salt,
    isPasswordSet: true,
    address: 'سوهاج - مركز جهينة',
    city: 'جهينة',
    notes: 'مساعد إدارة المتجر - صلاحيات إدارة المنتجات والأقسام ومراجعة العملاء',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        // Ensure all required fields exist
        if (!parsed.categories || parsed.categories.length === 0) {
          parsed.categories = INITIAL_CATEGORIES;
        }
        if (!parsed.products || parsed.products.length === 0) {
          parsed.products = INITIAL_PRODUCTS;
        }
        if (!parsed.settings) {
          parsed.settings = INITIAL_SETTINGS;
        }
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = INITIAL_USERS;
        } else {
          // Verify both Bishara and Thomas exist
          const hasBishara = parsed.users.some(u => u.name === 'بشاره ايوب');
          if (!hasBishara) {
            parsed.users.unshift(INITIAL_USERS[0]);
          } else {
            const bishara = parsed.users.find(u => u.name === 'بشاره ايوب');
            if (bishara && (!bishara.passwordHash || !bishara.isPasswordSet)) {
              bishara.passwordHash = defaultAdminCreds.hash;
              bishara.salt = defaultAdminCreds.salt;
              bishara.isPasswordSet = true;
            }
          }
          const hasThomas = parsed.users.some(u => u.name === 'توماس ايوب');
          if (!hasThomas) {
            parsed.users.push(INITIAL_USERS[1]);
          } else {
            const thomas = parsed.users.find(u => u.name === 'توماس ايوب');
            if (thomas && (!thomas.passwordHash || !thomas.isPasswordSet)) {
              thomas.passwordHash = defaultAdminCreds.hash;
              thomas.salt = defaultAdminCreds.salt;
              thomas.isPasswordSet = true;
            }
          }
        }
        if (!parsed.notifications) parsed.notifications = [];
        if (!parsed.auditLogs) parsed.auditLogs = [];
        return parsed;
      }
    } catch (err) {
      console.error('Error loading db file, re-initializing fresh schema:', err);
    }

    const fresh: DatabaseSchema = {
      users: INITIAL_USERS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      notifications: [
        {
          id: 'notif-welcome',
          type: 'order_inquiry',
          title: 'مرحباً بكم في لوحة تحكم روكا مول',
          message: 'تم إعداد المتجر الإلكتروني بنجاح وجاهز لاستقبال طلبات عرائس سوهاج وجهينة عبر واتساب.',
          isRead: false,
          createdAt: new Date().toISOString(),
        }
      ],
      auditLogs: [
        {
          id: 'log-init',
          adminId: 'system',
          adminName: 'النظام',
          action: 'تهيئة المتجر',
          details: 'تم تجهيز قواعد بيانات روكا مول بنجاح مع الفئات الأساسية وإعدادات جهينة، سوهاج.',
          createdAt: new Date().toISOString(),
        }
      ],
      settings: INITIAL_SETTINGS,
    };
    this.saveData(fresh);
    return fresh;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving db file:', err);
    }
  }

  public save(): void {
    this.saveData(this.data);
  }

  // --- Users Operations ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  public getUserByPhone(phone: string): User | undefined {
    return this.data.users.find(u => u.phone === phone.trim());
  }

  public addUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Categories Operations ---
  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getCategoryById(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id);
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find(c => c.slug === slug);
  }

  public addCategory(cat: Category): Category {
    this.data.categories.push(cat);
    this.save();
    return cat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Products Operations ---
  public getProducts(filters?: { categoryId?: string; search?: string; featured?: boolean }): Product[] {
    let list = this.data.products;

    if (filters?.categoryId) {
      list = list.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.featured !== undefined) {
      list = list.filter(p => p.isFeatured === filters.featured);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(prod: Product): Product {
    this.data.products.push(prod);
    this.save();
    return prod;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Notifications ---
  public getNotifications(): Notification[] {
    return [...this.data.notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notif: Notification): Notification {
    this.data.notifications.unshift(notif);
    // Keep max 200 notifications
    if (this.data.notifications.length > 200) {
      this.data.notifications = this.data.notifications.slice(0, 200);
    }
    this.save();
    return notif;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(): void {
    this.data.notifications.forEach(n => { n.isRead = true; });
    this.save();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.data.auditLogs.unshift(log);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
    return log;
  }

  // --- Settings ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }
}

export const db = new Database();
