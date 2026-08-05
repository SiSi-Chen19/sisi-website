import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  ExternalLink,
  Globe2,
  Heart,
  Hotel,
  ImagePlus,
  MapPin,
  Minus,
  Navigation,
  Plane,
  Plus,
  Route,
  ShoppingBag,
  Sparkles,
  Star,
  TrainFront,
  TramFront,
  Utensils,
  WandSparkles,
} from 'lucide-react'
import ClickSpark from './ClickSpark'
import CurvedLoop from './CurvedLoop'
import SplitText from './SplitText'

const originRegions = {
  上海: ['上海'],
  北京: ['北京'],
  天津: ['天津'],
  重庆: ['重庆'],
  河北: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
  山西: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
  辽宁: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
  吉林: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'],
  黑龙江: ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭'],
  江苏: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
  浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
  安徽: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'],
  福建: ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
  江西: ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
  山东: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽'],
  河南: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源'],
  湖北: ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门', '神农架'],
  湖南: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西'],
  广东: ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '河源', '梅州', '惠州', '汕尾', '东莞', '中山', '江门', '阳江', '湛江', '茂名', '肇庆', '清远', '潮州', '揭阳', '云浮'],
  海南: ['海口', '三亚', '三沙', '儋州', '五指山', '琼海', '文昌', '万宁', '东方'],
  四川: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山'],
  贵州: ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南'],
  云南: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆'],
  陕西: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
  甘肃: ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南'],
  青海: ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西'],
  内蒙古: ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
  广西: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
  西藏: ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里'],
  宁夏: ['银川', '石嘴山', '吴忠', '固原', '中卫'],
  新疆: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰', '石河子'],
  香港: ['香港'],
  澳门: ['澳门'],
}

const destinationGroups = {
  国内: ['上海', '北京', '杭州', '宁波', '苏州', '南京', '厦门', '福州', '广州', '深圳', '成都', '重庆', '长沙', '武汉', '西安', '青岛', '大理', '丽江', '昆明', '桂林', '三亚', '海口', '拉萨', '哈尔滨'],
  日本: ['东京', '京都', '大阪', '奈良', '神户', '横滨', '镰仓', '名古屋', '札幌', '小樽', '函馆', '福冈', '熊本', '长崎', '冲绳', '金泽', '富士河口湖', '广岛', '高松'],
  韩国: ['首尔', '釜山', '济州岛', '仁川', '水原', '大邱', '庆州', '全州', '江陵', '束草', '大田', '光州', '丽水', '蔚山', '春川'],
}

const destinationData = {
  上海: {
    tag: '海派漫游', code: 'SHA', station: '上海虹桥站', airport: '上海虹桥国际机场', image: '/assets/blue.jpg',
    attractions: ['武康路与安福路', '西岸美术馆大道', '外滩源', '愚园路'], foods: ['光明邨鲜肉月饼', '人和馆本帮菜', '佳家汤包'],
    hotels: ['全季酒店上海静安寺店', '上海静安嘉里中心酒店', '上海和平饭店'], transit: '地铁 10 号线 + 11 号线',
  },
  北京: {
    tag: '古都新章', code: 'BJS', station: '北京南站', airport: '北京首都国际机场', image: '/assets/miracle.jpg',
    attractions: ['故宫博物院', '景山公园', '什刹海', '798 艺术区'], foods: ['四季民福烤鸭', '方砖厂炸酱面', '护国寺小吃'],
    hotels: ['北京东四亚朵酒店', '北京王府井希尔顿酒店', '北京璞瑄酒店'], transit: '地铁 8 号线 + 6 号线',
  },
  杭州: {
    tag: '湖畔慢游', code: 'HGH', station: '杭州东站', airport: '杭州萧山国际机场', image: '/assets/green.jpg',
    attractions: ['曲院风荷', '北山街', '中国美术学院象山校区', '小河直街'], foods: ['知味观', '新周记', '方老大面'],
    hotels: ['杭州西湖湖滨亚朵酒店', '杭州君悦酒店', '杭州法云安缦'], transit: '地铁 1 号线 + 水上巴士',
  },
  厦门: {
    tag: '海风散步', code: 'XMN', station: '厦门站', airport: '厦门高崎国际机场', image: '/assets/pink.jpg',
    attractions: ['鼓浪屿', '沙坡尾', '山海健康步道', '集美学村'], foods: ['四里沙茶面', '八市海鲜', '黄则和花生汤'],
    hotels: ['厦门中山路海景亚朵酒店', '厦门康莱德酒店', '厦门七尚酒店'], transit: '地铁 1 号线 + 轮渡',
  },
  成都: {
    tag: '松弛食旅', code: 'CTU', station: '成都东站', airport: '成都天府国际机场', image: '/assets/baby.jpg',
    attractions: ['成都博物馆', '望平街', '东郊记忆', '青城山'], foods: ['马路边边麻辣烫', '陈麻婆豆腐', '甘食记肥肠粉'],
    hotels: ['成都春熙路亚朵酒店', '成都博舍', '成都钓鱼台精品酒店'], transit: '地铁 2 号线 + 8 号线',
  },
  重庆: {
    tag: '立体夜游', code: 'CKG', station: '重庆北站', airport: '重庆江北国际机场', image: '/assets/clover-transform.jpg',
    attractions: ['湖广会馆', '山城步道', '鹅岭二厂', '南滨路'], foods: ['珮姐老火锅', '花市豌杂面', '梯坎豆花'],
    hotels: ['重庆解放碑亚朵酒店', '重庆来福士洲际酒店', '重庆丽晶酒店'], transit: '轨道 2 号线 + 1 号线',
  },
  长沙: {
    tag: '烟火日夜', code: 'CSX', station: '长沙南站', airport: '长沙黄花国际机场', image: '/assets/pink-transform.jpg',
    attractions: ['湖南省博物院', '潮宗街', '岳麓书院', '谢子龙影像艺术馆'], foods: ['笨萝卜浏阳菜馆', '公交新村粉店', '金记糖油坨坨'],
    hotels: ['长沙五一广场亚朵酒店', '长沙尼依格罗酒店', '长沙柏悦酒店'], transit: '地铁 2 号线 + 3 号线',
  },
  大理: {
    tag: '苍山洱海', code: 'DLU', station: '大理站', airport: '大理凤仪机场', image: '/assets/green-transform.jpg',
    attractions: ['龙龛码头', '喜洲古镇', '海舌公园', '苍山感通索道'], foods: ['段公子天龙八部店', '云里伴山野生菌', '杨记乳扇'],
    hotels: ['大理古城既下山酒店', '大理俊发铂尔曼酒店', '大理颐雲度假养生酒店'], transit: '环洱海巴士 + 景区直通车',
  },
  东京: {
    tag: '霓虹与旧巷', code: 'TYO', station: '东京站', airport: '东京羽田机场', image: '/assets/blue-transform.jpg',
    attractions: ['浅草寺与隅田川', '涩谷 SKY', '国立新美术馆', '代官山', 'teamLab Planets', '明治神宫', '表参道', '东京站丸之内'], foods: ['浅草今半', 'AFURI 柚子盐拉面', '鸟贵族', 'Tsujihan 海鲜丼', '银座篝鸡白汤拉面', 'HARBS 千层蛋糕'],
    hotels: ['N+ Hotel Tokyo Nihonbashi', 'Mercure Tokyo Haneda Airport', 'InterContinental Tokyo Bay'], transit: '东京 Metro 银座线 + JR 山手线',
  },
  京都: {
    tag: '古都光影', code: 'KIX', station: '京都站', airport: '关西国际机场', image: '/assets/pink-transform.jpg',
    attractions: ['清水寺与二年坂', '伏见稻荷大社', '京都御苑', '岚山竹林', '金阁寺', '二条城', '锦市场', '鸭川与先斗町'], foods: ['祇园迦陵', '本家第一旭', '锦市场小吃', '南禅寺顺正汤豆腐', '出町双叶豆大福', 'Smart Coffee'],
    hotels: ['THE POCKET HOTEL 京都四条乌丸', 'Hotel Resol Kyoto Kawaramachi', 'THE THOUSAND KYOTO'], transit: '市营地铁 + 京阪本线',
  },
  大阪: {
    tag: '热烈关西', code: 'KIX', station: '新大阪站', airport: '关西国际机场', image: '/assets/title.jpg',
    attractions: ['中之岛美术馆', '大阪城公园', '新世界', '梅田蓝天大厦'], foods: ['美津の大阪烧', 'だるま串炸', '一芳亭烧卖'],
    hotels: ['Sotetsu Fresa Inn Osaka Namba', 'Hotel Monterey Grasmere Osaka', 'Conrad Osaka'], transit: 'Osaka Metro 御堂筋线 + 环状线',
  },
  札幌: {
    tag: '北国清透', code: 'CTS', station: '札幌站', airport: '新千岁机场', image: '/assets/miracle.jpg',
    attractions: ['北海道大学', '札幌艺术之森', '藻岩山', '白色恋人公园'], foods: ['成吉思汗烤肉だるま', '汤咖喱 GARAKU', '札幌拉面共和国'],
    hotels: ['The Knot Sapporo', 'JR Tower Hotel Nikko Sapporo', 'ONSEN RYOKAN 由縁札幌'], transit: '札幌市营地铁 + JR 快速 Airport',
  },
  福冈: {
    tag: '海港食旅', code: 'FUK', station: '博多站', airport: '福冈机场', image: '/assets/green.jpg',
    attractions: ['大濠公园', '福冈市美术馆', '海之中道', '天神地下街'], foods: ['博多一双', '元祖博多明太重', 'もつ鍋楽天地'],
    hotels: ['The Lively Fukuoka Hakata', 'Mitsui Garden Hotel Fukuoka Gion', 'WITH THE STYLE FUKUOKA'], transit: '机场线 + 西铁巴士',
  },
  小樽: {
    tag: '运河雪光', code: 'OTR', station: '小樽站', airport: '新千岁机场', image: '/assets/green-transform.jpg',
    attractions: ['小樽运河', '堺町通商店街', '天狗山展望台', '小樽音乐盒堂', '三角市场', '北一硝子三号馆', '小樽市综合博物馆', '祝津海岸'], foods: ['小樽政寿司', '三角市场海鲜丼', 'LeTAO 本店', '若鸡时代 Narutoya', '小樽啤酒仓库 No.1', '北菓楼小樽本馆'],
    hotels: ['OMO5 Otaru by Hoshino Resorts', 'Hotel Nord Otaru', 'Dormy Inn Premium Otaru'], transit: 'JR 函馆本线 + 小樽市内巴士',
  },
  横滨: {
    tag: '港湾夜色', code: 'YOK', station: '横滨站', airport: '东京羽田机场', image: '/assets/blue.jpg',
    attractions: ['横滨中华街', '红砖仓库', 'Landmark Tower Sky Garden', '山下公园', '杯面博物馆', '大栈桥国际客船码头', '港未来 21', '元町商店街'], foods: ['崎阳轩烧卖', '新横滨拉面博物馆', '中华街江户清肉包', 'bills 横滨红砖仓库', '胜烈庵炸猪排', '野毛居酒屋街'],
    hotels: ['JR-East Hotel Mets Yokohama', 'Hyatt Regency Yokohama', 'The Yokohama Bay Hotel Tokyu'], transit: '横滨地铁 + 港未来线',
  },
  首尔: {
    tag: '首尔节拍', code: 'SEL', station: '首尔站', airport: '仁川国际机场', image: '/assets/pink.jpg',
    attractions: ['景福宫与西村', '圣水洞', 'DDP 东大门设计广场', '南山公园'], foods: ['土俗村参鸡汤', '广藏市场', 'Myeongdong Kyoja'],
    hotels: ['Nine Tree Premier Insadong', 'L7 Myeongdong', 'Four Seasons Hotel Seoul'], transit: '首尔地铁 2 号线 + 3 号线',
  },
  釜山: {
    tag: '海岸电影感', code: 'PUS', station: '釜山站', airport: '金海国际机场', image: '/assets/blue.jpg',
    attractions: ['海云台蓝线公园', '影岛白浅文化村', 'F1963', '广安里海水浴场'], foods: ['札嘎其市场', '本钱猪肉汤饭', '海云台传统市场'],
    hotels: ['Toyoko Inn Busan Station No.1', 'L7 Haeundae', 'Park Hyatt Busan'], transit: '釜山地铁 1 号线 + 2 号线',
  },
  济州岛: {
    tag: '岛屿呼吸', code: 'CJU', station: '济州巴士总站', airport: '济州国际机场', image: '/assets/baby.jpg',
    attractions: ['咸德海水浴场', '月汀里', '涉地可支', '济州现代美术馆'], foods: ['济州黑猪一条街', '姐妹面条', '东门市场'],
    hotels: ['Hotel RegentMarine Jeju', 'Grand Hyatt Jeju', 'Parnas Hotel Jeju'], transit: '干线巴士 201 + 景区循环巴士',
  },
}

const hotelDetails = {
  'N+ Hotel Tokyo Nihonbashi': {
    address: '2-23-8 Nihonbashi Hamacho, Chuo-ku, Tokyo, Japan',
    station: '滨町站',
    stationDistance: '约 350m',
    district: '日本桥商圈',
    districtDistance: '约 1.3km',
    note: '适合把浅草、银座、日本桥连成一条线',
  },
  'Mercure Tokyo Haneda Airport': {
    address: '1-2-11 Haneda, Ota-ku, Tokyo 144-0043, Japan',
    station: '大鸟居站',
    stationDistance: '约 300m，步行约 4-5 分钟',
    district: 'Haneda Airport Garden 商场',
    districtDistance: '约 5.1km',
    note: '适合早晚航班或把羽田机场作为抵达/离开节点',
  },
  'InterContinental Tokyo Bay': {
    address: '1-16-2 Kaigan, Minato-ku, Tokyo 105-8576, Japan',
    station: '竹芝站',
    stationDistance: '酒店直连；滨松町站步行约 8 分钟',
    district: '银座商圈',
    districtDistance: '约 10 分钟车程',
    note: '适合东京湾、银座、台场方向的舒适行程',
  },
}

const airports = {
  上海: '上海虹桥国际机场', 北京: '北京首都国际机场', 广州: '广州白云国际机场', 深圳: '深圳宝安国际机场', 珠海: '珠海金湾机场',
  杭州: '杭州萧山国际机场', 宁波: '宁波栎社国际机场', 温州: '温州龙湾国际机场', 南京: '南京禄口国际机场', 苏州: '上海虹桥国际机场',
  无锡: '苏南硕放国际机场', 成都: '成都天府国际机场', 绵阳: '绵阳南郊机场', 武汉: '武汉天河国际机场', 厦门: '厦门高崎国际机场',
  福州: '福州长乐国际机场', 西安: '西安咸阳国际机场', 长沙: '长沙黄花国际机场', 青岛: '青岛胶东国际机场', 郑州: '郑州新郑国际机场',
  昆明: '昆明长水国际机场', 大理: '大理凤仪机场', 丽江: '丽江三义机场', 三亚: '三亚凤凰国际机场', 海口: '海口美兰国际机场',
  东京: '东京羽田机场', 横滨: '东京羽田机场', 京都: '关西国际机场', 大阪: '关西国际机场', 小樽: '新千岁机场', 首尔: '仁川国际机场', 釜山: '金海国际机场', 济州岛: '济州国际机场',
}

const nearestAirports = {
  苏州: { airport: '上海虹桥国际机场', route: '苏州站 → 上海虹桥站 → 上海虹桥国际机场', note: '苏州无民航机场，优先高铁到上海虹桥接驳' },
  无锡: { airport: '苏南硕放国际机场', route: '无锡市区 → 地铁/机场巴士 → 苏南硕放国际机场', note: '优先本地机场；国际航班不足时可改上海浦东/虹桥' },
  嘉兴: { airport: '杭州萧山国际机场', route: '嘉兴南站 → 杭州东站 → 机场快线/地铁 → 萧山机场', note: '嘉兴无民航机场，杭州萧山通常更顺路' },
  湖州: { airport: '杭州萧山国际机场', route: '湖州站 → 杭州东站 → 地铁/机场大巴 → 萧山机场', note: '湖州无民航机场，优先杭州萧山' },
  绍兴: { airport: '杭州萧山国际机场', route: '绍兴北站 → 杭州南/杭州东 → 地铁 7 号线 → 萧山机场', note: '绍兴无民航机场，萧山机场距离更近' },
  金华: { airport: '义乌机场', route: '金华站 → 义乌站 → 出租/公交 → 义乌机场', note: '若无合适航班，再查杭州萧山' },
  衢州: { airport: '衢州机场', route: '衢州市区 → 公交/出租 → 衢州机场', note: '优先本地机场，航线不足时查杭州萧山' },
  舟山: { airport: '舟山普陀山机场', route: '舟山市区 → 机场巴士/出租 → 普陀山机场', note: '优先本地机场' },
  台州: { airport: '台州路桥机场', route: '台州市区 → 机场巴士/公交 → 台州路桥机场', note: '优先本地机场' },
  丽水: { airport: '温州龙湾国际机场', route: '丽水站 → 温州南站 → S1/机场巴士 → 温州龙湾机场', note: '丽水无常用民航机场，优先温州龙湾' },
  佛山: { airport: '广州白云国际机场', route: '佛山市区 → 广佛线/广州地铁 → 机场北/机场南', note: '佛山机场航线较少，优先广州白云' },
  东莞: { airport: '深圳宝安国际机场', route: '东莞市区 → 穗深城际/地铁 → 深圳宝安机场', note: '东莞无民航机场，优先深圳宝安' },
  中山: { airport: '珠海金湾机场', route: '中山市区 → 城际/巴士 → 珠海金湾机场', note: '也可按航班价格比较广州白云、深圳宝安' },
  江门: { airport: '珠海金湾机场', route: '江门站 → 珠海站/机场巴士 → 珠海金湾机场', note: '优先珠海金湾' },
  惠州: { airport: '惠州平潭机场', route: '惠州市区 → 机场快线/出租 → 惠州平潭机场', note: '航线不足时查深圳宝安' },
  张家口: { airport: '张家口宁远机场', route: '张家口市区 → 公交/出租 → 宁远机场', note: '国际航班不足时优先北京首都/大兴' },
  保定: { airport: '北京大兴国际机场', route: '保定东站 → 北京大兴机场站 → 航站楼', note: '保定无民航机场，优先北京大兴' },
  廊坊: { airport: '北京大兴国际机场', route: '廊坊站 → 大兴机场线/城际 → 北京大兴机场', note: '廊坊无民航机场，优先北京大兴' },
}

const directAirportCities = {
  石家庄: '石家庄正定国际机场', 唐山: '唐山三女河机场', 秦皇岛: '秦皇岛北戴河机场', 邯郸: '邯郸机场', 承德: '承德普宁机场',
  太原: '太原武宿国际机场', 大同: '大同云冈机场', 长治: '长治王村机场', 运城: '运城张孝机场', 临汾: '临汾尧都机场',
  沈阳: '沈阳桃仙国际机场', 大连: '大连周水子国际机场', 丹东: '丹东浪头机场', 锦州: '锦州湾机场', 营口: '营口兰旗机场',
  长春: '长春龙嘉国际机场', 吉林: '长春龙嘉国际机场', 延边: '延吉朝阳川国际机场',
  哈尔滨: '哈尔滨太平国际机场', 齐齐哈尔: '齐齐哈尔三家子机场', 牡丹江: '牡丹江海浪机场', 大庆: '大庆萨尔图机场',
  合肥: '合肥新桥国际机场', 黄山: '黄山屯溪国际机场', 安庆: '安庆天柱山机场', 阜阳: '阜阳西关机场',
  泉州: '泉州晋江国际机场', 莆田: '泉州晋江国际机场', 南昌: '南昌昌北国际机场', 九江: '南昌昌北国际机场', 赣州: '赣州黄金机场',
  济南: '济南遥墙国际机场', 烟台: '烟台蓬莱国际机场', 威海: '威海大水泊机场', 日照: '日照山字河机场', 临沂: '临沂启阳机场',
  郑州: '郑州新郑国际机场', 洛阳: '洛阳北郊机场', 南阳: '南阳姜营机场',
  宜昌: '宜昌三峡机场', 襄阳: '襄阳刘集机场', 恩施: '恩施许家坪机场',
  张家界: '张家界荷花国际机场', 岳阳: '岳阳三荷机场', 常德: '常德桃花源机场',
  湛江: '湛江吴川机场', 梅州: '梅州梅县机场', 汕头: '揭阳潮汕国际机场', 潮州: '揭阳潮汕国际机场', 揭阳: '揭阳潮汕国际机场',
  贵阳: '贵阳龙洞堡国际机场', 遵义: '遵义新舟机场', 铜仁: '铜仁凤凰机场',
  昭通: '昭通机场', 保山: '保山云瑞机场', 西双版纳: '西双版纳嘎洒国际机场', 迪庆: '迪庆香格里拉机场',
  兰州: '兰州中川国际机场', 天水: '天水麦积山机场', 张掖: '张掖甘州机场', 敦煌: '敦煌莫高国际机场',
  西宁: '西宁曹家堡国际机场', 呼和浩特: '呼和浩特白塔国际机场', 包头: '包头东河机场', 鄂尔多斯: '鄂尔多斯伊金霍洛国际机场',
  南宁: '南宁吴圩国际机场', 桂林: '桂林两江国际机场', 北海: '北海福成机场', 柳州: '柳州白莲机场',
  拉萨: '拉萨贡嘎机场', 林芝: '林芝米林机场', 银川: '银川河东国际机场', 中卫: '中卫沙坡头机场',
  乌鲁木齐: '乌鲁木齐地窝堡国际机场', 喀什: '喀什徕宁国际机场', 伊犁: '伊宁机场', 阿勒泰: '阿勒泰雪都机场',
}

const provinceHubAirports = {
  河北: '石家庄正定国际机场', 山西: '太原武宿国际机场', 辽宁: '沈阳桃仙国际机场', 吉林: '长春龙嘉国际机场', 黑龙江: '哈尔滨太平国际机场',
  江苏: '南京禄口国际机场', 浙江: '杭州萧山国际机场', 安徽: '合肥新桥国际机场', 福建: '福州长乐国际机场', 江西: '南昌昌北国际机场',
  山东: '济南遥墙国际机场', 河南: '郑州新郑国际机场', 湖北: '武汉天河国际机场', 湖南: '长沙黄花国际机场', 广东: '广州白云国际机场',
  海南: '海口美兰国际机场', 四川: '成都天府国际机场', 贵州: '贵阳龙洞堡国际机场', 云南: '昆明长水国际机场', 陕西: '西安咸阳国际机场',
  甘肃: '兰州中川国际机场', 青海: '西宁曹家堡国际机场', 内蒙古: '呼和浩特白塔国际机场', 广西: '南宁吴圩国际机场', 西藏: '拉萨贡嘎机场',
  宁夏: '银川河东国际机场', 新疆: '乌鲁木齐地窝堡国际机场', 天津: '天津滨海国际机场', 香港: '香港国际机场', 澳门: '澳门国际机场',
}

const stations = {
  上海: '上海虹桥站', 北京: '北京南站', 广州: '广州南站', 深圳: '深圳北站', 珠海: '珠海站', 杭州: '杭州东站', 宁波: '宁波站',
  温州: '温州南站', 南京: '南京南站', 苏州: '苏州北站', 无锡: '无锡东站', 成都: '成都东站', 绵阳: '绵阳站', 武汉: '武汉站',
  厦门: '厦门北站', 福州: '福州南站', 西安: '西安北站', 长沙: '长沙南站', 青岛: '青岛北站', 郑州: '郑州东站',
  昆明: '昆明南站', 大理: '大理站', 丽江: '丽江站', 东京: '东京站', 横滨: '横滨站', 京都: '京都站', 大阪: '新大阪站', 小樽: '小樽站', 首尔: '首尔站', 釜山: '釜山站',
}

const cityCodes = {
  上海: 'SHA', 北京: 'BJS', 广州: 'CAN', 深圳: 'SZX', 杭州: 'HGH', 宁波: 'NGB', 温州: 'WNZ', 南京: 'NKG', 苏州: 'SZV',
  成都: 'CTU', 重庆: 'CKG', 武汉: 'WUH', 厦门: 'XMN', 福州: 'FOC', 西安: 'SIA', 长沙: 'CSX', 青岛: 'TAO', 昆明: 'KMG',
  大理: 'DLU', 丽江: 'LJG', 三亚: 'SYX', 海口: 'HAK', 东京: 'TYO', 横滨: 'TYO', 京都: 'KIX', 大阪: 'OSA', 札幌: 'SPK', 小樽: 'SPK', 福冈: 'FUK',
  首尔: 'SEL', 釜山: 'PUS', 济州岛: 'CJU',
  天津: 'TSN', 石家庄: 'SJW', 唐山: 'TVS', 秦皇岛: 'BPE', 邯郸: 'HDG', 承德: 'CDE', 太原: 'TYN', 大同: 'DAT', 长治: 'CIH',
  运城: 'YCU', 临汾: 'LFQ', 沈阳: 'SHE', 大连: 'DLC', 丹东: 'DDG', 锦州: 'JNZ', 营口: 'YKH', 长春: 'CGQ', 吉林: 'CGQ',
  延边: 'YNJ', 哈尔滨: 'HRB', 齐齐哈尔: 'NDG', 牡丹江: 'MDG', 大庆: 'DQA', 合肥: 'HFE', 黄山: 'TXN', 安庆: 'AQG',
  阜阳: 'FUG', 泉州: 'JJN', 莆田: 'JJN', 南昌: 'KHN', 九江: 'KHN', 赣州: 'KOW', 义乌: 'YIW', 金华: 'YIW',
  济南: 'TNA', 郑州: 'CGO', 贵阳: 'KWE', 兰州: 'LHW', 西宁: 'XNN', 呼和浩特: 'HET', 南宁: 'NNG', 拉萨: 'LXA', 银川: 'INC',
  乌鲁木齐: 'URC', 烟台: 'YNT', 威海: 'WEH', 日照: 'RIZ', 临沂: 'LYI', 洛阳: 'LYA', 南阳: 'NNY', 宜昌: 'YIH',
  襄阳: 'XFN', 恩施: 'ENH', 张家界: 'DYG', 岳阳: 'YYA', 常德: 'CGD', 湛江: 'ZHA', 梅州: 'MXZ', 汕头: 'SWA',
  潮州: 'SWA', 揭阳: 'SWA', 遵义: 'ZYI', 铜仁: 'TEN', 昭通: 'ZAT', 保山: 'BSD', 西双版纳: 'JHG', 迪庆: 'DIG',
  天水: 'THQ', 张掖: 'YZY', 敦煌: 'DNH', 包头: 'BAV', 鄂尔多斯: 'DSN', 桂林: 'KWL', 北海: 'BHY', 柳州: 'LZH',
  林芝: 'LZY', 中卫: 'ZHY', 喀什: 'KHG', 伊犁: 'YIN', 阿勒泰: 'AAT',
  香港: 'HKG', 澳门: 'MFM', 名古屋: 'NGO', 冲绳: 'OKA', 广岛: 'HIJ', 熊本: 'KMJ', 长崎: 'NGS',
  仁川: 'SEL', 大邱: 'TAE', 光州: 'KWJ',
}

const airportSearchCities = {
  上海虹桥国际机场: '上海', 上海浦东国际机场: '上海', 北京首都国际机场: '北京', 北京大兴国际机场: '北京', 广州白云国际机场: '广州',
  深圳宝安国际机场: '深圳', 珠海金湾机场: '珠海', 杭州萧山国际机场: '杭州', 宁波栎社国际机场: '宁波', 温州龙湾国际机场: '温州',
  南京禄口国际机场: '南京', 苏南硕放国际机场: '无锡', 成都天府国际机场: '成都', 绵阳南郊机场: '绵阳', 武汉天河国际机场: '武汉',
  厦门高崎国际机场: '厦门', 福州长乐国际机场: '福州', 西安咸阳国际机场: '西安', 长沙黄花国际机场: '长沙', 青岛胶东国际机场: '青岛',
  郑州新郑国际机场: '郑州', 昆明长水国际机场: '昆明', 大理凤仪机场: '大理', 丽江三义机场: '丽江', 三亚凤凰国际机场: '三亚',
  海口美兰国际机场: '海口', 石家庄正定国际机场: '石家庄', 太原武宿国际机场: '太原', 沈阳桃仙国际机场: '沈阳',
  长春龙嘉国际机场: '长春', 哈尔滨太平国际机场: '哈尔滨', 合肥新桥国际机场: '合肥', 南昌昌北国际机场: '南昌',
  济南遥墙国际机场: '济南', 贵阳龙洞堡国际机场: '贵阳', 兰州中川国际机场: '兰州', 西宁曹家堡国际机场: '西宁',
  呼和浩特白塔国际机场: '呼和浩特', 南宁吴圩国际机场: '南宁', 拉萨贡嘎机场: '拉萨', 银川河东国际机场: '银川',
  乌鲁木齐地窝堡国际机场: '乌鲁木齐', 天津滨海国际机场: '天津', 香港国际机场: '香港', 澳门国际机场: '澳门',
  义乌机场: '义乌', 唐山三女河机场: '唐山', 秦皇岛北戴河机场: '秦皇岛', 邯郸机场: '邯郸', 承德普宁机场: '承德',
  大同云冈机场: '大同', 长治王村机场: '长治', 运城张孝机场: '运城', 临汾尧都机场: '临汾', 大连周水子国际机场: '大连',
  丹东浪头机场: '丹东', 锦州湾机场: '锦州', 营口兰旗机场: '营口', 延吉朝阳川国际机场: '延边',
  齐齐哈尔三家子机场: '齐齐哈尔', 牡丹江海浪机场: '牡丹江', 大庆萨尔图机场: '大庆', 黄山屯溪国际机场: '黄山',
  安庆天柱山机场: '安庆', 阜阳西关机场: '阜阳', 泉州晋江国际机场: '泉州', 赣州黄金机场: '赣州', 烟台蓬莱国际机场: '烟台',
  威海大水泊机场: '威海', 日照山字河机场: '日照', 临沂启阳机场: '临沂', 洛阳北郊机场: '洛阳', 南阳姜营机场: '南阳',
  宜昌三峡机场: '宜昌', 襄阳刘集机场: '襄阳', 恩施许家坪机场: '恩施', 张家界荷花国际机场: '张家界',
  岳阳三荷机场: '岳阳', 常德桃花源机场: '常德', 湛江吴川机场: '湛江', 梅州梅县机场: '梅州',
  揭阳潮汕国际机场: '揭阳', 遵义新舟机场: '遵义', 铜仁凤凰机场: '铜仁', 昭通机场: '昭通', 保山云瑞机场: '保山',
  西双版纳嘎洒国际机场: '西双版纳', 迪庆香格里拉机场: '迪庆', 天水麦积山机场: '天水', 张掖甘州机场: '张掖',
  敦煌莫高国际机场: '敦煌', 包头东河机场: '包头', 鄂尔多斯伊金霍洛国际机场: '鄂尔多斯', 桂林两江国际机场: '桂林',
  北海福成机场: '北海', 柳州白莲机场: '柳州', 林芝米林机场: '林芝', 中卫沙坡头机场: '中卫',
  喀什徕宁国际机场: '喀什', 伊宁机场: '伊犁', 阿勒泰雪都机场: '阿勒泰',
  东京羽田机场: '东京', 关西国际机场: '大阪', 新千岁机场: '札幌', 福冈机场: '福冈', 仁川国际机场: '首尔', 金海国际机场: '釜山', 济州国际机场: '济州岛',
}

const transportModes = [
  { id: 'plane', label: '飞机', icon: Plane },
  { id: 'highspeed', label: '高铁', icon: TrainFront },
  { id: 'train', label: '火车', icon: TrainFront },
  { id: 'metro', label: '地铁/城际', icon: TramFront },
]

const travelStyles = [
  { id: '爱拍照', icon: Camera }, { id: '吃美食', icon: Utensils }, { id: '特种兵，来都来了', icon: Route },
  { id: '随便逛逛', icon: Coffee }, { id: '走哪算哪', icon: Navigation }, { id: '买买买', icon: ShoppingBag },
]

const constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
const travelRoles = ['点点', '饭田鱼', '蒸馍', '张葛']
const cccVisitedPlaces = [
  { id: 'shanghai', name: '上海', x: 77, y: 43, globeX: 72, globeY: 42, date: '2024 春天', roles: ['点点', '饭田鱼'], memory: '一起在街区散步，把晚风和甜点都放进行程。' },
  { id: 'hangzhou', name: '杭州', x: 76, y: 45, globeX: 70, globeY: 45, date: '2024 夏天', roles: ['点点', '蒸馍'], memory: '湖边慢慢走，路线被阳光切成很柔软的几段。' },
  { id: 'tokyo', name: '东京', x: 84, y: 41, globeX: 80, globeY: 40, date: '2025 冬天', roles: ['饭田鱼', '张葛'], memory: '霓虹、地铁、便利店和一张张没有计划但很开心的照片。' },
  { id: 'seoul', name: '首尔', x: 81, y: 39, globeX: 77, globeY: 38, date: '2025 秋天', roles: ['蒸馍', '张葛'], memory: '把美食和街拍排进同一条线，走得很顺。' },
  { id: 'paris', name: '巴黎', x: 48, y: 36, globeX: 47, globeY: 36, date: '未来想去', roles: ['点点', '饭田鱼', '蒸馍', '张葛'], memory: '先点亮在地图上，等素材来了再补照片。' },
]
const domesticCodes = new Set(destinationGroups.国内)
const today = new Date().toISOString().split('T')[0]

function Brand({ inverse = false }) {
  return (
    <div className={`brand ${inverse ? 'brand--inverse' : ''}`}>
      <span className="brand-mark"><Sparkles size={16} /></span>
      <span>ccc's travelplan</span>
    </div>
  )
}

function IconButton({ label, children, type = 'button', ...props }) {
  return <button type={type} className="icon-button" aria-label={label} title={label} {...props}>{children}</button>
}

function Welcome({ onStart, onWorld }) {
  return (
    <main className="welcome-page">
      <video className="welcome-video" autoPlay muted loop playsInline poster="/assets/miracle.jpg">
        <source src="/assets/castle.mp4" type="video/mp4" />
      </video>
      <div className="welcome-wash" />
      <header className="welcome-nav shell"><Brand inverse /><span className="edition">PERSONAL EDITION · 01</span></header>
      <section className="welcome-content shell">
        <div className="welcome-copy">
          <p className="eyebrow">A LITTLE TRIP, MADE JUST FOR YOU</p>
          <h1>ccc's<br />travelplan</h1>
          <p className="welcome-note">把目的地、心情和预算交给我。<br />剩下的路，会被轻轻排好。</p>
          <div className="welcome-actions">
            <button className="primary-button primary-button--light" onClick={onStart}>
              和ccc一起去旅行 <ArrowRight size={18} />
            </button>
            <button className="outline-button outline-button--light" onClick={onWorld}>
              ccc到过的地方 <Globe2 size={18} />
            </button>
          </div>
        </div>
        <div className="art-stack" aria-hidden="true">
          <figure className="art-card art-card--back"><img src="/assets/blue.jpg" alt="" /></figure>
          <figure className="art-card art-card--mid"><img src="/assets/pink.jpg" alt="" /></figure>
          <figure className="art-card art-card--front"><img src="/assets/title.jpg" alt="" /></figure>
          <div className="glass-ticket"><span>DESTINATION</span><strong>Somewhere lovely</strong><small>planned with care · 2026</small></div>
        </div>
      </section>
      <div className="scroll-cue"><span>SCROLL INTO THE STORY</span><span className="scroll-line" /></div>
    </main>
  )
}

function Profile({ profile, setProfile, onBack, onNext }) {
  const valid = profile.name.trim() && profile.gender && profile.constellation && profile.relation
  return (
    <main className="profile-page">
      <video className="profile-video" autoPlay muted loop playsInline><source src="/assets/magic-eggs.mp4" type="video/mp4" /></video>
      <div className="profile-overlay" />
      <header className="app-topbar shell"><Brand /><IconButton label="返回首页" onClick={onBack}><ArrowLeft size={19} /></IconButton></header>
      <section className="profile-layout shell">
        <div className="profile-intro">
          <span className="step-kicker">01 / MEET YOU</span>
          <h2>先认识一下<br />这次旅行的主角</h2>
          <p>这里不需要密码。你的回答只会留在当前设备，用来调节这份计划的语气和节奏。</p>
          <div className="tiny-orbit"><Heart size={18} /><span>private & personal</span></div>
        </div>
        <form className="profile-form glass-panel" onSubmit={(e) => { e.preventDefault(); if (valid) onNext() }}>
          <label className="field-label" htmlFor="name">怎么称呼你？</label>
          <input id="name" className="line-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="输入你的名字" autoFocus />

          <fieldset>
            <legend className="field-label">你的性别</legend>
            <div className="segmented">
              {['女生', '男生', '不限定'].map((item) => <button type="button" key={item} className={profile.gender === item ? 'selected' : ''} onClick={() => setProfile({ ...profile, gender: item })}>{item}</button>)}
            </div>
          </fieldset>

          <label className="field-label" htmlFor="constellation">你的星座</label>
          <div className="select-wrap"><select id="constellation" value={profile.constellation} onChange={(e) => setProfile({ ...profile, constellation: e.target.value })}><option value="">请选择</option>{constellations.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={17} /></div>

          <fieldset>
            <legend className="field-label">你和 ccc 的关系</legend>
            <div className="relation-grid">
              {['很差', '一般', '还行', '很好'].map((item, index) => <button type="button" key={item} className={profile.relation === item ? 'selected' : ''} onClick={() => setProfile({ ...profile, relation: item })}><span>0{index + 1}</span>{item}</button>)}
            </div>
          </fieldset>

          <button className="primary-button full-button" disabled={!valid}>继续填写行程 <ArrowRight size={18} /></button>
        </form>
      </section>
    </main>
  )
}

function Stepper({ value, onChange, min = 1, max = 14 }) {
  return <div className="number-stepper"><IconButton label="减少一天" disabled={value <= min} onClick={() => onChange(value - 1)}><Minus size={17} /></IconButton><strong>{value}</strong><span>天</span><IconButton label="增加一天" disabled={value >= max} onClick={() => onChange(value + 1)}><Plus size={17} /></IconButton></div>
}

function Planner({ profile, trip, setTrip, onBack, onGenerate }) {
  const cities = originRegions[trip.originProvince]
  const destinations = destinationGroups[trip.region]
  const selectedDestinations = trip.destinations?.length ? trip.destinations : [destinations[0]]
  const primaryDestination = selectedDestinations[0]
  const valid = trip.styles.length > 0 && trip.startDate && selectedDestinations.length > 0 && trip.transportMode
  const toggleStyle = (style) => setTrip({ ...trip, styles: trip.styles.includes(style) ? trip.styles.filter((item) => item !== style) : [...trip.styles, style] })
  const toggleDestination = (city) => {
    const next = selectedDestinations.includes(city) ? selectedDestinations.filter((item) => item !== city) : [...selectedDestinations, city]
    setTrip({ ...trip, destinations: next.length ? next : [city] })
  }

  return (
    <main className="planner-page">
      <header className="planner-header shell">
        <Brand />
        <div className="progress-steps"><span className="done"><Check size={13} />认识你</span><span className="active">02 设计旅程</span><span>03 收到计划</span></div>
        <IconButton label="返回上一步" onClick={onBack}><ArrowLeft size={19} /></IconButton>
      </header>
      <section className="planner-shell shell">
        <aside className="planner-aside">
          <div className="aside-number">02</div>
          <p className="step-kicker">SHAPE THE JOURNEY</p>
          <h2>{profile.name}，<br />想去哪里走走？</h2>
          <p>选好就出发！</p>
          <div className="portrait-window"><img src={getDestinationData(primaryDestination).image} alt="旅行主题插画" /></div>
        </aside>

        <form className="planner-form" onSubmit={(e) => { e.preventDefault(); if (valid) onGenerate() }}>
          <section className="form-section">
            <div className="section-title"><MapPin size={20} /><div><span>DESTINATION</span><h3>从哪里出发，去哪里</h3></div></div>
            <div className="input-grid input-grid--four">
              <label><span>出发省份</span><div className="select-wrap"><select value={trip.originProvince} onChange={(e) => setTrip({ ...trip, originProvince: e.target.value, originCity: originRegions[e.target.value][0] })}>{Object.keys(originRegions).map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></div></label>
              <label><span>出发城市</span><div className="select-wrap"><select value={trip.originCity} onChange={(e) => setTrip({ ...trip, originCity: e.target.value })}>{cities.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></div></label>
              <label><span>目的地区域</span><div className="select-wrap"><select value={trip.region} onChange={(e) => setTrip({ ...trip, region: e.target.value, destinations: [destinationGroups[e.target.value][0]] })}>{Object.keys(destinationGroups).map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></div></label>
            </div>
            <fieldset className="destination-field">
              <legend>具体地点，可多选</legend>
              <div className="destination-options">
                {destinations.map((item) => (
                  <button type="button" key={item} className={selectedDestinations.includes(item) ? 'destination-chip selected' : 'destination-chip'} onClick={() => toggleDestination(item)}>
                    <span>{item}</span>{selectedDestinations.includes(item) && <Check size={14} />}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="form-section">
            <div className="section-title"><CalendarDays size={20} /><div><span>WHEN</span><h3>你想拥有多久美好的旅程？</h3></div></div>
            <div className="date-row">
              <label><span>出发日期</span><input type="date" min={today} value={trip.startDate} onChange={(e) => setTrip({ ...trip, startDate: e.target.value })} /></label>
              <label><span>预计到达第一站时间</span><input type="time" value={trip.arrivalTime} onChange={(e) => setTrip({ ...trip, arrivalTime: e.target.value })} /></label>
              <label><span>旅行天数</span><Stepper value={trip.days} onChange={(days) => setTrip({ ...trip, days })} min={2} max={14} /></label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-title"><TrainFront size={20} /><div><span>TRANSPORT</span><h3>你想优先选择哪种出行方式？</h3></div></div>
            <div className="mode-grid">
              {transportModes.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} className={trip.transportMode === id ? 'mode-chip selected' : 'mode-chip'} onClick={() => setTrip({ ...trip, transportMode: id })}>
                  <Icon size={18} /><span>{label}</span>{trip.transportMode === id && <Check size={15} />}
                </button>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="section-title"><WandSparkles size={20} /><div><span>TRAVEL MOOD</span><h3>选择你喜欢的旅行风格</h3></div></div>
            <div className="style-grid">
              {travelStyles.map(({ id, icon: Icon }) => <button type="button" key={id} className={trip.styles.includes(id) ? 'style-chip selected' : 'style-chip'} onClick={() => toggleStyle(id)}><Icon size={18} /><span>{id}</span>{trip.styles.includes(id) && <Check size={15} />}</button>)}
            </div>
          </section>

          <section className="form-section budget-section">
            <div className="section-title"><BedDouble size={20} /><div><span>STAY BUDGET</span><h3>每晚住宿预算</h3></div></div>
            <div className="budget-control"><input type="range" min="200" max="3000" step="100" value={trip.budget} onChange={(e) => setTrip({ ...trip, budget: Number(e.target.value) })} /><output>¥ {trip.budget}<small> / 晚</small></output></div>
            <div className="budget-scale"><span>舒服就好</span><span>住得讲究</span><span>想要特别</span></div>
          </section>

          <div className="planner-submit"><button className="primary-button" disabled={!valid}>生成我的旅行计划 <Sparkles size={17} /></button></div>
        </form>
      </section>
    </main>
  )
}

function hashNumber(value) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0)
}

function addDays(dateText, days) {
  const date = new Date(`${dateText}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

function formatDate(dateText, offset = 0) {
  return new Date(`${addDays(dateText, offset)}T12:00:00`).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

function getDestinationData(city) {
  if (destinationData[city]) return destinationData[city]
  const imagePool = ['/assets/blue.jpg', '/assets/pink.jpg', '/assets/green.jpg', '/assets/title.jpg', '/assets/miracle.jpg']
  const seed = hashNumber(city)
  const isDomestic = domesticCodes.has(city)
  return {
    tag: `${city}灵感线`,
    code: city.toUpperCase().slice(0, 3),
    station: stations[city] || `${city}站`,
    airport: airports[city] || `${city}机场`,
    image: imagePool[seed % imagePool.length],
    attractions: [`${city}核心街区`, `${city}美术馆或博物馆`, `${city}城市公园`, `${city}夜景步道`, `${city}人气商圈`, `${city}观景台`, `${city}特色市集`, `${city}小众街区`],
    foods: [`${city}高分本地菜`, `${city}人气小吃街`, `${city}咖啡甜品店`, `${city}老字号餐厅`, `${city}夜市排队店`, `${city}甜品伴手礼`],
    hotels: [`${city}中心亚朵酒店`, `${city}万豪系精选酒店`, `${city}设计精品酒店`],
    transit: isDomestic ? `${city}地铁/公交 + 景区接驳` : `${city}地铁 + 干线巴士`,
  }
}

function getNearestAirport(city) {
  if (nearestAirports[city]) return nearestAirports[city]
  if (airports[city]) {
    return {
      airport: airports[city],
      route: `${city}市区 → 公共交通/机场快线 → ${airports[city]}`,
      note: '该城市有可用机场，出发前仍建议按航班价格比较同区域机场',
    }
  }
  if (directAirportCities[city]) {
    return {
      airport: directAirportCities[city],
      route: `${city}市区 → 公共交通/机场巴士/出租 → ${directAirportCities[city]}`,
      note: `已为${city}匹配最近常用机场：${directAirportCities[city]}`,
    }
  }
  const province = Object.entries(originRegions).find(([, cities]) => cities.includes(city))?.[0]
  const hubAirport = provinceHubAirports[province]
  if (hubAirport) {
    return {
      airport: hubAirport,
      route: `${city} → 高铁/城际/机场巴士 → ${hubAirport}`,
      note: `${city}暂未收录常用民航机场，优先接驳到${province}省域枢纽机场`,
    }
  }
  return {
    airport: '最近枢纽机场',
    route: `${city} → 高铁/城际 → 最近枢纽机场`,
    note: '暂未收录本地机场，先按最近省会或高铁枢纽机场查询',
  }
}

function getAirportSearchCity(airport, fallbackCity) {
  return airportSearchCities[airport] || fallbackCity
}

function transportLabel(mode) {
  return transportModes.find((item) => item.id === mode)?.label || '飞机'
}

function buildCtripTransportLink(item, trip) {
  const fromCity = item.ctripFromCity || item.fromCity || trip.originCity
  const toCity = item.ctripToCity || item.targetCity
  const fromCode = cityCodes[fromCity] || fromCity
  const toCode = cityCodes[toCity] || toCity
  const fromCodePath = String(fromCode).toLowerCase()
  const toCodePath = String(toCode).toLowerCase()
  const from = encodeURIComponent(fromCity)
  const to = encodeURIComponent(toCity)
  const date = item.date || trip.startDate
  if (item.type === 'flight' || item.type === 'combo') return `https://flights.ctrip.com/online/list/oneway-${fromCodePath}-${toCodePath}?depdate=${date}&cabin=y_s&adult=1&child=0&infant=0&from=${from}&to=${to}&ddate=${date}&dcity=${fromCode}&acity=${toCode}`
  return `https://trains.ctrip.com/webapp/train/list?ticketType=0&dStation=${from}&aStation=${to}&dDate=${date}`
}

function buildCtripLegLink(fromCity, toCity, date, type = 'train') {
  const from = encodeURIComponent(fromCity)
  const to = encodeURIComponent(toCity)
  const fromCode = cityCodes[fromCity] || fromCity
  const toCode = cityCodes[toCity] || toCity
  const fromCodePath = String(fromCode).toLowerCase()
  const toCodePath = String(toCode).toLowerCase()
  if (type === 'flight') return `https://flights.ctrip.com/online/list/oneway-${fromCodePath}-${toCodePath}?depdate=${date}&cabin=y_s&adult=1&child=0&infant=0&from=${from}&to=${to}&ddate=${date}&dcity=${fromCode}&acity=${toCode}`
  return `https://trains.ctrip.com/webapp/train/list?ticketType=0&dStation=${from}&aStation=${to}&dDate=${date}`
}

function buildGoogleMapsLink(city, hotelName, address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${address || city}`)}`
}

function buildGooglePlaceLink(city, placeName) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName} ${city}`)}`
}

function buildGoogleDirectionsLink(fromCity, toCity) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(fromCity)}&destination=${encodeURIComponent(toCity)}&travelmode=transit`
}

function buildHotelOptions(city, trip) {
  const data = getDestinationData(city)
  const hotelIndex = trip.budget < 700 ? 0 : trip.budget < 1600 ? 1 : 2
  const anchors = [
    ['地铁站', '约 260m', '适合公共交通换乘'],
    ['购物商场', '约 480m', '适合买买买和晚餐后散步'],
    ['核心景点片区', '约 900m', '适合拍照和慢逛'],
  ]
  return data.hotels.map((name, index) => ({
    name,
    tier: index === hotelIndex ? '最贴合预算' : index < hotelIndex ? '更省预算' : '升级备选',
    address: hotelDetails[name]?.address || `${city}核心住宿区，具体地址以 Google 地图为准`,
    station: hotelDetails[name]?.station || anchors[index]?.[0] || '换乘点',
    stationDistance: hotelDetails[name]?.stationDistance || anchors[index]?.[1] || '约 700m',
    district: hotelDetails[name]?.district || '核心商圈',
    districtDistance: hotelDetails[name]?.districtDistance || '约 1km',
    reason: hotelDetails[name]?.note || anchors[index]?.[2] || '方便接入当天路线',
    link: buildGoogleMapsLink(city, name, hotelDetails[name]?.address),
  }))
}

function buildTransport(trip, destinations) {
  const targetCity = destinations[0]
  const returnCity = destinations[destinations.length - 1]
  const data = getDestinationData(targetCity)
  const returnData = getDestinationData(returnCity)
  const seed = hashNumber(`${trip.originCity}${targetCity}${trip.startDate}${trip.transportMode}`)
  const originAirportInfo = getNearestAirport(trip.originCity)
  const originAirport = originAirportInfo.airport
  const originFlightCity = getAirportSearchCity(originAirport, trip.originCity)
  const originStation = stations[trip.originCity] || `${trip.originCity}站`
  const returnDate = addDays(trip.startDate, trip.days)
  const domestic = trip.region === '国内'
  const mode = trip.transportMode
  const base = {
    targetCity,
    fromCity: trip.originCity,
    baggage: '托运行李额以携程实时票规为准',
  }

  if (!domestic && mode !== 'plane') {
    const gatewayStation = mode === 'metro' ? `${trip.originCity}市区地铁站` : originStation
    const gatewayAirport = seed % 2 && trip.originCity === '上海' ? '上海浦东国际机场' : originAirport
    const gatewayFlightCity = getAirportSearchCity(gatewayAirport, originFlightCity)
    const destinationFlightCity = getAirportSearchCity(data.airport, targetCity)
    const returnFlightCity = getAirportSearchCity(returnData.airport, returnCity)
    const comboLabel = mode === 'highspeed' ? '高铁接驳' : mode === 'train' ? '火车接驳' : '地铁/城际接驳'
    return [
      { ...base, badge: '去程最低花销', type: 'combo', icon: mode === 'metro' ? TramFront : TrainFront, number: '携程实时查询', date: trip.startDate, depart: trip.startDate, arrive: '按实时结果', duration: '按实时结果', from: gatewayStation, to: data.airport, note: `${comboLabel} + 国际航班 · 托运行李额以票规为准`, direct: '打开后按价格排序', via: `${originAirportInfo.route} → ${data.airport}`, accessLink: buildGoogleDirectionsLink(trip.originCity, gatewayAirport), accessLabel: '出发地到机场路线', ctripFromCity: gatewayFlightCity, ctripToCity: destinationFlightCity },
      { ...base, badge: '返程最低花销', type: 'flight', icon: Plane, number: '返程实时查询', date: returnDate, fromCity: returnCity, targetCity: trip.originCity, depart: returnDate, arrive: '按实时结果', duration: '按实时结果', from: returnData.airport || `${returnCity}机场`, to: originAirport, note: '返程国际航班 · 行李额以票规为准', direct: '打开后按价格排序', accessLink: buildGoogleDirectionsLink(originAirport, trip.originCity), accessLabel: '机场回出发地路线', ctripFromCity: returnFlightCity, ctripToCity: originFlightCity },
    ]
  }

  if (mode === 'plane' || !domestic) {
    const destinationFlightCity = getAirportSearchCity(data.airport, targetCity)
    const returnFlightCity = getAirportSearchCity(returnData.airport, returnCity)
    return [
      { ...base, badge: '去程最低花销', type: 'flight', icon: Plane, number: '携程实时查询', date: trip.startDate, depart: trip.startDate, arrive: '按实时结果', duration: '按实时结果', from: originAirport, to: data.airport, note: `${originAirportInfo.note} · 行李额以票规为准`, direct: '打开后按价格排序', accessLink: buildGoogleDirectionsLink(trip.originCity, originAirport), accessLabel: '出发地到机场路线', via: originAirportInfo.route, ctripFromCity: originFlightCity, ctripToCity: destinationFlightCity },
      { ...base, badge: '返程最低花销', type: 'flight', icon: Plane, number: '返程实时查询', date: returnDate, fromCity: returnCity, targetCity: trip.originCity, depart: returnDate, arrive: '按实时结果', duration: '按实时结果', from: returnData.airport || `${returnCity}机场`, to: originAirport, note: '返程航班 · 行李额以票规为准', direct: '打开后按价格排序', accessLink: buildGoogleDirectionsLink(originAirport, trip.originCity), accessLabel: '机场回出发地路线', ctripFromCity: returnFlightCity, ctripToCity: originFlightCity },
    ]
  }

  if (mode === 'highspeed') {
    return [
      { ...base, badge: '去程最低花销', type: 'highspeed', icon: TrainFront, number: '携程实时查询', date: trip.startDate, depart: trip.startDate, arrive: '按实时结果', duration: '按实时结果', from: originStation, to: data.station, note: '二等座 · 实时余票', direct: '打开后按价格排序' },
      { ...base, badge: '返程查询', type: 'highspeed', icon: TrainFront, number: '返程实时查询', date: returnDate, fromCity: returnCity, targetCity: trip.originCity, depart: returnDate, arrive: '按实时结果', duration: '按实时结果', from: returnData.station, to: originStation, note: '返程二等座 · 实时余票', direct: '打开后按价格排序' },
    ]
  }

  if (mode === 'train') {
    return [
      { ...base, badge: '去程最低花销', type: 'train', icon: TrainFront, number: '携程实时查询', date: trip.startDate, depart: trip.startDate, arrive: '按实时结果', duration: '按实时结果', from: originStation, to: data.station, note: '硬卧/硬座 · 实时余票', direct: '打开后按价格排序' },
      { ...base, badge: '返程查询', type: 'train', icon: TrainFront, number: '返程实时查询', date: returnDate, fromCity: returnCity, targetCity: trip.originCity, depart: returnDate, arrive: '按实时结果', duration: '按实时结果', from: returnData.station, to: originStation, note: '返程火车票 · 实时余票', direct: '打开后按价格排序' },
    ]
  }

  return [
    { ...base, badge: '去程最低花销', type: 'metro', icon: TramFront, number: '携程实时查询', date: trip.startDate, depart: trip.startDate, arrive: '按实时结果', duration: '按实时结果', from: originStation, to: data.station, note: '地铁接驳 + 城际铁路', direct: '打开后按价格排序' },
    { ...base, badge: '返程查询', type: 'metro', icon: TramFront, number: '返程实时查询', date: returnDate, fromCity: returnCity, targetCity: trip.originCity, depart: returnDate, arrive: '按实时结果', duration: '按实时结果', from: returnData.station, to: originStation, note: '返程城际/地铁接驳', direct: '打开后按价格排序' },
  ]
}

function buildCityStops(destinations, days) {
  const base = Math.max(1, Math.floor(days / destinations.length))
  let rest = days - base * destinations.length
  let startOffset = 0
  return destinations.map((city) => {
    const stayDays = base + (rest > 0 ? 1 : 0)
    rest -= 1
    const stop = { city, days: stayDays, startOffset, data: getDestinationData(city) }
    startOffset += stayDays
    return stop
  })
}

function buildIntercityNote(from, to, region, returnTrip = false) {
  if (!from) return '从酒店出发，首选公共交通到达第一个片区'
  const action = returnTrip ? '返程' : '转场'
  if (region === '国内') return `${from} → ${to}：${action}优先高铁/城际铁路，打开携程后按价格排序，站点到酒店用地铁接驳`
  if (returnTrip) return `${from} → ${to}：返程优先机场铁路/机场巴士接驳 + 国际航班，打开携程后按价格或耗时排序确认实时票价`
  if (region === '日本') return `${from} → ${to}：${action}优先 JR/新干线/机场巴士组合，使用 IC 卡减少排队`
  return `${from} → ${to}：${action}优先 KTX/机场铁路/高速巴士，避开跨城回头路`
}

function buildTransferPlans(trip, destinations, stops) {
  const plans = []
  stops.slice(1).forEach((stop, index) => {
    const fromCity = stops[index].city
    const date = addDays(trip.startDate, stop.startOffset)
    const domesticTransfer = trip.region === '国内'
    plans.push({
      label: '城市转场',
      date,
      route: `${fromCity} → ${stop.city}`,
      method: domesticTransfer ? '携程高铁/城际查询' : 'Google Maps 公共交通路线',
      detail: buildIntercityNote(fromCity, stop.city, trip.region),
      link: domesticTransfer ? buildCtripLegLink(fromCity, stop.city, date, 'train') : buildGoogleDirectionsLink(fromCity, stop.city),
      linkLabel: domesticTransfer ? '打开携程实时查询' : '打开 Google Maps 路线',
    })
  })

  return plans
}

function shiftTime(time = '11:30', minutes = 0) {
  const [hour = 0, minute = 0] = time.split(':').map(Number)
  const total = Math.max(0, Math.min(23 * 60 + 50, hour * 60 + minute + minutes))
  const nextHour = String(Math.floor(total / 60)).padStart(2, '0')
  const nextMinute = String(total % 60).padStart(2, '0')
  return `${nextHour}:${nextMinute}`
}

function buildItinerary(trip, destinations) {
  const stops = buildCityStops(destinations, trip.days)
  const days = []
  let dayCursor = 0
  stops.forEach((stop, stopIndex) => {
    Array.from({ length: stop.days }, (_, localIndex) => {
      const attractionA = stop.data.attractions[(localIndex * 2) % stop.data.attractions.length]
      const attractionB = stop.data.attractions[(localIndex * 2 + 1) % stop.data.attractions.length]
      const attractionC = stop.data.attractions[(localIndex * 2 + 2) % stop.data.attractions.length]
      const food = stop.data.foods[localIndex % stop.data.foods.length]
      const dinner = stop.data.foods[(localIndex + 1) % stop.data.foods.length]
      const previousCity = stopIndex > 0 && localIndex === 0 ? stops[stopIndex - 1].city : null
      const isFirstDay = dayCursor === 0
      const isLastDay = dayCursor === trip.days - 1
      const startTime = previousCity ? '10:30' : isFirstDay ? trip.arrivalTime || '11:30' : '09:20'
      const items = [
        { time: startTime, title: previousCity ? `${previousCity} 前往 ${stop.city}` : isFirstDay ? `${stop.city} 抵达与酒店放行李` : attractionA, type: previousCity || isFirstDay ? '交通/入住' : '景点', note: previousCity ? buildIntercityNote(previousCity, stop.city, trip.region) : isFirstDay ? `预计 ${startTime} 抵达，先用公共交通到酒店放行李，再从住宿片区开始玩` : '优先公共交通到达，单段步行尽量控制在 12 分钟内' },
        { time: shiftTime(startTime, isFirstDay ? 90 : 110), title: food, type: '美食', note: `安排在 ${attractionA} 或住宿片区附近，先吃再进入密集游玩区` },
        { time: shiftTime(startTime, isFirstDay ? 210 : 250), title: isFirstDay ? attractionA : attractionB, type: '景点', note: `搭乘 ${stop.data.transit}，按花销最低原则选择公交/地铁优先` },
        { time: shiftTime(startTime, isFirstDay ? 330 : 390), title: trip.styles.includes('买买买') ? `${stop.city} 商圈顺路补给` : attractionC, type: trip.styles.includes('买买买') ? '商圈' : '景点', note: trip.styles.includes('买买买') ? '放在回酒店方向，避免购物后继续远距离移动' : '作为同片区补充点，天气不好时可替换为室内展馆或咖啡店' },
        { time: '18:20', title: dinner, type: '晚餐', note: '安排在酒店或当天最后一个景点附近，减少夜间换乘' },
        { time: '20:10', title: `${stop.city} 住宿周边`, type: '夜晚', note: '晚餐后回到住宿附近，避免跨区折返' },
      ]
      if (isLastDay) {
        items.push({ time: '21:10', title: `${stop.city} 酒店 → 机场`, type: '离境接驳', note: '行程结束后，从已选择酒店出发去机场，优先机场铁路、机场巴士或公共交通换乘少的路线' })
      }
      days.push({
        day: dayCursor + 1,
        date: formatDate(trip.startDate, dayCursor),
        city: stop.city,
        title: previousCity ? `低成本转场到 ${stop.city}` : isFirstDay ? '按到达时间轻松入场' : `${stop.data.tag} · 顺路漫游`,
        transit: stop.data.transit,
        transferNote: buildIntercityNote(previousCity, stop.city, trip.region),
        items,
      })
      dayCursor += 1
      return null
    })
  })
  return days.slice(0, trip.days)
}

function Recommendation({ profile, trip, onRestart, onEdit }) {
  const [activeDay, setActiveDay] = useState(0)
  const [selectedHotels, setSelectedHotels] = useState({})
  const destinations = trip.destinations?.length ? trip.destinations : [destinationGroups[trip.region][0]]
  const primaryData = getDestinationData(destinations[0])
  const transport = useMemo(() => buildTransport(trip, destinations), [trip, destinations])
  const stops = useMemo(() => buildCityStops(destinations, trip.days), [destinations, trip.days])
  const transferPlans = useMemo(() => buildTransferPlans(trip, destinations, stops), [trip, destinations, stops])
  const itinerary = useMemo(() => buildItinerary(trip, destinations), [trip, destinations])
  const relationCopy = profile.relation === '很好' ? '我把最舒服的节奏留给你。' : profile.relation === '很差' ? '即使关系有点微妙，路线也会认真安排。' : '刚刚好的关系，也配得上一段好旅程。'
  const destinationText = destinations.join('、')
  const activeDayPlan = itinerary[activeDay]
  const activeHotelOptions = buildHotelOptions(activeDayPlan.city, trip)
  const fallbackHotel = activeHotelOptions.find((hotel) => hotel.tier === '最贴合预算') || activeHotelOptions[0]
  const activeCityHotel = selectedHotels[activeDayPlan.city] || fallbackHotel
  const activeHotelOrigin = `${activeCityHotel.name} ${activeCityHotel.address}`
  const firstDailyStop = activeDayPlan.items.find((item) => !['交通/入住', '夜晚', '离境接驳'].includes(item.type))?.title || activeDayPlan.city
  const firstLegLink = buildGoogleDirectionsLink(activeHotelOrigin, `${firstDailyStop} ${activeDayPlan.city}`)
  const getTimelineItem = (item) => {
    if (item.type === '夜晚') {
      return {
        ...item,
        title: `${activeCityHotel.name} 周边`,
        note: `晚餐后回到 ${activeCityHotel.name}，以 ${activeCityHotel.district} 或酒店附近收尾，避免跨区折返。`,
        link: activeCityHotel.link,
        linkLabel: '查看住宿位置',
      }
    }
    if (item.type === '离境接驳') {
      const airport = getDestinationData(activeDayPlan.city).airport || getNearestAirport(activeDayPlan.city).airport
      return {
        ...item,
        title: `${activeCityHotel.name} → ${airport}`,
        note: `从 ${activeCityHotel.name} 出发去 ${airport}，优先公共交通、机场铁路或机场巴士，打开 Google Maps 后按实时换乘选择。`,
        link: buildGoogleDirectionsLink(activeHotelOrigin, airport),
        linkLabel: '酒店去机场路线',
      }
    }
    return {
      ...item,
      link: item.type === '交通/入住' ? buildGoogleDirectionsLink(activeHotelOrigin, `${activeDayPlan.city} ${getDestinationData(activeDayPlan.city).station}`) : buildGooglePlaceLink(activeDayPlan.city, item.title),
      linkLabel: item.type === '交通/入住' ? '查看交通路线' : 'Google 地图',
    }
  }

  return (
    <main className="result-page">
      <header className="result-header shell"><Brand /><div className="result-actions"><button className="text-button" onClick={onEdit}>修改选择</button><IconButton label="重新开始" onClick={onRestart}><Sparkles size={18} /></IconButton></div></header>

      <section className="result-hero shell">
        <div className="result-hero-copy">
          <p className="eyebrow">YOUR PERSONAL TRAVEL NOTE · 001</p>
          <div className="result-title" role="heading" aria-level="1" aria-label={`${profile.name} 的 ${destinations[0]}旅行计划`}>
            <SplitText
              tag="span"
              text={`${profile.name} 的`}
              className="result-title-line"
              splitType="chars"
              delay={34}
              duration={0.78}
              ease="back.out(1.35)"
              from={{ opacity: 0, y: 76, rotateX: -70 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              threshold={0.1}
              rootMargin="-60px"
              textAlign="left"
            />
            <SplitText
              tag="span"
              text={`${destinations[0]}旅行计划`}
              className="result-title-line result-title-line--accent"
              splitType="chars"
              delay={28}
              duration={0.84}
              ease="power4.out"
              from={{ opacity: 0, y: 88, scale: 0.92 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.1}
              rootMargin="-60px"
              textAlign="left"
            />
          </div>
          <p>{relationCopy}<br />从 {trip.originCity} 出发的 {trip.days} 天，连续去 {destinationText}，少走路，也少走回头路。</p>
          <div className="trip-facts"><span><CalendarDays size={16} />{trip.startDate}</span><span><MapPin size={16} />{trip.originCity} → {destinationText}</span><span><TrainFront size={16} />优先 {transportLabel(trip.transportMode)}</span><span><BedDouble size={16} />¥{trip.budget}/晚</span></div>
          <div className="result-signal-grid" aria-label="计划摘要">
            <span><strong>{destinations.length}</strong>目的地</span>
            <span><strong>{trip.days}</strong>旅行天数</span>
            <span><strong>{trip.arrivalTime}</strong>到达后开玩</span>
          </div>
        </div>
      </section>

      <section className="content-band route-band">
        <div className="shell section-shell">
          <div className="section-heading"><div><span>01 · MASTER ROUTE</span><h2>先定每一站待多久</h2></div><p>按照总天数把城市拆成停留段；多目的地时，这里只保留城市之间的转场，去程和返程统一在下一部分查询。</p></div>
          <div className="stay-plan-grid">
            {stops.map((stop, index) => (
              <article className="stay-plan-card" key={stop.city}>
                <span>STOP {String(index + 1).padStart(2, '0')}</span>
                <h3>{stop.city}</h3>
                <p>{formatDate(trip.startDate, stop.startOffset)} 开始，停留 {stop.days} 天</p>
                <small>住宿建议靠近 {stop.data.transit.split(' + ')[0]}，方便串联景点和美食。</small>
              </article>
            ))}
          </div>
          <div className="transfer-plan-list">
            {transferPlans.length === 0 && <article className="transfer-plan-card transfer-plan-card--quiet"><div><span>NO TRANSFER</span><h3>单一目的地</h3></div><p><Clock3 size={16} />本次不需要城市转场</p><small>去程与返程请看下一部分，行程内交通会在每日路线中按酒店位置安排。</small></article>}
            {transferPlans.map((plan, index) => (
              <article className="transfer-plan-card" key={`${plan.route}-${plan.date}`}>
                <div><span>{String(index + 1).padStart(2, '0')} · {plan.label}</span><h3>{plan.route}</h3></div>
                <p><Clock3 size={16} />{plan.date} · {plan.method}</p>
                <small>{plan.detail}</small>
                <a href={plan.link} target="_blank" rel="noreferrer">{plan.linkLabel || '打开路线'} <ExternalLink size={15} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-band transport-band">
        <div className="shell section-shell">
          <div className="section-heading"><div><span>02 · GO & RETURN</span><h2>去程与返程查询</h2></div><p>这里只保留最低花销去程和返程入口；携程页面会带上出发地、目的地和日期，国外城市间移动在总路线里使用 Google Maps。</p></div>
          <div className="transport-grid">
            {transport.map((item) => {
              const Icon = item.icon
              return <article className="transport-card" key={item.badge}>
                <div className="transport-top"><span className="recommend-badge">{item.badge}</span><Icon size={23} /></div>
                <div className="transport-number">{item.number}<small>{item.note}</small></div>
                <p className="query-note">携程预填：{item.ctripFromCity || item.fromCity || trip.originCity} → {item.ctripToCity || item.targetCity} · {item.date || trip.startDate}</p>
                <div className="time-line"><div><strong>{item.depart}</strong><span>{item.from}</span></div><div className="duration"><span>{item.duration}</span><i /><small>{item.direct}</small></div><div><strong>{item.arrive}</strong><span>{item.to}</span></div></div>
                {item.via && <p className="baggage-note">组合路线：{item.via}</p>}
                {(item.type === 'flight' || item.type === 'combo') && <p className="baggage-note">托运行李额、航班号、退改签和实时票价请以携程查询结果为准。</p>}
                <div className="transport-footer"><strong>实时查询</strong><span>{item.accessLink && <a href={item.accessLink} target="_blank" rel="noreferrer">{item.accessLabel} <ExternalLink size={15} /></a>}<a href={buildCtripTransportLink(item, trip)} target="_blank" rel="noreferrer">去携程查看 <ExternalLink size={15} /></a></span></div>
              </article>
            })}
          </div>
        </div>
      </section>

      <section className="content-band discover-band">
        <div className="shell section-shell">
          <div className="section-heading"><div><span>03 · STAY & DISCOVER</span><h2>住在好吃、好逛的附近</h2></div><p>每个目的地都列出多家备选酒店，标注具体地址、附近地铁站和商圈距离，点击可进入 Google 地图定位。</p></div>
          <div className="city-discover-stack">
            {destinations.map((city) => {
              const data = getDestinationData(city)
              const stop = stops.find((item) => item.city === city)
              const checkIn = addDays(trip.startDate, stop?.startOffset || 0)
              const checkOut = addDays(trip.startDate, (stop?.startOffset || 0) + (stop?.days || 1))
              const hotelOptions = buildHotelOptions(city, trip)
              return (
                <div className="discover-layout" key={city}>
                  <article className="hotel-feature">
                    <div className="hotel-copy"><span className="recommend-badge"><Hotel size={14} /> 备选住宿</span><h3>{city} 住宿候选</h3><p>按照入住 {checkIn}，退房 {checkOut}，停留 {stop?.days || 1} 晚，每晚 ¥{trip.budget} 的预算档位筛选。先选一间作为路线起点，再去 Google 地图查看位置、路线和周边评价。</p><div className="hotel-options">{hotelOptions.map((hotel) => <article className={selectedHotels[city]?.name === hotel.name ? 'hotel-option-card selected' : 'hotel-option-card'} key={hotel.name}><span>{hotel.tier}</span><strong>{hotel.name}</strong><small><MapPin size={14} /> {hotel.address}</small><small>距{hotel.station} {hotel.stationDistance} · 距{hotel.district} {hotel.districtDistance}</small><small>{hotel.reason}</small><div className="hotel-option-actions"><button type="button" onClick={() => setSelectedHotels({ ...selectedHotels, [city]: hotel })}>选为住宿</button><a href={hotel.link} target="_blank" rel="noreferrer">Google 地图 <ExternalLink size={13} /></a></div></article>)}</div></div>
                  </article>
                  <div className="recommend-list">
                    <div className="recommend-column"><div className="mini-heading"><Camera size={18} /><span>{city} 值得去</span></div>{data.attractions.map((item, index) => <a className="list-item list-item--link" href={buildGooglePlaceLink(city, item)} target="_blank" rel="noreferrer" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}<ExternalLink size={13} /></strong><small>{trip.styles.includes('爱拍照') ? '适合拍照 · 已按光线排时段' : '高分推荐 · 公交可达'} · Google 地图</small></a>)}</div>
                    <div className="recommend-column"><div className="mini-heading"><Utensils size={18} /><span>{city} 值得吃</span></div>{data.foods.map((item, index) => <a className="list-item list-item--link" href={buildGooglePlaceLink(city, item)} target="_blank" rel="noreferrer" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}<ExternalLink size={13} /></strong><small>{trip.styles.includes('吃美食') ? '优先安排 · 建议错峰' : '当地口味 · 顺路到达'} · Google 地图</small></a>)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="content-band route-detail-band">
        <div className="shell section-shell">
          <div className="section-heading"><div><span>04 · AFTER STAY</span><h2>选好酒店后的每日路线</h2></div><p>这里作为最后一步，按你选择的住宿作为当天起点；还没选择时，会先使用预算最贴合的酒店候选。</p></div>
          <div className="day-tabs" role="tablist" aria-label="选择行程日期">{itinerary.map((day, index) => <button role="tab" aria-selected={activeDay === index} className={activeDay === index ? 'active' : ''} key={day.day} onClick={() => setActiveDay(index)}><span>DAY {String(day.day).padStart(2, '0')}</span><small>{day.date} · {day.city}</small></button>)}</div>
          <div className="route-layout">
            <div className="route-intro"><span>{activeDayPlan.date} · {activeDayPlan.city}</span><h3>{activeDayPlan.title}</h3><p><TrainFront size={17} /> 当日主线：{activeDayPlan.transit}</p><div className="route-note"><Navigation size={18} /><span>从 {activeCityHotel.name} 出发。{activeDayPlan.transferNote}<br />单段步行尽量控制在 12 分钟内</span><a href={firstLegLink} target="_blank" rel="noreferrer">打开首段路线 <ExternalLink size={13} /></a></div></div>
            <div className="timeline">{activeDayPlan.items.map((item, index) => {
              const visibleItem = getTimelineItem(item)
              return <div className="timeline-item" key={`${visibleItem.time}-${visibleItem.title}`}><time>{visibleItem.time}</time><span className="timeline-dot">{index + 1}</span><div><small>{visibleItem.type}</small><h4>{visibleItem.title}</h4><p>{visibleItem.note}</p><a className="timeline-map-link" href={visibleItem.link} target="_blank" rel="noreferrer">{visibleItem.linkLabel} <ExternalLink size={13} /></a></div></div>
            })}</div>
          </div>
        </div>
      </section>

      <section className="footer-loop" aria-label="ccc's travelplan 循环文字">
        <CurvedLoop
          marqueeText="ccc's travelplan ✦ 和 ccc 一起去旅行 ✦ make it soft, make it yours ✦ "
          speed={1.4}
          curveAmount={210}
          direction="right"
          interactive
          className="curved-loop-text"
        />
      </section>
      <footer className="site-footer shell"><Brand /><p>路线是一份温柔的草稿。出发前，请再次确认开放时间、预约规则、携程实时交通与住宿价格。</p><button className="text-button" onClick={onEdit}>回去调整计划 <ArrowRight size={15} /></button></footer>
    </main>
  )
}

function CccWorld({ onBack }) {
  const [role, setRole] = useState(travelRoles[0])
  const [mapOpen, setMapOpen] = useState(false)
  const [activePlace, setActivePlace] = useState(cccVisitedPlaces[0])
  const [photos, setPhotos] = useState({})
  const [rotation, setRotation] = useState({ x: -16, y: -28 })
  const dragRef = useRef({ active: false, moved: false, x: 0, y: 0 })
  const visiblePlaces = cccVisitedPlaces.filter((place) => place.roles.includes(role))

  const handlePointerDown = (event) => {
    dragRef.current = { active: true, moved: false, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return
    const dx = event.clientX - dragRef.current.x
    const dy = event.clientY - dragRef.current.y
    dragRef.current = { active: true, moved: dragRef.current.moved || Math.abs(dx) + Math.abs(dy) > 4, x: event.clientX, y: event.clientY }
    setRotation((current) => ({ x: Math.max(-50, Math.min(50, current.x - dy * 0.18)), y: current.y + dx * 0.22 }))
  }

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file || !activePlace) return
    const reader = new FileReader()
    reader.onload = () => setPhotos((current) => ({ ...current, [activePlace.id]: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <main className="world-page">
      <header className="world-header shell"><Brand /><button className="text-button" onClick={onBack}>返回首页 <ArrowLeft size={15} /></button></header>
      <section className="world-shell shell">
        <div className="world-copy">
          <p className="eyebrow">CCC MEMORY MAP · 002</p>
          <h1>ccc到过的地方</h1>
          <p>先选择你是谁，再看和 ccc 一起被点亮的地点。这个版本先做可运行的基础体验，后面可以继续替换成你的真实照片和素材。</p>
          <div className="role-grid" aria-label="选择角色">
            {travelRoles.map((item) => <button type="button" className={role === item ? 'selected' : ''} key={item} onClick={() => { setRole(item); setActivePlace(cccVisitedPlaces.find((place) => place.roles.includes(item)) || cccVisitedPlaces[0]) }}>{item}</button>)}
          </div>
        </div>

        {!mapOpen ? (
          <button
            type="button"
            className="globe-stage"
            onClick={() => { if (!dragRef.current.moved) setMapOpen(true) }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => { dragRef.current.active = false }}
            onPointerLeave={() => { dragRef.current.active = false }}
            aria-label="打开世界地图"
          >
            <div className="tech-globe" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
              <span className="globe-grid globe-grid--lat" />
              <span className="globe-grid globe-grid--lng" />
              {visiblePlaces.map((place) => <i key={place.id} className="globe-pin" style={{ left: `${place.globeX}%`, top: `${place.globeY}%` }} />)}
            </div>
            <span className="globe-hint">拖动旋转 · 点击打开地图</span>
          </button>
        ) : (
          <div className="memory-map">
            <div className="world-map-surface" aria-label="世界地图">
              {visiblePlaces.map((place) => (
                <button type="button" key={place.id} className={activePlace?.id === place.id ? 'map-pin active' : 'map-pin'} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={() => setActivePlace(place)}>
                  <span>{place.name}</span>
                </button>
              ))}
            </div>
            <aside className="memory-panel glass-panel">
              <span className="recommend-badge"><MapPin size={14} /> {role} 和 ccc</span>
              <h2>{activePlace?.name}</h2>
              <p>{activePlace?.date}</p>
              <small>{activePlace?.memory}</small>
              <label className="upload-tile">
                <ImagePlus size={18} />
                <span>上传这里的照片</span>
                <input type="file" accept="image/*" onChange={handlePhoto} />
              </label>
              {photos[activePlace?.id] && <img className="memory-photo" src={photos[activePlace.id]} alt={`${activePlace.name} 照片记录`} />}
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [profile, setProfile] = useState({ name: '', gender: '', constellation: '', relation: '' })
  const [trip, setTrip] = useState({ originProvince: '上海', originCity: '上海', region: '日本', destinations: ['东京'], startDate: today, arrivalTime: '11:30', days: 4, transportMode: 'plane', styles: ['爱拍照', '吃美食'], budget: 900 })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [screen])

  return (
    <ClickSpark
      sparkColor="#f17fa3"
      sparkSize={12}
      sparkRadius={28}
      sparkCount={10}
      duration={520}
      easing="ease-out"
      extraScale={1.12}
    >
      <div className="app">
        {screen === 'welcome' && <Welcome onStart={() => setScreen('profile')} onWorld={() => setScreen('world')} />}
        {screen === 'world' && <CccWorld onBack={() => setScreen('welcome')} />}
        {screen === 'profile' && <Profile profile={profile} setProfile={setProfile} onBack={() => setScreen('welcome')} onNext={() => setScreen('planner')} />}
        {screen === 'planner' && <Planner profile={profile} trip={trip} setTrip={setTrip} onBack={() => setScreen('profile')} onGenerate={() => { setScreen('result'); window.scrollTo(0, 0) }} />}
        {screen === 'result' && <Recommendation profile={profile} trip={trip} onEdit={() => { setScreen('planner'); window.scrollTo(0, 0) }} onRestart={() => { setScreen('welcome'); window.scrollTo(0, 0) }} />}
      </div>
    </ClickSpark>
  )
}
