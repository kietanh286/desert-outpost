// ==========================================
// IDLE MAFIA: DESERT OUTPOST - GAME ENGINE v5.0
// Universal Pointer-Events Drag & Drop, Dual-Layer Suitcase Grid,
// Direct Hero-Laser Beam, Exact Cell Sizing (No Overflow), Hardcore 1-Item Roll
// ==========================================

// --- Web Audio Synthesizer ---
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.8;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playTone(freq, type, duration, startVol = 0.15) {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const actualVol = startVol * this.volume;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(actualVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }
  shoot(type) {
    if (type === 'laser') this.playTone(850, 'sawtooth', 0.12, 0.1);
    else if (type === 'firearm') this.playTone(450, 'square', 0.05, 0.09);
    else if (type === 'molotov') this.playTone(200, 'triangle', 0.18, 0.12);
    else this.playTone(360, 'sine', 0.06, 0.08);
  }
  hit() { this.playTone(180, 'triangle', 0.04, 0.08); }
  explosion() { this.playTone(70, 'sawtooth', 0.32, 0.25); }
  merge() {
    this.playTone(523.25, 'triangle', 0.09, 0.18);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.09, 0.18), 70);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.15, 0.22), 140);
  }
  coin() {
    this.playTone(987.77, 'sine', 0.06, 0.12);
    setTimeout(() => this.playTone(1318.51, 'sine', 0.1, 0.18), 50);
  }
  victory() {
    [400, 520, 650, 780, 1040].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.15, 0.2), i * 80);
    });
  }
}

const sfx = new SoundFX();

// ==========================================
// ADMIN EQUIPMENT CONFIGURATION (BẢNG CẤU HÌNH TRANG BỊ)
// ==========================================
// Chỉnh sửa bảng này để thay đổi chỉ số tất cả trang bị trong game.
// - id: Mã định danh
// - name: Tên hiển thị  
// - w, h: Kích thước ô trong vali (width x height)
// - category: 'weapon' | 'support' | 'defense' | 'obstacle' | 'utility'
// - baseDmg: Sát thương cơ bản (tier 1, level 1)
// - rate: Thời gian hồi chiêu (giây) - số nhỏ = bắn nhanh
// - aoe: Bán kính nổ diện rộng (0 = không có AoE)
// - shieldBonus: Lượng khiên cộng thêm cho căn cứ
// - reflection: Hệ số phản sát thương (1.0 = 100%)
// - cashPerWave: Tiền thưởng mỗi wave (trang bị utility)
// - desc: Mô tả công dụng
// - sellPrice: Tiền thu về khi bán ở shop
// - rollWeight: Trọng số xác suất khi roll (cao = dễ ra hơn)
// - color: Màu UI accent
// HELPER: LẤY ĐÚNG ĐƯỜNG DẪN ASSET CỦA TỪNG LOẠI TRANG BỊ & TIER
function getGearIconPath(type, tier = 1) {
  const folder = (type === 'landmine' || type === 'vest' || type === 'shield') ? 'defense' :
                 (type === 'belt' || type === 'drone' || type === 'scope' || type === 'speed_loader') ? 'support' :
                 (type === 'card' || type === 'barrier') ? 'utility' : 'weapons';
  const clampedTier = Math.min(10, Math.max(1, tier || 1));
  return `assets/${folder}/${type}_lv${clampedTier}.png`;
}

const ADMIN_GEAR_CONFIG = {
  bow: {
    id: 'bow',
    name: 'Nỏ Tác Chiến',
    icon: 'assets/weapons/bow_lv1.png',
    w: 2, h: 2,
    category: 'weapon',
    baseDmg: 45,
    rate: 0.65,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Bắn mũi tên nỏ xuyên giáp và gây bạo kích cực lớn.',
    sellPrice: 4,
    rollWeight: 9,
    color: '#10b981'
  },
  dagger: {
    id: 'dagger',
    name: 'Dao Găm Mafia',
    icon: 'assets/weapons/dagger_lv1.png',
    w: 1, h: 1,
    category: 'weapon',
    baseDmg: 12,
    rate: 0.3,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Tấn công nhanh, tỉa từng mục tiêu gần nhất.',
    sellPrice: 2,
    rollWeight: 15,
    color: '#38bdf8'
  },
  laser: {
    id: 'laser',
    name: 'Pháo Laser',
    icon: 'assets/weapons/laser_lv1.png',
    w: 2, h: 2,
    category: 'weapon',
    baseDmg: 26,
    rate: 0.85,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Bắn chùm tia Mega Laser cực lớn quét sạch quái.',
    sellPrice: 4,
    rollWeight: 8,
    color: '#38bdf8'
  },
  firearm: {
    id: 'firearm',
    name: 'Súng Lục / Tiểu Liên',
    icon: 'assets/weapons/firearm_lv1.png',
    w: 2, h: 1,
    category: 'weapon',
    baseDmg: 60,
    rate: 1.0,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Nã từng phát đạn công phá uy lực cao.',
    sellPrice: 3,
    rollWeight: 12,
    color: '#f97316'
  },
  belt: {
    id: 'belt',
    name: 'Thắt Lưng Đạn',
    icon: 'assets/support/belt_lv1.png',
    w: 2, h: 1,
    category: 'support',
    baseDmg: 0,
    rate: 0,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    isSupport: true,
    desc: 'Tăng +12% Sát thương cho mọi súng tiếp giáp.',
    sellPrice: 2,
    rollWeight: 10,
    color: '#ef4444'
  },
  vest: {
    id: 'vest',
    name: 'Áo Giáp Chống Đạn',
    icon: 'assets/defense/vest_lv1.png',
    w: 2, h: 2,
    category: 'defense',
    baseDmg: 0,
    rate: 0,
    aoe: 0,
    shieldBonus: 60,
    reflection: 0.35,
    regenShield: 3.5,
    regenHp: 2.0,
    cashPerWave: 0,
    isDefense: true,
    desc: 'Tăng +60 Khiên căn cứ, tự hồi phục +3.5 Khiên & +2 HP/s, phản đòn 35% sát thương.',
    sellPrice: 4,
    rollWeight: 7,
    color: '#3b82f6'
  },
  shield: {
    id: 'shield',
    name: 'Khiên Bạo Động',
    icon: 'assets/defense/shield_lv1.png',
    w: 2, h: 3,
    category: 'defense',
    baseDmg: 0,
    rate: 0,
    aoe: 0,
    shieldBonus: 100,
    reflection: 0,
    regenShield: 7.0,
    regenHp: 0,
    cashPerWave: 0,
    isDefense: true,
    desc: 'Cung cấp +100 Khiên cực dày cho căn cứ, sạc lượng tử +7.0 Khiên/s.',
    sellPrice: 5,
    rollWeight: 4,
    color: '#64748b'
  },
  barrier: {
    id: 'barrier',
    name: 'Thanh Chắn Gai',
    icon: 'assets/utility/barrier_lv1.png',
    w: 4, h: 1,
    category: 'obstacle',
    baseDmg: 8,
    rate: 0,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    isObstacle: true,
    desc: 'Dựng chướng ngại vật cản và làm chậm quái trên sa mạc.',
    sellPrice: 3,
    rollWeight: 5,
    color: '#f59e0b'
  },
  molotov: {
    id: 'molotov',
    name: 'Chai Xăng Cháy',
    icon: 'assets/weapons/molotov_lv1.png',
    w: 1, h: 2,
    category: 'weapon',
    baseDmg: 20,
    rate: 1.5,
    aoe: 55,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Tạo vùng lửa cháy thiêu đốt theo thời gian.',
    sellPrice: 3,
    rollWeight: 8,
    color: '#dc2626'
  },
  card: {
    id: 'card',
    name: 'Thẻ ATM / Tín Dụng',
    icon: 'assets/utility/card_lv1.png',
    w: 1, h: 1,
    category: 'utility',
    baseDmg: 0,
    rate: 0,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 15,
    isUtility: true,
    desc: 'Tự động rút tiền thưởng thêm khi vượt qua mỗi đợt Wave quái vật.',
    sellPrice: 2,
    rollWeight: 10,
    color: '#a855f7'
  },
  flamethrower: {
    id: 'flamethrower',
    name: 'Súng Phun Lửa',
    icon: 'assets/weapons/flamethrower_lv1.png',
    w: 2, h: 2,
    category: 'weapon',
    baseDmg: 35,
    rate: 0.16,
    aoe: 45,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Phun luồng lửa nón quét diện rộng thiêu đốt liên tục, gây hiệu ứng Cháy DoT dồn dập.',
    sellPrice: 5,
    rollWeight: 8,
    color: '#ea580c'
  },
  cryo_grenade: {
    id: 'cryo_grenade',
    name: 'Lựu Đạn Băng',
    icon: 'assets/weapons/cryo_grenade_lv1.png',
    w: 1, h: 2,
    category: 'weapon',
    baseDmg: 28,
    rate: 1.8,
    aoe: 40,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Quăng lựu đạn băng đông cứng kẻ địch 1.5s và tăng +40% sát thương nhận vào.',
    sellPrice: 4,
    rollWeight: 9,
    color: '#06b6d4'
  },
  landmine: {
    id: 'landmine',
    name: 'Mìn Tự Động',
    icon: 'assets/defense/landmine_lv1.png',
    w: 1, h: 1,
    category: 'defense',
    baseDmg: 180,
    rate: 2.5,
    aoe: 55,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    isDefense: true,
    desc: 'Cài bẫy mìn nổ hủy diệt khi quái vật chạm phải.',
    sellPrice: 3,
    rollWeight: 10,
    color: '#ef4444'
  },
  drone: {
    id: 'drone',
    name: 'Drone Tự Hành',
    icon: 'assets/support/drone_lv1.png',
    w: 2, h: 1,
    category: 'support',
    baseDmg: 22,
    rate: 0.6,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    isSupport: true,
    desc: 'Drone bay quanh căn cứ bắn tỉa hỗ trợ & tăng +15% Tỷ Lệ Chí Mạng cho vũ khí lân cận.',
    sellPrice: 5,
    rollWeight: 8,
    color: '#3b82f6'
  },
  scope: {
    id: 'scope',
    name: 'Ống Ngắm Chuẩn Xác',
    icon: 'assets/support/scope_lv1.png',
    w: 1, h: 1,
    category: 'support',
    baseDmg: 0,
    rate: 0,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    isSupport: true,
    desc: 'Ống ngắm tăng +30% Sát Thương Chí Mạng & +20% Tầm bắn cho Súng và Cung kề cạnh.',
    sellPrice: 3,
    rollWeight: 9,
    color: '#8b5cf6'
  },
  tesla: {
    id: 'tesla',
    name: 'Tháp Sấm Sét Tesla',
    icon: 'assets/weapons/tesla_lv1.png',
    w: 2, h: 2,
    category: 'weapon',
    baseDmg: 48,
    rate: 1.3,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Phóng ra các tia sét lan qua 4-8 quái vật, làm tê liệt choáng 0.4s.',
    sellPrice: 6,
    rollWeight: 7,
    color: '#a855f7'
  },
  mortar: {
    id: 'mortar',
    name: 'Súng Cối Hạng Nặng',
    icon: 'assets/weapons/mortar_lv1.png',
    w: 3, h: 2,
    category: 'weapon',
    baseDmg: 110,
    rate: 2.8,
    aoe: 70,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    desc: 'Bắn đạn pháo cối tầm xa nổ cực mạnh bán kính 70px.',
    sellPrice: 7,
    rollWeight: 6,
    color: '#f59e0b'
  },
  speed_loader: {
    id: 'speed_loader',
    name: 'Băng Đạn Nhanh',
    icon: 'assets/support/speed_loader_lv1.png',
    w: 1, h: 2,
    category: 'support',
    baseDmg: 0,
    rate: 0,
    aoe: 0,
    shieldBonus: 0,
    reflection: 0,
    cashPerWave: 0,
    isSupport: true,
    desc: 'Giảm -25% thời gian hồi chiêu (tăng tốc độ xả đạn) cho mọi vũ khí liền kề.',
    sellPrice: 4,
    rollWeight: 9,
    color: '#eab308'
  }
};

// GEAR_TYPES được sinh ra từ ADMIN_GEAR_CONFIG (backwards compatible)
const GEAR_TYPES = {};
Object.keys(ADMIN_GEAR_CONFIG).forEach(key => {
  const cfg = ADMIN_GEAR_CONFIG[key];
  GEAR_TYPES[key] = { ...cfg };
});

function updateGearTypesI18n() {
  if (typeof t !== 'function') return;
  Object.keys(ADMIN_GEAR_CONFIG).forEach(key => {
    const cfg = ADMIN_GEAR_CONFIG[key];
    const nameKey = 'gear.' + key + '.name';
    const descKey = 'gear.' + key + '.desc';
    const transName = t(nameKey);
    const transDesc = t(descKey);
    if (transName && transName !== nameKey) {
      cfg.name = transName;
      if (GEAR_TYPES[key]) GEAR_TYPES[key].name = transName;
    }
    if (transDesc && transDesc !== descKey) {
      cfg.desc = transDesc;
      if (GEAR_TYPES[key]) GEAR_TYPES[key].desc = transDesc;
    }
  });
}
// Initial sync
if (typeof t === 'function') updateGearTypesI18n();


const LAND_TILE_SHAPES = [
  { name: 'Thanh Ngang 1x2', w: 2, h: 1 },
  { name: 'Thanh Dọc 2x1', w: 1, h: 2 },
  { name: 'Thanh Ngang 1x3', w: 3, h: 1 },
  { name: 'Thanh Dọc 3x1', w: 1, h: 3 },
  { name: 'Khối Vuông 2x2', w: 2, h: 2 },
  { name: 'Thanh Dọc 4x1', w: 1, h: 4 },
  { name: 'Thanh Ngang 1x4', w: 4, h: 1 }
];

// ==========================================
// PIXEL-ART ASSETS (HUGGING FACE DATASET & CRISP FALLBACK)
// ==========================================
function getGearSVG(type, tier = 1, isLand = false) {
  if (isLand) {
    return `
      <div class="pixel-gear-card-wrapper" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;">
        <img src="assets/environment/desert_tile.png" alt="Mảnh Vali" class="pixel-asset-img" style="width:82%;height:82%;object-fit:cover;image-rendering:pixelated;image-rendering:-moz-crisp-edges;image-rendering:crisp-edges;-ms-interpolation-mode:nearest-neighbor;border:2px dashed #38bdf8;border-radius:4px;">
      </div>
    `;
  }

  const clampedTier = Math.min(10, Math.max(1, tier || 1));
  const pngPath = getGearIconPath(type, clampedTier);

  return `
    <div class="pixel-gear-card-wrapper" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;">
      <img src="${pngPath}" alt="${type}" class="pixel-asset-img" style="max-width:86%;max-height:86%;object-fit:contain;image-rendering:pixelated;image-rendering:-moz-crisp-edges;image-rendering:crisp-edges;-ms-interpolation-mode:nearest-neighbor;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
    </div>
  `;
}

// ==========================================
function getBossChizuruSVG() {
  return `
    <svg viewBox="0 0 240 180" width="100%" height="100%" style="display:block;">
      <defs>
        <radialGradient id="chizuruGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="chizuruSuit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e1e24"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <!-- Background Crimson Glow Aura -->
      <circle cx="120" cy="90" r="85" fill="url(#chizuruGlow)"/>
      <path d="M40 70 Q70 40 120 45 Q170 50 200 70" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.4" stroke-dasharray="4 2"/>
      <!-- Shoulders & Coat -->
      <path d="M50 170 L70 95 L100 85 L120 90 L140 85 L170 95 L190 170 Z" fill="url(#chizuruSuit)" stroke="#dc2626" stroke-width="2.5"/>
      <!-- Crimson Shirt & Tie -->
      <polygon points="105,87 135,87 125,140 115,140" fill="#dc2626"/>
      <polygon points="116,92 124,92 122,125 118,125" fill="#fef08a"/>
      <!-- Gold Mafia Chain -->
      <path d="M95 105 Q120 125 145 105" fill="none" stroke="#fbbf24" stroke-width="3"/>
      <circle cx="120" cy="116" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
      <!-- Coat Lapels -->
      <path d="M80 95 L105 145 L118 145 L95 90 Z" fill="#2d2d38" stroke="#ef4444" stroke-width="1.5"/>
      <path d="M160 95 L135 145 L122 145 L145 90 Z" fill="#2d2d38" stroke="#ef4444" stroke-width="1.5"/>
      <!-- Head & Skin -->
      <path d="M102 78 Q120 92 138 78 L136 60 Q120 62 104 60 Z" fill="#fcd34d"/>
      <!-- Anime Mafia Hair -->
      <path d="M96 60 Q120 30 144 60 Q138 45 120 40 Q102 45 96 60 Z" fill="#09090b" stroke="#3f3f46" stroke-width="2"/>
      <path d="M90 62 L105 50 L102 65 L115 50 L112 68 L128 50 L126 68 L142 52 L138 65 L150 62" fill="#09090b"/>
      <!-- Cybernetic Eye / Sunglasses -->
      <rect x="105" y="65" width="13" height="7" rx="2" fill="#09090b" stroke="#ef4444" stroke-width="1.5"/>
      <rect x="122" y="65" width="13" height="7" rx="2" fill="#09090b" stroke="#ef4444" stroke-width="1.5"/>
      <line x1="118" y1="68" x2="122" y2="68" stroke="#ef4444" stroke-width="1.5"/>
      <!-- Red glowing bionic eye -->
      <circle cx="128" cy="68" r="2.5" fill="#ef4444"/>
      <circle cx="128" cy="68" r="1" fill="#ffffff"/>
      <!-- Dual Plasma Pistols in Hands -->
      <g transform="translate(35, 105) rotate(-15)">
        <rect x="0" y="8" width="45" height="14" rx="2" fill="#27272a" stroke="#ef4444" stroke-width="1.5"/>
        <rect x="30" y="5" width="18" height="6" fill="#38bdf8"/>
        <circle cx="48" cy="8" r="5" fill="#38bdf8" opacity="0.8"/>
      </g>
      <g transform="translate(165, 95) rotate(15)">
        <rect x="0" y="8" width="45" height="14" rx="2" fill="#27272a" stroke="#ef4444" stroke-width="1.5"/>
        <rect x="30" y="5" width="18" height="6" fill="#38bdf8"/>
        <circle cx="48" cy="8" r="5" fill="#38bdf8" opacity="0.8"/>
      </g>
    </svg>
  `;
}

function getBossMechSVG() {
  return `
    <svg viewBox="0 0 240 180" width="100%" height="100%" style="display:block;">
      <defs>
        <radialGradient id="mechReactor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="70%" stop-color="#0891b2"/>
          <stop offset="100%" stop-color="#0e7490"/>
        </radialGradient>
      </defs>
      <!-- Left Shoulder Missile Pod -->
      <rect x="30" y="45" width="36" height="42" rx="4" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="40" cy="55" r="4" fill="#ef4444" stroke="#991b1b"/>
      <circle cx="56" cy="55" r="4" fill="#ef4444" stroke="#991b1b"/>
      <circle cx="40" cy="73" r="4" fill="#ef4444" stroke="#991b1b"/>
      <circle cx="56" cy="73" r="4" fill="#ef4444" stroke="#991b1b"/>
      <!-- Right Shoulder Missile Pod -->
      <rect x="174" y="45" width="36" height="42" rx="4" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="184" cy="55" r="4" fill="#ef4444" stroke="#991b1b"/>
      <circle cx="200" cy="55" r="4" fill="#ef4444" stroke="#991b1b"/>
      <circle cx="184" cy="73" r="4" fill="#ef4444" stroke="#991b1b"/>
      <circle cx="200" cy="73" r="4" fill="#ef4444" stroke="#991b1b"/>
      <!-- Torso & Plating -->
      <path d="M64 65 L90 35 L150 35 L176 65 L160 145 L80 145 Z" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
      <!-- Chest Armor Plates with Hazard Stripes -->
      <polygon points="90,45 150,45 140,85 100,85" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
      <line x1="105" y1="48" x2="115" y2="82" stroke="#eab308" stroke-width="3"/>
      <line x1="125" y1="48" x2="135" y2="82" stroke="#eab308" stroke-width="3"/>
      <!-- Glowing Hex Core Reactor -->
      <polygon points="120,95 136,104 136,122 120,131 104,122 104,104" fill="url(#mechReactor)" stroke="#a5f3fc" stroke-width="2"/>
      <circle cx="120" cy="113" r="6" fill="#ffffff"/>
      <!-- Head / Sensor Visor -->
      <rect x="100" y="24" width="40" height="16" rx="3" fill="#090d16" stroke="#06b6d4" stroke-width="2"/>
      <line x1="104" y1="32" x2="136" y2="32" stroke="#22d3ee" stroke-width="4"/>
      <!-- Heavy Dual Rotary Cannons -->
      <rect x="18" y="90" width="22" height="60" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="24" y1="150" x2="24" y2="168" stroke="#94a3b8" stroke-width="3"/>
      <line x1="30" y1="150" x2="30" y2="168" stroke="#94a3b8" stroke-width="3"/>
      <line x1="36" y1="150" x2="36" y2="168" stroke="#94a3b8" stroke-width="3"/>
      <rect x="200" y="90" width="22" height="60" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="206" y1="150" x2="206" y2="168" stroke="#94a3b8" stroke-width="3"/>
      <line x1="212" y1="150" x2="212" y2="168" stroke="#94a3b8" stroke-width="3"/>
      <line x1="218" y1="150" x2="218" y2="168" stroke="#94a3b8" stroke-width="3"/>
    </svg>
  `;
}

function getBossScorpionSVG() {
  return `
    <svg viewBox="0 0 240 180" width="100%" height="100%" style="display:block;">
      <defs>
        <radialGradient id="venomGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#22c55e"/>
          <stop offset="80%" stop-color="#15803d"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Giant Curved Stinger Tail -->
      <path d="M120 120 C100 80 130 30 160 25 C185 20 200 45 185 65" fill="none" stroke="#ca8a04" stroke-width="12" stroke-linecap="round"/>
      <path d="M120 120 C100 80 130 30 160 25 C185 20 200 45 185 65" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
      <!-- Toxic Emerald Stinger Bulb -->
      <circle cx="185" cy="65" r="10" fill="url(#venomGlow)"/>
      <path d="M185 65 L202 78 L192 68 Z" fill="#4ade80" stroke="#15803d" stroke-width="1.5"/>
      <!-- Scorpion Spiked Carapace -->
      <path d="M85 100 Q120 70 155 100 L150 145 Q120 160 90 145 Z" fill="#854d0e" stroke="#eab308" stroke-width="3"/>
      <!-- Golden Chitin Ridges -->
      <path d="M92 110 Q120 95 148 110" fill="none" stroke="#fef08a" stroke-width="3"/>
      <path d="M95 125 Q120 110 145 125" fill="none" stroke="#fef08a" stroke-width="3"/>
      <path d="M98 140 Q120 125 142 140" fill="none" stroke="#fef08a" stroke-width="2.5"/>
      <!-- Multiple Glowing Ruby Eyes -->
      <circle cx="112" cy="90" r="3" fill="#ef4444"/>
      <circle cx="120" cy="86" r="3.5" fill="#ef4444"/>
      <circle cx="128" cy="90" r="3" fill="#ef4444"/>
      <!-- Giant Pincer Claws -->
      <g transform="translate(45, 75)">
        <path d="M40 40 L15 20 Q-10 15 5 0 Q25 15 40 25 Z" fill="#ca8a04" stroke="#eab308" stroke-width="2.5"/>
        <path d="M5 0 Q-5 35 25 35" fill="none" stroke="#fef08a" stroke-width="3"/>
      </g>
      <g transform="translate(155, 75)">
        <path d="M0 40 L25 20 Q50 15 35 0 Q15 15 0 25 Z" fill="#ca8a04" stroke="#eab308" stroke-width="2.5"/>
        <path d="M35 0 Q45 35 15 35" fill="none" stroke="#fef08a" stroke-width="3"/>
      </g>
      <!-- Spiked Legs -->
      <path d="M85 115 L60 125 L45 145" fill="none" stroke="#ca8a04" stroke-width="3"/>
      <path d="M85 130 L55 145 L40 165" fill="none" stroke="#ca8a04" stroke-width="3"/>
      <path d="M155 115 L180 125 L195 145" fill="none" stroke="#ca8a04" stroke-width="3"/>
      <path d="M155 130 L185 145 L200 165" fill="none" stroke="#ca8a04" stroke-width="3"/>
    </svg>
  `;
}

function getBossDragonSVG() {
  return `
    <svg viewBox="0 0 240 180" width="100%" height="100%" style="display:block;">
      <defs>
        <radialGradient id="dragonPlasma" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="60%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Coiling Cyber Dragon Body -->
      <path d="M30 150 Q70 80 120 110 T210 70" fill="none" stroke="#1e1b4b" stroke-width="26" stroke-linecap="round"/>
      <path d="M30 150 Q70 80 120 110 T210 70" fill="none" stroke="#38bdf8" stroke-width="6" stroke-dasharray="12 6" stroke-linecap="round"/>
      <!-- Spines / Dorsal Fins -->
      <polygon points="65,95 72,75 80,98" fill="#c084fc"/>
      <polygon points="105,100 115,80 125,102" fill="#c084fc"/>
      <polygon points="145,95 155,75 165,98" fill="#c084fc"/>
      <!-- Dragon Head -->
      <path d="M185 85 L225 55 L235 68 L220 85 L235 95 L205 105 Z" fill="#312e81" stroke="#818cf8" stroke-width="3"/>
      <!-- Horns -->
      <path d="M195 65 Q210 30 235 25" fill="none" stroke="#c084fc" stroke-width="5" stroke-linecap="round"/>
      <path d="M185 70 Q195 40 215 38" fill="none" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>
      <!-- Glowing Eyes -->
      <circle cx="210" cy="65" r="4" fill="#38bdf8"/>
      <circle cx="210" cy="65" r="1.5" fill="#ffffff"/>
      <!-- Plasma Breath Glow -->
      <circle cx="230" cy="90" r="18" fill="url(#dragonPlasma)"/>
      <circle cx="230" cy="90" r="8" fill="#e0f2fe"/>
    </svg>
  `;
}

function getBossOverlordSVG() {
  return `
    <svg viewBox="0 0 240 180" width="100%" height="100%" style="display:block;">
      <defs>
        <radialGradient id="overlordAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.35"/>
          <stop offset="80%" stop-color="#b45309" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Gold Obsidian Aura -->
      <circle cx="120" cy="90" r="80" fill="url(#overlordAura)"/>
      <!-- Throne / Cape Backing -->
      <path d="M45 170 L75 50 L120 40 L165 50 L195 170 Z" fill="#18181b" stroke="#fbbf24" stroke-width="3"/>
      <!-- Pinstripe Overcoat -->
      <path d="M70 170 L85 90 L120 95 L155 90 L170 170 Z" fill="#09090b" stroke="#eab308" stroke-width="2"/>
      <line x1="95" y1="95" x2="90" y2="170" stroke="#713f12" stroke-width="1.5"/>
      <line x1="145" y1="95" x2="150" y2="170" stroke="#713f12" stroke-width="1.5"/>
      <!-- Golden Tie & Rose Boutonniere -->
      <polygon points="115,92 125,92 122,130 118,130" fill="#fbbf24"/>
      <circle cx="102" cy="100" r="4.5" fill="#ef4444"/>
      <!-- Don's Fedora Hat -->
      <ellipse cx="120" cy="65" rx="38" ry="10" fill="#27272a" stroke="#fbbf24" stroke-width="2"/>
      <path d="M96 64 C96 42 144 42 144 64 Z" fill="#18181b" stroke="#fbbf24" stroke-width="2"/>
      <rect x="98" y="58" width="44" height="4" fill="#fbbf24"/>
      <!-- Dark Face & Cyber Sunglasses -->
      <path d="M106 72 Q120 85 134 72 L132 64 Q120 65 108 64 Z" fill="#fcd34d"/>
      <rect x="108" y="68" width="10" height="5" rx="1" fill="#000000" stroke="#fbbf24" stroke-width="1"/>
      <rect x="122" y="68" width="10" height="5" rx="1" fill="#000000" stroke="#fbbf24" stroke-width="1"/>
      <!-- Cigar Smoke -->
      <line x1="124" y1="78" x2="135" y2="78" stroke="#78350f" stroke-width="2"/>
      <circle cx="136" cy="78" r="1.5" fill="#f97316"/>
      <!-- Gold-headed Cane -->
      <line x1="175" y1="90" x2="185" y2="170" stroke="#d97706" stroke-width="4"/>
      <circle cx="174" cy="88" r="7" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
    </svg>
  `;
}

// BÓNG ĐEN BÍ ẨN CỦA BOSS KHI MÀN CHƯA MỞ KHÓA (CÓ DẤU ? PHÁT SÁNG Ở GIỮA)
function getBossSilhouetteSVG(bossName, stageNum) {
  return `
    <svg viewBox="0 0 240 180" width="100%" height="100%" style="display:block;">
      <defs>
        <radialGradient id="silGlow${stageNum}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#9333ea" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="#3b0764" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#a855f7" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Mystery Void Aura -->
      <circle cx="120" cy="90" r="80" fill="url(#silGlow${stageNum})"/>
      <!-- Silhouette Body (Intimidating Shadow) -->
      <g filter="url(#shadowFilter)">
        <path d="M50 170 C50 110 75 75 95 65 C90 40 150 40 145 65 C165 75 190 110 190 170 Z" fill="#09090b" stroke="#581c87" stroke-width="3"/>
        <path d="M40 95 L65 75 L60 115 Z" fill="#09090b"/>
        <path d="M200 95 L175 75 L180 115 Z" fill="#09090b"/>
      </g>
      <!-- Glowing Red Demon Eyes in Darkness -->
      <circle cx="108" cy="74" r="3" fill="#ef4444"/>
      <circle cx="132" cy="74" r="3" fill="#ef4444"/>
      <!-- Giant Glowing Neon Question Mark (?) In Center -->
      <g transform="translate(120, 115)">
        <circle cx="0" cy="0" r="26" fill="#1e1b4b" stroke="#c084fc" stroke-width="3" stroke-dasharray="6 3"/>
        <text x="0" y="10" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="32" fill="#facc15" text-anchor="middle" filter="drop-shadow(0 0 6px #a855f7)">?</text>
      </g>
      <!-- Lock Badge Bottom -->
      <rect x="75" y="152" width="90" height="20" rx="4" fill="#18181b" stroke="#9333ea" stroke-width="1.5"/>
      <text x="120" y="166" font-family="sans-serif" font-weight="800" font-size="9" fill="#e9d5ff" text-anchor="middle">🔒 MÀN ${stageNum} CHƯA MỞ</text>
    </svg>
  `;
}

// 5 MÀN CHIẾN DỊCH MAFIA DESERT OUTPOST
// MAPPING MÁU TỐI ĐA CỦA TRÙM THEO MÀN (THEO YÊU CẦU CÂN BẰNG: Màn 1: 70k, Màn 2: 90k, Màn 3: 120k, Màn 4: 150k, Màn 5: 200k)
const STAGE_BOSS_MAX_HP = {
  1: 70000,
  2: 90000,
  3: 120000,
  4: 150000,
  5: 200000
};

// MAPPING MỞ KHÓA TRANG BỊ MỚI THEO CHIẾN CÔNG MỖI MÀN
const STAGE_GEAR_UNLOCKS = {
  1: [
    { id: 'bow', name: 'Nỏ Tác Chiến', category: 'weapon', desc: 'Bắn mũi tên nỏ công nghệ cao xuyên thấu và gây bạo kích cực lớn.' },
    { id: 'barrier', name: 'Thanh Chắn Gai', category: 'obstacle', desc: 'Dựng chướng ngại vật cản và làm chậm quái sa mạc.' }
  ],
  2: [
    { id: 'vest', name: 'Áo Giáp Chống Đạn', category: 'defense', desc: 'Tăng Khiên căn cứ, tự hồi phục HP và phản đòn quái vật.' },
    { id: 'shield', name: 'Khiên Bạo Động', category: 'defense', desc: 'Cung cấp giáp hộ thuẫn cực dày, chặn đứng hỏa lực tầm xa.' }
  ],
  3: [
    { id: 'laser', name: 'Pháo Laser', category: 'weapon', desc: 'Bắn chùm tia Mega Laser cực lớn quét sạch cả đàn quái.' },
    { id: 'belt', name: 'Thắt Lưng Đạn', category: 'support', desc: 'Tăng +12% Sát thương và cường hóa hỏa lực cho mọi súng tiếp giáp.' }
  ],
  4: [
    { id: 'flamethrower', name: 'Súng Phun Lửa', category: 'weapon', desc: 'Phun lửa thiêu đốt diện rộng cực nhanh.' },
    { id: 'cryo_grenade', name: 'Lựu Đạn Băng', category: 'weapon', desc: 'Đông cứng kẻ địch và khuếch đại sát thương nhận vào.' },
    { id: 'tesla', name: 'Tháp Sét Tesla', category: 'weapon', desc: 'Phóng tia sét lan truyền giật hàng loạt quái vật.' },
    { id: 'mortar', name: 'Pháo Cối Tầm Xa', category: 'weapon', desc: 'Nã pháo diện rộng cày nát đội hình quái từ xa.' }
  ],
  5: [
    { id: 'landmine', name: 'Mìn Sa Mạc', category: 'defense', desc: 'Cài mìn nổ hủy diệt khi quái vật giẫm phải.' },
    { id: 'drone', name: 'Drone Trinh Sát', category: 'support', desc: 'Drone bay tuần tra tự động xả đạn bảo vệ căn cứ.' },
    { id: 'scope', name: 'Kính Ngắm Laser', category: 'support', desc: 'Tăng mạnh tầm bắn và tỉ lệ bạo kích cực đại.' },
    { id: 'speed_loader', name: 'Băng Đạn Kép', category: 'support', desc: 'Rút ngắn thời gian nạp và tăng tốc độ bắn vũ khí.' }
  ]
};

const BOSS_LIST = [
  {
    id: 'chizuru',
    stage: 1,
    name: 'CAPO CHIZURU YAMAMOTO',
    areaName: 'TIỀN ĐỒN SA MẠC',
    level: 10,
    totalWaves: 10,
    unlockWave: 5,
    bossWave: 10,
    maxHp: 70000,
    diamondReward: 5,
    trait: 'Phóng chùm tia Mega Laser thiêu đốt & Triệu hồi bọ cạp bọc thép càn quét căn cứ!',
    maxWave: 10,
    maxScore: '500.000',
    svgFn: getBossChizuruSVG
  },
  {
    id: 'mech_titan',
    stage: 2,
    name: 'CHÚA TỂ CƠ GIỚI MECH GM-X',
    areaName: 'THÀNH PHỐ NGẦM MECH',
    level: 25,
    totalWaves: 15,
    unlockWave: 10,
    bossWave: 15,
    maxHp: 90000,
    diamondReward: 10,
    trait: 'Khiên lượng tử phản xạ đạn & Nã pháo chùm tên lửa hủy diệt diện rộng!',
    maxWave: 15,
    maxScore: '985.400',
    svgFn: getBossMechSVG
  },
  {
    id: 'golden_scorpion',
    stage: 3,
    name: 'ĐỘC HẠT HOÀNG KIM SA MẠC',
    areaName: 'ỐC ĐẢO ĐỘC HOÀNG KIM',
    level: 45,
    totalWaves: 20,
    unlockWave: 15,
    bossWave: 20,
    maxHp: 120000,
    diamondReward: 18,
    trait: 'Phun nọc độc sa mạc làm tê liệt rào chắn & Càng thép nghiền nát căn cứ!',
    maxWave: 20,
    maxScore: '1.450.000',
    svgFn: getBossScorpionSVG
  },
  {
    id: 'cyber_dragon',
    stage: 4,
    name: 'RỒNG MÁY CYBER SHENRON',
    areaName: 'PHÁO ĐÀI BAY KHÔNG GIAN',
    level: 70,
    totalWaves: 25,
    unlockWave: 20,
    bossWave: 25,
    maxHp: 150000,
    diamondReward: 30,
    trait: 'Hơi thở Plasma hủy diệt toàn màn hình & Phân thân bóng ma né tránh đòn!',
    maxWave: 25,
    maxScore: '2.100.000',
    svgFn: getBossDragonSVG
  },
  {
    id: 'don_corleone',
    stage: 5,
    name: 'DON CORLEONE DESERT OUTPOST',
    areaName: 'ĐẦU NÃO TỐI CAO MAFIA',
    level: 100,
    totalWaves: 30,
    unlockWave: 25,
    bossWave: 30,
    maxHp: 200000,
    diamondReward: 50,
    trait: 'Bố Già Tối Thượng: Triệu hồi hộ vệ Capo, Mưa bom nguyên tử & Khiên Hắc Kim bất hoại!',
    maxWave: 30,
    maxScore: '3.000.000',
    svgFn: getBossOverlordSVG
  }
];

const STAGES_LIST = BOSS_LIST;

const WEAPON_PROGRESSION = {
  bow: {
    stat1Label: 'Sát Thương Mũi Tên',
    stat2Label: 'Tốc Độ Giương Cung',
    milestones: {
      2: 'Mũi tên tích điện gây choáng nhẹ mục tiêu',
      3: 'Tăng +25% tỉ lệ Bạo Kích xuyên giáp',
      4: 'Bắn tỏa 3 mũi tên chùm cùng lúc',
      5: 'Nỏ Thần Cyber Shenron (Max DMG)'
    },
    getStats: (lvl) => {
      const dmg = Math.round(45 * (1 + (lvl - 1) * 0.35));
      const spd = Math.max(0.35, (0.65 - (lvl - 1) * 0.05)).toFixed(2);
      const nextDmg = Math.round(45 * (1 + lvl * 0.35));
      const nextSpd = Math.max(0.35, (0.65 - lvl * 0.05)).toFixed(2);
      return {
        val1: dmg,
        diff1: nextDmg - dmg,
        val2: `${spd}s`,
        diff2: `-${(parseFloat(spd) - parseFloat(nextSpd)).toFixed(2)}s`
      };
    }
  },
  laser: {
    stat1Label: 'Sát Thương Chùm Tia',
    stat2Label: 'Tần Suất Bắn',
    milestones: {
      2: 'Chùm tia siêu nhiệt xuyên giáp quái vật',
      3: 'Tụ năng lượng xung kích bạo kích +18%',
      4: 'Chùm Mega Laser kép quét 2 mục tiêu cùng lúc',
      5: 'Pháo đài hạt nhân diệt thế (Max DMG)'
    },
    getStats: (lvl) => {
      const dmg = Math.round(26 * (1 + (lvl - 1) * 0.35));
      const spd = Math.max(0.4, (0.85 - (lvl - 1) * 0.06)).toFixed(2);
      const nextDmg = Math.round(26 * (1 + lvl * 0.35));
      const nextSpd = Math.max(0.4, (0.85 - lvl * 0.06)).toFixed(2);
      return {
        val1: dmg,
        diff1: nextDmg - dmg,
        val2: `${spd}s`,
        diff2: `-${(parseFloat(spd) - parseFloat(nextSpd)).toFixed(2)}s`
      };
    }
  },
  firearm: {
    stat1Label: 'Sát Thương Đạn',
    stat2Label: 'Tốc Độ Xả Đạn',
    milestones: {
      2: 'Loạt bắn 3 viên (Burst Fire) dồn sát thương',
      3: 'Đạn xuyên thấu nhiều mục tiêu cùng hàng',
      4: 'Nòng đôi liên thanh (Twin Barrels +1 đạn)',
      5: 'Súng máy Vulcan hủy diệt chiến trường'
    },
    getStats: (lvl) => {
      const dmg = Math.round(48 * (1 + (lvl - 1) * 0.3));
      const spd = Math.max(0.4, (1.0 - (lvl - 1) * 0.08)).toFixed(2);
      const nextDmg = Math.round(48 * (1 + lvl * 0.3));
      const nextSpd = Math.max(0.4, (1.0 - lvl * 0.08)).toFixed(2);
      return {
        val1: dmg,
        diff1: nextDmg - dmg,
        val2: `${spd}s`,
        diff2: `-${(parseFloat(spd) - parseFloat(nextSpd)).toFixed(2)}s`
      };
    }
  },
  dagger: {
    stat1Label: 'Sát Thương Dao',
    stat2Label: 'Tốc Độ Vung Dao',
    milestones: {
      2: 'Đâm hiểm chí mạng x1.8 sát thương',
      3: 'Vết cắt sâu gây xuất huyết liên tục',
      4: 'Bão dao xoay 360° phản ứng tức thì',
      5: 'Lưỡi hái sát thủ vô ảnh'
    },
    getStats: (lvl) => {
      const dmg = Math.round(12 * (1 + (lvl - 1) * 0.3));
      const spd = Math.max(0.12, (0.3 - (lvl - 1) * 0.025)).toFixed(2);
      const nextDmg = Math.round(12 * (1 + lvl * 0.3));
      const nextSpd = Math.max(0.12, (0.3 - lvl * 0.025)).toFixed(2);
      return {
        val1: dmg,
        diff1: nextDmg - dmg,
        val2: `${spd}s`,
        diff2: `-${(parseFloat(spd) - parseFloat(nextSpd)).toFixed(2)}s`
      };
    }
  },
  belt: {
    stat1Label: 'Tăng Uy Lực Ô Kế',
    stat2Label: 'Phạm Vi Hiệu Ứng',
    milestones: {
      2: 'Kích hoạt thêm +6% sát thương lân cận',
      3: 'Tiếp đạn thần tốc giảm 10% hồi chiêu',
      4: 'Đạn bọc thép phá giáp quái vật',
      5: 'Hộp tiếp đạn vô tận huyền thoại'
    },
    getStats: (lvl) => {
      const buff = 12 + (lvl - 1) * 5;
      return {
        val1: `+${buff}% ATK`,
        diff1: `5%`,
        val2: `1 Ô Kề`,
        diff2: `+Uy Lực`
      };
    }
  },
  vest: {
    stat1Label: 'Phản Sát Thương',
    stat2Label: 'Giảm Đòn Đánh',
    milestones: {
      2: 'Giảm 12% sát thương va chạm căn cứ',
      3: 'Sóng xung kích đẩy lùi quái khi bị tấn công',
      4: 'Khiên chấn động điện từ làm choáng',
      5: 'Giáp phản lực Titan bất hoại'
    },
    getStats: (lvl) => {
      const ref = 35 + (lvl - 1) * 15;
      const red = Math.min(45, 10 + (lvl - 1) * 4);
      return {
        val1: `${ref}%`,
        diff1: `15%`,
        val2: `-${red}%`,
        diff2: `-4%`
      };
    }
  },
  shield: {
    stat1Label: 'Dung Lượng Khiên',
    stat2Label: 'Tốc Độ Tự Hồi',
    milestones: {
      2: 'Tốc độ hồi khiên nhanh hơn 20%',
      3: 'Lớp phủ nano chống tia laser quái',
      4: 'Hồi ngay 15% khiên mỗi khi diệt Boss',
      5: 'Trường lực phòng hộ tuyệt đối'
    },
    getStats: (lvl) => {
      const hp = 80 + (lvl - 1) * 35;
      const nextHp = 80 + lvl * 35;
      const reg = 1.5 + (lvl - 1) * 0.8;
      return {
        val1: `${hp} HP`,
        diff1: `${nextHp - hp}`,
        val2: `+${reg.toFixed(1)}/s`,
        diff2: `+0.8/s`
      };
    }
  },
  molotov: {
    stat1Label: 'Sát Thương Cháy',
    stat2Label: 'Thời Gian Đốt',
    milestones: {
      2: 'Biển lửa lan rộng thêm 20% diện tích',
      3: 'Lửa napalm xanh thiêu rụi giáp sắt',
      4: 'Vụ nổ kép hai giai đoạn uy lực x1.8',
      5: 'Hỏa ngục vĩnh cửu thiêu rụi bầy quái'
    },
    getStats: (lvl) => {
      const dmg = Math.round(20 * (1 + (lvl - 1) * 0.3));
      const nextDmg = Math.round(20 * (1 + lvl * 0.3));
      const dur = (2.2 + (lvl - 1) * 0.25).toFixed(1);
      return {
        val1: dmg,
        diff1: nextDmg - dmg,
        val2: `${dur}s`,
        diff2: `+0.25s`
      };
    }
  },
  card: {
    stat1Label: 'Rút Tiền Mỗi Giây',
    stat2Label: 'Thưởng Bắt Đầu Wave',
    milestones: {
      2: 'Thẻ ATM Bạch Kim: Tự động rút tiền nhanh hơn',
      3: 'Lãi suất ngầm Mafia: +25% tiền sinh ra',
      4: 'Thẻ Đen Black Card: Nhân đôi lượng tiền',
      5: 'Đế chế tài chính bố già vô tận'
    },
    getStats: (lvl) => {
      const cashWave = 15 + (lvl - 1) * 5;
      const nextCashWave = 15 + lvl * 5;
      return {
        val1: `+${lvl} $/s`,
        diff1: `+1 $/s`,
        val2: `+${cashWave} $`,
        diff2: `+5 $`
      };
    }
  },
  barrier: {
    stat1Label: 'Lực Cản Làm Chậm',
    stat2Label: 'Sát Thương Gai Đâm',
    milestones: {
      2: 'Gai thép bọc điện làm choáng quái',
      3: 'Hàng rào kép hai tầng gai kiên cố',
      4: 'Dây kẽm gai quân sự chống tăng',
      5: 'Pháo đài lũy thép bất khả xâm phạm'
    },
    getStats: (lvl) => {
      const slow = Math.min(50, 20 + (lvl - 1) * 5);
      const nextSlow = Math.min(50, 20 + lvl * 5);
      const dmg = 8 + (lvl - 1) * 6;
      const nextDmg = 8 + lvl * 6;
      return {
        val1: `-${slow}% SPD`,
        diff1: `-${nextSlow - slow}%`,
        val2: `${dmg} DMG`,
        diff2: `+6`
      };
    }
  }
};

const PERK_RARITIES = {
  common: {
    name: 'Phổ Thông',
    color: '#38bdf8',
    bgColor: 'rgba(14, 116, 144, 0.25)',
    borderColor: '#06b6d4',
    badge: 'Phổ Thông',
    rate: 60
  },
  rare: {
    name: 'Hiếm',
    color: '#c084fc',
    bgColor: 'rgba(88, 28, 135, 0.35)',
    borderColor: '#a855f7',
    badge: '★ Hiếm',
    rate: 25
  },
  epic: {
    name: 'Sử Thi',
    color: '#fbbf24',
    bgColor: 'rgba(120, 53, 15, 0.45)',
    borderColor: '#f59e0b',
    badge: '★★ Sử Thi',
    rate: 11
  },
  legendary: {
    name: 'Huyền Thoại',
    color: '#ef4444',
    bgColor: 'rgba(127, 29, 29, 0.55)',
    borderColor: '#dc2626',
    badge: '👑 HUYỀN THOẠI',
    rate: 4
  }
};

const ROGUELIKE_PERKS = [
  // --- 1. PHỔ THÔNG (COMMON - 80% TỈ LỆ) ---
  // Tăng 10% - 20% chỉ số gốc, cân bằng mượt mà
  {
    id: 'laser_boost_1',
    gear: 'laser',
    rarity: 'common',
    title: "Laser Boost I (+18%)",
    desc: 'Tăng +18% Sát thương chùm tia Mega Laser.',
    icon: '★',
    apply: (state) => { state.perkMultipliers.laserDmg += 0.18; }
  },
  {
    id: 'firearm_rapid_1',
    gear: 'firearm',
    rarity: 'common',
    title: "Firearm Rapid I (+16%)",
    desc: 'Tăng +16% Tốc độ xả đạn liên thanh cho Súng Lục / Tiểu Liên.',
    icon: '🔫',
    apply: (state) => { state.perkMultipliers.firearmRate += 0.16; }
  },
  {
    id: 'dagger_frenzy_1',
    gear: 'dagger',
    rarity: 'common',
    title: "Dagger Slash I (+18%)",
    desc: 'Dao găm tăng +18% Sát thương và tốc độ vung đâm.',
    icon: '🗡️',
    apply: (state) => { state.perkMultipliers.daggerDmg += 0.18; }
  },
  {
    id: 'molotov_flame_1',
    gear: 'molotov',
    rarity: 'common',
    title: "Molotov Flame I (+18%)",
    desc: 'Chai xăng cháy lan tăng +18% Sát thương và bán kính thiêu đốt.',
    icon: '🍾',
    apply: (state) => { state.perkMultipliers.molotovDmg = (state.perkMultipliers.molotovDmg || 1) + 0.18; }
  },
  {
    id: 'barrier_slow_1',
    gear: 'barrier',
    rarity: 'common',
    title: "Spike Barrier I (+15%)",
    desc: 'Thanh chắn làm chậm quái thêm +15% tốc độ di chuyển.',
    icon: '🚧',
    apply: (state) => { state.perkMultipliers.barrierSlow += 0.15; }
  },
  {
    id: 'vest_reflect_1',
    gear: 'vest',
    rarity: 'common',
    title: "Vest Plating I (+20%)",
    desc: 'Áo giáp chống đạn phản lại thêm +20% Sát thương quái va chạm.',
    icon: '🦺',
    apply: (state) => { state.perkMultipliers.vestReflection += 0.20; }
  },
  {
    id: 'vest_regen_1',
    gear: 'vest',
    rarity: 'common',
    title: "Nano Armor Regen I (+1.5 HP/s)",
    desc: 'Áo giáp kích hoạt nano sinh học tự hồi phục +1.5 HP mỗi giây.',
    icon: '💖',
    apply: (state) => { state.perkMultipliers.armorRegenHp = (state.perkMultipliers.armorRegenHp || 0) + 1.5; }
  },
  {
    id: 'shield_regen_1',
    gear: 'shield',
    rarity: 'common',
    title: "Shield Capacitor I (+2.0 Khiên/s)",
    desc: 'Tụ điện lượng tử sạc khiên bạo động nhanh hơn +2.0 điểm/giây.',
    icon: '🔋',
    apply: (state) => { state.perkMultipliers.shieldRegenBonus = (state.perkMultipliers.shieldRegenBonus || 0) + 2.0; }
  },
  {
    id: 'atm_crypto_1',
    gear: 'card',
    maxPicks: 1,
    rarity: 'common',
    title: "ATM Quick Cash I (+20% Tiền Rút [1/1])",
    desc: 'Thẻ ATM tối ưu mạch thanh toán, tăng +20% tiền rút mỗi giây (Tối đa 1 lần duy nhất).',
    icon: '💳',
    apply: (state) => {
      state.perkMultipliers.cardIncome = Math.max(state.perkMultipliers.cardIncome || 1, 1.2);
    }
  },
  {
    id: 'belt_ammo_supply_1',
    gear: 'belt',
    maxPicks: 1,
    rarity: 'common',
    title: "Ammo Belt Feed I (+15% ATK Kề [1/1])",
    desc: 'Thắt lưng đạn tiếp thêm uy lực +15% sát thương cho mọi vũ khí kế bên.',
    icon: '🎒',
    apply: (state) => { state.perkMultipliers.beltBuffBonus = (state.perkMultipliers.beltBuffBonus || 0) + 0.15; }
  },
  {
    id: 'bounty_cash_1',
    gear: 'universal',
    maxPicks: 99,
    rarity: 'common',
    title: "Bounty Cash (+15 $)",
    desc: 'Lập tức nhận ngay 15 $ trong ván để Roll trang bị.',
    icon: '$',
    apply: (state) => { state.runCash += 15; }
  },

  // --- 2. HIẾM (RARE - 14% TỈ LỆ - DUY NHẤT 1 LẦN [1/1]) ---
  {
    id: 'laser_plasma_2',
    gear: 'laser',
    maxPicks: 1,
    rarity: 'rare',
    title: "Mega Laser Plasma II (+35% [1/1])",
    desc: 'Tia Laser cường hóa plasma tăng +35% Sát thương và mở rộng đường kính.',
    icon: '★',
    apply: (state) => { state.perkMultipliers.laserDmg += 0.35; }
  },
  {
    id: 'firearm_heavy_2',
    gear: 'firearm',
    maxPicks: 1,
    rarity: 'rare',
    title: "Heavy Magnum II (+35% [1/1])",
    desc: 'Súng lục nã đạn công phá nặng tăng +35% Sát thương.',
    icon: '🔫',
    apply: (state) => { state.perkMultipliers.firearmDmg = (state.perkMultipliers.firearmDmg || 1) + 0.35; }
  },
  {
    id: 'crit_precision_2',
    gear: 'universal',
    maxPicks: 1,
    rarity: 'rare',
    title: "Mafia Critical Strike II (+15% Crit [1/1])",
    desc: 'Tăng +15% Tỉ lệ đòn đánh chí mạng (Bạo kích gây x2.5 Sát thương).',
    icon: '🎯',
    apply: (state) => { state.perkMultipliers.allCrit += 0.15; }
  },
  {
    id: 'molotov_inferno_2',
    gear: 'molotov',
    maxPicks: 1,
    rarity: 'rare',
    title: "Molotov Inferno II (+35% [1/1])",
    desc: 'Bom xăng tạo biển lửa thiêu đốt diện rộng và gây thêm +35% Sát thương.',
    icon: '🍾',
    apply: (state) => { state.perkMultipliers.molotovDmg += 0.35; }
  },
  {
    id: 'shield_overcharge_2',
    gear: 'shield',
    maxPicks: 1,
    rarity: 'rare',
    title: "Shield Overcharge II (+45 🛡️ [1/1])",
    desc: 'Tăng +45 Khiên tối đa và nạp đầy 100% khiên căn cứ ngay lập tức.',
    icon: '🛡️',
    apply: (state) => {
      state.maxShield += 45;
      state.shield = state.maxShield;
    }
  },
  {
    id: 'vest_thorn_2',
    gear: 'vest',
    maxPicks: 1,
    rarity: 'rare',
    title: "Titan Thorn Vest II (+35% Phản Đòn [1/1])",
    desc: 'Áo giáp titan phản lại thêm +35% sát thương khi quái va chạm vào căn cứ.',
    icon: '🦺',
    apply: (state) => { state.perkMultipliers.vestReflection += 0.35; }
  },
  {
    id: 'barrier_electric_2',
    gear: 'barrier',
    maxPicks: 1,
    rarity: 'rare',
    title: "Electric Barricade II (+25 DMG Sét [1/1])",
    desc: 'Rào chắn bọc dây điện cao thế: quái đi qua chịu 25 DMG sét/giây và chậm +15%.',
    icon: '★',
    apply: (state) => {
      state.perkMultipliers.barrierSlow += 0.15;
      state.perkMultipliers.barrierThornDmg = (state.perkMultipliers.barrierThornDmg || 0) + 25;
    }
  },
  {
    id: 'atm_jackpot_2',
    gear: 'card',
    maxPicks: 1, // GIỚI HẠN 1/1 DUY NHẤT
    rarity: 'rare',
    title: "ATM Jackpot II (+100% Tiền Rút [1/1])",
    desc: 'Thẻ ATM nhân đôi lượng tiền rút mỗi giây (+100%) và nhận ngay +25 $ (Tối đa 1 lần duy nhất).',
    icon: '$',
    apply: (state) => {
      state.runCash += 25;
      state.perkMultipliers.cardIncome = 2.0; // Đặt chuẩn x2, không cộng dồn cấp số nhân
    }
  },

  // --- 3. SỬ THI (EPIC - 5% TỈ LỆ - DUY NHẤT 1 LẦN [1/1]) ---
  {
    id: 'firearm_multishot_3',
    gear: 'firearm',
    maxPicks: 1,
    rarity: 'epic',
    title: "Twin Barrels (Multishot +1 [1/1])",
    desc: 'Súng lục bắn thêm 1 phát đạn song song quét diện rộng.',
    icon: '💥',
    apply: (state) => { state.perkMultipliers.firearmMultishot += 1; }
  },
  {
    id: 'all_weapons_surge_3',
    gear: 'universal',
    maxPicks: 1,
    rarity: 'epic',
    title: "Arsenal Overdrive III (+45% [1/1])",
    desc: 'Tăng +45% Sát thương cho TẤT CẢ mọi vũ khí và bẫy trong vali.',
    icon: '🔥',
    apply: (state) => {
      state.perkMultipliers.laserDmg += 0.45;
      state.perkMultipliers.daggerDmg += 0.45;
      state.perkMultipliers.molotovDmg += 0.45;
      state.perkMultipliers.firearmRate += 0.20;
    }
  },
  {
    id: 'deadly_assassin_3',
    gear: 'universal',
    maxPicks: 1,
    rarity: 'epic',
    title: "Deadly Assassin III (+25% Crit [1/1])",
    desc: 'Tăng +25% Tỉ lệ Bạo kích & Sát thương Chí Mạng tăng vọt lên x3.0!',
    icon: '🎯',
    apply: (state) => { state.perkMultipliers.allCrit += 0.25; }
  },
  {
    id: 'iron_fortress_3',
    gear: 'defense',
    maxPicks: 1,
    rarity: 'epic',
    title: "Iron Fortress III (+60 HP & +70 Khiên [1/1])",
    desc: 'Pháo đài thép gia cố: +60 HP, +70 Khiên tối đa và nạp đầy sinh lực căn cứ!',
    icon: '🏰',
    apply: (state) => {
      state.maxHp += 60;
      state.hp = state.maxHp;
      state.maxShield += 70;
      state.shield = state.maxShield;
    }
  },
  {
    id: 'bounty_empire_3',
    gear: 'card',
    maxPicks: 1, // GIỚI HẠN 1/1 DUY NHẤT
    rarity: 'epic',
    title: "Đế Chế Mafia III (+40 $ & +20 $/Wave [1/1])",
    desc: 'Lập tức nhận ngay +40 $ và mỗi khi hoàn thành wave được thưởng thêm +20 $ vĩnh viễn (Tối đa 1 lần).',
    icon: '👑',
    apply: (state) => {
      state.runCash += 40;
      state.perkMultipliers.cardWaveBonus = (state.perkMultipliers.cardWaveBonus || 0) + 20;
    }
  },

  // --- 4. HUYỀN THOẠI (LEGENDARY - 1% SIÊU HIẾM - DUY NHẤT 1 LẦN [1/1]) ---
  {
    id: 'godfather_arsenal_4',
    gear: 'universal',
    maxPicks: 1,
    rarity: 'legendary',
    title: "👑 Kho Vũ Khí Bố Già (+80% [1/1])",
    desc: 'Tăng cực mạnh (+80%) Sát thương toàn bộ trang bị & +30% Tốc đánh!',
    icon: '👑',
    apply: (state) => {
      state.perkMultipliers.laserDmg += 0.80;
      state.perkMultipliers.daggerDmg += 0.80;
      state.perkMultipliers.molotovDmg += 0.80;
      state.perkMultipliers.firearmRate += 0.30;
    }
  },
  {
    id: 'triple_barrels_4',
    gear: 'firearm',
    maxPicks: 1,
    rarity: 'legendary',
    title: "🔱 Đại Bác Ba Nòng (+2 Multishot [1/1])",
    desc: 'Súng lục nã 3 viên đạn song song quét sạch mọi kẻ thù trên bản đồ!',
    icon: '🔱',
    apply: (state) => { state.perkMultipliers.firearmMultishot += 2; }
  },
  {
    id: 'undying_aegis_4',
    gear: 'defense',
    maxPicks: 1,
    rarity: 'legendary',
    title: "🛡️ Hộ Thuẫn Bất Tử (Cực Phẩm [1/1])",
    desc: 'Khiên +100, hồi phục 40% HP mỗi wave và giảm 25% sát thương quái!',
    icon: '🛡️',
    apply: (state) => {
      state.maxShield += 100;
      state.shield = state.maxShield;
      state.maxHp += 40;
      state.hp = state.maxHp;
    }
  }
];

// ==========================================
// ==========================================
// METAGAME PERSISTENCE (LOBBY & ARSENAL)
// CHUẨN ĐÓNG GÓI PHÁT HÀNH WEB & YOUTUBE PLAYABLES
// ==========================================
class MetagameState {
  constructor() {
    this.RELEASE_VERSION = 'v1.0_factory_release';
    const storedVer = localStorage.getItem('mafia_release_version');

    // Tự động reset sạch về tài khoản người chơi mới cho lần đầu chạy bản phát hành này
    if (storedVer !== this.RELEASE_VERSION) {
      this.resetToFactoryRelease();
      localStorage.setItem('mafia_release_version', this.RELEASE_VERSION);
    } else {
      this.loadFromStorage();
    }

    // Tích hợp YouTube Playables SDK Cloud Load (Tải dữ liệu đồng bộ theo Account YouTube)
    this.initYouTubePlayables();
  }

  loadFromStorage() {
    this.cash = parseInt(localStorage.getItem('mafia_cash') || '150', 10);
    this.gems = parseInt(localStorage.getItem('mafia_gems') || '10', 10);
    this.energy = parseInt(localStorage.getItem('mafia_energy') || '30', 10);
    this.highScore = parseInt(localStorage.getItem('mafia_high_score') || '0', 10);
    this.maxWave = parseInt(localStorage.getItem('mafia_max_wave') || '1', 10);
    this.gameMode = localStorage.getItem('mafia_game_mode') || 'normal';

    this.lastAdEnergyTime = parseInt(localStorage.getItem('mafia_last_ad_energy') || '0', 10);
    this.lastAdGemTime = parseInt(localStorage.getItem('mafia_last_ad_gem') || '0', 10);
    this.unlockedStage = parseInt(localStorage.getItem('mafia_unlocked_stage') || '1', 10);
    this.selectedStage = parseInt(localStorage.getItem('mafia_selected_stage') || '1', 10);
    this.seasonPoints = parseInt(localStorage.getItem('mafia_season_points') || '0', 10);
    this.monsterKills = parseInt(localStorage.getItem('mafia_monster_kills') || '0', 10);
    this.bossKills = parseInt(localStorage.getItem('mafia_boss_kills') || '0', 10);
    this.claimedMilestones = JSON.parse(localStorage.getItem('mafia_claimed_milestones') || '[]');
    this.claimedWeeklyRank = localStorage.getItem('mafia_claimed_weekly_rank') === 'true';
    this.clearedStages = JSON.parse(localStorage.getItem('mafia_cleared_stages') || '[]');

    // Chỉ 3 vũ khí cơ bản ban đầu: Dao Găm, Súng Lục, Bom Xăng
    const defaultUnlocked = ['dagger', 'firearm', 'molotov'];
    const savedUnlocked = JSON.parse(localStorage.getItem('mafia_unlocked_gears') || 'null');
    this.unlockedGears = Array.isArray(savedUnlocked) && savedUnlocked.length > 0 ? savedUnlocked : [...defaultUnlocked];

    const savedLoadout = JSON.parse(localStorage.getItem('mafia_loadout') || 'null');
    if (Array.isArray(savedLoadout) && savedLoadout.length > 0) {
      this.equippedLoadout = savedLoadout.filter(t => this.unlockedGears.includes(t));
      if (this.equippedLoadout.length === 0) this.equippedLoadout = ['dagger', 'firearm', 'molotov'];
    } else {
      this.equippedLoadout = this.unlockedGears.slice(0, this.getMaxLoadoutSlots());
    }

    this.materials = JSON.parse(localStorage.getItem('mafia_materials') || '{}');
    this.weaponLevels = JSON.parse(localStorage.getItem('mafia_weapon_lvls') || '{}');
    Object.keys(ADMIN_GEAR_CONFIG).forEach(k => {
      if (this.materials[k] === undefined) this.materials[k] = 0;
      if (this.weaponLevels[k] === undefined) this.weaponLevels[k] = 1;
    });

    this.unlockedBossTraits = JSON.parse(localStorage.getItem('mafia_unlocked_bosses') || '[]');
  }

  // ĐÓNG GÓI PHÁT HÀNH: Đưa toàn bộ dữ liệu người chơi về trạng thái ban đầu sạch 100%
  resetToFactoryRelease() {
    const keysToRemove = [
      'mafia_cash', 'mafia_gems', 'mafia_energy', 'mafia_high_score', 'mafia_max_wave',
      'mafia_game_mode', 'mafia_last_ad_energy', 'mafia_last_ad_gem',
      'mafia_unlocked_stage', 'mafia_selected_stage', 'mafia_season_points',
      'mafia_monster_kills', 'mafia_boss_kills', 'mafia_claimed_milestones',
      'mafia_claimed_weekly_rank', 'mafia_materials', 'mafia_weapon_lvls',
      'mafia_unlocked_bosses', 'mafia_unlocked_gears', 'mafia_loadout',
      'mafia_cleared_stages', 'mafia_battle_save', 'mafia_is_factory_packaged'
    ];
    keysToRemove.forEach(k => {
      try { localStorage.removeItem(k); } catch(e) {}
    });

    this.cash = 150; // Vàng Mafia khởi đầu
    this.gems = 10;  // Kim cương khởi đầu
    this.energy = 30; // Năng lượng khởi đầu
    this.highScore = 0;
    this.maxWave = 1;
    this.gameMode = 'normal';
    this.unlockedStage = 1; // Chỉ mở Màn 1! Màn 2..5 bị khóa
    this.selectedStage = 1;
    this.seasonPoints = 0;
    this.monsterKills = 0;
    this.bossKills = 0;
    this.claimedMilestones = [];
    this.claimedWeeklyRank = false;
    this.clearedStages = [];

    // Chỉ mở 3 vũ khí cơ bản ban đầu: Dao Găm, Súng Lục, Bom Xăng
    this.unlockedGears = ['dagger', 'firearm', 'molotov'];
    this.equippedLoadout = ['dagger', 'firearm', 'molotov'];

    this.materials = {};
    this.weaponLevels = {};
    Object.keys(ADMIN_GEAR_CONFIG).forEach(k => {
      this.materials[k] = 0;
      this.weaponLevels[k] = 1;
    });

    this.unlockedBossTraits = [];

    this.save();
    return true;
  }

  // TÍCH HỢP YOUTUBE PLAYABLES SDK
  initYouTubePlayables() {
    if (typeof window === 'undefined' || !window.ytgame) return;

    // 1. Tải tiến trình đã lưu trên tài khoản YouTube (Cloud Save)
    if (window.ytgame.game && typeof window.ytgame.game.loadData === 'function') {
      window.ytgame.game.loadData().then(cloudData => {
        if (cloudData) {
          try {
            const parsed = typeof cloudData === 'string' ? JSON.parse(cloudData) : cloudData;
            if (parsed && parsed.cash !== undefined) {
              this.cash = parsed.cash;
              this.gems = parsed.gems !== undefined ? parsed.gems : this.gems;
              this.highScore = parsed.highScore || this.highScore;
              this.maxWave = parsed.maxWave || this.maxWave;
              this.unlockedStage = parsed.unlockedStage || this.unlockedStage;
              this.selectedStage = parsed.selectedStage || this.selectedStage;
              this.monsterKills = parsed.monsterKills || this.monsterKills;
              this.bossKills = parsed.bossKills || this.bossKills;
              this.claimedMilestones = parsed.claimedMilestones || this.claimedMilestones;
              this.clearedStages = parsed.clearedStages || this.clearedStages;
              this.unlockedGears = parsed.unlockedGears || this.unlockedGears;
              this.equippedLoadout = parsed.equippedLoadout || this.equippedLoadout;
              this.materials = parsed.materials || this.materials;
              this.weaponLevels = parsed.weaponLevels || this.weaponLevels;
              this.unlockedBossTraits = parsed.unlockedBossTraits || this.unlockedBossTraits;
              this.save();
              if (window.gameApp && typeof window.gameApp.renderLobby === 'function') {
                window.gameApp.renderLobby();
                if (window.gameApp.renderLobbyArsenal) window.gameApp.renderLobbyArsenal();
              }
            }
          } catch(e) {}
        }
      }).catch(() => {});
    }

    // 2. Lắng nghe thay đổi âm thanh từ giao diện YouTube
    if (window.ytgame.system && typeof window.ytgame.system.onAudioEnabledChange === 'function') {
      window.ytgame.system.onAudioEnabledChange(isEnabled => {
        sfx.enabled = isEnabled;
        const sndImg = document.getElementById('img-sound-icon');
        if (sndImg) sndImg.src = sfx.enabled ? 'assets/icons/sound_on.png' : 'assets/icons/sound_off.png';
      });
    }

    // 3. Tạm dừng khi chuyển tab / ẩn màn hình YouTube
    if (window.ytgame.system && typeof window.ytgame.system.onPause === 'function') {
      window.ytgame.system.onPause(() => {
        if (window.gameApp && window.gameApp.battle && window.gameApp.battle.state) {
          window.gameApp.battle.state.isPaused = true;
        }
      });
    }
    if (window.ytgame.system && typeof window.ytgame.system.onResume === 'function') {
      window.ytgame.system.onResume(() => {
        const pauseModal = document.getElementById('modal-battle-pause');
        if (window.gameApp && window.gameApp.battle && window.gameApp.battle.state && (!pauseModal || pauseModal.classList.contains('hidden'))) {
          window.gameApp.battle.state.isPaused = false;
        }
      });
    }
  }

  // DANH MỤC THỨ TỰ 18 VŨ KHÍ ĐỂ NÉN CHỈ MỤC SIÊU GỌN
  static get GEAR_KEYS() {
    return [
      'dagger', 'firearm', 'molotov', 'bow', 'barrier', 'vest', 'shield', 'laser',
      'belt', 'card', 'flamethrower', 'cryo_grenade', 'landmine', 'drone', 'scope',
      'tesla', 'mortar', 'speed_loader'
    ];
  }

  // XUẤT MÃ LƯU TOÀN BỘ TIẾN TRÌNH (LƯU 100% DỮ LIỆU NHƯNG ĐƯỢC NÉN CHỈ MỤC CỰC GỌN ~150 KÝ TỰ)
  generateSaveCode() {
    const keys = MetagameState.GEAR_KEYS;
    const uIdx = (this.unlockedGears || []).map(g => keys.indexOf(g)).filter(i => i >= 0);
    const lIdx = (this.equippedLoadout || []).map(g => keys.indexOf(g)).filter(i => i >= 0);

    const lvls = {};
    Object.keys(this.weaponLevels || {}).forEach(k => {
      const idx = keys.indexOf(k);
      if (idx >= 0 && this.weaponLevels[k] > 1) lvls[idx] = this.weaponLevels[k];
    });

    const mats = {};
    Object.keys(this.materials || {}).forEach(k => {
      const idx = keys.indexOf(k);
      if (idx >= 0 && this.materials[k] > 0) mats[idx] = this.materials[k];
    });

    // Mảng nén chứa TOÀN BỘ 100% dữ liệu game người chơi:
    // 0: cash, 1: gems, 2: energy, 3: highScore, 4: maxWave, 5: unlockedStage, 6: selectedStage,
    // 7: seasonPoints, 8: monsterKills, 9: bossKills, 10: claimedMilestones, 11: clearedStages,
    // 12: unlockedBossTraits, 13: uIdx, 14: lIdx, 15: lvls, 16: mats
    const packed = [
      this.cash,
      this.gems,
      this.energy,
      this.highScore,
      this.maxWave,
      this.unlockedStage,
      this.selectedStage,
      this.seasonPoints,
      this.monsterKills,
      this.bossKills,
      this.claimedMilestones || [],
      this.clearedStages || [],
      this.unlockedBossTraits || [],
      uIdx,
      lIdx,
      lvls,
      mats
    ];

    try {
      const jsonStr = JSON.stringify(packed);
      let b64 = '';
      if (typeof btoa === 'function') {
        b64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
      } else if (typeof Buffer !== 'undefined') {
        b64 = Buffer.from(jsonStr, 'utf8').toString('base64');
      }
      return 'DS_' + b64.replace(/=+$/, '');
    } catch (e) {
      return '';
    }
  }

  // NẠP TOÀN BỘ TIẾN TRÌNH TỪ MÃ LƯU (100% KHÔI PHỤC TOÀN DIỆN MỌI DỮ LIỆU)
  loadFromSaveCode(codeStr) {
    if (!codeStr || typeof codeStr !== 'string') return { success: false, msg: 'Mã lưu không hợp lệ!' };
    let clean = codeStr.trim();
    if (clean.startsWith('DS_')) clean = clean.substring(3);
    else if (clean.startsWith('DESERT_')) clean = clean.substring(7);

    while (clean.length % 4 !== 0) {
      clean += '=';
    }

    try {
      let jsonStr = '';
      if (typeof atob === 'function') {
        jsonStr = decodeURIComponent(atob(clean).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      } else if (typeof Buffer !== 'undefined') {
        jsonStr = Buffer.from(clean, 'base64').toString('utf8');
      }
      const d = JSON.parse(jsonStr);
      if (!d) return { success: false, msg: 'Dữ liệu mã lưu bị lỗi!' };

      const keys = MetagameState.GEAR_KEYS;

      // Định dạng mảng nén toàn bộ dữ liệu [0..16]
      if (Array.isArray(d)) {
        this.cash = parseInt(d[0], 10) || 0;
        this.gems = parseInt(d[1], 10) || 0;
        this.energy = Math.min(30, parseInt(d[2], 10) || 30);
        this.highScore = parseInt(d[3], 10) || 0;
        this.maxWave = parseInt(d[4], 10) || 1;
        this.unlockedStage = Math.max(1, Math.min(5, parseInt(d[5], 10) || 1));
        this.selectedStage = Math.max(1, Math.min(this.unlockedStage, parseInt(d[6], 10) || 1));
        this.seasonPoints = parseInt(d[7], 10) || 0;
        this.monsterKills = parseInt(d[8], 10) || 0;
        this.bossKills = parseInt(d[9], 10) || 0;
        this.claimedMilestones = Array.isArray(d[10]) ? d[10] : [];
        this.clearedStages = Array.isArray(d[11]) ? d[11] : [];
        this.unlockedBossTraits = Array.isArray(d[12]) ? d[12] : [];

        // Khôi phục vũ khí mở khóa
        const uIdxList = Array.isArray(d[13]) ? d[13] : [0, 1, 2];
        const restoredGears = uIdxList.map(i => keys[i]).filter(Boolean);
        this.unlockedGears = restoredGears.length > 0 ? restoredGears : ['dagger', 'firearm', 'molotov'];

        // Khôi phục bộ trang bị ra trận
        const lIdxList = Array.isArray(d[14]) ? d[14] : [0, 1, 2];
        const restoredLoadout = lIdxList.map(i => keys[i]).filter(g => this.unlockedGears.includes(g));
        this.equippedLoadout = restoredLoadout.length > 0 ? restoredLoadout : this.unlockedGears.slice(0, this.getMaxLoadoutSlots());

        // Khôi phục cấp độ 18 vũ khí
        this.weaponLevels = {};
        Object.keys(ADMIN_GEAR_CONFIG).forEach(k => { this.weaponLevels[k] = 1; });
        const rawLvls = d[15] || {};
        Object.keys(rawLvls).forEach(idx => {
          const k = keys[idx];
          if (k && this.weaponLevels[k] !== undefined) {
            this.weaponLevels[k] = Math.max(1, Math.min(10, parseInt(rawLvls[idx], 10) || 1));
          }
        });

        // Khôi phục mảnh nguyên liệu 18 vũ khí
        this.materials = {};
        Object.keys(ADMIN_GEAR_CONFIG).forEach(k => { this.materials[k] = 0; });
        const rawMats = d[16] || {};
        Object.keys(rawMats).forEach(idx => {
          const k = keys[idx];
          if (k && this.materials[k] !== undefined) {
            this.materials[k] = Math.max(0, parseInt(rawMats[idx], 10) || 0);
          }
        });
      } else {
        // Hỗ trợ backward compatible với object dictionary
        this.cash = parseInt(d.c !== undefined ? d.c : d.cash, 10) || 0;
        this.gems = parseInt(d.g !== undefined ? d.g : d.gems, 10) || 0;
        this.unlockedStage = Math.max(1, Math.min(5, parseInt(d.s !== undefined ? d.s : d.unlockedStage, 10) || 1));
        this.selectedStage = this.unlockedStage;
        this.maxWave = parseInt(d.w !== undefined ? d.w : d.maxWave, 10) || 1;
        this.highScore = parseInt(d.h !== undefined ? d.h : d.highScore, 10) || 0;
        this.unlockedGears = Array.isArray(d.u || d.unlockedGears) ? (d.u || d.unlockedGears) : ['dagger', 'firearm', 'molotov'];
        this.equippedLoadout = this.unlockedGears.slice(0, this.getMaxLoadoutSlots());
      }

      this.save();
      return { success: true, msg: 'Đã nạp thành công toàn bộ tiến trình game!' };
    } catch (err) {
      return { success: false, msg: 'Không thể giải mã tiến trình! Hãy kiểm tra lại mã đã dán.' };
    }
  }

  getMaxLoadoutSlots() {
    let slots = 5;
    if (this.maxWave >= 5) slots = 6;
    if (this.maxWave >= 15) slots = 7;
    return slots;
  }

  isGearUnlocked(typeId) {
    return this.unlockedGears.includes(typeId);
  }

  unlockGear(typeId) {
    if (!this.unlockedGears.includes(typeId)) {
      this.unlockedGears.push(typeId);
      // Tự động mang vào nếu bộ trang bị chưa đầy
      if (this.equippedLoadout.length < this.getMaxLoadoutSlots()) {
        this.equippedLoadout.push(typeId);
      }
      this.save();
      return true;
    }
    return false;
  }

  toggleLoadoutGear(typeId) {
    if (!this.isGearUnlocked(typeId)) return { success: false, msg: 'Trang bị này chưa mở khóa! Hãy mở hòm gacha để sở hữu.' };
    
    const idx = this.equippedLoadout.indexOf(typeId);
    if (idx !== -1) {
      if (this.equippedLoadout.length <= 1) {
        return { success: false, msg: 'Cần giữ lại ít nhất 1 trang bị để mang vào trận!' };
      }
      this.equippedLoadout.splice(idx, 1);
      this.save();
      return { success: true, action: 'removed', msg: `Đã tháo ${GEAR_TYPES[typeId]?.name || typeId} khỏi Bộ Trang Bị.` };
    } else {
      const maxSlots = this.getMaxLoadoutSlots();
      if (this.equippedLoadout.length >= maxSlots) {
        return { success: false, msg: `Bộ trang bị đã đầy (Tối đa ${maxSlots} món)! Hãy bấm vào một món đang mang để tháo ra trước.` };
      }
      this.equippedLoadout.push(typeId);
      this.save();
      return { success: true, action: 'added', msg: `Đã trang bị ${GEAR_TYPES[typeId]?.name || typeId} vào Bộ Trang Bị ra trận!` };
    }
  }

  unlockBossTrait(bossId) {
    if (!this.unlockedBossTraits.includes(bossId)) {
      this.unlockedBossTraits.push(bossId);
      this.save();
      return true;
    }
    return false;
  }

  save() {
    localStorage.setItem('mafia_cash', this.cash);
    localStorage.setItem('mafia_gems', this.gems);
    localStorage.setItem('mafia_energy', this.energy);
    localStorage.setItem('mafia_high_score', this.highScore);
    localStorage.setItem('mafia_max_wave', this.maxWave);
    localStorage.setItem('mafia_game_mode', this.gameMode);
    localStorage.setItem('mafia_unlocked_stage', this.unlockedStage);
    localStorage.setItem('mafia_selected_stage', this.selectedStage);
    localStorage.setItem('mafia_season_points', this.seasonPoints);
    localStorage.setItem('mafia_monster_kills', this.monsterKills);
    localStorage.setItem('mafia_boss_kills', this.bossKills);
    localStorage.setItem('mafia_claimed_milestones', JSON.stringify(this.claimedMilestones));
    localStorage.setItem('mafia_claimed_weekly_rank', this.claimedWeeklyRank);
    localStorage.setItem('mafia_cleared_stages', JSON.stringify(this.clearedStages || []));
    localStorage.setItem('mafia_materials', JSON.stringify(this.materials));
    localStorage.setItem('mafia_weapon_lvls', JSON.stringify(this.weaponLevels));
    localStorage.setItem('mafia_unlocked_bosses', JSON.stringify(this.unlockedBossTraits));
    localStorage.setItem('mafia_unlocked_gears', JSON.stringify(this.unlockedGears));
    localStorage.setItem('mafia_loadout', JSON.stringify(this.equippedLoadout));

    // YouTube Playables SDK Cloud Save (Lưu đồng bộ vào tài khoản YouTube của người chơi)
    if (typeof window !== 'undefined' && window.ytgame && window.ytgame.game && typeof window.ytgame.game.saveData === 'function') {
      try {
        const payload = JSON.stringify({
          cash: this.cash,
          gems: this.gems,
          energy: this.energy,
          highScore: this.highScore,
          maxWave: this.maxWave,
          unlockedStage: this.unlockedStage,
          selectedStage: this.selectedStage,
          seasonPoints: this.seasonPoints,
          monsterKills: this.monsterKills,
          bossKills: this.bossKills,
          claimedMilestones: this.claimedMilestones,
          clearedStages: this.clearedStages || [],
          unlockedGears: this.unlockedGears,
          equippedLoadout: this.equippedLoadout,
          materials: this.materials,
          weaponLevels: this.weaponLevels,
          unlockedBossTraits: this.unlockedBossTraits
        });
        window.ytgame.game.saveData(payload).catch(() => {});
      } catch (err) {}
    }
  }

  // YÊU CẦU 5: 10 DẠNG TIẾN HÓA (LV 1 -> LV 10) & BẢNG NGUYÊN LIỆU + TIỀN
  getUpgradeCost(curLvl) {
    const costs = [
      { lvl: 1, frags: 15, cash: 200 },
      { lvl: 2, frags: 30, cash: 500 },
      { lvl: 3, frags: 50, cash: 1000 },
      { lvl: 4, frags: 80, cash: 2000 },
      { lvl: 5, frags: 120, cash: 3500 },
      { lvl: 6, frags: 170, cash: 5500 },
      { lvl: 7, frags: 240, cash: 8500 },
      { lvl: 8, frags: 350, cash: 13000 },
      { lvl: 9, frags: 500, cash: 20000 }
    ];
    return costs[curLvl - 1] || { lvl: curLvl, frags: 9999, cash: 99999 };
  }

  upgradeWeapon(typeId) {
    const curLvl = this.weaponLevels[typeId] || 1;
    if (curLvl >= 10) return false; // Cực hạn Lv10

    const cost = this.getUpgradeCost(curLvl);
    if ((this.materials[typeId] || 0) >= cost.frags && this.cash >= cost.cash) {
      this.materials[typeId] -= cost.frags;
      this.cash -= cost.cash;
      this.weaponLevels[typeId] = curLvl + 1;
      this.save();
      sfx.victory();
      return true;
    }
    return false;
  }
}

// ==========================================
// IN-RUN STATE
// ==========================================

class InRunState {
  constructor(meta) {
    this.meta = meta;
    this.wave = 1;
    this.currentScore = 0;
    this.speed = 1;
    this.runCash = 30;
    this.refreshCost = 5;

    this.maxHp = 100;
    this.hp = 100;
    this.maxShield = 100;
    this.shield = 100;

    // IN-WAVE EXP & LEVEL UP SYSTEM (ẢNH 3 & 4)
    this.inWaveLevel = 1;
    this.inWaveExp = 0;
    this.expToNextLevel = 60;
    this.perks = [];
    this.perkMultipliers = {
      laserDmg: 1,
      firearmRate: 1,
      firearmDmg: 1,
      firearmMultishot: 0,
      allCrit: 0,
      daggerDmg: 1,
      molotovDmg: 1,
      barrierSlow: 0,
      barrierThornDmg: 0,
      vestReflection: 1,
      armorRegenHp: 0,
      shieldRegenBonus: 0,
      cardIncome: 1,
      beltBuffBonus: 0,
      beltRateBonus: 0
    };

    this.isPaused = false;
    this.isGameOver = false;
    this.reviveUsed = false;

    // 7x7 Grid: rows 0..6, cols 0..6 (49 cells)
    // EXACT CENTER 3x3: Rows 2..4, Cols 2..4 (Mặc định ở giữa)
    this.gridUnlocked = new Array(49).fill(false);
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        this.gridUnlocked[r * 7 + c] = true;
      }
    }

    // Weapons deployed inside backpack suitcase
    this.backpackItems = [];

    // 5-SLOT STASH BENCH (YÊU CẦU 3: Ô 1 Free, Ô 2 25$, Ô 3 15 Gems, Ô 4 1-QC, Ô 5 2-QC)
    this.stashSlots = [null, null, null, null, null];
    this.stashUnlocked = [true, false, false, false, false]; // Slot 0 miễn phí
    this.stashAdWatched = [0, 0, 0, 0, 0];
    this.unlockedSpeedX3 = false;
    this.unlockedSpeedX5 = false;

    // 3-ITEM SHOP SLOTS (Chuẩn Idle Mafia)
    this.shopSlots = [null, null, null];
    this.refreshCost = 10;
    this.hardcoreMode = (meta && meta.gameMode === 'hardcore');

    // Initial Starter: Lấy vũ khí đầu tiên trong Bộ Trang Bị (Loadout) tại trung tâm 3x3 (r:3, c:3)
    let starterType = 'dagger';
    if (this.meta && this.meta.equippedLoadout && this.meta.equippedLoadout.length > 0) {
      const wFound = this.meta.equippedLoadout.find(t => ADMIN_GEAR_CONFIG[t]?.category === 'weapon');
      starterType = wFound || this.meta.equippedLoadout[0];
    }
    const starterGInfo = GEAR_TYPES[starterType] || { w: 1, h: 1 };
    this.backpackItems.push({
      uid: 'bp_' + Math.random().toString(36).substr(2, 9),
      type: starterType,
      tier: 1,
      r: 3,
      c: 3,
      w: starterGInfo.w || 1,
      h: starterGInfo.h || 1,
      lastShotTime: 0
    });

    // Initial Roll (3 items ready in shop)
    this.rollShop(false);
    this.recalculateStats();
  }

  // ĐỒNG BỘ CHỈ SỐ MÁU & KHIÊN CĂN CỨ TỪ TRANG BỊ GIÁP (VEST, SHIELD)
  recalculateStats() {
    let bonusShield = 0;
    let bonusHp = 0;
    this.backpackItems.forEach(item => {
      const cfg = ADMIN_GEAR_CONFIG[item.type];
      if (!cfg) return;
      const tier = item.tier || 1;
      const lvl = (this.meta && this.meta.weaponLevels && this.meta.weaponLevels[item.type]) || 1;
      const tierMult = 1 + (tier - 1) * 0.45;
      const lvlMult = 1 + (lvl - 1) * 0.12;
      if (cfg.shieldBonus) {
        bonusShield += cfg.shieldBonus * tierMult * lvlMult;
      }
      if (cfg.hpBonus) {
        bonusHp += cfg.hpBonus * tierMult * lvlMult;
      }
    });

    const baseShield = 100;
    const baseHp = 100;
    const oldMaxShield = this.maxShield;
    this.maxShield = Math.round(baseShield + bonusShield);
    this.maxHp = Math.round(baseHp + bonusHp);

    if (this.maxShield > oldMaxShield) {
      this.shield = Math.min(this.maxShield, this.shield + (this.maxShield - oldMaxShield));
    } else if (this.shield > this.maxShield) {
      this.shield = this.maxShield;
    }
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }

  // TÍNH GIÁ BÁN THEO BẬC TIER: Tier 1: basePrice, Tier 2: +1$, Tier 3: +2$, Tier 4: +3$...
  calculateSellPrice(item) {
    if (!item) return 0;
    // ĐỒNG GIÁ BÁN 2$ CHO MỌI TRANG BỊ & MẢNH ĐẤT (CHỐNG LẠM PHÁT)
    return 2;
  }

  // DỜI VÙNG VALI (3x3 TRÁI, PHẢI, LÊN, XUỐNG - YÊU CẦU 5)
  shiftSuitcase(dRow, dCol) {
    // 1. Kiểm tra toàn bộ ô đã mở có nằm trong phạm vi 0..6 khi dời không
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (this.gridUnlocked[r * 7 + c]) {
          const nr = r + dRow;
          const nc = c + dCol;
          if (nr < 0 || nr >= 7 || nc < 0 || nc >= 7) {
            return false;
          }
        }
      }
    }

    // 2. Kiểm tra toàn bộ trang bị có nằm trong 0..6 khi dời không
    for (const it of this.backpackItems) {
      const gDef = GEAR_TYPES[it.type];
      const w = gDef ? gDef.w : (it.w || 1);
      const h = gDef ? gDef.h : (it.h || 1);
      const nr = it.r + dRow;
      const nc = it.c + dCol;
      if (nr < 0 || nr + h > 7 || nc < 0 || nc + w > 7) {
        return false;
      }
    }

    // 3. Thực hiện dời mảng ô đã mở
    const newGrid = new Array(49).fill(false);
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (this.gridUnlocked[r * 7 + c]) {
          newGrid[(r + dRow) * 7 + (c + dCol)] = true;
        }
      }
    }
    this.gridUnlocked = newGrid;

    // 4. Dời vị trí toàn bộ trang bị
    this.backpackItems.forEach(it => {
      it.r += dRow;
      it.c += dCol;
    });

    return true;
  }

  unlockStashSlot(slotIdx) {
    if (this.stashUnlocked[slotIdx]) return false;
    const cost = this.stashUnlockCosts[slotIdx] || 10;
    if (this.runCash < cost) return false;
    this.runCash -= cost;
    this.stashUnlocked[slotIdx] = true;
    return true;
  }


  rollShop(deduct = true) {
    if (deduct) {
      if (this.runCash < this.refreshCost) return false;
      this.runCash -= this.refreshCost;
    }

    // TỰ ĐỘNG BÁN: Thu hồi và hoàn tiền toàn bộ các trang bị còn lại trong 3 ô shop
    let autoSoldCash = 0;
    let autoSoldCount = 0;
    this.shopSlots.forEach(it => {
      if (it) {
        autoSoldCash += this.calculateSellPrice(it);
        autoSoldCount++;
      }
    });

    if (autoSoldCount > 0) {
      this.runCash += autoSoldCash;
      this._lastAutoSoldInfo = { count: autoSoldCount, cash: autoSoldCash };
    } else {
      this._lastAutoSoldInfo = null;
    }

    // TIERED ROLL: Chỉ roll ra các trang bị nằm trong Bộ Trang Bị (Loadout) đã chọn trước trận
    const allowedTypes = (this.meta && this.meta.equippedLoadout && this.meta.equippedLoadout.length > 0)
      ? this.meta.equippedLoadout
      : Object.keys(GEAR_TYPES);

    // YÊU CẦU 4: Tỉ lệ roll bám theo trang bị trong vali.
    // Tỉ lệ cao nhất ra lv thấp nhất (minTier), tỉ lệ cực thấp ra lv cao nhất (maxTier).
    // Trang bị đã đạt cấp tối thượng (Lv10) sẽ không xuất hiện trong lượt roll nữa!
    const bpTiers = this.backpackItems.map(it => it.tier || 1);
    const minTierInBp = bpTiers.length > 0 ? Math.min(...bpTiers) : 1;
    const maxTierInBp = bpTiers.length > 0 ? Math.min(10, Math.max(...bpTiers)) : 1;

    // Loại trừ trang bị đã max Lv10 khỏi lượt roll
    const maxedTypes = this.backpackItems.filter(it => (it.tier || 1) >= 10).map(it => it.type);
    let effectiveAllowedTypes = allowedTypes.filter(t => !maxedTypes.includes(t));
    if (effectiveAllowedTypes.length === 0) effectiveAllowedTypes = allowedTypes;

    for (let slotIdx = 0; slotIdx < 3; slotIdx++) {
      let rolledTier = 1;
      if (bpTiers.length > 0) {
        // Xây dựng trọng số: minTier chiếm ~60%, các bậc tiếp theo giảm dần, maxTier chỉ ~1-2%
        const tierWeights = [];
        let totalW = 0;
        for (let t = 1; t <= maxTierInBp; t++) {
          let w = 5;
          if (t < minTierInBp) {
            w = 12; // Bậc thấp hơn minTier vẫn có cơ hội ra để hợp nhất
          } else if (t === minTierInBp) {
            w = 58; // BẬC THẤP NHẤT TRONG VALI CÓ TỈ LỆ CAO NHẤT (58%)
          } else {
            const diff = t - minTierInBp;
            if (diff === 1) w = 24; // Bậc kế tiếp 24%
            else if (diff === 2) w = 10; // Bậc cao hơn 10%
            else if (diff === 3) w = 4;  // Bậc cao nữa 4%
            else w = 1;                  // Bậc cao nhất chỉ 1% (cực hiếm)
          }
          tierWeights.push({ tier: t, weight: w });
          totalW += w;
        }

        const randVal = Math.random() * totalW;
        let cumulative = 0;
        for (const tw of tierWeights) {
          cumulative += tw.weight;
          if (randVal <= cumulative) {
            rolledTier = tw.tier;
            break;
          }
        }
      }

      const isLand = Math.random() < 0.11; // 11% ra mảnh đất (tầm 3 lần roll xuất hiện 1 lần theo Yêu cầu 5)
      if (isLand) {
        const shape = LAND_TILE_SHAPES[Math.floor(Math.random() * LAND_TILE_SHAPES.length)];
        this.shopSlots[slotIdx] = {
          isLand: true,
          uid: 'land_' + Math.random().toString(36).substr(2, 9),
          name: shape.name,
          w: shape.w,
          h: shape.h,
          slotIndex: slotIdx
        };
      } else {
        // Weighted random type selection (chỉ trong allowedTypes)
        let totalRollWeight = 0;
        const weightedTypes = (effectiveAllowedTypes || allowedTypes).map(t => {
          const rw = ADMIN_GEAR_CONFIG[t]?.rollWeight || 10;
          totalRollWeight += rw;
          return { type: t, weight: rw };
        });
        let rollW = Math.random() * totalRollWeight;
        let randType = allowedTypes[0];
        for (const wt of weightedTypes) {
          rollW -= wt.weight;
          if (rollW <= 0) { randType = wt.type; break; }
        }
        const gInfo = GEAR_TYPES[randType];
        this.shopSlots[slotIdx] = {
          isLand: false,
          uid: 'gear_' + Math.random().toString(36).substr(2, 9),
          type: randType,
          tier: rolledTier,
          w: gInfo.w,
          h: gInfo.h,
          slotIndex: slotIdx,
          lastShotTime: 0
        };
      }
    }
    return true;
  }

  // Backwards compatibility alias
  rollSingleItem(deduct = true) {
    return this.rollShop(deduct);
  }

  _oldUnusedMethod() {
  }

  calculateBuffs() {
    const buffs = [];
    let beltCount = 0;
    let vestCount = 0;
    let firearmCount = 0;
    let laserCount = 0;

    this.backpackItems.forEach(item => {
      if (item.type === 'belt') beltCount++;
      if (item.type === 'vest') vestCount++;
      if (item.type === 'firearm' || item.type === 'dagger') firearmCount++;
      if (item.type === 'laser') laserCount++;
    });

    if (beltCount > 0) {
      buffs.push({
        icon: '🥋',
        text: `Adjacent Firearm's ATK +${beltCount * 12}%`
      });
    }
    if (laserCount > 0) {
      buffs.push({
        icon: '★',
        text: `Laser Guns' ATK +${laserCount * 15}%`
      });
    }
    if (vestCount > 0) {
      buffs.push({
        icon: '🦺',
        text: `Bulletproof Vest's DMG Reflection Ratio +${Math.round(vestCount * 35 * this.perkMultipliers.vestReflection)}%`
      });
    }
    if (firearmCount > 0) {
      buffs.push({
        icon: '🔫',
        text: `Firearm's ATK +${firearmCount * 4}% (Tốc độ x${this.perkMultipliers.firearmRate.toFixed(2)})`
      });
    }

    // Active in-wave Roguelike Perks (Ảnh 4)
    this.perks.forEach(p => {
      buffs.push({
        icon: p.icon,
        text: `${p.title} (${p.desc})`
      });
    });

    return buffs;
  }
}

// ==========================================
// DESERT BATTLE ENGINE (DIRECT HERO-BEAM & NEAREST LOCK AI)
// ==========================================
class DesertBattleEngine {
  constructor(canvas, runState, onWaveClear, onDefeat, onLevelUp) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = runState;
    this.meta = runState ? runState.meta : null;
    this.onWaveClear = onWaveClear;
    this.onDefeat = onDefeat;
    this.onLevelUp = onLevelUp;

    this.enemies = [];
    this.projectiles = [];
    this.laserBeams = [];
    this.bossBullets = [];
    this.molotovLobs = [];
    this.cryoGrenadeLobs = [];
    this.mortarShells = [];
    this.teslaBolts = [];
    this.placedMines = [];
    this.fireZones = [];
    this.particles = [];
    this.damageTexts = [];
    this.dronePulseTimer = 0;

    this.spawnTimer = 0;
    this.enemiesRemaining = 0;
    this.totalWaveEnemies = 0;
    this.enemiesSpawned = 0;

    this.sprites = {};
    this.loadSprites();

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  loadSprites() {
    const list = {
      cactus: 'assets/environment/prop_cactus.png',
      rock: 'assets/environment/prop_rock.png',
      desert_tile: 'assets/environment/desert_tile.png',
      prop_bunker: 'assets/environment/prop_bunker.png',
      hero_commander: 'assets/hero/hero_commander.png',
      prop_fire_zone: 'assets/environment/prop_fire_zone.png',
      barrier_broken: 'assets/utility/barrier_broken.png',
      bg_battle_desert: 'assets/environment/bg_battle_desert.png',
      monster_thug: 'assets/monsters/monster_thug.png',
      monster_scorpion: 'assets/monsters/monster_scorpion.png',
      monster_tank: 'assets/monsters/monster_tank.png',
      monster_healer: 'assets/monsters/monster_healer.png',
      monster_phantom: 'assets/monsters/monster_phantom.png',
      boss_stage1: 'assets/bosses/boss_stage1.png',
      boss_stage2: 'assets/bosses/boss_stage2.png',
      boss_stage3: 'assets/bosses/boss_stage3.png',
      boss_stage4: 'assets/bosses/boss_stage4.png',
      boss_stage5: 'assets/bosses/boss_stage5.png',
      proj_arrow: 'assets/weapons/projectile_arrow_lv1.png',
      proj_bullet: 'assets/weapons/projectile_bullet_lv1.png',
      proj_dagger: 'assets/weapons/dagger_lv1.png',
      proj_molotov: 'assets/weapons/molotov_lv1.png'
    };

    // Preload 10 tiers for all 18 gears dynamically
    Object.keys(ADMIN_GEAR_CONFIG).forEach(gKey => {
      for (let t = 1; t <= 10; t++) {
        list[`${gKey}_lv${t}`] = getGearIconPath(gKey, t);
      }
    });
    for (let t = 1; t <= 10; t++) {
      list[`proj_arrow_lv${t}`] = `assets/weapons/projectile_arrow_lv${t}.png`;
      list[`proj_bullet_lv${t}`] = `assets/weapons/projectile_bullet_lv${t}.png`;
    }

    Object.keys(list).forEach(k => {
      const img = new Image();
      img.src = list[k];
      this.sprites[k] = img;
      if (k === 'desert_tile') {
        img.onload = () => {
          if (this.ctx) {
            this.desertPattern = this.ctx.createPattern(img, 'repeat');
          }
        };
      }
    });
  }

  getEnemySprite(e) {
    if (e.type === 'boss' || e.isBoss) {
      const curStage = (this.meta && this.meta.selectedStage ? this.meta.selectedStage : 1);
      return this.sprites[`boss_stage${curStage}`] || this.sprites.boss_stage1;
    }
    if (e.type === 'scorpion') return this.sprites.monster_scorpion;
    if (e.type === 'mech_tank') return this.sprites.monster_tank;
    if (e.bossRole === 'healer') return this.sprites.monster_healer;
    if (e.bossRole === 'phantom') return this.sprites.monster_phantom;
    return this.sprites.monster_thug;
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: 380, height: 600 };
    const w = Math.round(rect.width) || 380;
    const h = Math.round(rect.height) || 600;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    this.width = w;
    this.height = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';

    if (this.ctx && this.ctx.setTransform) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  // TRÁNH LỖI NHÂN ĐÔI GHOST HERO: Xóa sạch toàn bộ pixel vật lý trên Canvas
  clearCanvas() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  startWave() {
    this.resize();
    this.enemies = [];
    this.projectiles = [];
    this.laserBeams = [];
    this.bossBullets = [];
    this.molotovLobs = [];
    this.fireZones = [];
    this.particles = [];
    this.damageTexts = [];
    this.waveCleared = false;
    this.bossSpawnedThisWave = false;

    // FIX LỖI HIỂN THỊ MÁU BOSS: Luôn ẩn thanh máu Boss khi bắt đầu wave mới
    const raidBar = document.getElementById('boss-raid-bar');
    if (raidBar) raidBar.classList.add('hidden');

    this.totalWaveEnemies = 12 + this.state.wave * 4;
    this.enemiesRemaining = this.totalWaveEnemies;
    this.enemiesSpawned = 0;
    this.spawnInterval = Math.max(0.25, 1.1 - this.state.wave * 0.05);
    this.spawnTimer = 0.35;
    this.gameTime = 0;

    // YÊU CẦU 3: RÀO CHẮN CÓ GIÁP ẢO, CÓ THỂ BỊ VỠ & HỒI PHỤC THEO THỜI GIAN
    const barrierItems = (this.state && this.state.backpackItems) ? this.state.backpackItems.filter(i => i.type === 'barrier') : [];
    if (barrierItems.length > 0) {
      const sorted = [...barrierItems].sort((a, b) => (b.tier || 1) - (a.tier || 1));
      const maxTier = sorted[0].tier || 1;
      // Lượng giáp ảo theo cấp độ: Lv1: 80, Lv2: 130, Lv3: 190, Lv4: 260, Lv5: 350, Lv6: 460, Lv7: 600
      let totalShield = 80 + (maxTier - 1) * 50 + (maxTier >= 4 ? (maxTier - 3) * 30 : 0);
      for (let b = 1; b < sorted.length; b++) {
        totalShield += (60 + (sorted[b].tier - 1) * 35) * 0.5;
      }
      this.barrierMaxShield = Math.round(totalShield);
      this.barrierShield = this.barrierMaxShield;
      this.barrierBroken = false;
      this.barrierRechargeTimer = 0;
      // Thời gian hồi phục khi rào sập: Lv1: 25s -> Lv4: 16s -> Lv7: 8s
      this.barrierRechargeTime = Math.max(8, 25 - (maxTier - 1) * 2.8);
    } else {
      this.barrierMaxShield = 0;
      this.barrierShield = 0;
      this.barrierBroken = false;
    }

    // CRITICAL: Reset lastShotTime so weapons fire immediately when enemies appear in the new wave!
    if (this.state && this.state.backpackItems) {
      this.state.backpackItems.forEach(w => {
        w.lastShotTime = -999;
      });
    }

    // Utility Card passive
    const cardCount = this.state.backpackItems.filter(i => i.type === 'card').length;
    if (cardCount > 0) {
      this.state.runCash += cardCount * 15;
    }
  }

  spawnEnemy() {
    // PHÂN CẤP BOSS & MINI BOSS:
    // Wave 5, 20, 35... (wave % 15 === 5): Mini Boss Dược Sĩ (Buff Máu & Tăng tốc)
    // Wave 10, 25, 40... (wave % 15 === 10): Mini Boss Ảo Ảnh (Buff Né Đòn)
    // Wave 15, 30, 45... (wave >= 15 && wave % 15 === 0): Siêu Trùm Cuối (Song Buff: Cả máu + né đòn, Giáp 50%, Khiên 50%)
    const wave = this.state.wave;
    const curStage = (this.meta && this.meta.selectedStage ? this.meta.selectedStage : 1);
    const stageConfig = BOSS_LIST.find(b => b.stage === curStage) || BOSS_LIST[0];
    const isFinalBossWave = (wave >= stageConfig.bossWave);
    const isMiniBossWave5 = (!isFinalBossWave && wave % 5 === 0);
    const isMiniBossWave10 = false;
    const isBossWave = isFinalBossWave || isMiniBossWave5;

    const isBoss = isBossWave && !this.bossSpawnedThisWave && (this.enemiesSpawned >= this.totalWaveEnemies - 1);
    const rand = Math.random();
    let type = 'thug';
    let hp = 220 * Math.pow(1.28, wave - 1);
    let speed = 38 + Math.min(35, wave * 2.2);
    let radius = 14;
    let color = '#ef4444';
    let icon = '🥷';

    let isFinalBoss = false;
    let isMiniBoss = false;
    let bossRole = null;
    let dodgeChance = 0;
    let armorReduction = 0;
    let buffAuraRadius = 0;
    let buffSpeedAura = 1.0;
    let buffHealAura = 0;
    let buffDodgeAura = 0;
    let canShoot = false;
    let shootCooldown = 0;
    let bulletSpeed = 0;
    let bulletDamage = 0;

    if (isBoss) {
      this.bossSpawnedThisWave = true;
      type = 'boss';
      let bossTitle = '';
      canShoot = true;
      shootCooldown = 3.0;
      bulletSpeed = 170;
      bulletDamage = isFinalBoss ? 20 : 12;

      if (isMiniBossWave5) {
        // MINI BOSS WAVE 5: CYBER HEALER (Buff Hồi Máu cho quái nhỏ)
        isMiniBoss = true;
        bossRole = 'healer';
        hp = Math.round((stageConfig.maxHp || 70000) * 0.35); // Tiểu trùm = 35% máu trùm cuối
        speed = 18;
        radius = 32;
        color = '#10b981';
        icon = '🧬';
        armorReduction = 0.20;
        buffAuraRadius = 160;
        buffSpeedAura = 1.30;
        buffHealAura = 40; // Hồi +40 HP/giây
        bossTitle = `🧬 TIỂU TRÙM DƯỢC SĨ (WAVE ${wave}) - BUFF HỒI MÁU`;
      } else if (isMiniBossWave10) {
        // MINI BOSS WAVE 10: PHANTOM SCOUT (Buff Né Đòn cho quái nhỏ & bản thân)
        isMiniBoss = true;
        bossRole = 'phantom';
        hp = 65 * Math.pow(1.26, wave - 1) * 60; // ~60x lính thường
        speed = 15;
        radius = 36;
        color = '#06b6d4';
        icon = '👻';
        dodgeChance = 0.25; // 25% né đòn
        armorReduction = 0.35;
        buffAuraRadius = 160;
        buffSpeedAura = 1.25;
        buffDodgeAura = 0.20; // 20% né cho lính xung quanh
        bossTitle = `👻 TIỂU TRÙM ẢO ẢNH (WAVE ${wave}) - BUFF NÉ ĐÒN`;
      } else {
        // SIÊU TRÙM CUỐI WAVE 15+: ROBOT DESERT OUTPOST (SONG BUFF CẢ MÁU & NÉ ĐÒN)
        isFinalBoss = true;
        bossRole = 'final';
        hp = stageConfig.maxHp || (STAGE_BOSS_MAX_HP[curStage] || 70000); // Máu tối đa cân bằng theo yêu cầu
        speed = 8; // Đi chậm lừng lững
        radius = 44;
        color = '#7e22ce';
        icon = '🤖';
        dodgeChance = 0.30; // 30% né đòn
        armorReduction = 0.50; // Giảm 50% non-crit dmg
        buffAuraRadius = 180;
        buffSpeedAura = 1.60; // +60% tốc độ chạy quái nhỏ
        buffHealAura = 80; // +80 HP/giây cho quái nhỏ
        buffDodgeAura = 0.20; // +20% né cho quái nhỏ
        bossTitle = `🤖 SIÊU TRÙM ROBOT DESERT OUTPOST (WAVE ${wave}) - SONG BUFF MÁU & NÉ`;
      }

      // Kích hoạt Boss Raid Bar trên đỉnh màn hình
      const raidBar = document.getElementById('boss-raid-bar');
      if (raidBar) {
        raidBar.classList.remove('hidden');
        const nameEl = document.getElementById('boss-raid-name');
        const hpTextEl = document.getElementById('boss-raid-hp-text');
        const fillEl = document.getElementById('boss-raid-fill');
        const shieldEl = document.getElementById('boss-raid-shield-fill');
        if (nameEl) nameEl.textContent = bossTitle;
        if (hpTextEl) hpTextEl.textContent = '100%'; // Hiển thị dạng % theo yêu cầu
        if (fillEl) fillEl.style.width = '100%';
        if (shieldEl) shieldEl.style.width = '0%';
      }
    } else if (wave >= 4 && rand < (wave <= 5 ? 0.08 : 0.25)) {
      // Yêu cầu 4: Wave 1-3 HOÀN TOÀN KHÔNG có quái bắn xa (0%)! Wave 4-5 rất ít (<8%) và đạn sát thương bé
      type = 'gunner';
      hp = hp * 0.85;
      speed = speed * 0.72; // Đi chậm để căn nhắm
      radius = 13;
      color = '#38bdf8';
      icon = '🔫';
      canShoot = true;
      shootCooldown = 2.4;
      bulletSpeed = 165;
      bulletDamage = 10 + wave * 1.8;
    } else if (rand < 0.52) {
      // 2. BỌ CẠP SA MẠC: Chạy nhanh, cận chiến
      type = 'scorpion';
      hp = hp * 0.6;
      speed = speed * 1.5;
      radius = 11;
      color = '#f97316';
      icon = '🦂';
    } else if (rand < 0.78) {
      // 3. XE TĂNG BỌC THÉP: Máu trâu + bắn pháo hạng nặng tầm xa
      type = 'mech_tank';
      hp = hp * 2.8;
      speed = speed * 0.58;
      radius = 20;
      color = '#64748b';
      icon = '🦏';
      canShoot = true;
      shootCooldown = 3.6;
      bulletSpeed = 130;
      bulletDamage = 18 + wave * 2.5;
    } else {
      // 4. CÔN ĐỒ SA MẠC: Cận chiến
      type = 'thug';
      hp = hp * 1.0;
      speed = speed * 1.0;
      radius = 14;
      color = '#ef4444';
      icon = '🥷';
    }

    const enemy = {
      x: 35 + Math.random() * (this.width - 70),
      y: -radius - 8,
      radius: radius,
      hp: hp,
      maxHp: hp,
      speed: speed,
      baseSpeed: speed,
      type: type,
      color: color,
      icon: icon,
      hitFlash: 0,
      isBoss: isBoss,
      isFinalBoss: isFinalBoss,
      isMiniBoss: isMiniBoss,
      bossRole: bossRole,
      dodgeChance: dodgeChance,
      armorReduction: armorReduction,
      canShoot: canShoot,
      shootCooldown: shootCooldown,
      shootTimer: 0.8 + Math.random() * 1.5,
      bulletSpeed: bulletSpeed,
      bulletDamage: bulletDamage,
      buffAuraRadius: buffAuraRadius,
      buffSpeedAura: buffSpeedAura,
      buffHealAura: buffHealAura,
      buffDodgeAura: buffDodgeAura,
      hasShield: false,
      shieldHp: 0,
      maxShieldHp: 0,
      summonedPhase1: false,
      summonedPhase2: false,
      summonCooldown: 1.5 // Chuẩn bị 1.5s trước lần triệu hồi quái đầu tiên nếu vắng bóng lính
    };

    this.enemies.push(enemy);
    this.enemiesSpawned++;
  }

  // AUTO-TARGETING AI: Target nearest monster to the base line (highest Y) until dead
  fireWeapons(dt) {
    const now = this.gameTime || 0;
    // CRITICAL FIX: Only actual weapons (category === 'weapon' & rate > 0) can fire!
    // Non-weapons (belt, vest, shield, barrier, card) can NEVER shoot!
    const weapons = this.state.backpackItems.filter(i => {
      const cfg = ADMIN_GEAR_CONFIG[i.type];
      return cfg && cfg.category === 'weapon' && cfg.rate > 0;
    });
    if (weapons.length === 0 || this.enemies.length === 0) return;

    // Nearest enemy to player baseline (highest y)
    const sortedEnemies = [...this.enemies].sort((a, b) => b.y - a.y);
    const nearestEnemy = sortedEnemies[0];
    if (!nearestEnemy || nearestEnemy.hp <= 0) return;

    weapons.forEach(w => {
      const gInfo = GEAR_TYPES[w.type] || ADMIN_GEAR_CONFIG[w.type];
      if (!gInfo || !gInfo.rate) return;
      const lvl = this.state.meta.weaponLevels[w.type] || 1;
      // Yêu cầu 5: Giảm 50% tốc độ bắn của người chơi (Tăng gấp đôi cooldown) để người chơi kiên nhẫn hoặc mở x3/x5
      let cooldown = Math.max(0.25, (gInfo.rate * 2.0) / (1 + (w.tier - 1) * 0.15 + (lvl - 1) * 0.08));
      if (w.type === 'firearm') {
        cooldown /= (this.state.perkMultipliers.firearmRate || 1);
        cooldown = Math.max(0.8, cooldown);
      }
      // Băng Đạn Nhanh (speed_loader): Giảm -25% hồi chiêu cho các vũ khí liền kề
      this.state.backpackItems.forEach(other => {
        if (other.type === 'speed_loader') {
          const isAdj = Math.abs(other.r - w.r) <= 1 && Math.abs(other.c - w.c) <= 1;
          if (isAdj) cooldown *= 0.75;
        }
      });

      if (now - w.lastShotTime >= cooldown) {
        w.lastShotTime = now;
        this.shootWeapon(w, nearestEnemy);
      }
    });
  }

  shootWeapon(weapon, target) {
    if (!target || target.hp <= 0) return;
    const gInfo = GEAR_TYPES[weapon.type] || ADMIN_GEAR_CONFIG[weapon.type];
    if (!gInfo) return;
    const lvl = this.state.meta.weaponLevels[weapon.type] || 1;

    // Adjacent support buffs: belt, drone, scope
    let beltBuff = 1;
    let extraCritRate = 0;
    let critDmgMult = 2.5;

    this.state.backpackItems.forEach(other => {
      const isAdj = Math.abs(other.r - weapon.r) <= 1 && Math.abs(other.c - weapon.c) <= 1;
      if (isAdj) {
        if (other.type === 'belt') beltBuff += 0.12;
        if (other.type === 'drone') extraCritRate += 0.15; // Drone tăng +15% Crit Rate
        if (other.type === 'scope' && (weapon.type === 'firearm' || weapon.type === 'bow')) {
          extraCritRate += 0.20; // Scope tăng +20% Crit Rate
          critDmgMult += 0.50;   // Scope tăng +50% Crit Dmg
        }
      }
    });

    let dmg = (gInfo.baseDmg * 1.85) * Math.pow(1.65, weapon.tier - 1) * (1 + (lvl - 1) * 0.25) * beltBuff;

    // Apply Roguelike Perk Multipliers
    if (weapon.type === 'laser') dmg *= this.state.perkMultipliers.laserDmg;
    if (weapon.type === 'dagger') dmg *= this.state.perkMultipliers.daggerDmg;
    if (weapon.type === 'molotov') dmg *= this.state.perkMultipliers.molotovDmg;

    // Critical Hit calculation
    let isCrit = false;
    const totalCritChance = (this.state.perkMultipliers.allCrit || 0) + extraCritRate;
    if (totalCritChance > 0 && Math.random() < totalCritChance) {
      dmg *= critDmgMult;
      isCrit = true;
    }

    sfx.shoot(weapon.type);
    this.lastShotVisualTime = this.gameTime || 0;

    // Hero Base Center Origin
    const heroX = this.width / 2;
    const heroY = this.height - 35;

    if (weapon.type === 'flamethrower') {
      // SÚNG PHUN LỬA: Phun luồng lửa nón thiêu đốt quét qua kẻ địch
      const startX = heroX;
      const startY = heroY - 18;
      const dx = target.x - startX;
      const dy = target.y - startY;
      const angle = Math.atan2(dy, dx);

      for (let i = 0; i < 8; i++) {
        const spread = (Math.random() - 0.5) * 0.5;
        const speed = 200 + Math.random() * 140;
        this.particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle + spread) * speed,
          vy: Math.sin(angle + spread) * speed,
          color: Math.random() < 0.6 ? '#f97316' : (Math.random() < 0.5 ? '#ef4444' : '#fbbf24'),
          radius: 3 + Math.random() * 3,
          life: 0.35,
          maxLife: 0.35
        });
      }

      const maxDist = 250;
      this.enemies.forEach(e => {
        if (e.hp <= 0) return;
        const edx = e.x - startX;
        const edy = e.y - startY;
        const dist = Math.hypot(edx, edy);
        if (dist <= maxDist) {
          const eAngle = Math.atan2(edy, edx);
          if (Math.abs(eAngle - angle) < 0.42) {
            this.damageEnemy(e, dmg, isCrit);
            e.burnTimer = 2.0;
            e.burnDmg = dmg * 0.22;
          }
        }
      });
      sfx.playTone(160, 'sawtooth', 0.08, 0.1);
      return;
    } else if (weapon.type === 'cryo_grenade') {
      // LỰU ĐẠN BĂNG: Nổ làm chậm & đóng băng kẻ địch, tăng +40% sát thương nhận vào
      const startX = heroX;
      const startY = heroY - 18;
      const aoeRadius = Math.round(40 + (weapon.tier - 1) * 8 + (lvl - 1) * 4);
      this.cryoGrenadeLobs = this.cryoGrenadeLobs || [];
      this.cryoGrenadeLobs.push({
        startX, startY, currentX: startX, currentY: startY,
        targetX: target.x, targetY: target.y,
        flightDuration: 0.7,
        elapsedTime: 0,
        arcHeight: 70,
        damage: dmg,
        isCrit,
        tier: weapon.tier || 1,
        aoeRadius,
        rotation: 0
      });
      return;
    } else if (weapon.type === 'tesla') {
      // THÁP SẤM SÉT TESLA: Sét giật chuỗi qua 4-8 quái vật, làm choáng 0.4s
      const maxChains = Math.min(8, 3 + (weapon.tier || 1));
      const chained = [target];
      this.damageEnemy(target, dmg, isCrit);
      target.stunTimer = 0.4;

      let prev = target;
      for (let c = 1; c < maxChains; c++) {
        let closest = null;
        let closestDist = 130;
        this.enemies.forEach(e => {
          if (e.hp > 0 && !chained.includes(e)) {
            const d = Math.hypot(e.x - prev.x, e.y - prev.y);
            if (d < closestDist) {
              closestDist = d;
              closest = e;
            }
          }
        });
        if (closest) {
          chained.push(closest);
          const chainDmg = dmg * Math.pow(0.85, c);
          this.damageEnemy(closest, chainDmg, isCrit);
          closest.stunTimer = 0.4;
          prev = closest;
        } else {
          break;
        }
      }

      this.teslaBolts = this.teslaBolts || [];
      this.teslaBolts.push({
        points: [{ x: heroX, y: heroY - 18 }, ...chained.map(e => ({ x: e.x, y: e.y }))],
        life: 0.22,
        maxLife: 0.22,
        tier: weapon.tier || 1
      });
      sfx.playTone(520, 'square', 0.1, 0.15);
      return;
    } else if (weapon.type === 'mortar') {
      // SÚNG CỐI HẠNG NẶNG: Nổ hủy diệt bán kính 70px
      const startX = heroX;
      const startY = heroY - 18;
      const aoeRadius = Math.round(65 + (weapon.tier - 1) * 10);
      this.mortarShells = this.mortarShells || [];
      this.mortarShells.push({
        startX, startY, currentX: startX, currentY: startY,
        targetX: target.x, targetY: target.y,
        flightDuration: 1.0,
        elapsedTime: 0,
        arcHeight: 110,
        damage: dmg,
        isCrit,
        tier: weapon.tier || 1,
        aoeRadius,
        rotation: 0
      });
      sfx.playTone(110, 'sawtooth', 0.15, 0.25);
      return;
    } else if (weapon.type === 'landmine') {
      // MÌN TỰ ĐỘNG: Cài bẫy dọc đường tiến của quái vật
      this.placedMines = this.placedMines || [];
      if (this.placedMines.length < 6) {
        this.placedMines.push({
          x: target.x + (Math.random() * 40 - 20),
          y: Math.min(this.height - 90, Math.max(100, target.y + 70)),
          damage: dmg,
          tier: weapon.tier || 1,
          radius: 26,
          life: 30
        });
        sfx.playTone(320, 'sine', 0.05, 0.06);
      }
      return;
    }

    if (weapon.type === 'laser') {
      // Pháo Laser: Shoots DIRECTLY from Hero to Target Enemy
      this.laserBeams.push({
        fromX: heroX,
        fromY: heroY - 18,
        toX: target.x,
        toY: target.y,
        life: 0.18,
        maxLife: 0.18,
        damage: dmg,
        isCrit: isCrit,
        tier: weapon.tier || 1
      });

      this.damageEnemy(target, dmg, isCrit);

      // Energy sparks on target
      for (let i = 0; i < 7; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 80;
        this.particles.push({
          x: target.x,
          y: target.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color: '#38bdf8',
          radius: 2.5,
          life: 0.2,
          maxLife: 0.2
        });
      }
    } else if (weapon.type === 'molotov') {
      // YÊU CẦU: VŨ KHÍ BOOM LỬA (MOLOTOV)
      // Không bay như phi tiêu, mà quăng trái boom lửa bay chậm hình vòng cung, chạm đất nổ lan ra 1 vùng
      // Lv1 vùng nhỏ sát thương thấp, lv càng cao sát thương càng to, vùng càng rộng thêm
      const startX = heroX;
      const startY = heroY - 18;
      const targetX = target.x;
      const targetY = target.y;

      // Yêu cầu 4: Bán kính nổ lan (AoE Radius) MỞ RỘNG RÕ RỆT theo Tier, Level và Buff Roguelike
      const aoeMult = (this.state.perkMultipliers.molotovAoE || 1) * (this.state.perkMultipliers.molotovDmg ? Math.sqrt(this.state.perkMultipliers.molotovDmg) : 1);
      // Lv1: 36px (~đường kính 72px) -> Lv4: 96px (~192px) -> Lv7: 156px (~312px khổng lồ)
      const aoeRadius = Math.round((36 + (weapon.tier - 1) * 20 + (lvl - 1) * 8) * aoeMult);

      this.molotovLobs.push({
        startX: startX,
        startY: startY,
        currentX: startX,
        currentY: startY,
        targetX: targetX,
        targetY: targetY,
        flightDuration: 0.75, // Bay chậm hình cầu vồng (0.75 giây)
        elapsedTime: 0,
        arcHeight: 75, // Bổng lên cao tạo góc quăng đẹp mắt
        damage: dmg,
        isCrit: isCrit,
        tier: weapon.tier || 1,
        lvl: lvl,
        aoeRadius: aoeRadius,
        rotation: 0
      });
    } else {
      // Other weapons (dagger, firearm): projectile trajectory fired from Hero directly to Target
      const startX = heroX;
      const startY = heroY - 18;
      const dx = target.x - startX;
      const dy = target.y - startY;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = weapon.type === 'firearm' ? 960 : (weapon.type === 'bow' ? 1050 : 720);
      const vx = (dx / dist) * speed;
      const vy = (dy / dist) * speed;
      let pIcon = '🗡️';
      if (weapon.type === 'firearm') pIcon = '🟡';
      else if (weapon.type === 'bow') pIcon = '🏹';

      this.projectiles.push({
        type: weapon.type,
        x: startX,
        y: startY,
        vx: vx,
        vy: vy,
        damage: dmg,
        color: gInfo.color,
        icon: pIcon,
        target: target,
        tier: weapon.tier || 1,
        isCrit: isCrit
      });

      // Firearm Multishot perk
      if (weapon.type === 'firearm' && this.state.perkMultipliers.firearmMultishot > 0) {
        for (let m = 0; m < this.state.perkMultipliers.firearmMultishot; m++) {
          const spreadAngle = (m % 2 === 0 ? 1 : -1) * (0.12 * Math.ceil((m + 1) / 2));
          const cosA = Math.cos(spreadAngle);
          const sinA = Math.sin(spreadAngle);
          const svx = vx * cosA - vy * sinA;
          const svy = vx * sinA + vy * cosA;
          this.projectiles.push({
            type: weapon.type,
            x: startX + (m % 2 === 0 ? 8 : -8),
            y: startY,
            vx: svx,
            vy: svy,
            damage: dmg,
            color: gInfo.color,
            icon: '🟡',
            target: target,
            tier: weapon.tier || 1,
            isCrit: isCrit
          });
        }
      }
    }
  }

  damageEnemy(enemy, dmg, isCrit = false) {
    if (!enemy || enemy.hp <= 0) return;

    // TỈ LỆ NÉ ĐÒN CỦA BOSS & QUÁI ĐƯỢC BUFF NÉ ĐÒN
    const effectiveDodge = enemy.dodgeChance || (enemy.isBuffedDodge ? 0.20 : 0);
    if (effectiveDodge > 0 && Math.random() < effectiveDodge) {
      this.damageTexts.push({
        x: enemy.x + (Math.random() * 20 - 10),
        y: enemy.y - 14,
        text: 'NÉ ĐÒN!',
        isCrit: false,
        isDodge: true,
        life: 0.7,
        maxLife: 0.7
      });
      sfx.playTone(480, 'triangle', 0.05, 0.08);
      return;
    }

    let finalDmg = dmg;
    // Khuếch đại sát thương nếu kẻ địch đang bị ĐÓNG BĂNG bởi Lựu Đạn Băng (+40%)
    if (enemy.freezeTimer > 0 && enemy.freezeVulnerability) {
      finalDmg *= enemy.freezeVulnerability;
    }
    // Giáp giảm sát thương trừ khi là đòn chí mạng (Crit)
    if (enemy.armorReduction > 0 && !isCrit) {
      finalDmg *= (1 - enemy.armorReduction);
    }

    // Hộ Thuẫn Lượng Tử hấp thụ trước
    if (enemy.shieldHp > 0) {
      const absorbed = Math.min(enemy.shieldHp, finalDmg);
      enemy.shieldHp -= absorbed;
      finalDmg -= absorbed;
      for (let i = 0; i < 4; i++) {
        this.particles.push({
          x: enemy.x + (Math.random() - 0.5) * 35,
          y: enemy.y + (Math.random() - 0.5) * 35,
          vx: (Math.random() - 0.5) * 120,
          vy: (Math.random() - 0.5) * 120,
          color: '#38bdf8',
          radius: 2.5,
          life: 0.25,
          maxLife: 0.25
        });
      }
    }

    enemy.hp -= finalDmg;
    // Cập nhật điểm Score theo sát thương gây ra và tiêu diệt
    if (this.state) this.state.currentScore = (this.state.currentScore || 0) + Math.round(finalDmg * 2);
    enemy.hitFlash = 0.12;

    // YÊU CẦU 4: Nổi bật số Sát thương Chí Mạng (Crit) với màu Đỏ - Cam rực cháy
    this.damageTexts.push({
      x: enemy.x + (Math.random() * 20 - 10),
      y: enemy.y - 12,
      text: Math.round(finalDmg),
      isCrit: isCrit,
      life: isCrit ? 0.75 : 0.55,
      maxLife: isCrit ? 0.75 : 0.55
    });

    if (isCrit) {
      // Bung thêm các hạt lửa cam đỏ khi Crit
      for (let i = 0; i < 6; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 90;
        this.particles.push({
          x: enemy.x,
          y: enemy.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color: '#ff4500',
          radius: 3,
          life: 0.3,
          maxLife: 0.3
        });
      }
    }

    sfx.hit();

    // CẬP NHẬT BOSS RAID BAR (HỖ TRỢ CẢ MINI BOSS & FINAL BOSS)
    if (enemy.isBoss || enemy.type === 'boss') {
      const raidBar = document.getElementById('boss-raid-bar');
      if (raidBar) {
        raidBar.classList.remove('hidden');
        const hpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
        const shieldPct = enemy.maxShieldHp ? Math.max(0, (enemy.shieldHp / enemy.maxShieldHp) * 100) : 0;
        const fillEl = document.getElementById('boss-raid-fill');
        const shieldEl = document.getElementById('boss-raid-shield-fill');
        const textEl = document.getElementById('boss-raid-hp-text');
        if (fillEl) fillEl.style.width = `${hpPct}%`;
        if (shieldEl) shieldEl.style.width = `${shieldPct}%`;
        if (textEl) {
          const displayPct = Math.ceil(hpPct);
          textEl.textContent = `${displayPct}%`; // Hiển thị máu trùm dạng % thay vì số
        }
      }

      // Pha 1: Triệu hồi Bọ Cạp ở 75% Máu
      if (enemy.hp <= enemy.maxHp * 0.75 && !enemy.summonedPhase1) {
        enemy.summonedPhase1 = true;
        this.spawnMinion('scorpion', enemy.x - 40, enemy.y + 15);
        this.spawnMinion('scorpion', enemy.x + 40, enemy.y + 15);
        sfx.explosion();
      }

      // Pha 2: Kích hoạt Hộ Thuẫn Lượng Tử ở 50% Máu (Cho Siêu Trùm Cuối)
      if (enemy.isFinalBoss && enemy.hp <= enemy.maxHp * 0.5 && !enemy.hasShield) {
        enemy.hasShield = true;
        enemy.shieldHp = Math.round(enemy.maxHp * 0.50);
        enemy.maxShieldHp = enemy.shieldHp;
        sfx.playTone(720, 'sawtooth', 0.35, 0.25);
      }

      // Pha 3: Triệu hồi Xe Tăng Thiết Giáp ở 35% Máu
      if (enemy.hp <= enemy.maxHp * 0.35 && !enemy.summonedPhase2) {
        enemy.summonedPhase2 = true;
        this.spawnMinion('mech_tank', enemy.x - 50, enemy.y + 20);
        this.spawnMinion('mech_tank', enemy.x + 50, enemy.y + 20);
        sfx.explosion();
      }
    }

    if (enemy.hp <= 0) {
      if (enemy.isBoss || enemy.type === 'boss') {
        const raidBar = document.getElementById('boss-raid-bar');
        if (raidBar) raidBar.classList.add('hidden');
      }
      this.killEnemy(enemy);
    }
  }

  spawnMinion(type, x, y, customSpeed = null) {
    const wave = this.state.wave || 1;
    const hp = 65 * Math.pow(1.26, wave - 1) * (type === 'mech_tank' ? 2.0 : 0.65);
    // Tốc độ quái triệu hồi được cân chỉnh vừa phải (22..34 px/s), di chuyển nhịp nhàng, không lao vun vút vào căn cứ
    const speed = customSpeed || (type === 'mech_tank' ? 22 : 32);
    const canShoot = (type === 'mech_tank');
    const enemy = {
      x: Math.max(30, Math.min(this.width - 30, x)),
      y: y,
      radius: type === 'mech_tank' ? 17 : 12,
      hp: hp,
      maxHp: hp,
      speed: speed,
      baseSpeed: speed,
      type: type,
      isSummoned: true,
      color: type === 'mech_tank' ? '#64748b' : (type === 'scorpion' ? '#f97316' : '#ef4444'),
      icon: type === 'mech_tank' ? '🦏' : (type === 'scorpion' ? '🦂' : '🥷'),
      hitFlash: 0,
      canShoot: canShoot,
      shootCooldown: 3.5,
      shootTimer: 1.5 + Math.random() * 1.5,
      bulletSpeed: 130,
      bulletDamage: 12 + wave * 1.5
    };
    this.enemies.push(enemy);
    this.enemiesRemaining = Math.max(0, (this.totalWaveEnemies - this.enemiesSpawned) + this.enemies.length);
  }

  killEnemy(enemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
      this.enemiesRemaining = Math.max(0, (this.totalWaveEnemies - this.enemiesSpawned) + this.enemies.length);
            this.state.currentScore += enemy.type === 'boss' ? 5000 : 800;
      // YÊU CẦU 3: Giết quái rơi tiền cố định đúng 1$/quái, boss rơi 5$
      const killCash = (enemy.type === 'boss') ? 5 : 1;
      if (this.state) {
        this.state.runCash += killCash;
      }
      this.damageTexts.push({
        x: enemy.x + (Math.random() * 16 - 8),
        y: enemy.y - 18,
        text: `+${killCash}$`,
        color: '#a7f3d0',
        life: 0.55,
        maxLife: 0.55
      });
      if (this.meta) {
        this.meta.monsterKills = (this.meta.monsterKills || 0) + 1;
        if (enemy.type === 'boss') {
          this.meta.bossKills = (this.meta.bossKills || 0) + 1;
        }
        this.meta.save();
      }

      // THƯỞNG KIM CƯƠNG KHI TIÊU DIỆT BOSS THEO ĐỘ KHÓ MÀN CHƠI & ĐIỂM MỐC MÙA
      if (enemy.type === 'boss') {
        const curStageIdx = (this.meta && this.meta.selectedStage ? this.meta.selectedStage - 1 : 0);
        const curStage = BOSS_LIST[curStageIdx] || BOSS_LIST[0];
        const bossGems = curStage.diamondReward || 5;
        if (this.meta) {
          this.meta.gems += bossGems;
          this.meta.seasonPoints = (this.meta.seasonPoints || 0) + 150;
          this.meta.save();
        }
        if (this.onToast) {
          this.onToast(`[Chiến Công] Tiêu diệt Boss ${curStage.name}! Nhận +${bossGems} Kim Cương & +150 Điểm Mùa!`);
        }
      }

      // EXP DROPS & IN-WAVE LEVEL UP (Ảnh 3 & 4)
      let expGain = 20;
      if (enemy.type === 'scorpion') expGain = 15;
      else if (enemy.type === 'mech_tank') expGain = 35;
      else if (enemy.type === 'boss') expGain = 120;

      this.state.inWaveExp += expGain;
      if (this.state.inWaveExp >= this.state.expToNextLevel) {
        this.state.inWaveExp -= this.state.expToNextLevel;
        this.state.inWaveLevel++;
        this.state.expToNextLevel = Math.round(this.state.expToNextLevel * 1.35);
        if (this.onLevelUp) {
          this.onLevelUp();
        }
      }

      for (let i = 0; i < 9; i++) {
        this.particles.push({
          x: enemy.x,
          y: enemy.y,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.5) * 180,
          color: enemy.color,
          radius: 3,
          life: 0.35,
          maxLife: 0.35
        });
      }

      if (this.enemiesSpawned >= this.totalWaveEnemies && this.enemies.length === 0) {
        if (!this.waveCleared) {
          this.waveCleared = true;
          this.onWaveClear();
        }
      }
    }
  }

  update(rawDt) {
    if (this.state.isPaused || this.state.isGameOver) return;
    const speedMultiplier = this.state.speed === 1 ? 1 : (this.state.speed === 2 ? 3 : 5);
    const dt = rawDt * speedMultiplier;
    this.gameTime = (this.gameTime || 0) + dt;

    // Yêu cầu 3: Đếm ngược hồi phục Rào Chắn khi bị sập
    if (this.barrierBroken && this.barrierRechargeTimer > 0) {
      this.barrierRechargeTimer -= dt;
      if (this.barrierRechargeTimer <= 0) {
        this.barrierBroken = false;
        this.barrierShield = this.barrierMaxShield;
        this.damageTexts.push({
          x: this.width / 2,
          y: (this.height * 0.42) - 14,
          text: `RÀO CHẮN ĐÃ HỒI PHỤC!`,
          color: '#38bdf8',
          life: 1.3,
          maxLife: 1.3
        });
        sfx.playTone(550, 'triangle', 0.08, 0.12);
      }
    }

    if (this.enemiesSpawned < this.totalWaveEnemies) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnEnemy();
        this.spawnTimer = this.spawnInterval;
      }
    }

    this.fireWeapons(dt);

    // Update laser beams
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i];
      b.life -= dt;
      if (b.life <= 0) this.laserBeams.splice(i, 1);
    }

    // Barrier check & Multiplicative Compounding Slow (YÊU CẦU: Vị trí cao hơn h * 0.42, 2 cây rào giảm cộng dồn: 100 -> 80 -> 64)
    const barrierItems = this.state.backpackItems.filter(i => i.type === 'barrier');
    const hasBarrier = barrierItems.length > 0;
    const barrierY = this.height * 0.42;
    let barrierCompoundSlow = 1.0;
    if (hasBarrier) {
      // Yêu cầu 4: Áp dụng thanh lv cao hơn trước, thanh lv thấp hơn trừ thêm chỉ số tuần tự dựa trên chỉ số đã neft
      const sortedBarriers = [...barrierItems].sort((a, b) => (b.tier || 1) - (a.tier || 1));
      sortedBarriers.forEach((b) => {
        const bSlow = Math.min(0.85, 0.20 + ((b.tier || 1) - 1) * 0.10 + (this.state.perkMultipliers.barrierSlow || 0));
        barrierCompoundSlow *= (1.0 - bSlow);
      });
      barrierCompoundSlow = Math.max(0.05, barrierCompoundSlow);
    }

    // ARMOR PASSIVE: Vest/Shield hồi HP + Shield mỗi giây (kèm bonus từ buff kỹ năng)
    const armorItems = this.state.backpackItems.filter(i => {
      const cfg = ADMIN_GEAR_CONFIG[i.type];
      return cfg && cfg.category === 'defense';
    });
    let regenHp = this.state.perkMultipliers.armorRegenHp || 0;
    let regenShield = this.state.perkMultipliers.shieldRegenBonus || 0;
    armorItems.forEach(ar => {
      const tier = ar.tier || 1;
      const lvl = (this.state.meta && this.state.meta.weaponLevels[ar.type]) || 1;
      const tierMult = 1 + (tier - 1) * 0.40;
      const lvlMult = 1 + (lvl - 1) * 0.10;
      const cfg = ADMIN_GEAR_CONFIG[ar.type];
      if (cfg) {
        if (cfg.regenShield) regenShield += cfg.regenShield * tierMult * lvlMult;
        if (cfg.regenHp) regenHp += cfg.regenHp * tierMult * lvlMult;
      }
    });

    if (regenHp > 0 && this.state.hp < this.state.maxHp) {
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + regenHp * dt);
    }
    if (regenShield > 0 && this.state.shield < this.state.maxShield) {
      this.state.shield = Math.min(this.state.maxShield, this.state.shield + regenShield * dt);
    }

    // Hiển thị chỉ số hồi phục khiên & máu bay lên định kỳ mỗi 1.5s
    this._regenIndicatorTimer = (this._regenIndicatorTimer || 0) + dt;
    if (this._regenIndicatorTimer >= 1.5) {
      this._regenIndicatorTimer = 0;
      if (regenShield > 0 && this.state.shield < this.state.maxShield) {
        this.damageTexts.push({
          x: (this.width / 2) - 45,
          y: this.height - 48,
          text: `+${Math.round(regenShield * 1.5)} 🛡️`,
          color: '#38bdf8',
          life: 0.8,
          maxLife: 0.8
        });
      }
      if (regenHp > 0 && this.state.hp < this.state.maxHp) {
        this.damageTexts.push({
          x: (this.width / 2) + 45,
          y: this.height - 48,
          text: `+${Math.round(regenHp * 1.5)} ❤️`,
          color: '#22c55e',
          life: 0.8,
          maxLife: 0.8
        });
      }
    }

    // CARD PASSIVE: Thẻ ATM tự động rút tiền mỗi 1 giây (Lv1 +1$/s, Lv2 +2$/s, Lv3 +3$/s...)
    const cardItems = this.state.backpackItems.filter(i => i.type === 'card');
    if (cardItems.length > 0) {
      this._cardCashTimer = (this._cardCashTimer || 0) + dt;
      if (this._cardCashTimer >= 1.0) {
        this._cardCashTimer -= 1.0;
        let totalGain = 0;
        const metaCardLvl = (this.state.meta && this.state.meta.weaponLevels['card']) || 1;
        const cardMult = this.state.perkMultipliers.cardIncome || 1;
        cardItems.forEach(c => {
          const tier = c.tier || 1;
          // Thẻ ATM không cộng tiền mỗi giây nữa để chống lạm phát
          totalGain = 0;
        });
        if (false && totalGain > 0) {
          this.state.runCash += totalGain;
          this.damageTexts.push({
            x: (this.width / 2) + (Math.random() * 40 - 20),
            y: this.height - 40,
            text: `+${totalGain} $`,
            isCrit: false,
            isCashText: true,
            life: 0.65,
            maxLife: 0.65
          });
        }
      }
    }

    // SKILL BOSS & MINI BOSS: HÀO QUANG CUỒNG NỘ / HỒI MÁU / NÉ ĐÒN
    const activeBoss = this.enemies.find(e => e.type === 'boss' || e.isBoss);
    if (activeBoss && activeBoss.buffAuraRadius > 0) {
      for (const other of this.enemies) {
        if (other === activeBoss) continue;
        const d = Math.hypot(other.x - activeBoss.x, other.y - activeBoss.y);
        if (d <= activeBoss.buffAuraRadius) {
          other.isBuffedByBoss = true;
          other.speed = (other.baseSpeed || other.speed) * (activeBoss.buffSpeedAura || 1.3);
          if (activeBoss.buffHealAura > 0) {
            other.hp = Math.min(other.maxHp, other.hp + activeBoss.buffHealAura * dt);
          }
          if (activeBoss.buffDodgeAura > 0) {
            other.isBuffedDodge = true;
          }
        } else if (other.isBuffedByBoss) {
          other.isBuffedByBoss = false;
          other.isBuffedDodge = false;
          other.speed = other.baseSpeed || other.speed;
        }
      }
    }

    // KỸ NĂNG: NẾU BOSS KHÔNG CÓ QUÁI NHỎ ĐI KÈM -> TỰ ĐỘNG TRIỆU HỒI 5-10 QUÁI NHỎ / TRUNG BÌNH ĐỂ BUFF
    if (activeBoss) {
      const minions = this.enemies.filter(e => e !== activeBoss && !e.isBoss);
      if (minions.length === 0) {
        activeBoss.summonCooldown = (activeBoss.summonCooldown || 0) - dt;
        if (activeBoss.summonCooldown <= 0) {
          activeBoss.summonCooldown = 9.0; // Cooldown 9 giây trước đợt triệu hồi kế tiếp
          const countToSpawn = 5 + Math.floor(Math.random() * 6); // 5..10 quái ngẫu nhiên
          for (let k = 0; k < countToSpawn; k++) {
            const isMedium = Math.random() < 0.30; // 30% trung bình (mech_tank), 70% nhỏ (thug/scorpion)
            const mType = isMedium ? 'mech_tank' : (Math.random() < 0.5 ? 'scorpion' : 'thug');
            const spreadX = (k - (countToSpawn - 1) / 2) * 28 + (Math.random() * 10 - 5);
            const posX = Math.max(25, Math.min(this.width - 25, activeBoss.x + spreadX));
            // ĐẶT VỊ TRÍ TRIỆU HỒI Ở PHÍA TRÊN MÀN HÌNH / PHÍA SAU BOSS (để quái hành quân xuống từ từ, không spawn sát căn cứ)
            const posY = Math.max(10, Math.min(activeBoss.y - 120, 25 + (k % 3) * 18));
            this.spawnMinion(mType, posX, posY, isMedium ? 22 : 32);
          }
          this.damageTexts.push({
            x: activeBoss.x,
            y: activeBoss.y - 28,
            text: `🚨 TRIỆU HỒI ${countToSpawn} QUÁI!`,
            isCrit: false,
            isDodge: false,
            life: 1.2,
            maxLife: 1.2
          });
          sfx.explosion();
        }
      }

      // KỸ NĂNG: BOSS BẮN TIA NĂNG LƯỢNG VÀO CĂN CỨ (NHÂN VẬT HOÀN TOÀN CHỊU ĐƯỢC DAMAGE BẰNG KHIÊN & MÁU)
      activeBoss.shootTimer = (activeBoss.shootTimer || 7.0) - dt;
      if (activeBoss.shootTimer <= 0) {
        // Yêu cầu 5: Giảm 50% tốc độ bắn của quái/boss (Tăng thời gian giữa các loạt bắn)
        activeBoss.shootTimer = activeBoss.isFinalBoss ? 6.0 : 8.0;
        const heroX = this.width / 2;
        const heroY = this.height - 35;
        const bdx = heroX - activeBoss.x;
        const bdy = heroY - (activeBoss.y + activeBoss.radius);
        const bdist = Math.hypot(bdx, bdy) || 1;
        const bspd = 170;
        this.bossBullets.push({
          x: activeBoss.x,
          y: activeBoss.y + activeBoss.radius,
          vx: (bdx / bdist) * bspd,
          vy: (bdy / bdist) * bspd,
          radius: 6,
          damage: activeBoss.isFinalBoss ? 15 : 10,
          color: activeBoss.isFinalBoss ? '#a855f7' : (activeBoss.bossRole === 'healer' ? '#10b981' : '#06b6d4')
        });
        sfx.playTone(300, 'sawtooth', 0.1, 0.12);
      }
    }

    // KỸ NĂNG: QUÁI TẦM XA (GUNNER / MECH TANK) BẮN VÀO CĂN CỨ NHÂN VẬT
    for (const e of this.enemies) {
      if (e.canShoot && !e.isBoss && e.y >= 25 && e.y <= this.height - 75) {
        e.shootTimer = (e.shootTimer || 4.0) - dt;
        if (e.shootTimer <= 0) {
          // Yêu cầu 5: Giảm 50% tốc độ bắn của quái tầm xa (Cooldown bắn tăng gấp đôi)
          e.shootTimer = (e.shootCooldown || 5.0) + Math.random() * 1.2;
          const heroX = this.width / 2;
          const heroY = this.height - 35;
          const edx = (heroX + (Math.random() * 30 - 15)) - e.x;
          const edy = heroY - (e.y + e.radius);
          const edist = Math.hypot(edx, edy) || 1;
          const espd = e.bulletSpeed || 160;
          this.bossBullets.push({
            x: e.x,
            y: e.y + e.radius,
            vx: (edx / edist) * espd,
            vy: (edy / edist) * espd,
            radius: e.type === 'mech_tank' ? 6 : 4.5,
            damage: e.bulletDamage || 12,
            color: e.type === 'mech_tank' ? '#f59e0b' : '#38bdf8',
            shooterType: e.type,
            isEnemyBullet: true
          });
          sfx.playTone(420, 'square', 0.04, 0.06);
        }
      }
    }

    // Cập nhật Đạn của Boss & Quái tầm xa bắn xuống căn cứ
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      const bb = this.bossBullets[i];
      bb.x += bb.vx * dt;
      bb.y += bb.vy * dt;

      // YÊU CẦU 3: RÀO CHẮN CHẶN ĐẠN BẰNG GIÁP ẢO -> TRỪ HẾT GIÁP THÌ SẬP (KHÔNG CHẶN ĐẠN NỮA, CHỈ LÀM CHẬM)
      if (hasBarrier && Math.abs(bb.y - barrierY) <= 18) {
        if (!this.barrierBroken && this.barrierShield > 0) {
          const bDmg = bb.damage || 8;
          this.barrierShield -= bDmg;
          this.bossBullets.splice(i, 1);
          sfx.hit();

          for (let k = 0; k < 5; k++) {
            this.particles.push({
              x: bb.x,
              y: bb.y,
              vx: (Math.random() - 0.5) * 90,
              vy: (Math.random() - 0.5) * 90,
              color: '#38bdf8',
              radius: 2.5,
              life: 0.25,
              maxLife: 0.25
            });
          }

          if (this.barrierShield <= 0) {
            this.barrierShield = 0;
            this.barrierBroken = true;
            this.barrierRechargeTimer = this.barrierRechargeTime || 15;
            sfx.explosion();
            this.damageTexts.push({
              x: this.width / 2,
              y: barrierY - 14,
              text: `💥 RÀO CHẮN BỊ VỠ! (Hồi sau ${Math.round(this.barrierRechargeTime)}s)`,
              color: '#ef4444',
              life: 1.6,
              maxLife: 1.6
            });
            for (let k = 0; k < 14; k++) {
              this.particles.push({
                x: bb.x + (Math.random() - 0.5) * 50,
                y: barrierY + (Math.random() - 0.5) * 12,
                vx: (Math.random() - 0.5) * 120,
                vy: (Math.random() - 0.5) * 120,
                color: k % 2 === 0 ? '#ea580c' : '#71717a',
                radius: 3,
                life: 0.45,
                maxLife: 0.45
              });
            }
          }
          continue;
        }
        // Nếu rào chắn đã vỡ (barrierBroken = true): Đạn bay xuyên qua bình thường!
      }

      // Đạn chạm căn cứ nhân vật -> Gây sát thương vào Khiên trước, hết khiên trừ vào Máu
      if (bb.y >= this.height - 35) {
        const bDmg = bb.damage || 12;
        let absorbed = 0;
        if (this.state.shield > 0) {
          absorbed = Math.min(this.state.shield, bDmg);
          this.state.shield -= absorbed;
          this.state.hp -= (bDmg - absorbed);
        } else {
          this.state.hp -= bDmg;
        }
        sfx.hit();
        this.damageTexts.push({
          x: bb.x + (Math.random() * 20 - 10),
          y: this.height - 45,
          text: `-${Math.round(bDmg)} ${absorbed > 0 ? '🛡️' : '❤️'}`,
          isCrit: false,
          color: absorbed > 0 ? '#38bdf8' : '#ef4444',
          life: 0.65,
          maxLife: 0.65
        });
        for (let k = 0; k < 5; k++) {
          this.particles.push({
            x: bb.x,
            y: this.height - 35,
            vx: (Math.random() - 0.5) * 80,
            vy: -Math.random() * 80,
            color: bb.color,
            radius: 2.5,
            life: 0.25,
            maxLife: 0.25
          });
        }
        this.bossBullets.splice(i, 1);
        if (this.state.hp <= 0) {
          this.state.hp = 0;
          this.state.isGameOver = true;
          this.state.isPaused = true;
          this.enemies = [];
          this.bossBullets = [];
          this.onDefeat(false);
          return;
        }
        continue;
      }

      if (bb.y < -20 || bb.x < -20 || bb.x > this.width + 20) {
        this.bossBullets.splice(i, 1);
      }
    }

    // TỰ ĐỘNG ĐỒNG BỘ BOSS RAID BAR: Khi không có Boss sống thì LUÔN ẨN thanh Boss ngay lập tức
    const raidBar = document.getElementById('boss-raid-bar');
    if (raidBar) {
      if (!activeBoss) {
        if (!raidBar.classList.contains('hidden')) raidBar.classList.add('hidden');
      } else {
        raidBar.classList.remove('hidden');
      }
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      let curSpeed = e.speed;

      // Xử lý hiệu ứng Choáng (Tesla) & Đóng Băng (Cryo Grenade)
      if (e.stunTimer > 0) {
        e.stunTimer -= dt;
        curSpeed = 0;
      } else if (e.freezeTimer > 0) {
        e.freezeTimer -= dt;
        curSpeed *= 0.35; // Làm chậm 65% khi bị đông cứng
      }

      // Xử lý hiệu ứng Cháy DoT (Flamethrower)
      if (e.burnTimer > 0) {
        e.burnTimer -= dt;
        this.damageEnemy(e, (e.burnDmg || 12) * dt, false);
      }

      // ÁP DỤNG LÀM CHẬM CỘNG DỒN TỪ THANH CHẮN GAI (1 CÂY -> 80, 2 CÂY -> 64)
      if (hasBarrier && e.y >= barrierY && Math.abs(e.y - barrierY) <= 35) {
        curSpeed *= barrierCompoundSlow;
        if (this.state.perkMultipliers.barrierThornDmg > 0) {
          this.damageEnemy(e, this.state.perkMultipliers.barrierThornDmg * dt, false);
        }
      }

      e.y += curSpeed * dt;
      if (e.hitFlash > 0) e.hitFlash -= dt;

      // Base reached
      if (e.y >= this.height - 35) {
        // YÊU CẦU QUAN TRỌNG:
        // CHỈ DUY NHẤT BOSS CHÍNH (SIÊU TRÙM CUỐI) CHẠM VÀO MAIN -> LÚC ĐÓ MỚI THUA LUÔN!
        if (e.isFinalBoss) {
          this.state.hp = 0;
          this.state.isGameOver = true;
          this.state.isPaused = true;
          this.enemies = [];
          this.bossBullets = [];
          sfx.explosion();
          if (raidBar) raidBar.classList.add('hidden');
          this.onDefeat(true); // isBossBreach = true -> Thua luôn!
          return;
        }

        // CÁC QUÁI CÒN LẠI: Quái triệu hồi, quái thường hoặc mini-boss đều chỉ gây sát thương bình thường!
        // Nhân vật hoàn toàn chịu được sát thương bằng Khiên và Máu!
        let hitDmg = 10;
        if (e.isSummoned) {
          hitDmg = (e.type === 'mech_tank') ? 8 : 5; // Quái triệu hồi chỉ gây 5 - 8 damage nhẹ
        } else if (e.isMiniBoss) {
          hitDmg = 30; // Mini-boss chỉ gây 30 damage (nhân vật có 100 máu + 100 khiên vẫn chịu tốt)
        } else if (e.type === 'mech_tank') {
          hitDmg = 16;
        } else {
          hitDmg = 10;
        }

        // Bulletproof Vest DMG Reflection
        const vestCount = this.state.backpackItems.filter(x => x.type === 'vest').length;
        if (vestCount > 0) {
          this.damageEnemy(e, hitDmg * vestCount * this.state.perkMultipliers.vestReflection);
        }

        if (this.enemies.includes(e)) {
          if (this.state.shield > 0) {
            const absorbed = Math.min(this.state.shield, hitDmg);
            this.state.shield -= absorbed;
            const leftOver = hitDmg - absorbed;
            this.state.hp -= leftOver;
          } else {
            this.state.hp -= hitDmg;
          }

          sfx.explosion();
          const remIdx = this.enemies.indexOf(e);
          if (remIdx !== -1) this.enemies.splice(remIdx, 1);
          this.enemiesRemaining = Math.max(0, (this.totalWaveEnemies - this.enemiesSpawned) + this.enemies.length);
        }

        if (this.state.hp <= 0) {
          this.state.hp = 0;
          this.state.isGameOver = true;
          this.state.isPaused = true;
          this.enemies = [];
          this.bossBullets = [];
          this.onDefeat(false);
          return;
        }

        if (this.enemiesSpawned >= this.totalWaveEnemies && this.enemies.length === 0) {
          if (!this.waveCleared) {
            this.waveCleared = true;
            this.onWaveClear();
          }
        }
      }
    }

    // Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      let hit = false;
      for (let j = 0; j < this.enemies.length; j++) {
        const e = this.enemies[j];
        if (Math.hypot(p.x - e.x, p.y - e.y) <= e.radius + 8) {
          hit = true;
          this.damageEnemy(e, p.damage, p.isCrit);
          this.projectiles.splice(i, 1);
          break;
        }
      }

      if (!hit && (p.y < -20 || p.x < -20 || p.x > this.width + 20)) {
        this.projectiles.splice(i, 1);
      }
    }

    // Update Drone pulse laser helper
    const droneGears = this.state.backpackItems.filter(i => i.type === 'drone');
    if (droneGears.length > 0 && this.enemies.length > 0) {
      this.dronePulseTimer = (this.dronePulseTimer || 0) + dt;
      if (this.dronePulseTimer >= 0.65) {
        this.dronePulseTimer = 0;
        const sorted = [...this.enemies].sort((a, b) => b.y - a.y);
        const dTarget = sorted[0];
        if (dTarget && dTarget.hp > 0) {
          const dTier = droneGears[0].tier || 1;
          const dDmg = 24 * Math.pow(1.5, dTier - 1);
          this.laserBeams.push({
            fromX: this.width / 2 + Math.cos(this.gameTime * 2.5) * 55,
            fromY: this.height - 75 + Math.sin(this.gameTime * 2.5) * 20,
            toX: dTarget.x,
            toY: dTarget.y,
            life: 0.12,
            maxLife: 0.12,
            damage: dDmg,
            isCrit: false,
            tier: dTier
          });
          this.damageEnemy(dTarget, dDmg, false);
          sfx.playTone(680, 'sine', 0.05, 0.08);
        }
      }
    }

    // Update Placed Mines (Mìn Tự Động)
    if (this.placedMines) {
      for (let i = this.placedMines.length - 1; i >= 0; i--) {
        const mine = this.placedMines[i];
        let triggered = false;
        for (const e of this.enemies) {
          if (e.hp > 0 && Math.hypot(e.x - mine.x, e.y - mine.y) <= (mine.radius + e.radius)) {
            triggered = true;
            break;
          }
        }
        if (triggered) {
          this.enemies.forEach(e => {
            if (e.hp > 0 && Math.hypot(e.x - mine.x, e.y - mine.y) <= 55) {
              this.damageEnemy(e, mine.damage, false);
            }
          });
          this.screenShake = 8;
          sfx.explosion();
          for (let p = 0; p < 16; p++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 80;
            this.particles.push({
              x: mine.x,
              y: mine.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              color: p % 2 === 0 ? '#ef4444' : '#f59e0b',
              radius: 3 + Math.random() * 3,
              life: 0.3,
              maxLife: 0.3
            });
          }
          this.placedMines.splice(i, 1);
        }
      }
    }

    // Update Cryo Grenade Lobs (Lựu Đạn Băng)
    if (this.cryoGrenadeLobs) {
      for (let i = this.cryoGrenadeLobs.length - 1; i >= 0; i--) {
        const c = this.cryoGrenadeLobs[i];
        c.elapsedTime += dt;
        const progress = Math.min(1.0, c.elapsedTime / c.flightDuration);
        c.currentX = c.startX + (c.targetX - c.startX) * progress;
        c.currentY = c.startY + (c.targetY - c.startY) * progress - Math.sin(progress * Math.PI) * c.arcHeight;
        c.rotation += 8 * dt;

        if (progress >= 1.0) {
          this.enemies.forEach(e => {
            if (e.hp > 0 && Math.hypot(e.x - c.targetX, e.y - c.targetY) <= (c.aoeRadius + e.radius)) {
              this.damageEnemy(e, c.damage, c.isCrit);
              e.freezeTimer = 1.5;           // Đóng băng 1.5 giây
              e.freezeVulnerability = 1.4;  // +40% sát thương nhận vào
            }
          });
          sfx.playTone(720, 'sine', 0.1, 0.15);
          for (let p = 0; p < 18; p++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 30 + Math.random() * 90;
            this.particles.push({
              x: c.targetX,
              y: c.targetY,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              color: p % 2 === 0 ? '#06b6d4' : '#e0f2fe',
              radius: 3 + Math.random() * 3,
              life: 0.35,
              maxLife: 0.35
            });
          }
          this.cryoGrenadeLobs.splice(i, 1);
        }
      }
    }

    // Update Mortar Shells (Súng Cối Hạng Nặng)
    if (this.mortarShells) {
      for (let i = this.mortarShells.length - 1; i >= 0; i--) {
        const ms = this.mortarShells[i];
        ms.elapsedTime += dt;
        const progress = Math.min(1.0, ms.elapsedTime / ms.flightDuration);
        ms.currentX = ms.startX + (ms.targetX - ms.startX) * progress;
        ms.currentY = ms.startY + (ms.targetY - ms.startY) * progress - Math.sin(progress * Math.PI) * ms.arcHeight;
        ms.rotation += 5 * dt;

        if (progress >= 1.0) {
          this.enemies.forEach(e => {
            if (e.hp > 0 && Math.hypot(e.x - ms.targetX, e.y - ms.targetY) <= (ms.aoeRadius + e.radius)) {
              this.damageEnemy(e, ms.damage, ms.isCrit);
            }
          });
          this.screenShake = 12;
          sfx.explosion();
          for (let p = 0; p < 24; p++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 120;
            this.particles.push({
              x: ms.targetX,
              y: ms.targetY,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              color: p % 3 === 0 ? '#ea580c' : (p % 2 === 0 ? '#facc15' : '#334155'),
              radius: 4 + Math.random() * 4,
              life: 0.45,
              maxLife: 0.45
            });
          }
          this.mortarShells.splice(i, 1);
        }
      }
    }

    // Update Tesla Lightning Bolts
    if (this.teslaBolts) {
      for (let i = this.teslaBolts.length - 1; i >= 0; i--) {
        this.teslaBolts[i].life -= dt;
        if (this.teslaBolts[i].life <= 0) this.teslaBolts.splice(i, 1);
      }
    }

    // Update Molotov Lobs (YÊU CẦU: Quăng boom bay chậm hình cầu vồng, va chạm vùng chỉ định nổ lan ra 1 vùng)
    for (let i = this.molotovLobs.length - 1; i >= 0; i--) {
      const m = this.molotovLobs[i];
      m.elapsedTime += dt;
      const progress = Math.min(1.0, m.elapsedTime / m.flightDuration);

      m.currentX = m.startX + (m.targetX - m.startX) * progress;
      const linearY = m.startY + (m.targetY - m.startY) * progress;
      m.currentY = linearY - m.arcHeight * Math.sin(progress * Math.PI);
      m.rotation += dt * 10;

      // Tia lửa khói khi chai bay trên không
      if (Math.random() < 0.6) {
        this.particles.push({
          x: m.currentX + (Math.random() - 0.5) * 6,
          y: m.currentY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 20,
          vy: -15 - Math.random() * 25,
          color: Math.random() < 0.5 ? '#f97316' : '#ef4444',
          radius: 2,
          life: 0.25,
          maxLife: 0.25
        });
      }

      if (progress >= 1.0) {
        sfx.explosion();
        // Sát thương nổ lan AoE: Bán kính nổ lớn dần theo Tier và Lv
        this.enemies.forEach(e => {
          const d = Math.hypot(e.x - m.targetX, e.y - m.targetY);
          if (d <= m.aoeRadius + e.radius) {
            this.damageEnemy(e, m.damage, m.isCrit);
          }
        });

        // Hiệu ứng bùng nổ lửa lan tỏa
        for (let p = 0; p < 18; p++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 30 + Math.random() * 90;
          this.particles.push({
            x: m.targetX,
            y: m.targetY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            color: p % 2 === 0 ? '#ff4500' : '#f59e0b',
            radius: 3 + Math.random() * 3,
            life: 0.35,
            maxLife: 0.35
          });
        }

        // Tạo vũng lửa thiêu đốt dưới đất (Fire Zone kéo dài 2.5 giây)
        this.fireZones.push({
          x: m.targetX,
          y: m.targetY,
          radius: m.aoeRadius,
          life: 2.5,
          maxLife: 2.5,
          damagePerSec: m.damage * 0.45,
          tickTimer: 0,
          tier: m.tier
        });

        this.molotovLobs.splice(i, 1);
      }
    }

    // Update Ground Fire Zones (Vũng lửa thiêu đốt quái đi qua)
    for (let i = this.fireZones.length - 1; i >= 0; i--) {
      const fz = this.fireZones[i];
      fz.life -= dt;
      fz.tickTimer -= dt;

      if (fz.tickTimer <= 0) {
        fz.tickTimer = 0.28;
        const tickDmg = fz.damagePerSec * 0.28;
        this.enemies.forEach(e => {
          const d = Math.hypot(e.x - fz.x, e.y - fz.y);
          if (d <= fz.radius + e.radius) {
            this.damageEnemy(e, tickDmg, false);
          }
        });
      }

      if (Math.random() < 0.4) {
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.random() * (fz.radius * 0.8);
        this.particles.push({
          x: fz.x + Math.cos(ang) * rad,
          y: fz.y + Math.sin(ang) * rad * 0.45,
          vx: (Math.random() - 0.5) * 15,
          vy: -20 - Math.random() * 30,
          color: '#f97316',
          radius: 2.2,
          life: 0.3,
          maxLife: 0.3
        });
      }

      if (fz.life <= 0) {
        this.fireZones.splice(i, 1);
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    // Damage texts
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const t = this.damageTexts[i];
      t.y -= 30 * dt;
      t.life -= dt;
      if (t.life <= 0) this.damageTexts.splice(i, 1);
    }
  }

  render() {
    this.clearCanvas();
    this.renderCanvas(this.ctx);
  }

  // 2D CANVAS PIPELINE (PIXEL ART WEAPONS, PROJECTILES, MONSTERS & EFFECTS)
  renderCanvas(ctx) {
    const bgImg = this.sprites ? this.sprites.bg_battle_desert : null;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, this.width, this.height);
    } else if (this.desertPattern) {
      ctx.fillStyle = this.desertPattern;
      ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.clearCanvas();
    }

    // Desert decorations (Pixel Art Props from Hugging Face Dataset)
    const cactus = this.sprites ? this.sprites.cactus : null;
    if (cactus && cactus.complete) {
      ctx.drawImage(cactus, 15, 120, 36, 36);
      ctx.drawImage(cactus, this.width - 50, 210, 36, 36);
    } else {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(25, 140, 12, 22);
      ctx.fillRect(this.width - 45, 230, 12, 22);
    }

    const rock = this.sprites ? this.sprites.rock : null;
    if (rock && rock.complete) {
      ctx.drawImage(rock, 20, 290, 32, 32);
      ctx.drawImage(rock, this.width - 52, 95, 32, 32);
    } else {
      ctx.fillStyle = '#78716c';
      ctx.fillRect(35, 310, 16, 12);
      ctx.fillRect(this.width - 50, 110, 16, 12);
    }

    // 2D Pixel Art Defense Barrier (Yêu cầu 3: Hiển thị thanh lành lặn hoặc thanh bị vỡ kèm thanh Giáp Ảo)
    const barrierItems = this.state.backpackItems.filter(i => i.type === 'barrier');
    if (barrierItems.length > 0) {
      const sortedBarriers = [...barrierItems].sort((a, b) => (b.tier || 1) - (a.tier || 1));
      const maxTier = sortedBarriers[0].tier || 1;
      const barY = this.height * 0.42;
      const barW = this.width - 24;
      const startX = 12;

      ctx.save();
      const isBroken = (this.barrierBroken === true);
      const barSpr = isBroken ? (this.sprites.barrier_broken || this.sprites.barrier_lv1) : (this.sprites[`barrier_lv${maxTier}`] || this.sprites.barrier_lv1);

      const segW = 32;
      const segCount = Math.ceil(barW / segW);
      for (let s = 0; s < segCount; s++) {
        const segX = startX + s * segW;
        if (barSpr && barSpr.complete && barSpr.naturalWidth > 0) {
          ctx.drawImage(barSpr, segX, barY - 14, segW, 28);
        } else {
          ctx.fillStyle = isBroken ? '#475569' : '#ea580c';
          ctx.fillRect(segX, barY - 2, segW - 2, 6);
        }
      }

      // Thanh Giáp Ảo hoặc Đếm ngược hồi phục phía trên rào chắn
      const meterW = 120;
      const meterX = (this.width - meterW) / 2;
      const meterY = barY - 18;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(meterX, meterY, meterW, 6);

      if (!isBroken && this.barrierMaxShield > 0) {
        const shieldPct = Math.max(0, Math.min(1.0, this.barrierShield / this.barrierMaxShield));
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(meterX + 1, meterY + 1, (meterW - 2) * shieldPct, 4);

        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(`[GIÁP RÀO] ${Math.ceil(this.barrierShield)}/${this.barrierMaxShield}`, this.width / 2, meterY - 3);
      } else if (isBroken) {
        const rechargePct = Math.max(0, Math.min(1.0, (this.barrierRechargeTime - this.barrierRechargeTimer) / (this.barrierRechargeTime || 1)));
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(meterX + 1, meterY + 1, (meterW - 2) * rechargePct, 4);

        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText(`[BỊ VỠ] Hồi sau ${Math.ceil(this.barrierRechargeTimer)}s (Vẫn làm chậm)`, this.width / 2, meterY - 3);
      }
      ctx.restore();
    }

    // Ground Fire Zones (Yêu cầu 3 & 4: Vùng lửa mở rộng trực quan thấy rõ bằng mắt thường theo bán kính fz.radius)
    if (this.fireZones) {
      this.fireZones.forEach(fz => {
        const fAlpha = Math.min(1.0, fz.life / fz.maxLife);
        ctx.save();
        ctx.globalAlpha = fAlpha;

        const radX = fz.radius;
        const radY = fz.radius * 0.65; // Phối cảnh 2D sa mạc nghiêng

        // 1. Vùng cháy loang dither pixel dưới mặt đất mở rộng đúng kích thước radX, radY
        ctx.fillStyle = (Math.floor(Date.now() / 150) % 2 === 0) ? 'rgba(239, 68, 68, 0.28)' : 'rgba(249, 115, 22, 0.22)';
        ctx.beginPath();
        ctx.ellipse(fz.x, fz.y, radX, radY, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 2. Sprite ngọn lửa 2D pixel scale chính xác theo vùng cháy thực tế
        const fireSpr = this.sprites ? this.sprites.prop_fire_zone : null;
        if (fireSpr && fireSpr.complete && fireSpr.naturalWidth > 0) {
          const fw = radX * 2.1;
          const fh = radY * 2.1;
          ctx.drawImage(fireSpr, fz.x - fw / 2, fz.y - fh / 2, fw, fh);
        } else {
          ctx.fillStyle = '#f97316';
          ctx.fillRect(fz.x - radX, fz.y - radY, radX * 2, radY * 2);
        }
        ctx.restore();
      });
    }

    // Hero Platform & Turret at Bottom Center (Yêu cầu 3: 100% 2D Pixel Art, Không dùng Emoji Cowboy hay vector arc)
    const heroX = this.width / 2;
    const heroY = this.height - 35;

    // Defense Bunker Platform
    const bunker = this.sprites ? this.sprites.prop_bunker : null;
    if (bunker && bunker.complete && bunker.naturalWidth > 0) {
      ctx.drawImage(bunker, heroX - 32, heroY - 8, 64, 48);
    }
    // 2D Pixel Art Mafia Commander Sprite
    const commanderSpr = this.sprites ? this.sprites.hero_commander : null;
    if (commanderSpr && commanderSpr.complete && commanderSpr.naturalWidth > 0) {
      ctx.drawImage(commanderSpr, heroX - 18, heroY - 26, 36, 36);
    }

    // RENDER LASER BEAMS: MÀU SẮC & KÍCH THƯỚC THAY ĐỔI THEO TIER (YÊU CẦU 5)
    this.laserBeams.forEach(b => {
      const alpha = Math.max(0.1, b.life / b.maxLife);
      const bTier = b.tier || 1;
      ctx.save();
      ctx.lineCap = 'round';

      let outerRgb = '56, 189, 248';
      let midRgb = '14, 165, 233';
      let coreHex = '#ffffff';

      if (bTier >= 7) {
        outerRgb = '251, 191, 36';
        midRgb = '245, 158, 11';
        coreHex = '#fef08a';
      } else if (bTier >= 5) {
        outerRgb = '239, 68, 68';
        midRgb = '220, 38, 38';
        coreHex = '#fecaca';
      } else if (bTier >= 3) {
        outerRgb = '168, 85, 247';
        midRgb = '147, 51, 234';
        coreHex = '#f3e8ff';
      }

      const outerW = Math.min(32, 12 + (bTier - 1) * 2.8);
      const midW = Math.min(16, 5 + (bTier - 1) * 1.5);
      const coreW = Math.min(8, 2 + (bTier - 1) * 0.8);

      ctx.strokeStyle = `rgba(${outerRgb}, ${alpha * 0.45})`;
      ctx.lineWidth = outerW;
      ctx.beginPath();
      ctx.moveTo(b.fromX, b.fromY);
      ctx.lineTo(b.toX, b.toY);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${midRgb}, ${alpha * 0.9})`;
      ctx.lineWidth = midW;
      ctx.beginPath();
      ctx.moveTo(b.fromX, b.fromY);
      ctx.lineTo(b.toX, b.toY);
      ctx.stroke();

      ctx.strokeStyle = coreHex;
      ctx.lineWidth = coreW;
      ctx.beginPath();
      ctx.moveTo(b.fromX, b.fromY);
      ctx.lineTo(b.toX, b.toY);
      ctx.stroke();

      ctx.restore();
    });

    // Render Projectiles (Yêu cầu 2: Mỗi cấp độ lv1..7 bắn ra đúng sprite của cấp độ đó)
    this.projectiles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const tier = p.tier || 1;

      let spr = null;
      if (p.type === 'bow') {
        spr = this.sprites[`proj_arrow_lv${tier}`] || this.sprites.proj_arrow || this.sprites[`bow_lv${tier}`];
        const angle = Math.atan2(p.vy, p.vx) + Math.PI * 0.75;
        ctx.rotate(angle);
        if (spr && spr.complete && spr.naturalWidth > 0) {
          ctx.drawImage(spr, -14, -14, 28, 28);
        }
      } else if (p.type === 'dagger') {
        spr = this.sprites[`dagger_lv${tier}`] || this.sprites.proj_dagger;
        p.spinAngle = (p.spinAngle || 0) + 0.35;
        ctx.rotate(p.spinAngle);
        if (spr && spr.complete && spr.naturalWidth > 0) {
          ctx.drawImage(spr, -14, -14, 28, 28);
        }
      } else if (p.type === 'firearm') {
        spr = this.sprites[`proj_bullet_lv${tier}`] || this.sprites.proj_bullet;
        const angle = Math.atan2(p.vy, p.vx) + Math.PI / 2;
        ctx.rotate(angle);

        // Tracer line matching tier color
        const tracerColors = [
          'rgba(245, 158, 11, 0.7)',
          'rgba(226, 232, 240, 0.8)',
          'rgba(56, 189, 248, 0.9)',
          'rgba(192, 132, 252, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(249, 115, 22, 0.9)',
          'rgba(251, 191, 36, 1.0)'
        ];
        ctx.strokeStyle = tracerColors[tier - 1] || 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2 + tier * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.lineTo(0, 14 + tier * 2);
        ctx.stroke();

        if (spr && spr.complete && spr.naturalWidth > 0) {
          ctx.drawImage(spr, -11, -11, 22, 22);
        }
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-4, -4, 8, 8);
      }
      ctx.restore();
    });

    // Render Placed Landmines
    if (this.placedMines) {
      this.placedMines.forEach(mine => {
        ctx.save();
        const mSpr = this.sprites[`landmine_lv${mine.tier || 1}`];
        if (mSpr && mSpr.complete && mSpr.naturalWidth > 0) {
          ctx.drawImage(mSpr, mine.x - 12, mine.y - 12, 24, 24);
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(mine.x, mine.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    // Render Tesla Bolts (Sấm sét Tesla chuỗi mắt xích)
    if (this.teslaBolts) {
      this.teslaBolts.forEach(tb => {
        if (!tb.points || tb.points.length < 2) return;
        ctx.save();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(tb.points[0].x, tb.points[0].y);
        for (let p = 1; p < tb.points.length; p++) {
          const p1 = tb.points[p - 1];
          const p2 = tb.points[p];
          const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 20;
          const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 20;
          ctx.lineTo(midX, midY);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
        ctx.restore();
      });
    }

    // Render Cryo Grenade Lobs
    if (this.cryoGrenadeLobs) {
      this.cryoGrenadeLobs.forEach(c => {
        ctx.save();
        ctx.translate(c.currentX, c.currentY);
        ctx.rotate(c.rotation);
        const cSpr = this.sprites[`cryo_grenade_lv${c.tier || 1}`];
        if (cSpr && cSpr.complete && cSpr.naturalWidth > 0) {
          ctx.drawImage(cSpr, -14, -14, 28, 28);
        } else {
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(-8, -8, 16, 16);
        }
        ctx.restore();
      });
    }

    // Render Mortar Shells
    if (this.mortarShells) {
      this.mortarShells.forEach(ms => {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(ms.currentX, ms.targetY, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(ms.currentX, ms.currentY);
        ctx.rotate(ms.rotation);
        const msSpr = this.sprites[`mortar_lv${ms.tier || 1}`];
        if (msSpr && msSpr.complete && msSpr.naturalWidth > 0) {
          ctx.drawImage(msSpr, -16, -16, 32, 32);
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-10, -10, 20, 20);
        }
        ctx.restore();
      });
    }

    // Render Orbiting Drones
    const activeDrones = this.state.backpackItems.filter(i => i.type === 'drone');
    if (activeDrones.length > 0) {
      activeDrones.forEach((dr, idx) => {
        const droneAngle = (this.gameTime || 0) * 2.5 + (idx * Math.PI);
        const drX = this.width / 2 + Math.cos(droneAngle) * 55;
        const drY = this.height - 75 + Math.sin(droneAngle) * 20;
        ctx.save();
        const drSpr = this.sprites[`drone_lv${dr.tier || 1}`];
        if (drSpr && drSpr.complete && drSpr.naturalWidth > 0) {
          ctx.drawImage(drSpr, drX - 16, drY - 16, 32, 32);
        } else {
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(drX - 10, drY - 10, 20, 20);
        }
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(drX - 3, drY + 8, 6, 4);
        ctx.restore();
      });
    }

    // Molotov Arc Lobs (Yêu cầu 2: Quăng chai molotov tương ứng đúng tier lv1..7)
    if (this.molotovLobs) {
      this.molotovLobs.forEach(m => {
        ctx.save();
        ctx.translate(m.currentX, m.currentY);
        ctx.rotate(m.rotation);
        const mTier = m.tier || 1;
        const mSpr = this.sprites[`molotov_lv${mTier}`] || this.sprites.proj_molotov;
        if (mSpr && mSpr.complete && mSpr.naturalWidth > 0) {
          ctx.drawImage(mSpr, -14, -14, 28, 28);
        }
        ctx.restore();
      });
    }

    // Render Enemies (Pixel Art Monsters & Bosses from Dataset)
    this.enemies.forEach(e => {
      ctx.save();
      if (e.type === 'boss') {
        const pulse = (Math.sin((this.gameTime || 0) * 6) + 1) * 0.5;
        ctx.fillStyle = `rgba(168, 85, 247, ${0.18 + pulse * 0.22})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius + 14 + pulse * 10, 0, Math.PI * 2);
        ctx.fill();

        if (e.shieldHp > 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 4]);
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius + 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (e.hitFlash > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius + 2, 0, Math.PI * 2);
        ctx.fill();
      }

      const spriteImg = this.getEnemySprite(e);
      if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
        const sz = e.radius * 2.3;
        ctx.drawImage(spriteImg, e.x - sz / 2, e.y - sz / 2, sz, sz);
      } else {
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `${e.radius * 1.3}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.icon, e.x, e.y);
      }

      // HP bar
      const barW = e.radius * 2.2;
      const hpPct = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(e.x - barW / 2, e.y - e.radius - 8, barW, 4);
      ctx.fillStyle = (e.type === 'boss') ? '#a855f7' : '#22c55e';
      ctx.fillRect(e.x - barW / 2, e.y - e.radius - 8, barW * hpPct, 4);
      ctx.restore();
    });

    // Render Boss & Monster Enemy Projectiles (Pixel Art Rocket / Plasma Blast)
    if (this.bossBullets) {
      this.bossBullets.forEach(bb => {
        ctx.save();
        ctx.translate(bb.x, bb.y);
        const bAngle = Math.atan2(bb.vy, bb.vx) + Math.PI / 2;
        ctx.rotate(bAngle);

        const bSpr = bb.isRocket ? (this.sprites.proj_missile || this.sprites.proj_bullet_glowing) : this.sprites.proj_bullet_glowing;
        if (bSpr && bSpr.complete && bSpr.naturalWidth > 0) {
          ctx.drawImage(bSpr, -10, -10, 20, 20);
        } else {
          ctx.fillStyle = bb.color || '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, bb.radius || 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, (bb.radius || 6) * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    // Particles
    this.particles.forEach(pt => {
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius || 2, 0, Math.PI * 2);
      ctx.fill();
    });

    this.renderDamageTexts(ctx);
  }

  // FLOATING COMBAT DAMAGE TEXT RENDERER (HỖ TRỢ CRIT RỰC LỬA ĐỎ - CAM)
  renderDamageTexts(ctx) {
    if (!ctx) return;
    this.damageTexts.forEach(t => {
      ctx.save();
      if (t.isDodge) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.textAlign = 'center';
        ctx.strokeText(t.text, t.x, t.y);
        ctx.fillText(t.text, t.x, t.y);
      } else if (t.isCashText) {
        ctx.font = '900 16px sans-serif';
        ctx.fillStyle = '#22c55e'; // Xanh lá tiền tệ
        ctx.strokeStyle = '#022c22';
        ctx.lineWidth = 2.5;
        ctx.textAlign = 'center';
        ctx.strokeText(t.text, t.x, t.y);
        ctx.fillText(t.text, t.x, t.y);
      } else if (t.isCrit) {
        // Yêu cầu 3: Không dùng chữ CRIT to đùng, chỉ đổi màu vàng cam rực & gắn icon nhỏ ✦
        ctx.font = '900 15px sans-serif';
        ctx.fillStyle = '#f59e0b'; // Vàng cam rực rỡ
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.0;
        ctx.textAlign = 'center';
        ctx.strokeText('✦ ' + t.text, t.x, t.y);
        ctx.fillText('✦ ' + t.text, t.x, t.y);
      } else if (t.color) {
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = t.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.0;
        ctx.textAlign = 'center';
        ctx.strokeText(t.text, t.x, t.y);
        ctx.fillText(t.text, t.x, t.y);
      } else {
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#f1f5f9'; // Trắng sáng dịu mắt
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.0;
        ctx.textAlign = 'center';
        ctx.strokeText(t.text, t.x, t.y);
        ctx.fillText(t.text, t.x, t.y);
      }
      ctx.restore();
    });
  }
}

// ==========================================
// MAIN CONTROLLER & BACKPACK SYSTEM
// ==========================================
class AppController {
  constructor() {
    this.meta = new MetagameState();
    this.run = new InRunState(this.meta);

    this.currentBossIndex = 0;
    this.canvas = document.getElementById('battle-canvas');
    this.battle = new DesertBattleEngine(
      this.canvas,
      this.run,
      () => this.onWaveClear(),
      (isBreach) => this.onDefeat(isBreach),
      () => this.showLevelUpModal()
    );

    this.dragItem = null;
    this.ghostAvatar = null;
    this.selectedItem = null;
    this.toastTimer = null;
    this.isAdjustingMidWave = false;

    this.initDOM();
    this.bindEvents();
    this.initYouTubeSDK();
    this.initLanguage();
    this.initTutorial();
    this.renderLobby();
  }


  // --- LANGUAGE / i18n SYSTEM ---
  initLanguage() {
    if (typeof applyLanguageToDOM === 'function') {
      applyLanguageToDOM();
    }
    if (typeof updateGearTypesI18n === 'function') {
      updateGearTypesI18n();
    }

    const btnLang = document.getElementById('btn-lang-toggle');
    if (btnLang) {
      btnLang.onclick = () => {
        const nextLang = toggleLanguage();
        updateGearTypesI18n();
        this.refreshAllText();
        const msg = nextLang === 'en' ? '🌐 Switched to English language!' : '🌐 Đã chuyển sang Tiếng Việt!';
        this.showToast(msg);
        sfx.playTone(440, 'sine', 0.08, 0.1);
      };
    }
  }

  refreshAllText() {
    if (typeof applyLanguageToDOM === 'function') {
      applyLanguageToDOM();
    }
    if (typeof updateGearTypesI18n === 'function') {
      updateGearTypesI18n();
    }
    this.renderLobby();
    this.renderBackpack();
    this.renderRankTab();
    if (this.renderTutorialStep && !document.getElementById('modal-tutorial')?.classList.contains('hidden')) {
      this.renderTutorialStep();
    }
  }

  // --- TUTORIAL / ONBOARDING SYSTEM ---
  initTutorial() {
    this.tutCurrentStep = 0;
    this.tutSteps = [
      {
        icon: '🎒',
        titleKey: 'tut.step1_title',
        descKey: 'tut.step1_desc'
      },
      {
        icon: '⭐',
        titleKey: 'tut.step2_title',
        descKey: 'tut.step2_desc'
      },
      {
        icon: '🛒',
        titleKey: 'tut.step3_title',
        descKey: 'tut.step3_desc'
      },
      {
        icon: '⚔️',
        titleKey: 'tut.step4_title',
        descKey: 'tut.step4_desc'
      }
    ];

    const btnOpenTut = document.getElementById('btn-tutorial-open');
    const btnCloseTut = document.getElementById('btn-close-tutorial-x');
    const btnSkip = document.getElementById('btn-tut-skip');
    const btnNext = document.getElementById('btn-tut-next');
    const btnPrev = document.getElementById('btn-tut-prev');
    const btnStart = document.getElementById('btn-tut-start');

    if (btnOpenTut) {
      btnOpenTut.onclick = () => this.startGameplayTutorial(true);
    }
    if (btnCloseTut) {
      btnCloseTut.onclick = () => this.closeTutorial();
    }
    if (btnSkip) {
      btnSkip.onclick = () => this.closeTutorial();
    }
    if (btnStart) {
      btnStart.onclick = () => this.closeTutorial();
    }
    if (btnNext) {
      btnNext.onclick = () => {
        if (this.tutCurrentStep < this.tutSteps.length - 1) {
          this.tutCurrentStep++;
          this.renderTutorialStep();
          sfx.playTone(320, 'sine', 0.05, 0.08);
        }
      };
    }
    if (btnPrev) {
      btnPrev.onclick = () => {
        if (this.tutCurrentStep > 0) {
          this.tutCurrentStep--;
          this.renderTutorialStep();
          sfx.playTone(280, 'sine', 0.05, 0.08);
        }
      };
    }

    document.querySelectorAll('.tut-dot').forEach(dot => {
      dot.onclick = () => {
        const step = parseInt(dot.getAttribute('data-step') || '0', 10);
        this.tutCurrentStep = step;
        this.renderTutorialStep();
      };
    });

    // Auto open interactive gameplay walkthrough on first launch
    try {
      const done = localStorage.getItem('desert_outpost_gameplay_tut_done');
      if (!done) {
        setTimeout(() => this.startGameplayTutorial(false), 700);
      }
    } catch(e) {}
  }

  openTutorial() {
    // If user clicks ?, open interactive gameplay walkthrough directly
    document.getElementById('modal-tutorial')?.classList.add('hidden');
    this.startGameplayTutorial(true);
  }

  closeTutorial() {
    document.getElementById('modal-tutorial')?.classList.add('hidden');
    try {
      localStorage.setItem('desert_outpost_tutorial_done', 'true');
    } catch(e) {}
    sfx.playTone(300, 'sine', 0.08, 0.1);
  }

  renderTutorialStep() {
    const stepData = this.tutSteps[this.tutCurrentStep];
    if (!stepData) return;

    const iconEl = document.getElementById('tut-slide-icon');
    const titleEl = document.getElementById('tut-slide-title');
    const descEl = document.getElementById('tut-slide-desc');
    const btnPrev = document.getElementById('btn-tut-prev');
    const btnNext = document.getElementById('btn-tut-next');
    const btnStart = document.getElementById('btn-tut-start');

    if (iconEl) iconEl.textContent = stepData.icon;
    if (titleEl) titleEl.textContent = typeof t === 'function' ? t(stepData.titleKey) : stepData.titleKey;
    if (descEl) descEl.textContent = typeof t === 'function' ? t(stepData.descKey) : stepData.descKey;

    // Dots indicator
    document.querySelectorAll('.tut-dot').forEach((dot, idx) => {
      if (idx === this.tutCurrentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Prev button visibility
    if (btnPrev) {
      if (this.tutCurrentStep > 0) {
        btnPrev.classList.remove('hidden');
      } else {
        btnPrev.classList.add('hidden');
      }
    }

    // Next vs Start button
    if (this.tutCurrentStep === this.tutSteps.length - 1) {
      if (btnNext) btnNext.classList.add('hidden');
      if (btnStart) btnStart.classList.remove('hidden');
    } else {
      if (btnNext) btnNext.classList.remove('hidden');
      if (btnStart) btnStart.classList.add('hidden');
    }
  }

  // --- YOUTUBE PLAYABLES CLOUD SAVE & SDK LIFECYCLE ---
  initYouTubeSDK() {
    try {
      // 1. YouTube Playables gameReady()
      if (typeof window !== 'undefined' && window.ytgame && window.ytgame.game && typeof window.ytgame.game.firstFrameReady === 'function') {
        try { window.ytgame.game.firstFrameReady(); } catch(e){}
      }
      if (typeof window !== 'undefined' && window.YT && window.YT.playable && typeof window.YT.playable.gameReady === 'function') {
        window.YT.playable.gameReady();
        console.log('[YouTube Playables] gameReady() active');
      }

      // 2. Audio Mute Sync
      if (typeof window !== 'undefined' && window.YT && window.YT.playable && typeof window.YT.playable.onAudioMuted === 'function') {
        window.YT.playable.onAudioMuted((isMuted) => {
          sfx.enabled = !isMuted;
          const sndImg = document.getElementById('img-sound-icon');
          if (sndImg) sndImg.src = sfx.enabled ? 'assets/icons/sound_on.png' : 'assets/icons/sound_off.png';
        });
      }

      // 3. YouTube Cloud Save: loadData()
      if (typeof window !== 'undefined' && window.YT && window.YT.playable && typeof window.YT.playable.loadData === 'function') {
        window.YT.playable.loadData().then((savedStr) => {
          if (savedStr && typeof savedStr === 'string' && savedStr.startsWith('DS_')) {
            console.log('[YouTube Playables] Đã tìm thấy dữ liệu Cloud Save của Account YouTube, tự động nạp...');
            this.loadFromSaveCode(savedStr, true);
          }
        }).catch(err => {
          console.log('[YouTube Playables] No cloud save found or standalone mode:', err);
        });
      }
    } catch (e) {
      console.warn('[YouTube Playables SDK init]', e);
    }
  }

  saveToYouTubeCloud() {
    try {
      if (typeof window !== 'undefined' && window.YT && window.YT.playable && typeof window.YT.playable.saveData === 'function') {
        const code = this.generateSaveCode();
        window.YT.playable.saveData(code).then(() => {
          console.log('[YouTube Playables] Đồng bộ Cloud Save thành công');
        }).catch(err => {
          console.warn('[YouTube Playables] saveData error:', err);
        });
      }
    } catch (e) {
      console.warn('[YouTube Playables saveData]', e);
    }
  }

  initDOM() {
    this.viewLobby = document.getElementById('view-lobby');
    this.viewBackpack = document.getElementById('view-backpack');
    this.viewBattle = document.getElementById('view-battle');

    this.backpackGridBoard = document.getElementById('backpack-grid-board');
    this.gridCellsLayer = document.getElementById('grid-cells-layer');
    this.gridItemsLayer = document.getElementById('grid-items-layer');

    // Lobby mode selector
    this.btnLobbyMode = document.getElementById('btn-lobby-mode');
    this.lobbyModeBadge = document.getElementById('lobby-mode-badge');
    this.backpackModeIndicator = document.getElementById('backpack-mode-indicator');

    // 4 Shift buttons
    this.btnShiftLeft = document.getElementById('btn-shift-left');
    this.btnShiftUp = document.getElementById('btn-shift-up');
    this.btnShiftDown = document.getElementById('btn-shift-down');
    this.btnShiftRight = document.getElementById('btn-shift-right');

    // Stash bench slots (5 slots)
    this.stashSlotsEls = [
      document.getElementById('stash-slot-0'),
      document.getElementById('stash-slot-1'),
      document.getElementById('stash-slot-2'),
      document.getElementById('stash-slot-3'),
      document.getElementById('stash-slot-4')
    ];

    this.shopSlotsEls = [
      document.getElementById('shop-slot-0'),
      document.getElementById('shop-slot-1'),
      document.getElementById('shop-slot-2')
    ];
    this.sellZoneEl = document.getElementById('sell-drop-zone');
    this.modalBuffs = document.getElementById('modal-buff-list');
    this.modalPause = document.getElementById('modal-battle-pause');
    this.modalVictory = document.getElementById('modal-victory');
    this.modalDefeat = document.getElementById('modal-defeat');
    this.modalRevive = document.getElementById('modal-revive');
    this.modalAd = document.getElementById('ad-simulator');
    this.modalLevelup = document.getElementById('modal-levelup');
    this.levelupChoicesContainer = document.getElementById('levelup-choices-container');

    // Lobby Elements
    this.arsenalDetailedList = document.getElementById('arsenal-detailed-list');
    this.giantBossAvatarWrapper = document.getElementById('giant-boss-avatar-wrapper');
    this.bossNameHeading = document.getElementById('boss-name-heading');
    this.bossLvlBadge = document.getElementById('boss-lvl-badge');
    this.bossSubtitleTag = document.getElementById('boss-subtitle-tag');
    this.bossTraitDesc = document.getElementById('boss-trait-desc');
    this.lobbyMaxWave = document.getElementById('lobby-max-wave');
    this.lobbyMaxScore = document.getElementById('lobby-max-score');
    this.navTabBtns = document.querySelectorAll('.nav-tab-btn');
    this.tabPanes = document.querySelectorAll('.lobby-tab-pane');

    // Setup touch/mouse drag to shift suitcase freely
    this.setupSuitcaseTouchDrag();
  }

  showToast(msg) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'game-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'game-toast show';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.className = 'game-toast';
    }, 2200);
  }

  showView(viewName) {
    this.viewLobby.classList.remove('active');
    this.viewBackpack.classList.remove('active');
    this.viewBattle.classList.remove('active');

    const raidBar = document.getElementById('boss-raid-bar');
    if (viewName !== 'battle' && raidBar) {
      raidBar.classList.add('hidden');
    }

    // Hiển thị nút Pause ở góc trên bên phải khi ở trận đấu
    const btnBattlePause = document.getElementById('btn-battle-pause');
    if (btnBattlePause) {
      if (viewName === 'battle') {
        btnBattlePause.classList.remove('hidden');
      } else {
        btnBattlePause.classList.add('hidden');
      }
    }

    const curIcon = document.getElementById('hud-currency-icon');
    const cashVal = document.getElementById('player-cash');

    if (viewName === 'lobby') {
      this.isAdjustingMidWave = false;
      this.viewLobby.classList.add('active');
      if (curIcon) {
        curIcon.src = 'assets/icons/gold_coin.png';
        curIcon.alt = 'Coin';
        curIcon.title = 'Coin / Vàng Mafia ngoài sảnh';
      }
      if (cashVal) {
        cashVal.textContent = this.meta.cash;
        cashVal.title = 'Coin / Vàng Mafia';
      }
      this.renderLobby();
    } else if (viewName === 'backpack') {
      this.viewBackpack.classList.add('active');
      if (curIcon) {
        curIcon.src = 'assets/icons/pixel_cash.png';
        curIcon.alt = 'Money';
        curIcon.title = 'Money trong ván ($) - Dùng Roll trang bị & mở ô dự bị';
      }
      if (cashVal) {
        cashVal.textContent = `${this.run.runCash} $`;
        cashVal.title = 'Money trong ván ($)';
      }
      this.renderBackpack();
      this.updateBackpackUI();
    } else if (viewName === 'battle') {
      if (curIcon) {
        curIcon.src = 'assets/icons/pixel_cash.png';
        curIcon.alt = 'Money';
        curIcon.title = 'Money trong ván ($)';
      }
      if (cashVal) {
        cashVal.textContent = `${this.run.runCash} $`;
        cashVal.title = 'Money trong ván ($)';
      }
      // FIX LỖI GHOST BOSS BAR: Luôn ẩn boss bar trước khi vào battle để tránh hiển thị boss wave cũ
      if (raidBar) raidBar.classList.add('hidden');
      this.viewBattle.classList.add('active');
      this.renderBattleUI();
      this.battle.resize();
      // YÊU CẦU 1: Bấm Adjust Backpack rồi bấm Fight lại thì TIẾP TỤC ván đấu, KHÔNG reset từ đầu!
      if (!this.isAdjustingMidWave) {
        this.battle.startWave();
      } else {
        this.battle.state.isPaused = false;
        this.isAdjustingMidWave = false;
        this.showToast(`Tiếp tục chiến đấu Wave ${this.run.wave}!`);
      }
    }
  }

  renderLobby() {
    document.getElementById('player-cash').textContent = this.meta.cash;
    document.getElementById('player-gems').textContent = this.meta.gems;
    document.getElementById('player-energy').textContent = `${this.meta.energy}/30`;

    // Render lobby mode badge
    if (this.lobbyModeBadge) {
      if (this.meta.gameMode === 'hardcore') {
        this.lobbyModeBadge.className = 'mode-badge hardcore-mode';
        this.lobbyModeBadge.textContent = typeof t === 'function' ? t('lobby.mode_hardcore_badge', 'Hardcore (Khóa Bán Vali)') : 'Hardcore (Khóa Bán Vali)';
      } else {
        this.lobbyModeBadge.className = 'mode-badge normal-mode';
        this.lobbyModeBadge.textContent = typeof t === 'function' ? t('lobby.mode_normal_badge', 'Thường (Bán Vali: BẬT)') : 'Thường (Bán Vali: BẬT)';
      }
    }

    const rankPlayerWave = document.getElementById('rank-player-wave');
    if (rankPlayerWave) rankPlayerWave.textContent = `Wave ${this.meta.maxWave}`;

    this.renderGiantBoss();
    this.renderBattleTabLoadout();
    this.renderLobbyArsenal();
    this.renderMilestoneProgress();
    this.renderRankTab();
  }

    // --- CỘT MỐC TIẾN TRÌNH CHIẾN TRƯỜNG (YÊU CẦU 4: BỎ MÙA, THEO MÀN & DIỆT QUÁI/BOSS) ---
  getStageMilestones() {
    return [
      { id: 'w3', title: 'Tập Sự Sống Sót (Wave 3)', desc: 'Vượt qua 3 Wave khởi đầu trận đấu', target: 3, current: this.meta.maxWave, icon: 'assets/icons/gold_coin.png', reward: '+300 Vàng & +15 Mảnh Phi Tiêu', claimFn: () => { this.meta.cash += 300; this.meta.materials.dagger = (this.meta.materials.dagger || 0) + 15; } },
      { id: 'w5', title: 'Vượt Qua Wave 5', desc: 'Chinh phục đợt quái tân thủ Wave 5', target: 5, current: this.meta.maxWave, icon: 'assets/icons/gold_coin.png', reward: '+500 Vàng & +20 Mảnh Súng Lục', claimFn: () => { this.meta.cash += 500; this.meta.materials.firearm = (this.meta.materials.firearm || 0) + 20; } },
      { id: 'b1', title: 'Hạ Gục Boss Đầu Tiên (Wave 5)', desc: 'Tiêu diệt Trùm Boss tại Wave 5', target: 1, current: this.meta.bossKills, icon: 'assets/icons/gem.png', reward: '+20 Kim Cương & +20 Mảnh Áo Giáp', claimFn: () => { this.meta.gems += 20; this.meta.materials.vest = (this.meta.materials.vest || 0) + 20; } },
      { id: 'w8', title: 'Chiến Binh Kiên Cường (Wave 8)', desc: 'Trụ vững qua 8 Wave chiến trận khốc liệt', target: 8, current: this.meta.maxWave, icon: 'assets/icons/gold_coin.png', reward: '+800 Vàng & +25 Mảnh Khiên', claimFn: () => { this.meta.cash += 800; this.meta.materials.shield = (this.meta.materials.shield || 0) + 25; } },
      { id: 'w10', title: 'Vượt Qua Wave 10', desc: 'Sống sót qua đợt tấn công quái tinh anh', target: 10, current: this.meta.maxWave, icon: 'assets/icons/gold_coin.png', reward: '+1.000 Vàng & +30 Mảnh Bom Xăng', claimFn: () => { this.meta.cash += 1000; this.meta.materials.molotov = (this.meta.materials.molotov || 0) + 30; } },
      { id: 'b2', title: 'Tiêu Diệt 2 Trùm Boss', desc: 'Hạ gục 2 boss trong các chiến dịch', target: 2, current: this.meta.bossKills, icon: 'assets/weapons/bow_lv1.png', reward: '+35 Kim Cương & +30 Mảnh Cung Nỏ', claimFn: () => { this.meta.gems += 35; this.meta.materials.bow = (this.meta.materials.bow || 0) + 30; } },
      { id: 'w13', title: 'Cận Kề Chiến Thắng (Wave 13)', desc: 'Vượt qua đợt quái cuồng nộ Wave 13', target: 13, current: this.meta.maxWave, icon: 'assets/icons/gold_coin.png', reward: '+1.200 Vàng & +35 Mảnh Pháo Laser', claimFn: () => { this.meta.cash += 1200; this.meta.materials.laser = (this.meta.materials.laser || 0) + 35; } },
      { id: 'w15', title: 'Phá Đảo Wave 15 (Chinh Phục Màn)', desc: 'Vượt toàn bộ 15 Wave & tiêu diệt Boss tối thượng!', target: 15, current: this.meta.maxWave, icon: 'assets/icons/chest_gold.png', reward: 'Hòm Hoàng Kim Bố Già (+120 Mảnh) & +2.000 Vàng & +50 💎', claimFn: () => { this.meta.cash += 2000; this.meta.gems += 50; this.meta.materials.bow = (this.meta.materials.bow || 0) + 60; this.meta.materials.laser = (this.meta.materials.laser || 0) + 60; } },
      { id: 'k50', title: 'Tiêu Diệt 50 Quái Vật', desc: 'Tích lũy 50 quái vật bị hạ gục', target: 50, current: this.meta.monsterKills, icon: 'assets/icons/chest_wood.png', reward: '+300 Vàng & +15 Mảnh Rào Chắn', claimFn: () => { this.meta.cash += 300; this.meta.materials.barrier = (this.meta.materials.barrier || 0) + 15; } },
      { id: 'k150', title: 'Tiêu Diệt 150 Quái Vật', desc: 'Tích lũy 150 quái vật bị hạ gục', target: 150, current: this.meta.monsterKills, icon: 'assets/icons/chest_silver.png', reward: '+600 Vàng & +25 Mảnh Thắt Lưng', claimFn: () => { this.meta.cash += 600; this.meta.materials.belt = (this.meta.materials.belt || 0) + 25; } },
      { id: 'k300', title: 'Tiêu Diệt 300 Quái Vật', desc: 'Tích lũy 300 quái vật bị hạ gục', target: 300, current: this.meta.monsterKills, icon: 'assets/icons/chest_gold.png', reward: '+50 Kim Cương & Hòm Bạc Tinh Anh', claimFn: () => { this.meta.gems += 50; this.meta.materials.bow = (this.meta.materials.bow || 0) + 35; this.meta.materials.laser = (this.meta.materials.laser || 0) + 35; } }
    ];
  }

  renderMilestoneProgress() {
    const ptsTextEl = document.getElementById('milestone-pts-text');
    const fillEl = document.getElementById('milestone-bar-fill');
    const badgeEl = document.getElementById('milestone-btn-badge');

    const milestones = this.getStageMilestones();
    const claimed = this.meta.claimedMilestones || [];
    const completedCount = milestones.filter(m => (m.current || 0) >= m.target).length;
    const hasUnclaimed = milestones.some(m => (m.current || 0) >= m.target && !claimed.includes(m.id));

    if (ptsTextEl) ptsTextEl.textContent = `${completedCount} / ${milestones.length} Mốc`;
    if (fillEl) fillEl.style.width = `${Math.min(100, (completedCount / milestones.length) * 100)}%`;

    if (badgeEl) {
      if (hasUnclaimed) badgeEl.classList.remove('hidden');
      else badgeEl.classList.add('hidden');
    }
  }

    openMilestonesModal() {
    const modal = document.getElementById('modal-milestones');
    if (!modal) return;
    modal.classList.remove('hidden');

    const curWaveEl = document.getElementById('modal-milestone-cur-wave');
    if (curWaveEl) curWaveEl.textContent = this.meta.maxWave;
    const curKillsEl = document.getElementById('modal-milestone-kills');
    if (curKillsEl) curKillsEl.textContent = this.meta.monsterKills || 0;

    const listEl = document.getElementById('milestone-tiers-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const milestones = this.getStageMilestones();
    const claimed = this.meta.claimedMilestones || [];

    milestones.forEach(t => {
      const card = document.createElement('div');
      const isReached = (t.current || 0) >= t.target;
      const isClaimed = claimed.includes(t.id);
      
      card.className = `m-row-item ${isClaimed ? 'is-claimed' : (isReached ? 'is-ready' : 'is-locked')}`;

      const pct = Math.min(100, Math.floor(((t.current || 0) / t.target) * 100));

      let actionHtml = '';
      if (isClaimed) {
        actionHtml = '<span class="m-btn-claimed">ĐÃ NHẬN</span>';
      } else if (isReached) {
        actionHtml = `<button class="m-btn-claim-action" data-id="${t.id}">NHẬN</button>`;
      } else {
        actionHtml = `<span class="m-pill-progress">${t.current || 0}/${t.target}</span>`;
      }

      card.innerHTML = `
        <div class="m-icon-box">
          <img src="${t.icon}" class="m-pixel-img" alt="">
        </div>
        <div class="m-detail-box">
          <div class="m-detail-header">
            <span class="m-detail-title">${t.title}</span>
            <span class="m-detail-target">Mục tiêu: ${t.target}</span>
          </div>
          <div class="m-detail-reward">Thưởng: <b class="m-reward-val">${t.reward}</b></div>
          <div class="m-row-bar-track">
            <div class="m-row-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="m-action-box">
          ${actionHtml}
        </div>
      `;

      listEl.appendChild(card);
    });

    listEl.querySelectorAll('.m-btn-claim-action').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const target = milestones.find(m => m.id === id);
        if (target && !this.meta.claimedMilestones.includes(id)) {
          this.meta.claimedMilestones.push(id);
          target.claimFn();
          this.meta.save();
          sfx.victory();
          this.showToast(`🎁 Đã nhận thưởng [${target.title}]!`);
          this.renderLobby();
          this.openMilestonesModal();
        }
      };
    });
  }

  // --- CLUB LEADERBOARD & BẢNG XẾP HẠNG MAFIA ---
  renderRankTab() {
    const score = this.meta.highScore || 0;
    let badgeIcon = '🥉';
    let badgeTitle = 'BẬC ĐỒNG MAFIA';
    let rankPos = 'Top 10';

    if (score >= 2000000) {
      badgeIcon = '👑';
      badgeTitle = typeof t === 'function' ? t('lb.tier_godfather', 'BỐ GIÀ HOÀNG KIM') : 'BỐ GIÀ HOÀNG KIM';
      rankPos = 'Top 1';
    } else if (score >= 1500000) {
      badgeIcon = 'KC';
      badgeTitle = typeof t === 'function' ? t('lb.tier_diamond', 'BẬC KIM CƯƠNG') : 'BẬC KIM CƯƠNG';
      rankPos = 'Top 3';
    } else if (score >= 1000000) {
      badgeIcon = '🥇';
      badgeTitle = typeof t === 'function' ? t('lb.tier_gold', 'BẬC VÀNG MAFIA') : 'BẬC VÀNG MAFIA';
      rankPos = 'Top 4';
    } else if (score >= 500000) {
      badgeIcon = '🥈';
      badgeTitle = typeof t === 'function' ? t('lb.tier_silver', 'BẬC BẠC MAFIA') : 'BẬC BẠC MAFIA';
      rankPos = 'Top 7';
    } else {
      badgeTitle = typeof t === 'function' ? t('lb.tier_bronze', 'BẬC ĐỒNG MAFIA') : 'BẬC ĐỒNG MAFIA';
    }

    const iconEl = document.getElementById('club-player-badge-icon');
    const titleEl = document.getElementById('club-player-badge-title');
    const rankEl = document.getElementById('club-player-rank-num');
    const scoreEl = document.getElementById('club-player-max-score');
    const stageEl = document.getElementById('club-player-max-stage');

    if (iconEl) iconEl.textContent = badgeIcon;
    if (titleEl) titleEl.textContent = badgeTitle;
    if (rankEl) rankEl.textContent = rankPos;
    if (scoreEl) scoreEl.textContent = score.toLocaleString();
    if (stageEl) stageEl.textContent = `${typeof t === 'function' ? t('lb.stage_label', 'Màn') : 'Màn'} ${this.meta.unlockedStage || 1} / 5`;

    const weeklyBtn = document.getElementById('btn-claim-weekly-rank');
    if (weeklyBtn) {
      if (this.meta.claimedWeeklyRank) {
        weeklyBtn.textContent = typeof t === 'function' ? t('lb.weekly_claimed', '✅ Đã Nhận Thưởng Tuần Này') : '✅ Đã Nhận Thưởng Tuần Này';
        weeklyBtn.classList.add('btn-claimed');
      } else {
        weeklyBtn.textContent = typeof t === 'function' ? t('lb.weekly_claim', '🎁 Nhận Thưởng Tuần (+50 Kim Cương & +1.000 Vàng)') : '🎁 Nhận Thưởng Tuần (+50 Kim Cương & +1.000 Vàng)';
        weeklyBtn.classList.remove('btn-claimed');
      }
    }

    const lbList = document.getElementById('leaderboard-rows-list');
    if (!lbList) return;
    lbList.innerHTML = '';

    const competitors = [
      { rank: 1, name: 'Don Vito Corleone', clan: 'The Syndicate', wave: 242, score: 2850000, isPlayer: false },
      { rank: 2, name: 'Yamamoto Chizuru', clan: 'Tokyo Neon', wave: 218, score: 2120000, isPlayer: false },
      { rank: 3, name: 'Mech GM-X Titan', clan: 'Cyber Core', wave: 195, score: 1680000, isPlayer: false },
      { rank: 4, name: `⭐ ${typeof t === 'function' ? t('lb.player_you', 'Bạn') : 'Bạn'} (Capo Black Gold)`, clan: 'Black Gold Citadel', wave: this.meta.maxWave, score: score, isPlayer: true },
      { rank: 5, name: 'Tony Montana', clan: 'Scarface Cartel', wave: 140, score: 950000, isPlayer: false },
      { rank: 6, name: 'Heisenberg', clan: 'Blue Crystal', wave: 115, score: 820000, isPlayer: false },
      { rank: 7, name: 'Tommy Shelby', clan: 'Peaky Blinders', wave: 95, score: 680000, isPlayer: false },
      { rank: 8, name: 'John Wick', clan: 'Continental Hotel', wave: 80, score: 540000, isPlayer: false },
      { rank: 9, name: 'Michael Corleone', clan: 'Five Families', wave: 65, score: 420000, isPlayer: false },
      { rank: 10, name: 'Frank Costello', clan: 'Wall Street Mob', wave: 45, score: 310000, isPlayer: false }
    ];

    competitors.forEach(c => {
      const row = document.createElement('div');
      row.className = `lb-item-row ${c.isPlayer ? 'is-player-row' : ''}`;
      row.innerHTML = `
        <span class="lb-col-rank ${c.rank <= 3 ? 'top-' + c.rank : ''}">#${c.rank}</span>
        <div class="lb-col-user">
          <span class="lb-uname">${c.name}</span>
          <span class="lb-uclan">${c.clan}</span>
        </div>
        <span class="lb-col-wave">W.${c.wave}</span>
        <span class="lb-col-score text-gold">${c.score.toLocaleString()}</span>
      `;
      lbList.appendChild(row);
    });
  }

  // --- GIANT BOSS SHOWCASE (ẢNH LOBBY IDLE MAFIA & PIXEL ART HUGGING FACE) ---
  renderGiantBoss() {
    const stage = BOSS_LIST[this.currentBossIndex];
    if (!stage) return;
    this.meta.selectedStage = stage.stage;
    this.meta.save();

    const stageNum = stage.stage;
    const isStageUnlocked = stageNum <= (this.meta.unlockedStage || 1);

    const btnEnter = document.getElementById('btn-enter-run');
    const titleEl = document.getElementById('btn-battle-title-el');
    const subEl = document.getElementById('btn-battle-sub-el');
    const iconEl = document.getElementById('btn-battle-icon-el');
    const traitCardEl = document.querySelector('.boss-trait-card');
    const traitBadgeEl = document.querySelector('.trait-icon-badge');

    const areaName = typeof t === 'function' ? t(`boss.${stage.id}.area`, stage.areaName) : stage.areaName;
    const bossName = typeof t === 'function' ? t(`boss.${stage.id}.name`, stage.name) : stage.name;
    const bossTrait = typeof t === 'function' ? t(`boss.${stage.id}.trait`, stage.trait) : stage.trait;

    if (isStageUnlocked) {
      if (this.bossSubtitleTag) {
        this.bossSubtitleTag.textContent = typeof t === 'function' ? t('lobby.stage_tag', `MÀN ${stageNum} / 5 • ${areaName}`, { stage: stageNum, area: areaName }) : `MÀN ${stageNum} / 5 • ${areaName}`;
      }
      if (this.bossNameHeading) this.bossNameHeading.textContent = bossName;
      if (this.bossLvlBadge) {
        this.bossLvlBadge.textContent = `LV. ${stage.level}`;
        this.bossLvlBadge.classList.remove('is-locked');
      }
      if (traitBadgeEl) traitBadgeEl.textContent = typeof t === 'function' ? t('lobby.boss_trait_unlocked', '★ Kỹ Năng Boss (Đã Mở)') : '★ Kỹ Năng Boss (Đã Mở)';
      if (this.bossTraitDesc) this.bossTraitDesc.textContent = bossTrait;
      if (traitCardEl) traitCardEl.classList.remove('is-locked');

      if (this.giantBossAvatarWrapper) {
        this.giantBossAvatarWrapper.innerHTML = `
          <div class="pixel-boss-showcase">
            <img src="assets/bosses/boss_stage${stageNum}.png" alt="${bossName}" class="giant-pixel-boss-img" onerror="this.onerror=null;this.parentElement.innerHTML=stage.svgFn();">
          </div>
        `;
      }

      if (btnEnter) {
        btnEnter.disabled = false;
        btnEnter.classList.remove('stage-locked-btn');
      }
      if (titleEl) {
        const deployPrefix = typeof t === 'function' ? t('lobby.deploy_stage', 'XUẤT TRẬN MÀN') : 'XUẤT TRẬN MÀN';
        titleEl.textContent = `${deployPrefix} ${stageNum}`;
      }
      if (subEl) {
        subEl.textContent = typeof t === 'function' ? t('lobby.deploy_sub', `Vượt ${stage.totalWaves} Waves & Diệt Boss (Tốn 5 Năng Lượng)`, { waves: stage.totalWaves }) : `Vượt ${stage.totalWaves} Waves & Diệt Boss (Tốn 5 Năng Lượng)`;
      }
      if (iconEl) iconEl.textContent = '⚔️';
    } else {
      if (this.bossSubtitleTag) {
        this.bossSubtitleTag.textContent = typeof t === 'function' ? t('lobby.stage_locked_tag', `MÀN ${stageNum} / 5 • VÙNG ĐẤT BÍ ẨN 🔒`, { stage: stageNum }) : `MÀN ${stageNum} / 5 • VÙNG ĐẤT BÍ ẨN 🔒`;
      }
      if (this.bossNameHeading) this.bossNameHeading.textContent = typeof t === 'function' ? t('lobby.mystery_boss', '??? TRÙM BÍ ẨN ???') : '??? TRÙM BÍ ẨN ???';
      if (this.bossLvlBadge) {
        this.bossLvlBadge.textContent = 'LV. ???';
        this.bossLvlBadge.classList.add('is-locked');
      }
      if (traitBadgeEl) traitBadgeEl.textContent = typeof t === 'function' ? t('lobby.boss_locked_badge', '🔒 MÀN CHƯA MỞ KHÓA') : '🔒 MÀN CHƯA MỞ KHÓA';
      if (this.bossTraitDesc) {
        this.bossTraitDesc.textContent = typeof t === 'function' ? t('lobby.stage_unlock_req', `🔒 Cần vượt qua Màn ${stageNum - 1} và tiêu diệt Boss để mở khóa!`, { prev: stageNum - 1 }) : `🔒 Cần vượt qua Màn ${stageNum - 1} và tiêu diệt Boss để mở khóa khu vực chiến dịch này!`;
      }
      if (traitCardEl) traitCardEl.classList.add('is-locked');

      if (this.giantBossAvatarWrapper) {
        this.giantBossAvatarWrapper.innerHTML = `
          <div class="pixel-boss-showcase locked-silhouette">
            <img src="assets/bosses/boss_stage${stageNum}_silhouette.png" alt="Locked Boss" class="giant-pixel-boss-img" onerror="this.onerror=null;this.parentElement.innerHTML=getBossSilhouetteSVG(stage.name, stageNum);">
          </div>
        `;
      }

      if (btnEnter) {
        btnEnter.disabled = true;
        btnEnter.classList.add('stage-locked-btn');
      }
      if (titleEl) titleEl.textContent = typeof t === 'function' ? t('lobby.btn_battle_locked', 'CHƯA MỞ KHÓA') : `🔒 MÀN ${stageNum} ĐANG BỊ KHÓA`;
      if (subEl) subEl.textContent = typeof t === 'function' ? t('lobby.stage_unlock_req', `Cần hạ Boss Màn ${stageNum - 1} trước`, { prev: stageNum - 1 }) : `Hãy tiêu diệt Trùm Màn ${stageNum - 1} để mở khóa`;
      if (iconEl) iconEl.textContent = '🔒';
    }

    if (this.lobbyMaxWave) this.lobbyMaxWave.textContent = `${stage.totalWaves} Waves`;
    if (this.lobbyMaxScore) this.lobbyMaxScore.innerHTML = `<img src="assets/icons/gem.png" class="pixel-mini-icon"> +${stage.diamondReward}`;
  }

  // --- BỘ TRANG BỊ RA TRẬN & KHO VŨ KHÍ TIẾN HÓA (LOADOUT & ARSENAL METAGAME) ---
  renderBattleTabLoadout() {
    const container = document.getElementById('battle-tab-loadout-icons');
    if (!container) return;
    container.innerHTML = '';

    const maxSlots = this.meta.getMaxLoadoutSlots();
    this.meta.equippedLoadout.forEach(tId => {
      const gInfo = GEAR_TYPES[tId];
      if (!gInfo) return;
      const lvl = this.meta.weaponLevels[tId] || 1;
      const itemEl = document.createElement('div');
      itemEl.className = 'll-icon-item';
      itemEl.title = `${gInfo.name} (Lv.${lvl})`;
      itemEl.innerHTML = `
        <span class="ll-icon-tier">Lv.${lvl}</span>
        <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
          ${getGearSVG(tId, lvl, false)}
        </div>
      `;
      itemEl.onclick = () => {
        // Chuyển sang Tab Arsenal để chỉnh sửa
        const equipTabBtn = document.querySelector('.nav-tab-btn[data-tab="arsenal"]');
        if (equipTabBtn) equipTabBtn.click();
      };
      container.appendChild(itemEl);
    });

    // Hiển thị ô trống nếu chưa đủ slot
    for (let s = this.meta.equippedLoadout.length; s < maxSlots; s++) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'll-icon-item';
      emptyEl.style.borderStyle = 'dashed';
      emptyEl.style.opacity = '0.5';
      emptyEl.title = 'Ô trống - Nhấn để chọn thêm trang bị';
      emptyEl.innerHTML = `<span style="font-size:12px;color:#64748b;">+</span>`;
      emptyEl.onclick = () => {
        const equipTabBtn = document.querySelector('.nav-tab-btn[data-tab="arsenal"]');
        if (equipTabBtn) equipTabBtn.click();
      };
      container.appendChild(emptyEl);
    }

    const editBtn = document.getElementById('btn-goto-equip-tab');
    if (editBtn) {
      editBtn.onclick = () => {
        const equipTabBtn = document.querySelector('.nav-tab-btn[data-tab="arsenal"]');
        if (equipTabBtn) equipTabBtn.click();
      };
    }
  }

  renderLobbyArsenal() {
    // 1. Render Khung Bộ Trang Bị (Loadout Selection)
    const loadoutBox = document.getElementById('arsenal-loadout-container');
    if (loadoutBox) {
      loadoutBox.innerHTML = '';
      const maxSlots = this.meta.getMaxLoadoutSlots();
      const curCount = this.meta.equippedLoadout.length;

      const headerDiv = document.createElement('div');
      headerDiv.className = 'alb-title-row';
      headerDiv.innerHTML = `
        <span class="alb-title">🎒 BỘ TRANG BỊ RA TRẬN</span>
        <span class="alb-slots-badge">${curCount}/${maxSlots} Ô ĐANG CHỌN</span>
      `;
      loadoutBox.appendChild(headerDiv);

      const descP = document.createElement('p');
      descP.className = 'alb-desc';
      descP.textContent = `Chỉ ${curCount} trang bị này xuất hiện trong ván đấu. Chạm vào ô để tháo hoặc chọn món bên dưới để thêm.`;
      loadoutBox.appendChild(descP);

      const gridDiv = document.createElement('div');
      gridDiv.className = 'alb-grid';

      // Các ô trang bị đã chọn
      this.meta.equippedLoadout.forEach(tId => {
        const gInfo = GEAR_TYPES[tId];
        const lvl = this.meta.weaponLevels[tId] || 1;
        const slotEl = document.createElement('div');
        slotEl.className = 'alb-slot filled';
        slotEl.title = `Chạm để tháo ${gInfo ? gInfo.name : tId}`;
        slotEl.innerHTML = `
          <div class="alb-slot-x" title="Tháo món này">✕</div>
          <div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
            ${getGearSVG(tId, lvl, false)}
          </div>
          <span class="alb-slot-name">${gInfo ? gInfo.name : tId}</span>
        `;
        slotEl.onclick = () => {
          const res = this.meta.toggleLoadoutGear(tId);
          this.showToast(res.msg);
          sfx.playTone(320, 'sine', 0.05, 0.08);
          this.renderLobbyArsenal();
          this.renderBattleTabLoadout();
        };
        gridDiv.appendChild(slotEl);
      });

      // Các ô slot còn trống
      for (let s = curCount; s < maxSlots; s++) {
        const emptySlot = document.createElement('div');
        emptySlot.className = 'alb-slot empty';
        emptySlot.innerHTML = `
          <span style="font-size:16px;color:#475569;">+</span>
          <span style="font-size:7.5px;color:#64748b;margin-top:2px;">Trống #${s + 1}</span>
        `;
        gridDiv.appendChild(emptySlot);
      }

      loadoutBox.appendChild(gridDiv);
    }

    // 2. Render Danh Sách Chi Tiết Toàn Bộ Trang Bị
    if (!this.arsenalDetailedList) return;
    this.arsenalDetailedList.innerHTML = '';

    const allGearTypes = ['dagger', 'firearm', 'laser', 'molotov', 'vest', 'shield', 'barrier', 'belt', 'card'];
    allGearTypes.forEach(tId => {
      const gInfo = GEAR_TYPES[tId];
      const prog = WEAPON_PROGRESSION[tId];
      if (!gInfo || !prog) return;

      const isUnlocked = this.meta.isGearUnlocked(tId);
      const isEquipped = this.meta.equippedLoadout.includes(tId);
      const curLvl = this.meta.weaponLevels[tId] || 1;
      const isMaxLvl = curLvl >= 10;
      const nextLvl = isMaxLvl ? 10 : curLvl + 1;
      const frags = this.meta.materials[tId] || 0;
      const cost = this.meta.getUpgradeCost(curLvl);
      const reqFrags = cost.frags;
      const reqCash = cost.cash;
      const canUpgrade = isUnlocked && !isMaxLvl && frags >= reqFrags && this.meta.cash >= reqCash;

      const curStats = prog.getStats(curLvl);
      const nextStats = prog.getStats(nextLvl);
      const milestone = prog.milestones[nextLvl] || `Cường hóa toàn diện chỉ số Lv.${nextLvl}`;

      const card = document.createElement('div');
      card.className = `arsenal-card ${!isUnlocked ? 'is-locked' : (isEquipped ? 'is-equipped' : '')}`;

      let loadoutBtnHtml = '';
      if (!isUnlocked) {
        loadoutBtnHtml = `<button class="btn-toggle-loadout btn-locked" type="button" disabled>🔒 MỞ HÒM ĐỂ MỞ KHÓA</button>`;
      } else if (isEquipped) {
        loadoutBtnHtml = `<button class="btn-toggle-loadout btn-equipped" type="button">✅ ĐÃ TRANG BỊ (THÁO)</button>`;
      } else {
        loadoutBtnHtml = `<button class="btn-toggle-loadout btn-add" type="button">➕ ĐEM VÀO TRẬN</button>`;
      }

      card.innerHTML = `
        <div class="arsenal-card-top">
          <div class="arsenal-identity">
            <div class="arsenal-avatar-frame" style="${!isUnlocked ? 'filter:grayscale(0.8);border-color:#475569;' : ''}">
              ${getGearSVG(tId, curLvl, false)}
            </div>
            <div class="arsenal-title-group">
              <div style="display:flex;align-items:center;gap:6px;">
                <h4 style="margin:0;">${gInfo.name}</h4>
                ${!isUnlocked ? '<span style="font-size:8px;background:#7f1d1d;color:#fca5a5;padding:1px 5px;border-radius:4px;font-weight:900;">🔒 CHƯA SỞ HỮU</span>' : ''}
              </div>
              <span class="arsenal-lvl-tag">${isUnlocked ? `Cấp Hiện Tại: Lv.${curLvl}` : `Khóa (Cần mở hòm gacha)`}</span>
            </div>
          </div>
          ${loadoutBtnHtml}
        </div>

        <div class="arsenal-stats-grid">
          <div class="stat-metric">
            <span class="stat-lbl">${prog.stat1Label}</span>
            <div class="stat-val-row">
              <span>${curStats.val1}</span>
              <span style="color:#64748b;">➜</span>
              <span class="stat-plus">${nextStats.val1} (+${nextStats.diff1})</span>
            </div>
          </div>
          <div class="stat-metric">
            <span class="stat-lbl">${prog.stat2Label}</span>
            <div class="stat-val-row">
              <span>${curStats.val2}</span>
              <span style="color:#64748b;">➜</span>
              <span class="stat-plus">${nextStats.val2} (${nextStats.diff2})</span>
            </div>
          </div>
        </div>

        <div class="arsenal-milestone-pill">
          Năng Lượng <b>Mốc Lv.${nextLvl}:</b> ${milestone}
        </div>

        <div class="arsenal-card-footer">
          <div class="cost-req-chips">
            <span class="frag-chip">📦 Mảnh: <b>${frags}/${reqFrags}</b></span>
            <span class="cash-chip"><img src="assets/icons/gold_coin.png" class="pixel-mini-icon"> Phí: <b>${reqCash}</b></span>
          </div>
          <button class="btn-card-upgrade" ${canUpgrade ? '' : 'disabled'}>
            ${!isUnlocked ? 'CHƯA MỞ KHÓA' : (isMaxLvl ? 'CẤP TỐI THƯỢNG (MAX)' : (canUpgrade ? `NÂNG LÊN LV.${nextLvl}` : `THIẾU TÀI NGUYÊN`))}
          </button>
        </div>
      `;

      // Xử lý nút Đem Vào Trận / Tháo Gỡ
      const toggleBtn = card.querySelector('.btn-toggle-loadout');
      if (toggleBtn && isUnlocked) {
        toggleBtn.onclick = () => {
          const res = this.meta.toggleLoadoutGear(tId);
          this.showToast(res.msg);
          if (res.success) {
            sfx.playTone(res.action === 'added' ? 440 : 330, 'sine', 0.06, 0.1);
            this.renderLobbyArsenal();
            this.renderBattleTabLoadout();
          }
        };
      }

      // Xử lý nút Nâng Cấp
      const btnUpgrade = card.querySelector('.btn-card-upgrade');
      if (btnUpgrade && isUnlocked) {
        btnUpgrade.onclick = () => {
          if (this.meta.upgradeWeapon(tId)) {
            this.showToast(`🎉 Nâng cấp ${gInfo.name} lên Lv.${this.meta.weaponLevels[tId]} thành công!`);
            this.renderLobby();
          } else {
            this.showToast('⚠️ Không đủ mảnh nguyên liệu hoặc tiền để nâng cấp!');
          }
        };
      }

      this.arsenalDetailedList.appendChild(card);
    });
  }

  // --- LEVEL UP ROGUELIKE PERK CHOICES (THÔNG MINH: GIỚI HẠN 1/1, LỌC THEO TRANG BỊ & ĐỘ HIẾM) ---
  showLevelUpModal() {
    if (!this.modalLevelup || !this.levelupChoicesContainer) return;
    this.battle.state.isPaused = true;
    sfx.victory();

    this.levelupChoicesContainer.innerHTML = '';

    // Thu thập các trang bị người chơi đang sử dụng trong trận
    const activeGears = new Set();
    if (this.run && this.run.backpackItems) {
      this.run.backpackItems.forEach(i => activeGears.add(i.type));
    }
    if (this.run && this.run.meta && this.run.meta.equippedLoadout) {
      this.run.meta.equippedLoadout.forEach(t => activeGears.add(t));
    }
    const hasDefense = activeGears.has('vest') || activeGears.has('shield');

    // Thống kê số lần mỗi perk đã được chọn trong ván chơi này
    const pickedCounts = {};
    (this.run.perks || []).forEach(p => {
      pickedCounts[p.id] = (pickedCounts[p.id] || 0) + 1;
    });

    // Context-Aware Perk Filtering & Giới hạn số lần chọn:
    // CÁC BUFF HIẾM VÀ CAO HƠN (RARE, EPIC, LEGENDARY) CHỈ XUẤT HIỆN DUY NHẤT 1 LẦN (1/1)
    const isPerkAvailable = (p) => {
      // 1. Kiểm tra giới hạn số lần chọn: Rare trở lên chỉ được chọn 1 lần duy nhất (1/1)
      const isHighRarity = p.rarity === 'rare' || p.rarity === 'epic' || p.rarity === 'legendary';
      const maxAllowed = isHighRarity ? 1 : (p.maxPicks || 99);
      const count = pickedCounts[p.id] || 0;
      if (count >= maxAllowed) return false;

      // 2. Kiểm tra tính liên quan đến trang bị đang mang
      if (!p.gear || p.gear === 'universal') return true;
      if (p.gear === 'defense') return hasDefense;
      return activeGears.has(p.gear);
    };

    const eligiblePool = ROGUELIKE_PERKS.filter(p => isPerkAvailable(p));
    // Nếu pool theo trang bị không đủ 3 món, lấy từ toàn bộ các perk chưa đạt max picks
    const unpickedGeneralPool = ROGUELIKE_PERKS.filter(p => {
      const isHighRarity = p.rarity === 'rare' || p.rarity === 'epic' || p.rarity === 'legendary';
      const maxAllowed = isHighRarity ? 1 : (p.maxPicks || 99);
      return (pickedCounts[p.id] || 0) < maxAllowed;
    });

    const poolToUse = eligiblePool.length >= 3 ? eligiblePool : (unpickedGeneralPool.length > 0 ? unpickedGeneralPool : ROGUELIKE_PERKS);

    // Lựa chọn 3 buff độc lập theo tỷ lệ độ hiếm mới:
    // Đa phần là Common (80%), Rare thấp xuống (14%), Epic (5%), Legendary (1%)
    const selected3 = [];
    const usedIds = new Set();

    for (let i = 0; i < 3; i++) {
      const roll = Math.random() * 100;
      let targetRarity = 'common';
      if (roll < 80) targetRarity = 'common';       // 80% Common
      else if (roll < 94) targetRarity = 'rare';    // 14% Rare
      else if (roll < 99) targetRarity = 'epic';    // 5% Epic
      else targetRarity = 'legendary';              // 1% Legendary

      let available = poolToUse.filter(p => p.rarity === targetRarity && !usedIds.has(p.id));
      if (available.length === 0) {
        available = poolToUse.filter(p => !usedIds.has(p.id));
      }
      if (available.length === 0) available = poolToUse;

      const chosen = available[Math.floor(Math.random() * available.length)];
      usedIds.add(chosen.id);
      selected3.push(chosen);
    }

    selected3.forEach(perk => {
      const rMeta = PERK_RARITIES[perk.rarity] || PERK_RARITIES.common;
      const card = document.createElement('div');
      card.className = `perk-choice-card rarity-${perk.rarity}`;
      const isUnique = (perk.rarity === 'rare' || perk.rarity === 'epic' || perk.rarity === 'legendary') || (perk.maxPicks === 1);
      card.innerHTML = `
        <div class="perk-card-icon" style="border-color: ${rMeta.borderColor};">
          ${perk.icon}
        </div>
        <div class="perk-card-content">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <h4 class="perk-card-title" style="color: ${rMeta.color}; margin:0;">${perk.title}</h4>
            <div style="display:flex;align-items:center;gap:4px;">
              ${isUnique ? '<span style="background:rgba(255,255,255,0.08);color:#94a3b8;border:1px solid #475569;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:900;">1/1</span>' : ''}
              <span class="perk-rarity-badge" style="background:${rMeta.color}22; color:${rMeta.color}; border:1px solid ${rMeta.borderColor};">
                ${rMeta.badge}
              </span>
            </div>
          </div>
          <p class="perk-card-desc" style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">${perk.desc}</p>
        </div>
      `;

      card.onclick = () => {
        perk.apply(this.run);
        this.run.perks.push(perk);
        sfx.merge();
        this.showToast(`✨ Đã chọn [${rMeta.badge}]: ${perk.title}!`);
        this.modalLevelup.classList.add('hidden');
        this.battle.state.isPaused = false;
      };

      this.levelupChoicesContainer.appendChild(card);
    });

    this.modalLevelup.classList.remove('hidden');
  }

  // --- 5-SLOT STASH BENCH (YÊU CẦU 3: Ô 1 Free, Ô 2 25$, Ô 3 15 Gems, Ô 4 1-QC, Ô 5 2-QC) ---
  renderStashBench() {
    if (!this.stashSlotsEls) return;
    this.stashSlotsEls.forEach((slotEl, idx) => {
      if (!slotEl) return;
      slotEl.innerHTML = '';
      const isUnlocked = this.run.stashUnlocked[idx];
      const item = this.run.stashSlots[idx];

      if (!isUnlocked) {
        slotEl.className = 'stash-slot locked';
        let lockTitle = '';
        let lockSub = '';

        if (idx === 1) {
          lockTitle = '<img src="assets/icons/pixel_cash.png" class="pixel-mini-icon"> 25 $';
          lockSub = 'Money ván';
        } else if (idx === 2) {
          lockTitle = '<img src="assets/icons/gem.png" class="pixel-mini-icon"> 15';
          lockSub = 'Kim Cương';
        } else if (idx === 3) {
          lockTitle = '📺 1 QC';
          lockSub = 'Xem Video';
        } else if (idx === 4) {
          const watched = this.run.stashAdWatched[4] || 0;
          lockTitle = '📺 2 QC';
          lockSub = `(${watched}/2 QC)`;
        }

        slotEl.innerHTML = `
          <div class="stash-lock-chip">
            <span>🔒 Ô #${idx + 1}</span>
            <span class="stash-lock-price">${lockTitle}</span>
            <span style="font-size:7px;color:#94a3b8;">${lockSub}</span>
          </div>
        `;

        slotEl.onclick = () => {
          if (idx === 1) {
            // Mua bằng 25 tiền trong ván
            if (this.run.runCash >= 25) {
              this.run.runCash -= 25;
              this.run.stashUnlocked[1] = true;
              sfx.coin();
              this.showToast('[Mở Khóa] Hàng dự bị #2 bằng 25 $!');
              this.renderStashBench();
              this.updateBackpackUI();
            } else {
              this.showToast('⚠️ Cần 25 $ trong ván để mở ô này!');
              sfx.playTone(180, 'sawtooth', 0.12, 0.12);
            }
          } else if (idx === 2) {
            // Mua bằng 15 kim cương
            if (this.meta.gems >= 15) {
              this.meta.gems -= 15;
              this.meta.save();
              this.run.stashUnlocked[2] = true;
              sfx.coin();
              this.showToast('[Mở Khóa] Hàng dự bị #3 bằng 15 Kim Cương!');
              this.renderStashBench();
              this.renderLobby();
            } else {
              this.showToast('⚠️ Cần 15 Kim Cương Kim Cương để mở ô này!');
              sfx.playTone(180, 'sawtooth', 0.12, 0.12);
            }
          } else if (idx === 3) {
            // Xem 1 lượt quảng cáo
            this.modalAd.classList.remove('hidden');
            let timer = 4;
            const timerEl = document.getElementById('ad-timer');
            timerEl.textContent = `Đóng sau ${timer}s`;
            const iv = setInterval(() => {
              timer--;
              if (timer > 0) {
                timerEl.textContent = `Đóng sau ${timer}s`;
              } else {
                clearInterval(iv);
                this.modalAd.classList.add('hidden');
                this.run.stashUnlocked[3] = true;
                sfx.victory();
                this.showToast('📺 Đã xem QC - Mở khóa Hàng dự bị #4 thành công!');
                this.renderStashBench();
              }
            }, 1000);
          } else if (idx === 4) {
            // Xem 2 lượt quảng cáo
            this.modalAd.classList.remove('hidden');
            let timer = 4;
            const timerEl = document.getElementById('ad-timer');
            timerEl.textContent = `Đóng sau ${timer}s`;
            const iv = setInterval(() => {
              timer--;
              if (timer > 0) {
                timerEl.textContent = `Đóng sau ${timer}s`;
              } else {
                clearInterval(iv);
                this.modalAd.classList.add('hidden');
                this.run.stashAdWatched[4] = (this.run.stashAdWatched[4] || 0) + 1;
                if (this.run.stashAdWatched[4] >= 2) {
                  this.run.stashUnlocked[4] = true;
                  sfx.victory();
                  this.showToast('🎉 Đã xem đủ 2 QC - Mở khóa Hàng dự bị #5 thành công!');
                } else {
                  sfx.coin();
                  this.showToast('📺 Đã xem 1/2 QC! Hãy xem thêm 1 lượt nữa để mở Ô #5!');
                }
                this.renderStashBench();
              }
            }, 1000);
          }
        };
        return;
      }

      slotEl.onclick = null;
      if (!item) {
        slotEl.className = 'stash-slot unlocked';
        slotEl.innerHTML = `<span style="font-size:8px;color:#475569;font-weight:700;">#${idx + 1} Trống</span>`;
        return;
      }

      slotEl.className = `stash-slot unlocked tier-${Math.min(8, item.tier || 1)}`;
      const previewSvg = getGearSVG(item.type, item.tier || 1, false);
      slotEl.innerHTML = `
        <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
          ${previewSvg}
        </div>
        <span style="font-size:7.5px;font-weight:900;color:#fbbf24;">★${item.tier || 1}</span>
      `;

      // Pointer drag from Stash
      this.attachPointerDrag(slotEl, item, 'stash', idx);
    });
  }

  // --- DUAL-LAYER BACKPACK SUITCASE RENDERING ---
  renderBackpack() {
    // Mode indicator in backpack
    if (this.backpackModeIndicator) {
      if (this.run.hardcoreMode) {
        this.backpackModeIndicator.className = 'mode-badge hardcore-mode';
        this.backpackModeIndicator.textContent = '🔥 Hardcore';
      } else {
        this.backpackModeIndicator.className = 'mode-badge normal-mode';
        this.backpackModeIndicator.textContent = '🛡️ Thường (Bán Vali)';
      }
    }

    // Render Stash Bench (5 slots)
    this.renderStashBench();
    // 1. Layer 1: Fixed 7x7 Background Cells (Never displaced)
    this.gridCellsLayer.innerHTML = '';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const idx = r * 7 + c;
        const cell = document.createElement('div');
        const isUnlocked = this.run.gridUnlocked[idx];

        cell.className = `bp-cell ${isUnlocked ? 'cell-unlocked' : 'cell-locked'}`;
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.dataset.idx = idx;

        // Tap-to-place support: click any cell when an item is selected
        cell.onclick = () => {
          if (this.selectedItem && this.selectedItem.source === 'shop') {
            const w = this.selectedItem.w || 1;
            const h = this.selectedItem.h || 1;
            const rootCol = Math.max(0, Math.min(7 - w, Math.round(c - (w - 1) / 2)));
            const rootRow = Math.max(0, Math.min(7 - h, Math.round(r - (h - 1) / 2)));
            this.handleDropToBackpack(rootRow, rootCol, this.selectedItem);
            this.selectedItem = null;
            if (this.shopSlotsEls) this.shopSlotsEls.forEach(s => s && s.classList.remove('is-selected'));
          }
        };

        this.gridCellsLayer.appendChild(cell);
      }
    }

    // 2. Layer 2: Overlay Equipment Cards (Strictly fitted, NO text overflow)
    this.gridItemsLayer.innerHTML = '';
    this.run.backpackItems.forEach(item => {
      const card = document.createElement('div');
      card.className = `bp-item-card tier-${Math.min(8, item.tier)}`;
      const gDefRender = GEAR_TYPES[item.type];
      const renderW = gDefRender ? gDefRender.w : (item.w || 1);
      const renderH = gDefRender ? gDefRender.h : (item.h || 1);
      card.style.gridColumn = `${item.c + 1} / span ${renderW}`;
      card.style.gridRow = `${item.r + 1} / span ${renderH}`;

      card.innerHTML = `
        <div class="bp-item-tier">★${item.tier}</div>
        ${getGearSVG(item.type, item.tier, false)}
      `;

      // Universal Pointer-Events Drag & Drop
      this.attachPointerDrag(card, item, 'backpack');

      this.gridItemsLayer.appendChild(card);
    });

    // 3. 3-Item Shop Slots
    this.renderShopSlots();
  }

  renderShopSlots() {
    if (!this.shopSlotsEls) return;
    this.shopSlotsEls.forEach((slotEl, idx) => {
      if (!slotEl) return;
      slotEl.innerHTML = '';
      const sItem = this.run.shopSlots[idx];

      if (!sItem) {
        slotEl.className = 'shop-item-slot slot-empty';
        slotEl.style.borderColor = '#28374d';
        slotEl.style.boxShadow = 'none';
        slotEl.innerHTML = `<span class="empty-roll-hint">Trống / Đã Mua</span>`;
        return;
      }

      const tier = sItem.tier || 1;
      const tierColors = {
        1: { bg: '#1e293b', border: '#64748b', text: '#cbd5e1', name: 'Cấp 1 ★' },
        2: { bg: '#064e3b', border: '#10b981', text: '#6ee7b7', name: 'Cấp 2 ★★' },
        3: { bg: '#1e3a8a', border: '#3b82f6', text: '#93c5fd', name: 'Cấp 3 ★★★' },
        4: { bg: '#581c87', border: '#a855f7', text: '#d8b4fe', name: 'Cấp 4 ★★★★' },
        5: { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5', name: 'Cấp 5 ★★★★★' },
        6: { bg: '#164e63', border: '#06b6d4', text: '#67e8f9', name: 'Cấp 6 ★★★★★★' },
        7: { bg: '#78350f', border: '#f59e0b', text: '#fde68a', name: 'Cấp 7 👑 Thần Thoại' }
      };
      const tMeta = tierColors[Math.min(7, tier)] || tierColors[1];

      slotEl.className = `shop-item-slot tier-${Math.min(8, tier)}`;
      slotEl.style.borderColor = tMeta.border;
      slotEl.style.boxShadow = `0 0 10px ${tMeta.border}55`;

      const gInfo = sItem.isLand ? { name: sItem.name } : GEAR_TYPES[sItem.type];
      const previewSvg = getGearSVG(sItem.isLand ? 'land' : sItem.type, tier, sItem.isLand);
      const sellVal = this.run.calculateSellPrice(sItem);

      // YÊU CẦU 2: THỂ HIỆN RÕ CẤP ĐỘ (LEVEL / TIER) CỦA TRANG BỊ ROLL RA (KHÔNG ĐÈ CHỮ)
      slotEl.innerHTML = `
        <div class="shop-card-top">
          <span class="shop-card-dots">#${idx + 1}</span>
          <div class="shop-tier-badge" style="background:${tMeta.bg}; border:1px solid ${tMeta.border}; color:${tMeta.text};">
            ${sItem.isLand ? 'Mảnh Đất' : `Lv.${tier} ★`}
          </div>
        </div>
        <div class="shop-card-icon-wrap">
          <div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
            ${previewSvg}
          </div>
        </div>
        <div class="shop-card-bottom">
          <div class="shop-item-name">${gInfo.name}</div>
          <div class="shop-item-stats">
            <span class="shop-tier-title" style="color:${tMeta.border}; font-weight:800;">${sItem.isLand ? 'Mở Rộng Ô' : tMeta.name}</span>
            <span class="shop-meta-sep">•</span>
            <span>${sItem.w}x${sItem.h} ô</span>
            <span class="shop-meta-sep">•</span>
            <span style="color:#fbbf24; font-weight:800;">+${sellVal}$</span>
          </div>
        </div>
      `;

      // Universal Pointer-Events Drag & Drop from each Shop Slot
      this.attachPointerDrag(slotEl, sItem, 'shop', idx);
    });
  }

  // --- UNIVERSAL POINTER-EVENTS DRAG & DROP ENGINE (ROCK-SOLID & PRECISE) ---
  attachPointerDrag(element, itemData, source, slotIndex = 0) {
    // Explicitly disable native drag to prevent pointercancel interruptions
    element.draggable = false;
    element.ondragstart = (e) => { e.preventDefault(); return false; };

    element.onpointerdown = (e) => {
      // Primary left click or touch only
      if (e.button !== 0) return;
      e.preventDefault();

      sfx.init();
      const startX = e.clientX;
      const startY = e.clientY;
      let isDragging = false;
      let currentHoverTarget = null;
      let isHoveringSell = false;

      // ALWAYS use canonical w/h from GEAR_TYPES to prevent stale size bugs
      const gearDef = (!itemData.isLand && itemData.type) ? GEAR_TYPES[itemData.type] : null;
      const dragObj = {
        source: source,
        slotIndex: slotIndex,
        stashIndex: (source === 'stash') ? slotIndex : undefined,
        item: itemData,
        w: gearDef ? gearDef.w : (itemData.w || 1),
        h: gearDef ? gearDef.h : (itemData.h || 1),
        isLand: itemData.isLand || false
      };

      let ghostW = 48;
      let ghostH = 48;

      const calcGridTarget = (clientX, clientY) => {
        const boardRect = this.backpackGridBoard.getBoundingClientRect();
        const pad = 15;
        if (
          clientX < boardRect.left - pad || clientX > boardRect.right + pad ||
          clientY < boardRect.top - pad || clientY > boardRect.bottom + pad
        ) {
          return null;
        }

        const cellW = boardRect.width / 7;
        const cellH = boardRect.height / 7;
        const col = Math.floor((clientX - boardRect.left) / cellW);
        const row = Math.floor((clientY - boardRect.top) / cellH);

        // Center item placement around cursor position
        const rootCol = Math.max(0, Math.min(7 - dragObj.w, Math.round(col - (dragObj.w - 1) / 2)));
        const rootRow = Math.max(0, Math.min(7 - dragObj.h, Math.round(row - (dragObj.h - 1) / 2)));

        return { row: rootRow, col: rootCol };
      };

      const onPointerMove = (moveEvent) => {
        const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
        if (!isDragging && dist > 4) {
          isDragging = true;
          this.dragItem = dragObj;
          this.selectedItem = dragObj;
          document.body.classList.add('is-dragging');

          // Compute exact ghost dimensions based on current grid board size
          const boardRect = this.backpackGridBoard.getBoundingClientRect();
          const cellW = boardRect.width / 7;
          const cellH = boardRect.height / 7;
          ghostW = Math.max(46, Math.round(cellW * dragObj.w));
          ghostH = Math.max(46, Math.round(cellH * dragObj.h));

          // Create floating drag ghost centered on cursor
          this.ghostAvatar = document.createElement('div');
          this.ghostAvatar.className = `floating-drag-ghost tier-${itemData.tier || 1}`;
          this.ghostAvatar.style.width = `${ghostW}px`;
          this.ghostAvatar.style.height = `${ghostH}px`;
          this.ghostAvatar.innerHTML = getGearSVG(itemData.isLand ? 'land' : itemData.type, itemData.tier || 1, itemData.isLand);
          document.body.appendChild(this.ghostAvatar);
          element.style.opacity = '0.4';
          const tutHand = document.getElementById('tut-pointer-hand');
          if (tutHand) tutHand.classList.add('hidden');
        }

        if (isDragging && this.ghostAvatar) {
          // Keep ghost centered cleanly under cursor/touch
          this.ghostAvatar.style.left = `${moveEvent.clientX - ghostW / 2}px`;
          this.ghostAvatar.style.top = `${moveEvent.clientY - ghostH / 2}px`;

          // Grid hover check with touch coordinates
          const boardRect = this.backpackGridBoard.getBoundingClientRect();
          const cellW = boardRect.width / 7;
          const cellH = boardRect.height / 7;
          dragObj.currentTouchCol = Math.floor((moveEvent.clientX - boardRect.left) / cellW);
          dragObj.currentTouchRow = Math.floor((moveEvent.clientY - boardRect.top) / cellH);

          const target = calcGridTarget(moveEvent.clientX, moveEvent.clientY);
          if (target) {
            this.highlightBackpackHover(target.row, target.col, dragObj);
            currentHoverTarget = target;
          } else {
            this.clearBackpackHighlights();
            currentHoverTarget = null;
          }

          // Sell Zone hover check
          const sellRect = this.sellZoneEl.getBoundingClientRect();
          const padHover = 20;
          const insideSell = (
            moveEvent.clientX >= sellRect.left - padHover && moveEvent.clientX <= sellRect.right + padHover &&
            moveEvent.clientY >= sellRect.top - padHover && moveEvent.clientY <= sellRect.bottom + padHover
          );
          isHoveringSell = insideSell;

          if (insideSell) {
            if (source === 'backpack' && this.run.hardcoreMode) {
              this.sellZoneEl.classList.add('drag-reject');
              document.getElementById('sell-zone-text').textContent = '🚫 Chế độ Hardcore: Không bán đồ vali!';
            } else {
              const sellVal = this.run.calculateSellPrice(dragObj.item);
              this.sellZoneEl.classList.add('drag-over');
              document.getElementById('sell-zone-text').textContent = `Thả để BÁN ${dragObj.isLand ? 'Mảnh Đất' : (GEAR_TYPES[dragObj.item.type]?.name || '')}: +${sellVal} $ (Money ván)`;
            }
          } else {
            this.sellZoneEl.classList.remove('drag-over', 'drag-reject');
            document.getElementById('sell-zone-text').textContent = 'Kéo trang bị vào đây để BÁN';
          }
        }
      };

      const onPointerUp = (upEvent) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        document.body.classList.remove('is-dragging');
        element.style.opacity = '1';

        if (this.ghostAvatar) {
          this.ghostAvatar.remove();
          this.ghostAvatar = null;
        }

        this.clearBackpackHighlights();
        this.sellZoneEl.classList.remove('drag-over', 'drag-reject');
        document.getElementById('sell-zone-text').textContent = 'Kéo trang bị vào đây để BÁN';

        if (!isDragging) {
          // Tap / click selection
          this.selectedItem = dragObj;
          if (source === 'shop') {
            document.querySelectorAll('.shop-item-slot').forEach(s => s.classList.remove('is-selected'));
            element.classList.add('is-selected');
            const gName = dragObj.isLand ? dragObj.item.name : (GEAR_TYPES[dragObj.item.type]?.name || '');
            this.showToast(`👉 Đã chọn ${gName}: Chạm ô trong vali hoặc kéo thả để trang bị!`);
          } else {
            if (!dragObj.isLand && GEAR_TYPES[dragObj.item.type]) {
              const g = GEAR_TYPES[dragObj.item.type];
              this.showToast(`📌 ${g.name} ★${dragObj.item.tier || 1}: ${g.desc}`);
            }
          }
          return;
        }

        // Drop on Sell Zone (Hỗ trợ bán cả đồ shop, đồ dự bị và đồ vali, độ nhạy cao)
        const sellRect = this.sellZoneEl.getBoundingClientRect();
        const padSell = 25;
        const droppedInSell = isHoveringSell || (
          upEvent.clientX >= sellRect.left - padSell && upEvent.clientX <= sellRect.right + padSell &&
          upEvent.clientY >= sellRect.top - padSell && upEvent.clientY <= sellRect.bottom + padSell
        );

        if (droppedInSell) {
          this.handleSell();
          this.dragItem = null;
          return;
        }

        // Drop on Stash Bench Check
        const stashTarget = this.getStashSlotAtPoint(upEvent.clientX, upEvent.clientY);
        if (stashTarget !== null) {
          this.handleDropToStash(stashTarget, dragObj);
          this.dragItem = null;
          return;
        }

        // Drop on Backpack Grid
        const boardRect = this.backpackGridBoard.getBoundingClientRect();
        const cellW = boardRect.width / 7;
        const cellH = boardRect.height / 7;
        dragObj.touchCol = Math.floor((upEvent.clientX - boardRect.left) / cellW);
        dragObj.touchRow = Math.floor((upEvent.clientY - boardRect.top) / cellH);

        const finalTarget = currentHoverTarget || calcGridTarget(upEvent.clientX, upEvent.clientY);
        if (finalTarget) {
          this.handleDropToBackpack(finalTarget.row, finalTarget.col, dragObj);
        } else if (dragObj.touchRow >= 0 && dragObj.touchRow < 7 && dragObj.touchCol >= 0 && dragObj.touchCol < 7) {
          this.handleDropToBackpack(dragObj.touchRow, dragObj.touchCol, dragObj);
        }

        this.dragItem = null;
        currentHoverTarget = null;
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };
  }

  highlightBackpackHover(rootR, rootC, dragObj) {
    this.clearBackpackHighlights();
    const w = dragObj.w;
    const h = dragObj.h;

    if (dragObj.isLand) {
      let canPlace = true;
      let hasAdj = false;
      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const r = rootR + dr;
          const c = rootC + dc;
          if (r >= 7 || c >= 7) { canPlace = false; break; }
          const idx = r * 7 + c;
          if (this.run.gridUnlocked[idx]) { canPlace = false; break; }

          const nbs = [(r - 1) * 7 + c, (r + 1) * 7 + c, r * 7 + (c - 1), r * 7 + (c + 1)];
          if (nbs.some(n => n >= 0 && n < 49 && this.run.gridUnlocked[n])) {
            hasAdj = true;
          }
        }
      }

      const isValidLand = canPlace && hasAdj;
      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const cell = this.getBpCell(rootR + dr, rootC + dc);
          if (cell) cell.classList.add(isValidLand ? 'highlight-land' : 'highlight-invalid');
        }
      }
    } else {
      const movingItem = dragObj.item;

      // Ưu tiên phát hiện mục tiêu Ghép Sao trực tiếp
      let directMergeTarget = null;
      if (dragObj.currentTouchRow >= 0 && dragObj.currentTouchRow < 7 && dragObj.currentTouchCol >= 0 && dragObj.currentTouchCol < 7) {
        const direct = this.getBackpackItemAt(dragObj.currentTouchRow, dragObj.currentTouchCol);
        if (direct && direct.uid !== movingItem.uid && direct.type === movingItem.type && direct.tier === movingItem.tier && direct.tier < 10) {
          directMergeTarget = direct;
        }
      }

      let allUnlocked = true;
      const occupiedItems = [];

      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const r = rootR + dr;
          const c = rootC + dc;
          if (r >= 7 || c >= 7) { allUnlocked = false; break; }
          const idx = r * 7 + c;
          if (!this.run.gridUnlocked[idx]) { allUnlocked = false; break; }

          const occ = this.getBackpackItemAt(r, c);
          if (occ && occ.uid !== movingItem.uid && !occupiedItems.includes(occ)) {
            occupiedItems.push(occ);
          }
        }
      }

      if (!directMergeTarget) {
        const matchOcc = occupiedItems.find(o => o.type === movingItem.type && o.tier === movingItem.tier && o.tier < 10);
        if (matchOcc) directMergeTarget = matchOcc;
      }

      if (directMergeTarget) {
        const tow = GEAR_TYPES[directMergeTarget.type]?.w || directMergeTarget.w || 1;
        const toh = GEAR_TYPES[directMergeTarget.type]?.h || directMergeTarget.h || 1;
        for (let dr = 0; dr < toh; dr++) {
          for (let dc = 0; dc < tow; dc++) {
            const cell = this.getBpCell(directMergeTarget.r + dr, directMergeTarget.c + dc);
            if (cell) cell.classList.add('highlight-merge');
          }
        }
        return;
      }

      let highlightClass = 'highlight-valid';
      if (!allUnlocked) {
        highlightClass = 'highlight-invalid';
      } else if (occupiedItems.length === 1) {
        highlightClass = 'highlight-valid'; // Swap is supported
      } else if (occupiedItems.length > 1) {
        highlightClass = 'highlight-invalid';
      }

      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const cell = this.getBpCell(rootR + dr, rootC + dc);
          if (cell) cell.classList.add(highlightClass);
        }
      }
    }
  }

  getStashSlotAtPoint(clientX, clientY) {
    if (!this.stashSlotsEls) return null;
    for (let i = 0; i < this.stashSlotsEls.length; i++) {
      const el = this.stashSlotsEls[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom
      ) {
        return i;
      }
    }
    return null;
  }

  handleDropToStash(targetSlotIdx, dragObj) {
    if (!this.run.stashUnlocked[targetSlotIdx]) {
      this.showToast('⚠️ Ô dự bị này đang bị khóa!');
      sfx.playTone(180, 'sawtooth', 0.12, 0.12);
      return;
    }

    if (dragObj.isLand) {
      this.showToast('⚠️ Mảnh đất chỉ có thể ghép vào vali, không thể lưu ở hàng chờ!');
      sfx.playTone(180, 'sawtooth', 0.12, 0.12);
      return;
    }

    const movingItem = dragObj.item;
    const existingStashItem = this.run.stashSlots[targetSlotIdx];

    // FIX LỖI: Thả lại chính ô dự bị của nó -> Huỷ drag an toàn, KHÔNG hợp nhất với chính mình!
    if (dragObj.source === 'stash' && dragObj.stashIndex === targetSlotIdx) {
      this.renderBackpack();
      return;
    }
    if (existingStashItem && movingItem.uid && existingStashItem.uid === movingItem.uid) {
      this.renderBackpack();
      return;
    }

    // Case 1: Drop on empty stash slot
    if (!existingStashItem) {
      this.run.stashSlots[targetSlotIdx] = {
        uid: movingItem.uid || ('stash_' + Math.random().toString(36).substr(2, 9)),
        type: movingItem.type,
        tier: movingItem.tier || 1
      };

      // Remove from source
      if (dragObj.source === 'backpack') {
        this.run.backpackItems = this.run.backpackItems.filter(x => x.uid !== movingItem.uid);
      } else if (dragObj.source === 'shop') {
        this.run.shopSlots[dragObj.slotIndex] = null;
      } else if (dragObj.source === 'stash') {
        this.run.stashSlots[dragObj.stashIndex] = null;
      }

      sfx.playTone(360, 'sine', 0.08, 0.1);
      this.showToast(`📥 Đã cất ${GEAR_TYPES[movingItem.type].name} ★${movingItem.tier || 1} vào Hàng Dự Bị #${targetSlotIdx + 1}`);
      this.renderBackpack();
      return;
    }

    // Case 2: Drop on existing stash item -> MERGE if same type & tier (và khác vật phẩm)!
    if (existingStashItem.type === movingItem.type && existingStashItem.tier === movingItem.tier && existingStashItem.tier < 10) {
      existingStashItem.tier++;
      if (dragObj.source === 'backpack') {
        this.run.backpackItems = this.run.backpackItems.filter(x => x.uid !== movingItem.uid);
      } else if (dragObj.source === 'shop') {
        this.run.shopSlots[dragObj.slotIndex] = null;
      } else if (dragObj.source === 'stash') {
        this.run.stashSlots[dragObj.stashIndex] = null;
      }
      sfx.merge();
      this.showToast(`✨ Hợp nhất ${GEAR_TYPES[existingStashItem.type].name} lên ★${existingStashItem.tier} tại Hàng Dự Bị!`);
      this.renderBackpack();
      return;
    }

    // Case 3: Swap if dragging between 2 stash slots
    if (dragObj.source === 'stash' && dragObj.stashIndex !== undefined) {
      const srcIdx = dragObj.stashIndex;
      const temp = this.run.stashSlots[targetSlotIdx];
      this.run.stashSlots[targetSlotIdx] = this.run.stashSlots[srcIdx];
      this.run.stashSlots[srcIdx] = temp;
      sfx.playTone(360, 'sine', 0.08, 0.1);
      this.showToast(`🔄 Đã hoán đổi vị trí Ô #${srcIdx + 1} và Ô #${targetSlotIdx + 1}!`);
      this.renderBackpack();
      return;
    }

    this.showToast('⚠️ Ô dự bị này đã có trang bị khác loại! Hãy chọn ô trống.');
    sfx.playTone(180, 'sawtooth', 0.12, 0.12);
  }

  // --- DROP & MOVE / MERGE / SWAP LOGIC ---
  // --- AIRTIGHT BACKPACK DROP & MOVE / MERGE / SWAP (KHÔNG BAO GIỜ BỊ ĐÈ Ô - YÊU CẦU 2 & 5) ---
  handleDropToBackpack(rootR, rootC, dragObj) {
    const w = dragObj.w;
    const h = dragObj.h;

    // A. LAND TILE PLACEMENT (CHO PHÉP GHÉP DỄ DÀNG, KHÔNG BỊ TỪ CHỐI KHI ĐÈ Ô ĐÃ MỞ - YÊU CẦU 5)
    if (dragObj.isLand) {
      let withinBounds = true;
      let hasAdj = false;
      let newlyUnlockedCount = 0;

      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const r = rootR + dr;
          const c = rootC + dc;
          if (r < 0 || r >= 7 || c < 0 || c >= 7) {
            withinBounds = false;
            break;
          }
          const idx = r * 7 + c;
          if (!this.run.gridUnlocked[idx]) {
            newlyUnlockedCount++;
          }
          // Kiểm tra tiếp giáp với bất kỳ ô nào đã mở
          const nbs = [(r - 1) * 7 + c, (r + 1) * 7 + c, r * 7 + (c - 1), r * 7 + (c + 1)];
          if (nbs.some(n => n >= 0 && n < 49 && this.run.gridUnlocked[n])) {
            hasAdj = true;
          }
        }
        if (!withinBounds) break;
      }

      if (withinBounds && hasAdj && newlyUnlockedCount > 0) {
        for (let dr = 0; dr < h; dr++) {
          for (let dc = 0; dc < w; dc++) {
            this.run.gridUnlocked[(rootR + dr) * 7 + (rootC + dc)] = true;
          }
        }
        if (dragObj.source === 'shop') {
          const sIdx = dragObj.slotIndex !== undefined ? dragObj.slotIndex : (dragObj.item?.slotIndex ?? 0);
          this.run.shopSlots[sIdx] = null;
        }
        sfx.merge();
        this.showToast(`🗺️ Đã mở rộng thêm +${newlyUnlockedCount} ô vali!`);
        this.renderBackpack();
      } else {
        this.showToast('⚠️ Mảnh đất phải nằm trọn trong bảng 7x7 và kết nối với ô đã mở!');
        sfx.playTone(180, 'sawtooth', 0.12, 0.12);
      }
      return;
    }

    // B. WEAPON / GEAR PLACEMENT WITH SMART DIRECT MERGE
    const movingItem = dragObj.item;

    // --- ƯU TIÊN SỐ 1: GHÉP SAO THÔNG MINH (SMART DIRECT MERGE) ---
    // Người chơi chạm/thả trực tiếp hoặc chạm mép vào trang bị cùng loại & cùng sao -> Hợp nhất ngay!
    let mergeTarget = null;

    if (dragObj.touchRow >= 0 && dragObj.touchRow < 7 && dragObj.touchCol >= 0 && dragObj.touchCol < 7) {
      const directItem = this.getBackpackItemAt(dragObj.touchRow, dragObj.touchCol);
      if (directItem && directItem.uid !== movingItem.uid && directItem.type === movingItem.type && directItem.tier === movingItem.tier && directItem.tier < 10) {
        mergeTarget = directItem;
      }
    }

    if (!mergeTarget) {
      for (const other of this.run.backpackItems) {
        if (other.uid === movingItem.uid) continue;
        if (other.type === movingItem.type && other.tier === movingItem.tier && other.tier < 10) {
          const ow = GEAR_TYPES[other.type]?.w || other.w || 1;
          const oh = GEAR_TYPES[other.type]?.h || other.h || 1;
          const overlaps = !(
            rootR + h <= other.r ||
            other.r + oh <= rootR ||
            rootC + w <= other.c ||
            other.c + ow <= rootC
          );
          if (overlaps) {
            mergeTarget = other;
            break;
          }
        }
      }
    }

    if (mergeTarget) {
      mergeTarget.tier++;
      if (dragObj.source === 'backpack') {
        this.run.backpackItems = this.run.backpackItems.filter(x => x.uid !== movingItem.uid);
      } else if (dragObj.source === 'shop') {
        const sIdx = dragObj.slotIndex !== undefined ? dragObj.slotIndex : (dragObj.item?.slotIndex ?? 0);
        this.run.shopSlots[sIdx] = null;
      } else if (dragObj.source === 'stash') {
        this.run.stashSlots[dragObj.stashIndex] = null;
      }
      sfx.merge();
      if (navigator.vibrate) { try { navigator.vibrate([40, 30, 60]); } catch(e){} }
      this.showToast(`✨ Hợp nhất  lên ★!`);
      if (this.gtutActive && (this.gtutStep === 3 || this.gtutStep === 4)) setTimeout(() => this.setGameplayTutorialStep(5), 100);
      this.renderBackpack();
      return;
    }

    // 1. Kiểm tra toàn bộ ô của vùng đặt mới: phải nằm trong 0..6 và ĐÃ MỞ KHÓA
    for (let dr = 0; dr < h; dr++) {
      for (let dc = 0; dc < w; dc++) {
        const r = rootR + dr;
        const c = rootC + dc;
        if (r < 0 || r >= 7 || c < 0 || c >= 7 || !this.run.gridUnlocked[r * 7 + c]) {
          this.showToast('⚠️ Vùng này chưa mở khóa ô hoặc nằm ngoài vali!');
          sfx.playTone(180, 'sawtooth', 0.12, 0.12);
          return;
        }
      }
    }

    // 2. Thu thập TẤT CẢ các trang bị xung đột tại vùng đặt mới (loại trừ chính movingItem nếu có)
    const conflictingItems = [];
    for (const other of this.run.backpackItems) {
      if (dragObj.source === 'backpack' && other.uid === movingItem.uid) continue;
      const ow = GEAR_TYPES[other.type]?.w || other.w || 1;
      const oh = GEAR_TYPES[other.type]?.h || other.h || 1;

      // Kiểm tra giao nhau giữa 2 hình chữ nhật
      const overlaps = !(
        rootR + h <= other.r ||
        other.r + oh <= rootR ||
        rootC + w <= other.c ||
        other.c + ow <= rootC
      );

      if (overlaps && !conflictingItems.includes(other)) {
        conflictingItems.push(other);
      }
    }

    // TRƯỜNG HỢP 1: Hoàn toàn không vướng trang bị nào -> Đặt mới hoặc Dời ô an toàn
    if (conflictingItems.length === 0) {
      if (dragObj.source === 'backpack') {
        movingItem.r = rootR;
        movingItem.c = rootC;
        movingItem.w = w;
        movingItem.h = h;
      } else {
        // Deploy from shop or stash
        this.run.backpackItems.push({
          uid: movingItem.uid || ('bp_' + Math.random().toString(36).substr(2, 9)),
          type: movingItem.type,
          tier: movingItem.tier || 1,
          r: rootR,
          c: rootC,
          w: w,
          h: h,
          lastShotTime: 0
        });

        if (dragObj.source === 'shop') {
          const sIdx = dragObj.slotIndex !== undefined ? dragObj.slotIndex : (dragObj.item?.slotIndex ?? 0);
          this.run.shopSlots[sIdx] = null;
        } else if (dragObj.source === 'stash') {
          this.run.stashSlots[dragObj.stashIndex] = null;
        }
      }

      sfx.playTone(350, 'sine', 0.08, 0.1);
      if (this.gtutActive && this.gtutStep === 3) setTimeout(() => this.setGameplayTutorialStep(4), 100);
      this.renderBackpack();
      return;
    }

    // TRƯỜNG HỢP 2: Va chạm ĐÚNG 1 trang bị -> Xét Ghép Sao (Merge) hoặc Hoán Đổi (Swap)
    if (conflictingItems.length === 1) {
      const targetItem = conflictingItems[0];

      // A. MERGE: Cùng loại + Cùng cấp sao -> Lên sao!
      if (targetItem.type === movingItem.type && targetItem.tier === movingItem.tier && targetItem.tier < 10) {
        targetItem.tier++;
        if (dragObj.source === 'backpack') {
          this.run.backpackItems = this.run.backpackItems.filter(x => x.uid !== movingItem.uid);
        } else if (dragObj.source === 'shop') {
          const sIdx = dragObj.slotIndex !== undefined ? dragObj.slotIndex : (dragObj.item?.slotIndex ?? 0);
          this.run.shopSlots[sIdx] = null;
        } else if (dragObj.source === 'stash') {
          this.run.stashSlots[dragObj.stashIndex] = null;
        }
        sfx.merge();
        this.showToast(`✨ Hợp nhất ${GEAR_TYPES[targetItem.type].name} lên ★${targetItem.tier}!`);
        this.renderBackpack();
        return;
      }

      // B. SWAP: Chỉ cho phép giữa 2 trang bị ĐÃ Ở TRONG VALI (nghiêm cấm từ shop/stash đè lên)
      if (dragObj.source === 'backpack') {
        const oldR = movingItem.r;
        const oldC = movingItem.c;
        const targetW = GEAR_TYPES[targetItem.type]?.w || targetItem.w || 1;
        const targetH = GEAR_TYPES[targetItem.type]?.h || targetItem.h || 1;

        // B1: targetItem chuyển về (oldR, oldC) có nằm trong ô đã mở không?
        let targetFitsOld = true;
        for (let dr = 0; dr < targetH; dr++) {
          for (let dc = 0; dc < targetW; dc++) {
            const r = oldR + dr;
            const c = oldC + dc;
            if (r < 0 || r >= 7 || c < 0 || c >= 7 || !this.run.gridUnlocked[r * 7 + c]) {
              targetFitsOld = false;
              break;
            }
          }
          if (!targetFitsOld) break;
        }

        // B2: targetItem tại (oldR, oldC) có đè lên trang bị thứ 3 nào không?
        if (targetFitsOld) {
          for (const other of this.run.backpackItems) {
            if (other.uid === movingItem.uid || other.uid === targetItem.uid) continue;
            const ow = GEAR_TYPES[other.type]?.w || other.w || 1;
            const oh = GEAR_TYPES[other.type]?.h || other.h || 1;
            if (!(oldR + targetH <= other.r || other.r + oh <= oldR || oldC + targetW <= other.c || other.c + ow <= oldC)) {
              targetFitsOld = false;
              break;
            }
          }
        }

        // B3: movingItem tại (rootR, rootC) và targetItem tại (oldR, oldC) có bị dính nhau không?
        if (targetFitsOld) {
          const directCollision = !(
            rootR + h <= oldR ||
            oldR + targetH <= rootR ||
            rootC + w <= oldC ||
            oldC + targetW <= rootC
          );
          if (directCollision) {
            targetFitsOld = false;
          }
        }

        if (targetFitsOld) {
          movingItem.r = rootR;
          movingItem.c = rootC;
          movingItem.w = w;
          movingItem.h = h;
          targetItem.r = oldR;
          targetItem.c = oldC;
          targetItem.w = targetW;
          targetItem.h = targetH;
          sfx.playTone(380, 'sine', 0.08, 0.1);
          this.renderBackpack();
          return;
        } else {
          this.showToast('⚠️ Không thể hoán đổi: Vướng trang bị khác hoặc lệch kích thước ô!');
          sfx.playTone(180, 'sawtooth', 0.12, 0.12);
          return;
        }
      } else {
        this.showToast('⚠️ Vị trí này đã có trang bị! Hãy kéo vào ô trống hoặc ghép cùng loại.');
        sfx.playTone(180, 'sawtooth', 0.12, 0.12);
        return;
      }
    }

    // TRƯỜNG HỢP 3: Va chạm nhiều hơn 1 trang bị -> DỨT KHOÁT TỪ CHỐI ĐỂ KHÔNG BAO GIỜ BỊ ĐÈ Ô
    this.showToast('⚠️ Vị trí này vướng nhiều trang bị khác, không thể đặt!');
    sfx.playTone(180, 'sawtooth', 0.12, 0.12);
  }

    // HỆ THỐNG BÁN TRANG BỊ: BÁN ĐƯỢC TỪ VALI VÀ TỪ SHOP VỚI GIÁ TĂNG THEO TIER (YÊU CẦU 2 & 4)
  handleSell() {
    if (!this.dragItem) return;
    const dragObj = this.dragItem;
    const movingItem = dragObj.item;

    if (dragObj.source === 'backpack') {
      if (this.run.hardcoreMode) {
        this.showToast('🚫 Chế độ Hardcore: Không thể bán trang bị trong vali!');
        sfx.playTone(180, 'sawtooth', 0.15, 0.15);
        return;
      }
      const sellPrice = this.run.calculateSellPrice(movingItem);
      this.run.backpackItems = this.run.backpackItems.filter(x => x.uid !== movingItem.uid);
      this.run.runCash += sellPrice;
      sfx.coin();
      const gName = GEAR_TYPES[movingItem.type]?.name || 'Trang bị';
      this.showToast(`[Đã Bán] ${gName} ★${movingItem.tier || 1} từ vali: +${sellPrice} $`);
      this.renderBackpack();
      this.updateBackpackUI();
      return;
    }

    if (dragObj.source === 'shop' || dragObj.source === 'stash') {
      const sellPrice = this.run.calculateSellPrice(movingItem);
      if (dragObj.source === 'shop') {
        const sIdx = dragObj.slotIndex !== undefined ? dragObj.slotIndex : (dragObj.item?.slotIndex ?? 0);
        this.run.shopSlots[sIdx] = null;
      } else {
        this.run.stashSlots[dragObj.stashIndex] = null;
      }
      this.run.runCash += sellPrice;
      sfx.coin();
      const gName = movingItem.isLand ? movingItem.name : (GEAR_TYPES[movingItem.type]?.name || 'Trang bị');
      this.showToast(`[Đã Bán] ${gName} ${movingItem.tier ? `★` + movingItem.tier : ''}: +${sellPrice} $`);
      this.renderBackpack();
      this.updateBackpackUI();
    }
  }

  getBackpackItemAt(r, c) {
    return this.run.backpackItems.find(w => {
      const gDef = GEAR_TYPES[w.type];
      const iw = gDef ? gDef.w : (w.w || 1);
      const ih = gDef ? gDef.h : (w.h || 1);
      return r >= w.r && r < w.r + ih && c >= w.c && c < w.c + iw;
    });
  }

  getBpCell(r, c) {
    return this.gridCellsLayer.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  }

  clearBackpackHighlights() {
    this.gridCellsLayer.querySelectorAll('.bp-cell').forEach(c => {
      c.classList.remove('highlight-valid', 'highlight-invalid', 'highlight-merge', 'highlight-land');
    });
  }

  updateBackpackUI() {
    this.run.recalculateStats();
    document.getElementById('backpack-wave-num').textContent = this.run.wave;
    document.getElementById('bp-shield-text').textContent = `${Math.ceil(this.run.shield)} / ${this.run.maxShield}`;
    document.getElementById('bp-hp-text').textContent = `${Math.ceil(this.run.hp)} / ${this.run.maxHp}`;
    document.getElementById('bp-shield-fill').style.width = `${Math.max(0, (this.run.shield / this.run.maxShield) * 100)}%`;
    document.getElementById('bp-hp-fill').style.width = `${Math.max(0, (this.run.hp / this.run.maxHp) * 100)}%`;
    document.getElementById('refresh-cost').textContent = this.run.refreshCost;
    document.getElementById('player-cash').textContent = `${this.run.runCash} $`;

    // YÊU CẦU 1: Cập nhật nhãn nút Fight nếu đang tạm dừng giữa ván
    const fightBtnTitle = document.querySelector('.btn-fight-title');
    if (fightBtnTitle) {
      fightBtnTitle.textContent = this.isAdjustingMidWave ? 'Tiếp Tục (Resume)' : 'Fight';
    }
  }

  updateSpeedUI() {
    const btnSpeedX1 = document.getElementById('btn-speed-x1');
    const btnSpeedX3 = document.getElementById('btn-speed-x3');
    const btnSpeedX5 = document.getElementById('btn-speed-x5');
    if (!btnSpeedX1 || !btnSpeedX3 || !btnSpeedX5) return;

    // Reset trạng thái nút active theo speed hiện tại của run
    [btnSpeedX1, btnSpeedX3, btnSpeedX5].forEach(b => b.classList.remove('active'));
    if (this.run.speed === 1) btnSpeedX1.classList.add('active');
    else if (this.run.speed === 2) btnSpeedX3.classList.add('active');
    else if (this.run.speed === 3) btnSpeedX5.classList.add('active');

    // Quản lý icon QC và trạng thái khóa của Tốc độ x3 (KHÔNG BAO GIỜ DÙNG .remove() ĐỂ TRÁNH MẤT ICON KHI QUA MÀN)
    let tagX3 = document.getElementById('tag-speed-x3');
    if (!tagX3) {
      tagX3 = document.createElement('span');
      tagX3.className = 'speed-ad-tag';
      tagX3.id = 'tag-speed-x3';
      tagX3.innerHTML = '<img src="assets/icons/ad_tv.png" class="pixel-mini-icon" alt="">';
      btnSpeedX3.appendChild(tagX3);
    }
    if (this.run.unlockedSpeedX3) {
      tagX3.style.display = 'none';
      btnSpeedX3.classList.remove('locked');
    } else {
      tagX3.style.display = 'inline-flex';
      btnSpeedX3.classList.add('locked');
    }

    // Quản lý icon QC và trạng thái khóa của Tốc độ x5 (KHÔNG BAO GIỜ DÙNG .remove() ĐỂ TRÁNH MẤT ICON KHI QUA MÀN)
    let tagX5 = document.getElementById('tag-speed-x5');
    if (!tagX5) {
      tagX5 = document.createElement('span');
      tagX5.className = 'speed-ad-tag';
      tagX5.id = 'tag-speed-x5';
      tagX5.innerHTML = '<img src="assets/icons/ad_tv.png" class="pixel-mini-icon" alt="">';
      btnSpeedX5.appendChild(tagX5);
    }
    if (this.run.unlockedSpeedX5) {
      tagX5.style.display = 'none';
      btnSpeedX5.classList.remove('locked');
    } else {
      tagX5.style.display = 'inline-flex';
      btnSpeedX5.classList.add('locked');
    }
  }

  renderBattleUI() {
    this.run.recalculateStats();
    this.updateSpeedUI();
    document.getElementById('battle-wave-num').textContent = this.run.wave;
    const curScoreEl = document.getElementById('current-score-text');
    if (curScoreEl) curScoreEl.textContent = (this.run.currentScore || 0).toLocaleString();
    document.getElementById('high-score-text').textContent = this.meta.highScore.toLocaleString();
    document.getElementById('battle-shield-text').textContent = `${Math.ceil(this.run.shield)} / ${this.run.maxShield}`;
    document.getElementById('battle-hp-text').textContent = `${Math.ceil(this.run.hp)} / ${this.run.maxHp}`;
    document.getElementById('battle-shield-fill').style.width = `${Math.max(0, (this.run.shield / this.run.maxShield) * 100)}%`;
    document.getElementById('battle-hp-fill').style.width = `${Math.max(0, (this.run.hp / this.run.maxHp) * 100)}%`;

    // Bottom Quick Rack: Grouped compact display (⚔️ x3, 🛡️ x2...)
    const rack = document.getElementById('battle-quick-rack');
    rack.innerHTML = '';

    // Group by type, track max tier per group
    const groups = {};
    this.run.backpackItems.forEach(item => {
      const key = item.type;
      if (!groups[key]) groups[key] = { type: key, count: 0, maxTier: 0 };
      groups[key].count++;
      groups[key].maxTier = Math.max(groups[key].maxTier, item.tier || 1);
    });

    // Category icons for compact display
    const catIcon = {
      weapon: '⚔️', defense: '🛡️', obstacle: '🚧', support: '💪', utility: '💳'
    };

    Object.values(groups).forEach(g => {
      const cfg = ADMIN_GEAR_CONFIG[g.type];
      const slot = document.createElement('div');
      slot.className = 'quick-rack-slot quick-rack-grouped';
      const tierStr = g.maxTier > 1 ? `<span style="color:#fbbf24;font-size:7px;font-weight:900;">★${g.maxTier}</span>` : '';
      const countStr = g.count > 1 ? `<span style="color:#38bdf8;font-size:7px;font-weight:900;">×${g.count}</span>` : '';
      slot.innerHTML = `
        <div style="width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
          ${getGearSVG(g.type, g.maxTier, false)}
        </div>
        <div style="display:flex;gap:1px;align-items:center;justify-content:center;">
          ${tierStr}${countStr}
        </div>
      `;
      slot.title = `${cfg ? cfg.name : g.type} (${g.count} cái, ★${g.maxTier})`;
      rack.appendChild(slot);
    });
  }

  // TỔNG HỢP TOÀN BỘ KỸ NĂNG, BUFF VÀ THÔNG SỐ TRANG BỊ CHO MENU PAUSE
  renderPauseMenu() {
    const weaponsContainer = document.getElementById('pause-weapons-summary');
    if (weaponsContainer) {
      weaponsContainer.innerHTML = '';
      if (!this.run.backpackItems || this.run.backpackItems.length === 0) {
        weaponsContainer.innerHTML = '<div style="color:#64748b; font-size:11px; text-align:center; padding:8px;">Vali đang trống, chưa có trang bị nào.</div>';
      } else {
        // Tính belt buff adjacency
        const getBeltBuff = (item) => {
          let beltBuff = 1;
          this.run.backpackItems.forEach(other => {
            if (other.type === 'belt') {
              const isAdj = Math.abs(other.r - item.r) <= 1 && Math.abs(other.c - item.c) <= 1;
              if (isAdj) beltBuff += 0.12;
            }
          });
          return beltBuff;
        };

        this.run.backpackItems.forEach(item => {
          const gInfo = GEAR_TYPES[item.type];
          const cfg = ADMIN_GEAR_CONFIG[item.type];
          if (!gInfo || !cfg) return;
          const tier = item.tier || 1;
          const lvl = this.run.meta.weaponLevels[item.type] || 1;
          const card = document.createElement('div');
          card.className = 'pause-stat-item';

          let badges = '';
          const critPct = Math.round(this.run.perkMultipliers.allCrit * 100);

          if (cfg.category === 'weapon' && cfg.baseDmg > 0) {
            // Vũ khí: tính DPS thực tế
            const beltBuff = getBeltBuff(item);
            let dmg = cfg.baseDmg * Math.pow(1.6, tier - 1) * (1 + (lvl - 1) * 0.2) * beltBuff;
            if (item.type === 'laser') dmg *= this.run.perkMultipliers.laserDmg;
            if (item.type === 'dagger') dmg *= this.run.perkMultipliers.daggerDmg;
            if (item.type === 'molotov') dmg *= this.run.perkMultipliers.molotovDmg;
            if (item.type === 'firearm') {
              const fmDmg = this.run.perkMultipliers.firearmDmg || 1;
              dmg *= fmDmg;
            }
            let rate = Math.max(0.22, cfg.rate / (1 + (tier - 1) * 0.15 + (lvl - 1) * 0.08));
            if (item.type === 'firearm') rate /= (this.run.perkMultipliers.firearmRate || 1);
            const dps = (dmg / rate).toFixed(0);
            badges += `<span class="p-chip-dmg">STK: ${Math.round(dmg)}</span>`;
            badges += `<span class="p-chip-sub">DPS: ${dps}/s</span>`;
            if (critPct > 0) badges += `<span class="p-chip-sub" style="color:#f59e0b;">Crit: ${critPct}% (x2.5)</span>`;
            if (item.type === 'molotov') {
              const aoeR = 45 + (tier - 1) * 14 + (lvl - 1) * 6;
              badges += `<span class="p-chip-sub" style="color:#ef4444;">AoE: ${aoeR}px</span>`;
            }
            if (item.type === 'firearm' && this.run.perkMultipliers.firearmMultishot > 0) {
              badges += `<span class="p-chip-sub" style="color:#a855f7;">+${this.run.perkMultipliers.firearmMultishot} viên</span>`;
            }
          } else if (cfg.category === 'defense') {
            // Giáp: HP/Shield bonus + regen
            const shieldBonus = cfg.shieldBonus ? cfg.shieldBonus + (tier - 1) * 20 : 0;
            const reflPct = cfg.reflection ? Math.round((cfg.reflection + (tier - 1) * 0.15) * 100) : 0;
            if (item.type === 'vest') {
              const regenHp = (1.5 + (tier - 1) * 0.8 + (lvl - 1) * 0.5).toFixed(1);
              badges += `<span class="p-chip-dmg" style="color:#10b981;background:rgba(16,185,129,0.15);">HP hồi: +${regenHp}/s</span>`;
              if (reflPct > 0) badges += `<span class="p-chip-sub" style="color:#f59e0b;">Phản đòn: ${reflPct}%</span>`;
            } else if (item.type === 'shield') {
              const regenShield = (2.5 + (tier - 1) * 1.2 + (lvl - 1) * 0.8).toFixed(1);
              badges += `<span class="p-chip-dmg" style="color:#38bdf8;background:rgba(56,189,248,0.15);">Khiên hồi: +${regenShield}/s</span>`;
              if (shieldBonus > 0) badges += `<span class="p-chip-sub">+${shieldBonus} Khiên Tối Đa</span>`;
            }
          } else if (cfg.category === 'obstacle') {
            // Rào: % làm chậm thực tế
            const bSlow = Math.min(50, Math.round((0.20 + (tier - 1) * 0.05 + this.run.perkMultipliers.barrierSlow) * 100));
            const barrierCount = this.run.backpackItems.filter(i => i.type === 'barrier').length;
            let compoundSlow = 1.0;
            this.run.backpackItems.filter(i => i.type === 'barrier').forEach(b => {
              const bs = Math.min(0.50, 0.20 + (b.tier - 1) * 0.05 + (this.run.perkMultipliers.barrierSlow || 0));
              compoundSlow *= (1 - bs);
            });
            const totalSlow = Math.round((1 - compoundSlow) * 100);
            badges += `<span class="p-chip-dmg" style="color:#f59e0b;background:rgba(245,158,11,0.15);">Chậm: -${bSlow}%/cây</span>`;
            if (barrierCount > 1) badges += `<span class="p-chip-sub" style="color:#fbbf24;">Tổng cộng dồn: -${totalSlow}%</span>`;
          } else if (cfg.category === 'support') {
            // Belt: buff vũ khí kề
            const beltBonus = Math.round((0.12 + (this.run.perkMultipliers.beltBuffBonus || 0)) * 100);
            badges += `<span class="p-chip-dmg" style="color:#ef4444;background:rgba(239,68,68,0.15);">+${beltBonus}% ATK vũ khí kề</span>`;
          } else if (cfg.category === 'utility') {
            // Card: tự động rút tiền mỗi 1 giây
            const metaCardLvl = (this.run.meta && this.run.meta.weaponLevels['card']) || 1;
            const cardMult = this.run.perkMultipliers.cardIncome || 1;
            const cashRate = Math.round(tier * (1 + (metaCardLvl - 1) * 0.2) * cardMult);
            badges += `<span class="p-chip-dmg" style="color:#a855f7;background:rgba(168,85,247,0.15);">+${cashRate} $/s</span>`;
            badges += `<span class="p-chip-sub">+${15 + (metaCardLvl - 1) * 5} $/wave</span>`;
          }

          const catLabel = {
            'weapon': '⚔️ Vũ Khí', 'defense': '🛡️ Giáp', 'obstacle': '🚧 Rào Chắn',
            'support': '💪 Hỗ Trợ', 'utility': '💳 Tiện Ích'
          }[cfg.category] || cfg.category;

          card.innerHTML = `
            <div class="p-stat-main">
              <div class="p-stat-icon">${getGearSVG(item.type, tier, false)}</div>
              <div class="p-stat-info">
                <span class="p-stat-name">${gInfo.name} ★${tier}</span>
                <span class="p-stat-desc" style="color:#94a3b8;font-size:9px;">${catLabel} • Lv.${lvl} nền</span>
              </div>
            </div>
            <div class="p-stat-badges" style="flex-wrap:wrap;gap:3px;">${badges}</div>
          `;
          weaponsContainer.appendChild(card);
        });

        // Tổng quan cuối danh sách
        const totalWeapons = this.run.backpackItems.filter(i => ADMIN_GEAR_CONFIG[i.type]?.category === 'weapon');
        if (totalWeapons.length > 0) {
          const summaryDiv = document.createElement('div');
          summaryDiv.style.cssText = 'border-top:1px solid #334155;margin-top:6px;padding-top:6px;';
          const critPct = Math.round(this.run.perkMultipliers.allCrit * 100);
          const totalHp = this.run.maxHp + this.run.maxShield;
          summaryDiv.innerHTML = `
            <div style="display:flex;gap:6px;flex-wrap:wrap;font-size:9px;">
              <span style="background:#1e293b;color:#38bdf8;padding:2px 6px;border-radius:4px;border:1px solid #334155;">❤️ HP: ${this.run.hp.toFixed(0)}/${this.run.maxHp}</span>
              <span style="background:#1e293b;color:#06b6d4;padding:2px 6px;border-radius:4px;border:1px solid #334155;">🛡️ Khiên: ${this.run.shield.toFixed(0)}/${this.run.maxShield}</span>
              <span style="background:#1e293b;color:#fbbf24;padding:2px 6px;border-radius:4px;border:1px solid #334155;">★ Lv: ${this.run.inWaveLevel}</span>
              ${critPct > 0 ? `<span style="background:#1e293b;color:#f59e0b;padding:2px 6px;border-radius:4px;border:1px solid #334155;">🎯 Crit: ${critPct}%</span>` : ''}
            </div>
          `;
          weaponsContainer.appendChild(summaryDiv);
        }
      }
    }

    const perksContainer = document.getElementById('pause-perks-summary');
    if (perksContainer) {
      perksContainer.innerHTML = '';
      const activePerks = this.run.perks || this.run.activePerks || [];
      if (!activePerks || activePerks.length === 0) {
        perksContainer.innerHTML = '<div style="color:#64748b; font-size:11px; text-align:center; padding:8px;">Chưa chọn buff nào trong chiến dịch này.</div>';
      } else {
        activePerks.forEach(p => {
          const rMeta = PERK_RARITIES[p.rarity] || PERK_RARITIES.common;
          const item = document.createElement('div');
          item.className = 'pause-stat-item';
          item.innerHTML = `
            <div class="p-stat-main">
              <div class="p-stat-icon" style="font-size:16px;">${p.icon || '★'}</div>
              <div class="p-stat-info">
                <span class="p-stat-name" style="color:${rMeta.color};">${p.title}</span>
                <span class="p-stat-desc" style="font-size:9px;color:#94a3b8;">${p.desc}</span>
              </div>
            </div>
          `;
          perksContainer.appendChild(item);
        });
      }
    }
  }

  onWaveClear() {
    this.isAdjustingMidWave = false;
    const raidBar = document.getElementById('boss-raid-bar');
    if (raidBar) raidBar.classList.add('hidden');

    sfx.victory();
    const completedWave = this.run.wave;
    this.run.wave++;

    // YÊU CẦU 3: Giảm lạm phát tiền roll qua từng wave (Wave 1: 10$, Wave 2: 12$, Wave 3: 14$...)
    let waveReward = 8 + completedWave * 2;
    const isBossWave = (completedWave % 5 === 0);
    let bossBonus = 0;
    if (isBossWave) {
      bossBonus = 15; // Thưởng Boss cố định +15$, không lạm phát hàng trăm dollar
      waveReward += bossBonus;
    }
    const bonusWaveCash = (this.run.perkMultipliers && this.run.perkMultipliers.cardWaveBonus) || 0;
    // Thẻ ATM chỉ thưởng thụ động vừa phải theo Wave: mỗi thẻ +2$
    const cardItems = this.run.backpackItems ? this.run.backpackItems.filter(i => i.type === 'card') : [];
    const cardBonus = cardItems.reduce((sum, c) => sum + Math.max(2, (c.tier || 1) * 2), 0);
    const totalCashAward = waveReward + bonusWaveCash + cardBonus;

    this.run.runCash += totalCashAward;

    if (isBossWave) {
      this.showToast(`CHIẾN CÔNG BOSS WAVE ${completedWave}! Nhận: +${totalCashAward} $ (Gồm +${bossBonus} $ Thưởng Lũy Tiến Boss)`);
    } else {
      this.showToast(`Hoàn thành Wave ${completedWave}! Thưởng: +${totalCashAward} $ (Money)`);
    }

    if (this.run.wave > this.meta.maxWave) {
      this.meta.maxWave = this.run.wave;
    }
    if (this.run.currentScore > this.meta.highScore) {
      this.meta.highScore = this.run.currentScore;
    }

    // Auto-discover / unlock Boss traits when reaching their wave milestone
    BOSS_LIST.forEach(b => {
      if (this.run.wave >= b.unlockWave) {
        if (this.meta.unlockBossTrait(b.id)) {
          this.showToast(`🔓 Đã giải mã bí mật nội tại của ${b.name}!`);
        }
      }
    });

        // YÊU CẦU 6: Mở khóa trang bị mới theo màn chơi
    // Màn 1 Wave 10: Mở khóa Nỏ (bow) và Rào chắn (barrier)
    if (this.run.wave >= 10 && !this.meta.isGearUnlocked('bow')) {
      this.meta.unlockGear('bow');
      this.meta.unlockGear('barrier');
      this.showToast('🎉 ĐẠT WAVE 10: ĐÃ MỞ KHÓA [Cung Nỏ Săn Bắn] & [Rào Chắn]!');
    }
    // Màn 2 (Wave 15): Mở khóa Hộ thuẫn (shield) & Áo giáp (vest)
    if (this.run.wave >= 15 && !this.meta.isGearUnlocked('shield')) {
      this.meta.unlockGear('shield');
      this.meta.unlockGear('vest');
      this.showToast('🎉 PHÁ ĐẢO MÀN 1: ĐÃ MỞ KHÓA [Hộ Thuẫn] & [Áo Giáp Chống Đạn]!');
    }
    // Tiêu diệt Boss hoặc Màn cao hơn: Mở khóa Laser & Thắt lưng
    if ((this.meta.bossKills || 0) >= 2 && !this.meta.isGearUnlocked('laser')) {
      this.meta.unlockGear('laser');
      this.meta.unlockGear('belt');
      this.showToast('🎉 CHIẾN CÔNG 2 BOSS: ĐÃ MỞ KHÓA [Pháo Laser] & [Thắt Lưng Đạn]!');
    }

    this.meta.save();

    const curStage = (this.meta && this.meta.selectedStage ? this.meta.selectedStage : 1);
    const stageConfig = BOSS_LIST.find(b => b.stage === curStage) || BOSS_LIST[0];
    const isStageCleared = (completedWave >= stageConfig.bossWave);

    if (isStageCleared) {
      // 1. Mở khóa màn chơi tiếp theo (Màn 1 -> Màn 2 -> Màn 3...)
      if (curStage < 5) {
        this.meta.unlockedStage = Math.max(this.meta.unlockedStage || 1, curStage + 1);
      }

      // 2. Mở khóa trang bị chiến công của màn này
      const stageUnlocks = STAGE_GEAR_UNLOCKS[curStage] || [];
      const newUnlocked = [];
      stageUnlocks.forEach(g => {
        if (!this.meta.unlockedGears.includes(g.id)) {
          this.meta.unlockedGears.push(g.id);
          newUnlocked.push(g);
        }
      });

      if (!this.meta.clearedStages) this.meta.clearedStages = [];
      const isFirstClear = !this.meta.clearedStages.includes(curStage);
      if (isFirstClear) {
        this.meta.clearedStages.push(curStage);
      }
      this.meta.save();

      // Hiển thị Pop-up Mở Khóa Trang Bị Mới
      this.showGearUnlockModal(stageUnlocks, curStage);
    } else {
      this.showView('backpack');
    }
  }

  
  showGearUnlockModal(gears, stageNum) {
    const modal = document.getElementById('modal-gear-unlock');
    if (!modal) {
      this.showVictoryModal();
      return;
    }

    const curStage = stageNum || (this.meta && this.meta.selectedStage ? this.meta.selectedStage : 1);
    const stageConfig = BOSS_LIST.find(b => b.stage === curStage) || BOSS_LIST[0];

    const tagEl = document.getElementById('unlock-stage-tag');
    if (tagEl) {
      tagEl.textContent = 'CHIẾN THẮNG MÀN ' + curStage + ' - ' + stageConfig.name;
    }

    const listEl = document.getElementById('unlock-gears-list');
    if (listEl) {
      listEl.innerHTML = '';
      gears.forEach(g => {
        const card = document.createElement('div');
        card.className = 'unlocked-gear-card';
        const iconPath = getGearIconPath(g.id, 1);
        const catMap = {
          weapon: 'Vũ Khí',
          defense: 'Phòng Thủ',
          support: 'Hỗ Trợ',
          obstacle: 'Chướng Ngại',
          utility: 'Tiện Ích'
        };
        const catName = catMap[g.category] || 'Trang Bị';
        card.innerHTML = `
          <div class="unlocked-gear-icon-wrap">
            <img src="${iconPath}" alt="${g.name}">
          </div>
          <div class="unlocked-gear-info">
            <div class="unlocked-gear-name-row">
              <span class="unlocked-gear-name">${g.name}</span>
              <span class="unlocked-gear-category-badge">${catName}</span>
            </div>
            <div class="unlocked-gear-desc">${g.desc}</div>
            <div class="unlocked-gear-tag">★ Cấp Độ 1 (Sẵn sàng ra trận & nâng cấp)</div>
          </div>
        `;
        listEl.appendChild(card);
      });
    }

    // Nút Trang bị ngay vào vali
    const btnEquip = document.getElementById('btn-equip-unlocked-gear');
    if (btnEquip) {
      btnEquip.onclick = () => {
        gears.forEach(g => {
          if (!this.meta.equippedLoadout.includes(g.id)) {
            if (this.meta.equippedLoadout.length < this.meta.getMaxLoadoutSlots()) {
              this.meta.equippedLoadout.push(g.id);
            }
          }
          if (this.run && this.run.stashItems) {
            const emptyIdx = this.run.stashItems.findIndex(s => s === null);
            if (emptyIdx !== -1) {
              const def = ADMIN_GEAR_CONFIG[g.id] || { w: 1, h: 1 };
              this.run.stashItems[emptyIdx] = {
                type: g.id,
                tier: 1,
                w: def.w || 1,
                h: def.h || 1
              };
            }
          }
        });
        this.meta.save();
        modal.classList.add('hidden');
        this.showToast('✅ Đã thêm trang bị mới vào Bộ Trang Bị & Hàng Chờ!');
        this.showVictoryModal();
      };
    }

    // Nút Xác nhận & tiếp tục
    const btnClose = document.getElementById('btn-close-gear-unlock');
    if (btnClose) {
      btnClose.onclick = () => {
        modal.classList.add('hidden');
        this.showVictoryModal();
      };
    }

    sfx.victory();
    modal.classList.remove('hidden');
  }

  showVictoryModal() {
    const raidBar = document.getElementById('boss-raid-bar');
    if (raidBar) raidBar.classList.add('hidden');

    this.modalVictory.classList.remove('hidden');
    document.getElementById('v-max-wave').textContent = this.meta.maxWave;
    document.getElementById('v-cur-wave').textContent = Math.max(1, this.run.wave - 1);

    const waveFactor = Math.max(1, this.run.wave - 1);
    const gearList = ['dagger', 'laser', 'firearm', 'belt', 'vest', 'shield', 'molotov', 'barrier'];
    const dropped = gearList.map(id => {
      const base = 15 + Math.floor(waveFactor * 6);
      const rand = Math.floor(Math.random() * 8);
      return { id, qty: base + rand };
    });

    this._pendingVictoryRewards = dropped;
    this._pendingVictoryCash = 150 + waveFactor * 25;
    this._renderVictoryRewardsGrid(dropped);
  }

  _renderVictoryRewardsGrid(dropped, multiplier = 1) {
    const rewardsGrid = document.getElementById('victory-rewards-grid');
    rewardsGrid.innerHTML = '';
    dropped.forEach(d => {
      const slot = document.createElement('div');
      slot.className = 'reward-slot';
      slot.innerHTML = `
        <div class="reward-slot-icon" style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          ${getGearSVG(d.id, 1, false)}
        </div>
        <div class="reward-slot-qty">x${d.qty * multiplier} ${multiplier > 1 ? '<span style="color:#22c55e;">(x2)</span>' : ''}</div>
      `;
      rewardsGrid.appendChild(slot);
    });
  }

  claimVictoryRewards(multiplier = 1) {
    if (this._pendingVictoryRewards) {
      this._pendingVictoryRewards.forEach(d => {
        this.meta.materials[d.id] = (this.meta.materials[d.id] || 0) + (d.qty * multiplier);
      });
      const cashGain = (this._pendingVictoryCash || 150) * multiplier;
      this.meta.cash += cashGain;
      this.meta.save();
      sfx.victory();
      this.showToast(`🎉 Đã nhận +${cashGain} $ và toàn bộ Mảnh Nguyên Liệu!`);
      this._pendingVictoryRewards = null;
    }
    this.modalVictory.classList.add('hidden');
    this.isAdjustingMidWave = false;
    this._isDefeatModalActive = false;

    // Reset hoàn toàn trận đấu khi kết thúc ván thắng
    this.run = new InRunState(this.meta);
    this.battle.state = this.run;
    this.battle.enemies = [];
    this.battle.bossBullets = [];
    this.battle.projectiles = [];
    this.battle.laserBeams = [];
    this.battle.fireZones = [];
    this.battle.molotovLobs = [];
    this.battle.bossSpawnedThisWave = false;
    this.battle.waveCleared = false;
    this.showView('lobby');
    setTimeout(() => this.startGameplayTutorial(false), 800);
  }

  onDefeat(isBossBreach = false) {
    if (this._isDefeatModalActive) return; // Tránh gọi lặp nhiều lần mỗi frame
    this._isDefeatModalActive = true;
    this.isAdjustingMidWave = false;
    this.battle.state.isPaused = true;
    this.battle.state.isGameOver = true;
    this.battle.enemies = [];
    this.battle.bossBullets = [];
    const raidBar = document.getElementById('boss-raid-bar');
    if (raidBar) raidBar.classList.add('hidden');

    if (isBossBreach) {
      // YÊU CẦU: Khi Boss cuối tiến thẳng tới thanh máu của nhân vật chính -> THUA LUÔN, không cho hồi sinh, trừ 40% nguyên liệu!
      this.modalRevive.classList.add('hidden');
      this.showDefeatModal(true);
    } else if (!this.run.reviveUsed) {
      this.modalRevive.classList.remove('hidden');
    } else {
      this.showDefeatModal(false);
    }
  }

  showDefeatModal(isBossBreach = false) {
    const raidBar = document.getElementById('boss-raid-bar');
    if (raidBar) raidBar.classList.add('hidden');

    this.modalDefeat.classList.remove('hidden');
    document.getElementById('d-max-wave').textContent = this.meta.maxWave;
    document.getElementById('d-cur-wave').textContent = this.run.wave;

    const waveFactor = Math.max(1, this.run.wave);
    const gearList = ['dagger', 'laser', 'firearm', 'belt', 'vest', 'shield', 'molotov', 'barrier'];
    
    // Nếu bị boss cuối phá hủy căn cứ: Trừ 40% nguyên liệu rơi (hệ số 0.6)
    const penaltyRate = isBossBreach ? 0.6 : 1.0;
    const dropped = gearList.map(id => {
      const base = 8 + Math.floor(waveFactor * 3.5);
      const rand = Math.floor(Math.random() * 5);
      return { id, qty: Math.max(1, Math.floor((base + rand) * penaltyRate)) };
    });

    this._pendingDefeatRewards = dropped;
    this._pendingDefeatCash = Math.floor((30 + waveFactor * 10) * penaltyRate);
    this._renderDefeatRewardsGrid(dropped);

    const bannerTitle = document.querySelector('.defeat-banner-title');
    if (bannerTitle) {
      if (isBossBreach) {
        bannerTitle.innerHTML = '💀 SIÊU TRÙM ĐÃ ĐỘT PHÁ CĂN CỨ!<br><span style="font-size:11px;color:#fca5a5;font-weight:700;">(Thua cuộc - Bị trừ 40% nguyên liệu)</span>';
      } else {
        bannerTitle.textContent = 'CHIẾN DỊCH THẤT BẠI';
      }
    }
  }

  _renderDefeatRewardsGrid(dropped, multiplier = 1) {
    const rewardsGrid = document.getElementById('defeat-rewards-grid');
    rewardsGrid.innerHTML = '';
    dropped.forEach(d => {
      const slot = document.createElement('div');
      slot.className = 'reward-slot';
      slot.innerHTML = `
        <div class="reward-slot-icon" style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          ${getGearSVG(d.id, 1, false)}
        </div>
        <div class="reward-slot-qty">x${d.qty * multiplier} ${multiplier > 1 ? '<span style="color:#22c55e;">(x2)</span>' : ''}</div>
      `;
      rewardsGrid.appendChild(slot);
    });
  }

  claimDefeatRewards(multiplier = 1) {
    if (this._pendingDefeatRewards) {
      this._pendingDefeatRewards.forEach(d => {
        this.meta.materials[d.id] = (this.meta.materials[d.id] || 0) + (d.qty * multiplier);
      });
      const cashGain = (this._pendingDefeatCash || 30) * multiplier;
      this.meta.cash += cashGain;
      this.meta.save();
      sfx.coin();
      this.showToast(`🎁 Đã thu hoạch +${cashGain} $ và các Mảnh Nguyên Liệu chiến dịch!`);
      this._pendingDefeatRewards = null;
    }
    this.modalDefeat.classList.add('hidden');
    this.modalRevive.classList.add('hidden');
    this._isDefeatModalActive = false;
    this.isAdjustingMidWave = false;

    // Reset hoàn toàn trận đấu khi kết thúc ván thua
    this.run = new InRunState(this.meta);
    this.battle.state = this.run;
    this.battle.enemies = [];
    this.battle.bossBullets = [];
    this.battle.projectiles = [];
    this.battle.laserBeams = [];
    this.battle.fireZones = [];
    this.battle.molotovLobs = [];
    this.battle.bossSpawnedThisWave = false;
    this.battle.waveCleared = false;
    this.showView('lobby');
  }

  // --- HỖ TRỢ ĐÈ CẢM ỨNG / ĐÈ CHUỘT VÀ KÉO ĐỂ DỜI VALI TỰ DO (YÊU CẦU MỚI) ---
  setupSuitcaseTouchDrag() {
    const board = this.backpackGridBoard;
    if (!board) return;

    board.addEventListener('pointerdown', (e) => {
      // Nếu click hoặc chạm trúng thẻ trang bị, để thẻ trang bị xử lý drag & drop
      if (e.target.closest('.bp-item-card')) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const startX = e.clientX;
      const startY = e.clientY;
      let lastX = startX;
      let lastY = startY;
      let isDraggingSuitcase = false;

      const rect = board.getBoundingClientRect();
      const stepX = Math.max(20, (rect.width / 7) * 0.55);
      const stepY = Math.max(20, (rect.height / 7) * 0.55);

      const onPointerMove = (moveEvt) => {
        const totalDist = Math.hypot(moveEvt.clientX - startX, moveEvt.clientY - startY);
        if (!isDraggingSuitcase && totalDist > 6) {
          isDraggingSuitcase = true;
          board.style.cursor = 'grabbing';
        }

        if (!isDraggingSuitcase) return;

        const dx = moveEvt.clientX - lastX;
        const dy = moveEvt.clientY - lastY;

        if (Math.abs(dx) >= stepX) {
          const dCol = dx > 0 ? 1 : -1;
          if (this.run.shiftSuitcase(0, dCol)) {
            sfx.playTone(380, 'sine', 0.04, 0.06);
            this.renderBackpack();
          }
          lastX = moveEvt.clientX;
        }

        if (Math.abs(dy) >= stepY) {
          const dRow = dy > 0 ? 1 : -1;
          if (this.run.shiftSuitcase(dRow, 0)) {
            sfx.playTone(380, 'sine', 0.04, 0.06);
            this.renderBackpack();
          }
          lastY = moveEvt.clientY;
        }
      };

      const onPointerUp = () => {
        board.style.cursor = '';
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });
  }

  // CHỨC NĂNG XEM QUẢNG CÁO TỰ ĐỘNG TẠM DỪNG TRẬN ĐẤU & TIẾP TỤC SAU KHI XONG
  playRewardedAd(onReward) {
    const wasPaused = (this.battle && this.battle.state) ? this.battle.state.isPaused : false;
    if (this.battle && this.battle.state) {
      this.battle.state.isPaused = true;
    }

    if (this.modalAd) this.modalAd.classList.remove('hidden');
    let timer = 4;
    const timerEl = document.getElementById('ad-timer');
    if (timerEl) timerEl.textContent = `Đóng sau ${timer}s`;

    const iv = setInterval(() => {
      timer--;
      if (timer > 0) {
        if (timerEl) timerEl.textContent = `Đóng sau ${timer}s`;
      } else {
        clearInterval(iv);
        if (this.modalAd) this.modalAd.classList.add('hidden');
        if (this.battle && this.battle.state) {
          this.battle.state.isPaused = wasPaused;
        }
        if (onReward) onReward();
      }
    }, 1000);
  }

  bindEvents() {
    // Đã đóng gói hoàn tất - nút dev reset đã được gỡ bỏ

    // --- TÍNH NĂNG MÃ LƯU TIẾN TRÌNH (SAVE CODE CHO WEB / GITHUB PAGES) ---
    const modalSaveCode = document.getElementById('modal-save-code');
    const btnSaveCodeTop = document.getElementById('btn-save-code');
    const btnCloseSaveCode = document.getElementById('btn-close-save-code');
    const txtExportSave = document.getElementById('txt-export-save-code');
    const txtImportSave = document.getElementById('txt-import-save-code');
    const btnCopySaveCode = document.getElementById('btn-copy-save-code');
    const btnApplySaveCode = document.getElementById('btn-apply-save-code');

    const openSaveCodeModal = () => {
      sfx.playTone(400, 'sine', 0.05, 0.08);
      if (txtExportSave) {
        txtExportSave.value = this.meta.generateSaveCode();
      }
      if (txtImportSave) txtImportSave.value = '';
      if (modalSaveCode) modalSaveCode.classList.remove('hidden');
    };

    if (btnSaveCodeTop) btnSaveCodeTop.onclick = openSaveCodeModal;
    if (btnCloseSaveCode) {
      btnCloseSaveCode.onclick = () => {
        if (modalSaveCode) modalSaveCode.classList.add('hidden');
      };
    }

    // Nút Lưu Tiến Độ trong Menu Pause cũng mở bảng Mã Lưu
    const btnPauseSaveProgress = document.getElementById('btn-pause-save');
    if (btnPauseSaveProgress) {
      btnPauseSaveProgress.onclick = () => {
        this.meta.save();
        openSaveCodeModal();
        this.showToast('💾 Đã lưu dữ liệu! Bạn có thể sao chép Mã Lưu để dùng trên thiết bị khác.');
      };
    }

    if (btnCopySaveCode) {
      btnCopySaveCode.onclick = async () => {
        const codeToCopy = txtExportSave ? txtExportSave.value : this.meta.generateSaveCode();
        if (txtExportSave) {
          txtExportSave.focus();
          txtExportSave.select();
        }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(codeToCopy);
          } else {
            document.execCommand('copy');
          }
          sfx.coin();
          this.showToast('📋 ĐÃ SAO CHÉP MÃ LƯU VÀO CLIPBOARD! Hãy dán vào ghi chú hoặc gửi sang máy khác.');
        } catch (err) {
          this.showToast('⚠️ Hãy bôi đen và nhấn Ctrl+C để sao chép mã!');
        }
      };
    }

    if (btnApplySaveCode) {
      btnApplySaveCode.onclick = () => {
        const inputCode = txtImportSave ? txtImportSave.value : '';
        if (!inputCode.trim()) {
          this.showToast('⚠️ Vui lòng dán mã tiến trình vào ô trước khi nạp!');
          return;
        }
        const res = this.meta.loadFromSaveCode(inputCode);
        if (res.success) {
          sfx.victory();
          this.showToast('🎉 ' + res.msg);
          this.renderLobby();
          if (this.renderLobbyArsenal) this.renderLobbyArsenal();
          if (this.renderGiantBoss) this.renderGiantBoss();
          if (modalSaveCode) modalSaveCode.classList.add('hidden');
        } else {
          sfx.playTone(180, 'sawtooth', 0.15, 0.2);
          this.showToast('⚠️ ' + res.msg);
        }
      };
    }

    // Package reset UI removed

    // Toggle Hardcore / Normal Mode in Lobby (YÊU CẦU 3)
    if (this.btnLobbyMode) {
      this.btnLobbyMode.onclick = () => {
        this.meta.gameMode = (this.meta.gameMode === 'normal') ? 'hardcore' : 'normal';
        this.meta.save();
        this.renderLobby();
        sfx.playTone(420, 'sine', 0.08, 0.1);
        if (this.meta.gameMode === 'hardcore') {
          this.showToast('Đã chọn Chế độ Hardcore: Khóa bán trang bị từ vali!');
        } else {
          this.showToast('Đã chọn Chế độ Thường: Cho phép bán trang bị trong vali!');
        }
      };
    }

    // 4 Shift Buttons (⬅️ ⬆️ ⬇️ ➡️ Dời vali tự do - YÊU CẦU 5)
    if (this.btnShiftLeft) {
      this.btnShiftLeft.onclick = () => {
        if (this.run.shiftSuitcase(0, -1)) {
          sfx.playTone(380, 'sine', 0.05, 0.08);
          this.renderBackpack();
        } else {
          this.showToast('⚠️ Không thể dời sang trái nữa (chạm mép)!');
        }
      };
    }
    if (this.btnShiftRight) {
      this.btnShiftRight.onclick = () => {
        if (this.run.shiftSuitcase(0, 1)) {
          sfx.playTone(380, 'sine', 0.05, 0.08);
          this.renderBackpack();
        } else {
          this.showToast('⚠️ Không thể dời sang phải nữa (chạm mép)!');
        }
      };
    }
    if (this.btnShiftUp) {
      this.btnShiftUp.onclick = () => {
        if (this.run.shiftSuitcase(-1, 0)) {
          sfx.playTone(380, 'sine', 0.05, 0.08);
          this.renderBackpack();
        } else {
          this.showToast('⚠️ Không thể dời lên trên nữa (chạm mép)!');
        }
      };
    }
    if (this.btnShiftDown) {
      this.btnShiftDown.onclick = () => {
        if (this.run.shiftSuitcase(1, 0)) {
          sfx.playTone(380, 'sine', 0.05, 0.08);
          this.renderBackpack();
        } else {
          this.showToast('⚠️ Không thể dời xuống dưới nữa (chạm mép)!');
        }
      };
    }

    // Enter Run from Lobby
    document.getElementById('btn-enter-run').onclick = () => {
      if (this.meta.energy < 5) {
        this.showToast('⚠️ Không đủ năng lượng! Hãy nạp thêm hoặc đợi hồi phục.');
        return;
      }
      if (!this.meta.equippedLoadout || this.meta.equippedLoadout.length === 0) {
        this.showToast('⚠️ Hãy chọn ít nhất 1 trang bị vào Bộ Trang Bị trước khi ra trận!');
        return;
      }
      const raidBar = document.getElementById('boss-raid-bar');
      if (raidBar) raidBar.classList.add('hidden');
      this.meta.energy -= 5;
            this.run = new InRunState(this.meta);
      this.battle.state = this.run;
      this.showView('backpack');
      if (this.gtutActive && this.gtutStep === 1) {
        setTimeout(() => this.setGameplayTutorialStep(2), 350);
      }
    };

    // 4-Tab Bottom Navigation in Lobby (Battle, Equip, Club, Shop)
    this.navTabBtns.forEach(btn => {
      btn.onclick = () => {
        const targetTab = btn.dataset.tab;
        this.navTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.tabPanes.forEach(pane => pane.classList.remove('active'));
        const targetPane = document.getElementById(`lobby-tab-${targetTab}`);
        if (targetPane) targetPane.classList.add('active');

        if (targetTab === 'arsenal') this.renderLobbyArsenal();
        if (targetTab === 'battle') this.renderGiantBoss();
        if (targetTab === 'shop' && this.updateAdShopCooldowns) this.updateAdShopCooldowns();
        sfx.playTone(320, 'sine', 0.05, 0.08);
      };
    });

    // Giant Boss Carousel Switchers (◀ / ▶)
    const prevBossBtn = document.getElementById('btn-prev-boss');
    const nextBossBtn = document.getElementById('btn-next-boss');
    if (prevBossBtn) {
      prevBossBtn.onclick = () => {
        this.currentBossIndex = (this.currentBossIndex - 1 + BOSS_LIST.length) % BOSS_LIST.length;
        this.renderGiantBoss();
        sfx.playTone(350, 'sine', 0.06, 0.1);
      };
    }
    if (nextBossBtn) {
      nextBossBtn.onclick = () => {
        this.currentBossIndex = (this.currentBossIndex + 1) % BOSS_LIST.length;
        this.renderGiantBoss();
        sfx.playTone(350, 'sine', 0.06, 0.1);
      };
    }

    // BATTLE PASS MILESTONE BAR & MODAL
    const btnMilestone = document.getElementById('btn-open-milestone');
    if (btnMilestone) {
      btnMilestone.onclick = () => {
        this.openMilestonesModal();
      };
    }
    const btnCloseMilestone = document.getElementById('btn-close-milestones');
    if (btnCloseMilestone) {
      btnCloseMilestone.onclick = () => {
        document.getElementById('modal-milestones')?.classList.add('hidden');
      };
    }

    // CLUB LEADERBOARD WEEKLY CLAIM
    const btnWeeklyRank = document.getElementById('btn-claim-weekly-rank');
    if (btnWeeklyRank) {
      btnWeeklyRank.onclick = () => {
        if (!this.meta.claimedWeeklyRank) {
          this.meta.claimedWeeklyRank = true;
          this.meta.gems += 50;
          this.meta.cash += 1000;
          this.meta.save();
          sfx.victory();
          this.showToast('🎁 Đã nhận Thưởng Tuần: +50 Kim Cương & +1.000 Vàng!');
          this.renderRankTab();
          this.renderLobby();
        } else {
          this.showToast('ℹ️ Bạn đã nhận thưởng tuần này rồi! Vui lòng quay lại tuần sau.');
        }
      };
    }

        // BLACK MARKET MYSTERY CHESTS & FREE AD CHESTS
    this.showChestRewardModal = (chestName, chestIcon, lootList) => {
      const modal = document.getElementById('modal-chest-reward');
      if (!modal) return;
      
      const iconEl = document.getElementById('chest-reward-icon');
      if (iconEl) iconEl.src = chestIcon || 'assets/icons/chest_gold.png';
      
      const titleEl = document.getElementById('chest-reward-title');
      if (titleEl) titleEl.textContent = 'MỞ RƯƠNG THÀNH CÔNG!';
      
      const subEl = document.getElementById('chest-reward-sub');
      if (subEl) subEl.textContent = chestName.toUpperCase();

      const itemsContainer = document.getElementById('chest-reward-items');
      if (itemsContainer) {
        itemsContainer.innerHTML = '';
        lootList.forEach(item => {
          const card = document.createElement('div');
          card.className = `loot-card-item ${item.isNew ? 'is-unlocked-new' : ''}`;
          
          let amountClass = 'loot-item-amount';
          if (item.type === 'cash') amountClass += ' gold-amount';
          if (item.type === 'gem') amountClass += ' gem-amount';

          card.innerHTML = `
            <img src="${item.icon}" class="loot-item-icon" alt="${item.name}">
            <div class="loot-item-info">
              <div class="loot-item-name">${item.name} ${item.isNew ? '<span style="color:#22c55e;font-size:10px;">★ MỚI</span>' : ''}</div>
              <div class="loot-item-sub">${item.sub || 'Nguyên liệu nâng cấp'}</div>
            </div>
            <div class="${amountClass}">${item.amount}</div>
          `;
          itemsContainer.appendChild(card);
        });
      }

      modal.classList.remove('hidden');
      sfx.victory();

      const btnClaim = document.getElementById('btn-claim-chest-reward');
      if (btnClaim) {
        btnClaim.onclick = () => {
          modal.classList.add('hidden');
          sfx.playTone(520, 'sine', 0.08, 0.1);
          this.renderLobby();
        };
      }
    };

    const openChest = (chestName, costType, costVal, minS, maxS, bonusWeapon = null, chestIcon = 'assets/icons/chest_wood.png') => {
      if (costType === 'cash' && this.meta.cash < costVal) {
        this.showToast(`Không đủ Vàng (Cần ${costVal} Vàng)!`);
        return;
      }
      if (costType === 'gem' && this.meta.gems < costVal) {
        this.showToast(`Không đủ Kim Cương (Cần ${costVal} Kim Cương)!`);
        return;
      }

      if (costType === 'cash') this.meta.cash -= costVal;
      else if (costType === 'gem') this.meta.gems -= costVal;

      const shards = Math.floor(minS + Math.random() * (maxS - minS + 1));
      const pool = Object.keys(ADMIN_GEAR_CONFIG);
      const chosen = bonusWeapon || pool[Math.floor(Math.random() * pool.length)];
      const gName = GEAR_TYPES[chosen]?.name || chosen;
      const gIcon = getGearIconPath(chosen, 1);

      this.meta.materials[chosen] = (this.meta.materials[chosen] || 0) + shards;
      const wasUnlocked = this.meta.isGearUnlocked(chosen);
      let unlockedNew = false;
      if (!wasUnlocked) {
        this.meta.unlockGear(chosen);
        unlockedNew = true;
      }
      this.meta.save();

      const lootList = [
        {
          name: gName,
          icon: gIcon,
          amount: `+${shards} Mảnh`,
          sub: unlockedNew ? 'Mở khóa vũ khí mới vào Vali!' : 'Dùng để tiến hóa cấp sao',
          isNew: unlockedNew
        }
      ];

      if (chestName.includes('Hoàng Kim')) {
        const bonusGems = 25;
        this.meta.gems += bonusGems;
        lootList.push({
          name: 'Kim Cương Bố Già',
          icon: 'assets/icons/gem.png',
          amount: `+${bonusGems} KC`,
          sub: 'Kho báu Hoàng Kim',
          type: 'gem'
        });
      } else if (chestName.includes('Bạc')) {
        const bonusCash = 300;
        this.meta.cash += bonusCash;
        lootList.push({
          name: 'Vàng Mafia Thưởng Thêm',
          icon: 'assets/icons/gold_coin.png',
          amount: `+${bonusCash}`,
          sub: 'Kho báu Bạc Tinh Anh',
          type: 'cash'
        });
      }

      this.meta.save();
      this.showChestRewardModal(chestName, chestIcon, lootList);
    };

    document.getElementById('btn-buy-wood-chest')?.addEventListener('click', () => {
      openChest('Hòm Gỗ Tiếp Tế', 'cash', 500, 10, 25, null, 'assets/icons/chest_wood.png');
    });

    document.getElementById('btn-buy-silver-coin')?.addEventListener('click', () => {
      openChest('Hòm Bạc Tinh Anh', 'cash', 1500, 35, 75, null, 'assets/icons/chest_silver.png');
    });

    document.getElementById('btn-buy-silver-gem')?.addEventListener('click', () => {
      openChest('Hòm Bạc Tinh Anh', 'gem', 25, 35, 75, null, 'assets/icons/chest_silver.png');
    });

    document.getElementById('btn-buy-gold-chest')?.addEventListener('click', () => {
      openChest('Hòm Hoàng Kim Bố Già', 'gem', 80, 80, 160, Math.random() < 0.6 ? 'bow' : null, 'assets/icons/chest_gold.png');
    });

        // Helper cập nhật đếm ngược hồi chiêu 5 phút xem QC nhận Quà trong Shop (Yêu cầu 2: Chuẩn xác 5 phút 300s)
    this.updateAdShopCooldowns = () => {
      const now = Date.now();
      const COOLDOWN_MS = 5 * 60 * 1000; // 5 phút = 300,000 ms

      // Nút Năng Lượng Miễn Phí
      const btnEnergy = document.getElementById('btn-ad-free-energy');
      if (btnEnergy) {
        const lastTime = this.meta.lastAdEnergyTime || 0;
        const elapsed = now - lastTime;
        if (elapsed < COOLDOWN_MS && lastTime > 0) {
          const remainMs = Math.max(0, COOLDOWN_MS - elapsed);
          const totalSec = Math.ceil(remainMs / 1000);
          const m = Math.floor(totalSec / 60);
          const s = String(totalSec % 60).padStart(2, '0');
          btnEnergy.disabled = true;
          btnEnergy.classList.add('ad-btn-disabled');
          btnEnergy.innerHTML = `<img src="assets/icons/ad_tv.png" class="pixel-mini-icon" alt=""> Chờ ${m}:${s} (+10 <img src="assets/icons/energy.png" class="pixel-mini-icon">)`;
        } else {
          btnEnergy.disabled = false;
          btnEnergy.classList.remove('ad-btn-disabled');
          btnEnergy.innerHTML = `<img src="assets/icons/ad_tv.png" class="pixel-mini-icon"> Xem QC (+10 <img src="assets/icons/energy.png" class="pixel-mini-icon">)`;
        }
      }

      // Nút Kim Cương Miễn Phí
      const btnGems = document.getElementById('btn-ad-free-gems');
      if (btnGems) {
        const lastTime = this.meta.lastAdGemTime || 0;
        const elapsed = now - lastTime;
        if (elapsed < COOLDOWN_MS && lastTime > 0) {
          const remainMs = Math.max(0, COOLDOWN_MS - elapsed);
          const totalSec = Math.ceil(remainMs / 1000);
          const m = Math.floor(totalSec / 60);
          const s = String(totalSec % 60).padStart(2, '0');
          btnGems.disabled = true;
          btnGems.classList.add('ad-btn-disabled');
          btnGems.innerHTML = `<img src="assets/icons/ad_tv.png" class="pixel-mini-icon" alt=""> Chờ ${m}:${s} (+10 <img src="assets/icons/gem.png" class="pixel-mini-icon">)`;
        } else {
          btnGems.disabled = false;
          btnGems.classList.remove('ad-btn-disabled');
          btnGems.innerHTML = `<img src="assets/icons/ad_tv.png" class="pixel-mini-icon"> Xem QC (+10 <img src="assets/icons/gem.png" class="pixel-mini-icon">)`;
        }
      }
    };

    // Gọi cập nhật ngay lập tức khi khởi tạo
    this.updateAdShopCooldowns();

    // Đếm ngược hồi chiêu định kỳ mỗi 1 giây
    setInterval(() => {
      if (this.updateAdShopCooldowns) this.updateAdShopCooldowns();
    }, 1000);

    document.getElementById('btn-ad-free-energy')?.addEventListener('click', () => {
      const COOLDOWN_MS = 5 * 60 * 1000;
      const lastTime = this.meta.lastAdEnergyTime || 0;
      const elapsed = Date.now() - lastTime;
      if (elapsed < COOLDOWN_MS && lastTime > 0) {
        const totalSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        const m = Math.floor(totalSec / 60);
        const s = String(totalSec % 60).padStart(2, '0');
        this.showToast(`Quảng cáo đang hồi chiêu! Vui lòng chờ ${m}:${s} nữa.`);
        return;
      }
      this.playRewardedAd(() => {
        this.meta.energy = Math.min(30, this.meta.energy + 10);
        this.meta.lastAdEnergyTime = Date.now();
        this.meta.save();
        sfx.victory();
        this.showToast('[Quảng Cáo] Nhận +10 Năng Lượng! Hồi chiêu 5 phút bắt đầu.');
        this.renderLobby();
        if (this.updateAdShopCooldowns) this.updateAdShopCooldowns();
      });
    });

    document.getElementById('btn-ad-free-gems')?.addEventListener('click', () => {
      const COOLDOWN_MS = 5 * 60 * 1000;
      const lastTime = this.meta.lastAdGemTime || 0;
      const elapsed = Date.now() - lastTime;
      if (elapsed < COOLDOWN_MS && lastTime > 0) {
        const totalSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        const m = Math.floor(totalSec / 60);
        const s = String(totalSec % 60).padStart(2, '0');
        this.showToast(`Quảng cáo đang hồi chiêu! Vui lòng chờ ${m}:${s} nữa.`);
        return;
      }
      this.playRewardedAd(() => {
        this.meta.gems += 10;
        this.meta.lastAdGemTime = Date.now();
        this.meta.save();
        sfx.victory();
        this.showToast('[Quảng Cáo] Nhận +10 Kim Cương! Hồi chiêu 5 phút bắt đầu.');
        this.renderLobby();
        if (this.updateAdShopCooldowns) this.updateAdShopCooldowns();
      });
    });



    // Roll 3 trang bị 1 lần (Tự động bán đồ cũ còn lại trong shop)
    document.getElementById('btn-refresh-shop').onclick = () => {
      sfx.init();
      if (!this.run.rollShop(true)) {
        this.showToast(`⚠️ Cần ${this.run.refreshCost} $ để Roll 3 trang bị!`);
      } else {
        sfx.coin();
        if (this.gtutActive && this.gtutStep === 2) {
          setTimeout(() => this.setGameplayTutorialStep(3), 250);
        }
        if (this.run._lastAutoSoldInfo) {
          this.showToast(`🔄 Tự động bán ${this.run._lastAutoSoldInfo.count} món cũ (+${this.run._lastAutoSoldInfo.cash} $) → Roll 3 món mới!`);
        }
        this.renderShopSlots();
        this.updateBackpackUI();
      }
    };

    // Fight button -> Enter Battle
    document.getElementById('btn-fight').onclick = () => {
      sfx.init();
      if (this.run.backpackItems.length === 0) {
        this.showToast('⚠️ Hãy kéo ít nhất 1 vũ khí vào vali trước khi Fight!');
        return;
      }
      this.showView('battle');
    };

    // Adjust Backpack from Battle (YÊU CẦU 1: Tạm dừng ván đấu, bấm Fight sẽ tiếp tục mà KHÔNG bị reset từ đầu)
    document.getElementById('btn-adjust-backpack').onclick = () => {
      sfx.init();
      if (this.battle.enemiesRemaining > 0 && this.battle.enemiesSpawned > 0) {
        this.isAdjustingMidWave = true;
        this.battle.state.isPaused = true;
        this.showToast('⏸️ Đã tạm dừng trận đấu! Hãy sắp xếp lại vali rồi bấm Tiếp Tục!');
      }
      this.showView('backpack');
    };

    // Speed toggles x1 / x3 / x5 (YÊU CẦU 6: x3 và x5 cần xem QC để mở khóa)
    const btnSpeedX1 = document.getElementById('btn-speed-x1');
    const btnSpeedX3 = document.getElementById('btn-speed-x3');
    const btnSpeedX5 = document.getElementById('btn-speed-x5');

    // updateSpeedUI() is now an official persistent AppController method

    if (btnSpeedX1) {
      btnSpeedX1.onclick = () => {
        this.run.speed = 1;
        this.updateSpeedUI();
      };
    }

    if (btnSpeedX3) {
      btnSpeedX3.onclick = () => {
        if (!this.run.unlockedSpeedX3) {
          this.playRewardedAd(() => {
            this.run.unlockedSpeedX3 = true;
            this.run.speed = 2; // x3 speed
            sfx.victory();
            this.showToast('[Tốc Độ] Đã kích hoạt Tốc độ x3 cho cả ván chơi!');
            this.updateSpeedUI();
          });
        } else {
          this.run.speed = 2;
          this.updateSpeedUI();
        }
      };
    }

    if (btnSpeedX5) {
      btnSpeedX5.onclick = () => {
        if (!this.run.unlockedSpeedX5) {
          if (!this.run.unlockedSpeedX3) {
            this.showToast('⚠️ Bạn phải mở khóa Tốc độ x3 trước khi mở x5!');
            return;
          }
          this.playRewardedAd(() => {
            this.run.unlockedSpeedX5 = true;
            this.run.speed = 3; // x5 speed
            sfx.victory();
            this.showToast('🔥 Đã mở khóa Siêu Tốc x5 cho cả ván chơi!');
            this.updateSpeedUI();
          });
        } else {
          this.run.speed = 3;
          this.updateSpeedUI();
        }
      };
    }

    // MENU PAUSE CHUYÊN NGHIỆP TRONG TRẬN ĐẤU (YÊU CẦU 10)
    const btnBattlePause = document.getElementById('btn-battle-pause');
    const btnClosePauseX = document.getElementById('btn-close-pause-x');
    const btnPauseResume = document.getElementById('btn-pause-resume');
    const btnPauseSave = document.getElementById('btn-pause-save');
    const btnPauseLobby = document.getElementById('btn-pause-lobby');
    const sliderPauseVol = document.getElementById('slider-pause-volume');
    const btnToggleVfx = document.getElementById('btn-toggle-vfx');

    const openPauseMenu = () => {
      sfx.init();
      this.battle.state.isPaused = true;
      this.renderPauseMenu();
      if (this.modalPause) this.modalPause.classList.remove('hidden');
    };

    const closePauseMenu = () => {
      if (this.modalPause) this.modalPause.classList.add('hidden');
      this.battle.state.isPaused = false;
      this.showToast('▶️ Tiếp tục trận đấu!');
    };

    if (btnBattlePause) btnBattlePause.onclick = openPauseMenu;
    if (btnClosePauseX) btnClosePauseX.onclick = closePauseMenu;
    if (btnPauseResume) btnPauseResume.onclick = closePauseMenu;

    if (sliderPauseVol) {
      sliderPauseVol.oninput = (e) => {
        const val = parseInt(e.target.value) || 0;
        sfx.volume = val / 100;
        const valBadge = document.getElementById('pause-volume-val');
        if (valBadge) valBadge.textContent = `${val}%`;
        const icon = document.getElementById('p-vol-icon');
        if (icon) icon.textContent = val === 0 ? '🔇' : (val < 50 ? '🔉' : '🔊');
        sfx.playTone(500, 'sine', 0.05, 0.1);
      };
    }

    if (btnToggleVfx) {
      btnToggleVfx.onclick = () => {
        this.isLowVFX = !this.isLowVFX;
        if (this.isLowVFX) {
          btnToggleVfx.className = 'btn-toggle-badge';
          btnToggleVfx.textContent = '★ Tiết Kiệm (Mượt)';
          this.showToast('Đã chuyển sang chế độ đồ họa Tiết Kiệm');
        } else {
          btnToggleVfx.className = 'btn-toggle-badge active';
          btnToggleVfx.textContent = '✨ Tối Đa (HD)';
          this.showToast('Đã kích hoạt hiệu ứng đồ họa Tối Đa HD');
        }
      };
    }

    if (btnPauseSave) {
      btnPauseSave.onclick = () => {
        try {
          const runSaveData = {
            wave: this.run.wave,
            hp: this.run.hp,
            maxHp: this.run.maxHp,
            shield: this.run.shield,
            maxShield: this.run.maxShield,
            currentScore: this.run.currentScore,
            runCash: this.run.runCash,
            speed: this.run.speed,
            unlockedSpeedX3: this.run.unlockedSpeedX3,
            unlockedSpeedX5: this.run.unlockedSpeedX5,
            inWaveLevel: this.run.inWaveLevel,
            inWaveExp: this.run.inWaveExp,
            expToNextLevel: this.run.expToNextLevel,
            backpackItems: this.run.backpackItems,
            unlockedBackpackCells: this.run.unlockedBackpackCells,
            activePerks: this.run.activePerks,
            perkMultipliers: this.run.perkMultipliers,
            savedAt: Date.now()
          };
          localStorage.setItem('idle_mafia_blackgold_run_save', JSON.stringify(runSaveData));
          this.meta.save();
          sfx.victory();
          this.showToast('💾 Đã lưu tiến độ ván đấu vào bộ nhớ máy!');
        } catch (e) {
          this.showToast('⚠️ Không thể lưu dữ liệu: ' + e.message);
        }
      };
    }

    if (btnPauseLobby) {
      btnPauseLobby.onclick = () => {
        if (confirm('Bạn có chắc muốn thoát ra Lobby? Toàn bộ nguyên liệu và tiền tích lũy đến hiện tại sẽ được bảo lưu!')) {
          this.battle.state.isPaused = false;
          if (this.modalPause) this.modalPause.classList.add('hidden');
          const raidBar = document.getElementById('boss-raid-bar');
          if (raidBar) raidBar.classList.add('hidden');
          this.meta.save();
          this.showToast('🚪 Đã trở về Lobby chính');
          this.showView('lobby');
        }
      };
    }

    // Buff list popup
    document.getElementById('btn-buff-list').onclick = () => {
      const container = document.getElementById('buff-items-container');
      container.innerHTML = '';
      const buffs = this.run.calculateBuffs();
      buffs.forEach(b => {
        const item = document.createElement('div');
        item.className = 'buff-card-item';
        item.innerHTML = `
          <div class="buff-card-icon">${b.icon}</div>
          <div class="buff-card-text">${b.text}</div>
        `;
        container.appendChild(item);
      });
      this.modalBuffs.classList.remove('hidden');
    };
    document.getElementById('btn-close-buffs').onclick = () => {
      this.modalBuffs.classList.add('hidden');
    };

    // Victory Claim & Ad Multiplier Buttons (YÊU CẦU MỚI)
    const btnVictoryAd = document.getElementById('btn-victory-ad');
    if (btnVictoryAd) {
      btnVictoryAd.onclick = () => {
        this.modalVictory.classList.add('hidden');
        this.modalAd.classList.remove('hidden');
        let timer = 4;
        const timerEl = document.getElementById('ad-timer');
        timerEl.textContent = `Đóng sau ${timer}s`;
        const iv = setInterval(() => {
          timer--;
          if (timer > 0) {
            timerEl.textContent = `Đóng sau ${timer}s`;
          } else {
            clearInterval(iv);
            this.modalAd.classList.add('hidden');
            this.claimVictoryRewards(2); // 2x Multiplier!
          }
        }, 1000);
      };
    }

    const btnVictoryOk = document.getElementById('btn-victory-ok');
    if (btnVictoryOk) {
      btnVictoryOk.onclick = () => {
        this.claimVictoryRewards(1);
      };
    }

    // Defeat Claim & Ad Multiplier Buttons (YÊU CẦU MỚI)
    const btnDefeatAd = document.getElementById('btn-defeat-ad');
    if (btnDefeatAd) {
      btnDefeatAd.onclick = () => {
        this.modalDefeat.classList.add('hidden');
        this.modalAd.classList.remove('hidden');
        let timer = 4;
        const timerEl = document.getElementById('ad-timer');
        timerEl.textContent = `Đóng sau ${timer}s`;
        const iv = setInterval(() => {
          timer--;
          if (timer > 0) {
            timerEl.textContent = `Đóng sau ${timer}s`;
          } else {
            clearInterval(iv);
            this.modalAd.classList.add('hidden');
            this.claimDefeatRewards(2); // 2x Multiplier!
          }
        }, 1000);
      };
    }

    const btnDefeatClaim = document.getElementById('btn-defeat-claim');
    if (btnDefeatClaim) {
      btnDefeatClaim.onclick = () => {
        this.claimDefeatRewards(1);
      };
    }

    // Sound toggle
    document.getElementById('btn-sound').onclick = () => {
      sfx.enabled = !sfx.enabled;
      const sndImg = document.getElementById('img-sound-icon');
      if (sndImg) sndImg.src = sfx.enabled ? 'assets/icons/sound_on.png' : 'assets/icons/sound_off.png';
    };

    // Watch Ad to Revive
    document.getElementById('btn-watch-ad').onclick = () => {
      this.modalRevive.classList.add('hidden');
      this.modalAd.classList.remove('hidden');
      let timer = 4;
      const timerEl = document.getElementById('ad-timer');
      timerEl.textContent = `Đóng sau ${timer}s`;
      const iv = setInterval(() => {
        timer--;
        if (timer > 0) {
          timerEl.textContent = `Đóng sau ${timer}s`;
        } else {
          clearInterval(iv);
          this.modalAd.classList.add('hidden');
          this._isDefeatModalActive = false;
          this.run.reviveUsed = true;
          this.run.isGameOver = false;
          this.run.isPaused = false;
          this.run.recalculateStats();
          this.run.hp = this.run.maxHp;
          this.run.shield = this.run.maxShield;
          this.battle.enemies = [];
          this.battle.bossBullets = [];
          sfx.victory();
          this.showToast('💖 Đã hồi sinh 100% Sinh lực & Khiên! Tiếp tục chiến đấu!');
          this.showView('battle');
        }
      }, 1000);
    };

    document.getElementById('btn-give-up').onclick = () => {
      this.modalRevive.classList.add('hidden');
      this.showDefeatModal(false); // Chuyển sang bảng tổng kết chiến lợi phẩm khi chết
    };
  }

  // ========================================================
  // INTERACTIVE IN-GAME GAMEPLAY TUTORIAL WALKTHROUGH
  // ========================================================
  startGameplayTutorial(force = false) {
    if (!force) {
      try {
        if (localStorage.getItem('desert_outpost_gameplay_tut_done') === 'true') return;
      } catch(e) {}
    }
    this.gtutActive = true;
    this.gtutStep = 1;
    const overlay = document.getElementById('gameplay-tutorial-overlay');
    if (overlay) overlay.classList.remove('hidden');

    const btnSkip = document.getElementById('btn-gtut-skip');
    if (btnSkip) {
      btnSkip.onclick = () => this.hideGameplayTutorial();
    }
    const btnAction = document.getElementById('btn-gtut-action');
    if (btnAction) {
      btnAction.onclick = () => {
        if (this.gtutStep === 1) {
          const btnEnter = document.getElementById('btn-enter-run');
          if (btnEnter) btnEnter.click();
        } else if (this.gtutStep === 2) {
          const btnRoll = document.getElementById('btn-refresh-shop');
          if (btnRoll) btnRoll.click();
        } else if (this.gtutStep === 3) {
          this.setGameplayTutorialStep(4);
        } else if (this.gtutStep === 4) {
          this.setGameplayTutorialStep(5);
        } else if (this.gtutStep === 5) {
          const btnFight = document.getElementById('btn-fight');
          if (btnFight) btnFight.click();
        } else if (this.gtutStep === 6) {
          this.hideGameplayTutorial();
        }
      };
    }

    if (!this._gtutResizeBound) {
      window.addEventListener('resize', () => {
        if (this.gtutActive) this.updateGameplayTutorialPosition();
      });
      this._gtutResizeBound = true;
    }

    this.setGameplayTutorialStep(1);
  }

  setGameplayTutorialStep(step) {
    if (!this.gtutActive) return;
    this.gtutStep = step;

    document.querySelectorAll('.tut-highlight-pulse').forEach(el => el.classList.remove('tut-highlight-pulse'));

    const stepTag = document.getElementById('gtut-step-tag');
    const stepText = document.getElementById('gtut-step-text');
    const btnAction = document.getElementById('btn-gtut-action');
    const hand = document.getElementById('tut-pointer-hand');

    if (hand) hand.classList.remove('hidden');

    let targetEl = null;

    if (step === 1) {
      if (stepTag) stepTag.textContent = typeof t === 'function' ? t('gtut.step1_tag', 'BƯỚC 1: XUẤT TRẬN') : 'BƯỚC 1: XUẤT TRẬN';
      if (stepText) stepText.textContent = typeof t === 'function' ? t('gtut.step1_text', '👉 Bấm [XUẤT TRẬN CHIẾN DỊCH] để vào vali và tiền đồn!') : '👉 Bấm [XUẤT TRẬN CHIẾN DỊCH] để vào vali và tiền đồn!';
      if (btnAction) {
        btnAction.classList.remove('hidden');
        btnAction.textContent = typeof t === 'function' ? t('gtut.next', 'Tiếp theo 👉') : 'Tiếp theo 👉';
      }
      targetEl = document.getElementById('btn-enter-run');
    } else if (step === 2) {
      if (stepTag) stepTag.textContent = typeof t === 'function' ? t('gtut.step2_tag', 'BƯỚC 2: ROLL VŨ KHÍ') : 'BƯỚC 2: ROLL VŨ KHÍ';
      if (stepText) stepText.textContent = typeof t === 'function' ? t('gtut.step2_text', '🎲 Bấm [Roll (3 Món)] để mua trang bị ngẫu nhiên!') : '🎲 Bấm [Roll (3 Món)] để mua trang bị ngẫu nhiên!';
      if (btnAction) {
        btnAction.classList.remove('hidden');
        btnAction.textContent = typeof t === 'function' ? t('gtut.next', 'Tiếp theo 👉') : 'Tiếp theo 👉';
      }
      targetEl = document.getElementById('btn-refresh-shop');
    } else if (step === 3) {
      if (stepTag) stepTag.textContent = typeof t === 'function' ? t('gtut.step3_tag', 'BƯỚC 3: XẾP VÀO VALI') : 'BƯỚC 3: XẾP VÀO VALI';
      if (stepText) stepText.textContent = typeof t === 'function' ? t('gtut.step3_text', '🖐️ Chạm & Kéo vũ khí từ Cửa Hàng thả vào ô sáng trong Vali!') : '🖐️ Chạm & Kéo vũ khí từ Cửa Hàng thả vào ô sáng trong Vali!';
      // ALWAYS provide 'Tiếp theo 👉' so user is never blocked!
      if (btnAction) {
        btnAction.classList.remove('hidden');
        btnAction.textContent = typeof t === 'function' ? t('gtut.next', 'Tiếp theo 👉') : 'Tiếp theo 👉';
      }
      targetEl = document.getElementById('shop-slot-0') || document.getElementById('shop-triple-slots-row');
    } else if (step === 4) {
      if (stepTag) stepTag.textContent = typeof t === 'function' ? t('gtut.step4_tag', 'BƯỚC 4: GHÉP & BÁN') : 'BƯỚC 4: GHÉP & BÁN';
      if (stepText) stepText.textContent = typeof t === 'function' ? t('gtut.step4_text', '⭐ Kéo 2 món CÙNG LOẠI & CÙNG SAO đè lên nhau để GHÉP! Hoặc kéo ô đỏ để BÁN (2$).') : '⭐ Kéo 2 món CÙNG LOẠI & CÙNG SAO đè lên nhau để GHÉP! Hoặc kéo ô đỏ để BÁN (2$).';
      if (btnAction) {
        btnAction.classList.remove('hidden');
        btnAction.textContent = typeof t === 'function' ? t('gtut.next', 'Tiếp theo 👉') : 'Tiếp theo 👉';
      }
      targetEl = document.getElementById('sell-drop-zone') || document.getElementById('backpack-grid-board');
    } else if (step === 5) {
      if (stepTag) stepTag.textContent = typeof t === 'function' ? t('gtut.step5_tag', 'BƯỚC 5: VÀO TRẬN') : 'BƯỚC 5: VÀO TRẬN';
      if (stepText) stepText.textContent = typeof t === 'function' ? t('gtut.step5_text', '⚔️ Đội hình sẵn sàng! Bấm [Xuất Trận] để bảo vệ tiền đồn!') : '⚔️ Đội hình sẵn sàng! Bấm [Xuất Trận] để bảo vệ tiền đồn!';
      if (btnAction) {
        btnAction.classList.remove('hidden');
        btnAction.textContent = typeof t === 'function' ? t('bp.btn_fight', 'Vào Trận 👉') : 'Vào Trận 👉';
      }
      targetEl = document.getElementById('btn-fight');
    } else if (step === 6) {
      if (stepTag) stepTag.textContent = typeof t === 'function' ? t('gtut.step6_tag', 'BƯỚC 6: CHIẾN ĐẤU') : 'BƯỚC 6: CHIẾN ĐẤU';
      if (stepText) stepText.textContent = typeof t === 'function' ? t('gtut.step6_text', '🔥 Vũ khí TỰ ĐỘNG BẮN! Tiêu diệt quái vật và hạ gục Boss Sa Mạc!') : '🔥 Vũ khí TỰ ĐỘNG BẮN! Tiêu diệt quái vật và hạ gục Boss Sa Mạc!';
      if (hand) hand.classList.add('hidden');
      if (btnAction) {
        btnAction.classList.remove('hidden');
        btnAction.textContent = typeof t === 'function' ? t('gtut.done', 'Hoàn tất 🎉') : 'Hoàn tất 🎉';
      }
      setTimeout(() => {
        if (this.gtutActive && this.gtutStep === 6) {
          this.hideGameplayTutorial();
        }
      }, 5000);
      return;
    }

    if (targetEl) {
      targetEl.classList.add('tut-highlight-pulse');
      this.positionHandOnElement(targetEl);
    }
  }

  positionHandOnElement(targetEl) {
    const hand = document.getElementById('tut-pointer-hand');
    if (!hand || !targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    // Use downward hand if target is in bottom half of viewport
    if (rect.top > window.innerHeight * 0.55) {
      hand.textContent = '👇';
      const x = rect.left + rect.width / 2 - 16;
      const y = rect.top - 38;
      hand.style.left = `${Math.max(10, Math.min(window.innerWidth - 40, x))}px`;
      hand.style.top = `${Math.max(60, y)}px`;
    } else {
      hand.textContent = '👆';
      const x = rect.left + rect.width / 2 - 16;
      const y = rect.bottom + 4;
      hand.style.left = `${Math.max(10, Math.min(window.innerWidth - 40, x))}px`;
      hand.style.top = `${Math.max(60, y)}px`;
    }
    hand.classList.remove('hidden');
  }

  updateGameplayTutorialPosition() {
    if (!this.gtutActive) return;
    let targetEl = null;
    if (this.gtutStep === 1) targetEl = document.getElementById('btn-enter-run');
    else if (this.gtutStep === 2) targetEl = document.getElementById('btn-refresh-shop');
    else if (this.gtutStep === 3) targetEl = document.getElementById('shop-slot-0') || document.getElementById('shop-triple-slots-row');
    else if (this.gtutStep === 4) targetEl = document.getElementById('sell-drop-zone') || document.getElementById('backpack-grid-board');
    else if (this.gtutStep === 5) targetEl = document.getElementById('btn-fight');
    if (targetEl) this.positionHandOnElement(targetEl);
  }

  hideGameplayTutorial() {
    this.gtutActive = false;
    document.querySelectorAll('.tut-highlight-pulse').forEach(el => el.classList.remove('tut-highlight-pulse'));
    const overlay = document.getElementById('gameplay-tutorial-overlay');
    if (overlay) overlay.classList.add('hidden');
    const hand = document.getElementById('tut-pointer-hand');
    if (hand) hand.classList.add('hidden');
    try {
      localStorage.setItem('desert_outpost_gameplay_tut_done', 'true');
    } catch(e) {}
  }

}

// ==========================================
// GAME INIT
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  window.gameApp = app;

  // Báo hiệu cho YouTube Playables SDK khung hình đầu tiên đã sẵn sàng (Tắt loading spinner)
  if (typeof window !== 'undefined' && window.ytgame && window.ytgame.game && typeof window.ytgame.game.firstFrameReady === 'function') {
    try {
      window.ytgame.game.firstFrameReady();
    } catch(e) {}
  }

  let lastTime = performance.now();
  function loop(currentTime) {
    if (!lastTime || !currentTime) lastTime = currentTime || performance.now();
    const dt = Math.max(0.001, Math.min(0.1, (currentTime - lastTime) / 1000 || 0.016));
    lastTime = currentTime;

    if (app.viewBattle.classList.contains('active')) {
      app.battle.update(dt);
      app.battle.render();

      document.getElementById('battle-shield-text').textContent = `${Math.ceil(app.run.shield)} / ${app.run.maxShield}`;
      document.getElementById('battle-hp-text').textContent = `${Math.ceil(app.run.hp)} / ${app.run.maxHp}`;
      document.getElementById('battle-shield-fill').style.width = `${Math.max(0, (app.run.shield / app.run.maxShield) * 100)}%`;
      document.getElementById('battle-hp-fill').style.width = `${Math.max(0, (app.run.hp / app.run.maxHp) * 100)}%`;
      const plannedLeft = Math.max(0, app.battle.totalWaveEnemies - app.battle.enemiesSpawned);
      const activeNonSummoned = app.battle.enemies.filter(e => !e.isSummoned).length;
      const enemiesLeft = Math.max(0, plannedLeft + activeNonSummoned);
      app.battle.enemiesRemaining = enemiesLeft;
      // FIX LỖI GIẬT THANH WAVE & SỐ ÂM: Không bao giờ âm, luôn đệm 2 chữ số (09, 08... 00)
      document.getElementById('battle-enemies-left').textContent = String(enemiesLeft).padStart(2, '0');

      const progressPct = Math.min(100, Math.max(0, ((app.battle.totalWaveEnemies - enemiesLeft) / app.battle.totalWaveEnemies) * 100));
      document.getElementById('battle-progress-fill').style.width = `${progressPct}%`;

      // Cập nhật Money trong ván thời gian thực (ví dụ nhận từ thẻ ATM)
      const cashEl = document.getElementById('player-cash');
      if (cashEl && app.run) cashEl.textContent = `${app.run.runCash} $`;

      // In-Wave EXP Bar & Level (Ảnh 3: Lv.58)
      const inwaveLvEl = document.getElementById('battle-inwave-lv');
      if (inwaveLvEl) inwaveLvEl.textContent = app.run.inWaveLevel;
      const expFillEl = document.getElementById('battle-exp-fill');
      if (expFillEl) {
        const expPct = Math.min(100, (app.run.inWaveExp / app.run.expToNextLevel) * 100);
        expFillEl.style.width = `${expPct}%`;
      }

      // Cập nhật điểm số Score thời gian thực & Kỷ Lục
      const scoreEl = document.getElementById('current-score-text');
      if (scoreEl) scoreEl.textContent = (app.run.currentScore || 0).toLocaleString();
      if (app.run.currentScore > app.meta.highScore) {
        app.meta.highScore = app.run.currentScore;
        const hiScoreEl = document.getElementById('high-score-text');
        if (hiScoreEl) hiScoreEl.textContent = app.meta.highScore.toLocaleString();
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
