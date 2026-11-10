/**
 * DESERT OUTPOST: MERGE DEFENSE - MULTI-LANGUAGE SYSTEM (i18n)
 * Supports: Tiếng Việt (vi) & English (en)
 */

const I18N = {
  vi: {
    // Top HUD
    'hud.gold': 'Vàng',
    'hud.gems': 'Kim Cương',
    'hud.energy': 'Năng Lượng',
    'hud.save_code': 'Mã Lưu',
    'hud.save_code_title': 'Sao Chép hoặc Nạp mã lưu tiến trình (Cloud Save Code)',
    'hud.pause': 'Tạm Dừng',
    'hud.sound': 'Bật/Tắt âm thanh',
    'hud.tutorial': 'Hướng Dẫn Tân Thủ',
    'hud.lang': 'Tiếng Việt',

    // Lobby
    'lobby.milestone_title': 'Cột Mốc Vượt Màn & Diệt Quái',
    'lobby.claim_reward': 'Nhận Quà',
    'lobby.season_title': 'Mùa 1: Sa Mạc Tử Thần',
    'lobby.boss_arena': 'TRÙM ĐẠI CHIẾN SA MẠC',
    'lobby.boss_trait': 'Đặc Điểm Boss',
    'lobby.boss_locked': 'Chưa Mở Khóa Màn Này',
    'lobby.boss_locked_desc': 'Vượt qua các màn trước để mở khóa trùm chiến này.',
    'lobby.record_wave': 'KỶ LỤC WAVE',
    'lobby.high_score': 'ĐIỂM CAO NHẤT',
    'lobby.mode_normal': 'Chế độ: Thường (Bán Vali)',
    'lobby.mode_hardcore': 'Hardcore (Cấm Bán Vali)',
    'lobby.btn_battle': 'VÀO CHIẾN DỊCH',
    'lobby.btn_battle_locked': 'CHƯA MỞ KHÓA',
    'lobby.cost_energy': 'Hao phí',

    // Nav Tabs
    'tab.battle': 'Chiến Trận',
    'tab.equip': 'Trang Bị',
    'tab.club': 'Bảng Xếp Hạng',
    'tab.shop': 'Chợ Đen',

    // Backpack View
    'bp.wave': 'Wave',
    'bp.shift_hint': 'Dời vali hoặc kéo tự do:',
    'bp.btn_left': 'Trái',
    'bp.btn_up': 'Lên',
    'bp.btn_down': 'Xuống',
    'bp.btn_right': 'Phải',
    'bp.stash_title': 'HÀNG DỰ BỊ (5 Ô LƯU TRỮ GHÉP SAO)',
    'bp.stash_hint': 'Ô 1 Miễn phí - Chạm ô khóa để mở',
    'bp.stash_empty': 'Trống',
    'bp.shop_title': 'VŨ KHÍ / MẢNH ĐẤT (3 Ô SHOP)',
    'bp.mode_normal': 'Chế Độ: Thường',
    'bp.mode_hardcore': 'Chế Độ: Hardcore',
    'bp.empty_slot': 'Trống / Đã Mua',
    'bp.sell_hint': 'Kéo trang bị vào đây để BÁN',
    'bp.sell_drop': 'Thả để BÁN',
    'bp.btn_roll': 'Roll (3 Món)',
    'bp.btn_fight': 'Xuất Trận',

    // Battle View
    'battle.wave': 'Wave',
    'battle.enemies_left': 'Quái còn lại:',
    'battle.score': 'Điểm:',
    'battle.speed': 'Tốc độ:',
    'battle.adjust': 'Chỉnh Vali',
    'battle.paused': 'ĐÃ TẠM DỪNG',
    'battle.resume': 'Tiếp Tục',

    // Leaderboard
    'lb.title': 'BẢNG XẾP HẠNG LIÊN MINH & MAFIA CLUB',
    'lb.subtitle': 'Điểm Kỷ Lục (Max Score) xác định Danh Vọng & Bậc Hạng Thế Giới Ngầm!',
    'lb.cur_rank': 'Hạng Hiện Tại:',
    'lb.max_score': 'Kỷ Lục Max Score:',
    'lb.max_stage': 'Màn Cao Nhất:',
    'lb.weekly_claim': '🎁 Nhận Thưởng Tuần (+50 Kim Cương & +1.000 Vàng)',
    'lb.weekly_claimed': '✅ Đã Nhận Thưởng Tuần Này',
    'lb.col_rank': 'HẠNG',
    'lb.col_user': 'TRÙM / LIÊN MINH',
    'lb.col_wave': 'MAX WAVE',
    'lb.col_score': 'MAX SCORE',

    // Gears
    'gear.bow.name': 'Nỏ Tác Chiến',
    'gear.bow.desc': 'Bắn mũi tên nỏ xuyên giáp và gây bạo kích cực lớn.',
    'gear.dagger.name': 'Dao Găm Mafia',
    'gear.dagger.desc': 'Tấn công nhanh, tỉa từng mục tiêu gần nhất.',
    'gear.firearm.name': 'Súng Lục Sa Mạc',
    'gear.firearm.desc': 'Nã từng phát đạn công phá uy lực cao.',
    'gear.laser.name': 'Pháo Laser Hạng Nặng',
    'gear.laser.desc': 'Bắn chùm tia Mega Laser cực lớn quét sạch quái.',
    'gear.cannon.name': 'Đại Bác Sa Mạc',
    'gear.cannon.desc': 'Bắn đạn pháo cối tầm xa nổ cực mạnh bán kính 70px.',
    'gear.belt.name': 'Thắt Lưng Đạn',
    'gear.belt.desc': 'Tăng +12% Sát thương cho mọi súng tiếp giáp.',
    'gear.vest.name': 'Áo Giáp Chống Đạn',
    'gear.vest.desc': 'Tăng +60 Khiên căn cứ, tự hồi phục +3.5 Khiên & +2 HP/s, phản đòn 35% sát thương.',
    'gear.shield.name': 'Hộ Thuẫn Năng Lượng',
    'gear.shield.desc': 'Cung cấp +100 Khiên cực dày cho căn cứ, sạc lượng từ +7.0 Khiên/s.',
    'gear.barrier.name': 'Thanh Chắn Gai',
    'gear.barrier.desc': 'Dựng chướng ngại vật cản và làm chậm quái trên sa mạc.',
    'gear.molotov.name': 'Bom Xăng Cổ Điển',
    'gear.molotov.desc': 'Tạo vùng lửa cháy thiêu đốt theo thời gian.',
    'gear.card.name': 'Thẻ ATM Mafia',
    'gear.card.desc': 'Tự động rút tiền thưởng thêm khi vượt qua mỗi đợt Wave quái vật.',
    'gear.flamethrower.name': 'Súng Phun Lửa',
    'gear.flamethrower.desc': 'Phun luồng lửa nón quét diện rộng thiêu đốt liên tục, gây hiệu ứng Cháy DoT dồn dập.',
    'gear.cryo_nade.name': 'Lựu Đạn Băng Giá',
    'gear.cryo_nade.desc': 'Quăng lựu đạn băng đông cứng kẻ địch 1.5s và tăng +40% sát thương nhận vào.',
    'gear.landmine.name': 'Mìn Sát Thương',
    'gear.landmine.desc': 'Cài bẫy mìn nổ hủy diệt khi quái vật chạm phải.',
    'gear.drone.name': 'Drone Trợ Chiến',
    'gear.drone.desc': 'Drone bay quanh căn cứ bắn tỉa hỗ trợ & tăng +15% Tỷ Lệ Chí Mạng cho vũ khí lân cận.',
    'gear.scope.name': 'Ống Ngắm Laser',
    'gear.scope.desc': 'Ống ngắm tăng +30% Sát Thương Chí Mạng & +20% Tầm bắn cho Súng và Cung kế cận.',
    'gear.tesla_coil.name': 'Trụ Sấm Sét',
    'gear.tesla_coil.desc': 'Phóng ra các tia sét lan qua 4-8 quái vật, làm tê liệt choáng 0.4s.',
    'gear.mortar.name': 'Súng Cối Sa Mạc',
    'gear.mortar.desc': 'Nã pháo tầm xa sát thương diện rộng cực lớn.',
    'gear.speed_loader.name': 'Tiếp Đạn Siêu Tốc',
    'gear.speed_loader.desc': 'Giảm -25% thời gian hồi chiêu (tăng tốc độ xả đạn) cho mọi vũ khí liền kề.',
    'gear.land.name': 'Mảnh Đất Mở Rộng',
    'gear.land.desc': 'Mảnh vali mở rộng diện tích kho đồ.',

    // Tutorial Modal
    'tut.title': 'HƯỚNG DẪN TÂN THỦ',
    'tut.btn_skip': 'Bỏ qua',
    'tut.btn_prev': 'Trước',
    'tut.btn_next': 'Tiếp theo',
    'tut.btn_start': 'Bắt đầu chơi ngay! 🚀',
    'tut.step1_title': '🎒 Quản Lý Vali & Sắp Xếp Ô',
    'tut.step1_desc': 'Đặt vũ khí vào các ô vali màu sáng. Dùng nút Dời Vali (Trái/Phải/Lên/Xuống) hoặc kéo thả tự do để căn chỉnh. Mua thêm Mảnh Đất để mở rộng vali!',
    'tut.step2_title': '⭐ Hợp Nhất Ghép Sao (Merge)',
    'tut.step2_desc': 'Kéo 2 vũ khí CÙNG LOẠI và CÙNG CẤP SAO đè lên nhau để nâng cấp lên sao cao hơn (★1 + ★1 = ★2). Cấp sao càng cao, sức mạnh bắn phá càng khủng!',
    'tut.step3_title': '🛒 Roll Shop & Hàng Dự Bị',
    'tut.step3_desc': 'Bấm nút "Roll (3 Món)" để mua vũ khí mới bằng tiền ván đấu. Cất tối đa 5 món vào Hàng Dự Bị, hoặc kéo trang bị vào ô Bán để nhận lại 2$.',
    'tut.step4_title': '⚔️ Xuất Trận & Diệt Trùm Boss',
    'tut.step4_desc': 'Bấm "Xuất Trận" để bước vào đấu trường! Mọi vũ khí trong vali sẽ tự động xả đạn tiêu diệt quái. Trụ vững qua các Wave và hạ gục Trùm Boss khổng lồ!',

    // Modals & General
    'modal.victory': 'CHIẾN THẮNG HUY HOÀNG!',
    'modal.defeat': 'CĂN CỨ THẤT THỦ!',
    'modal.levelup': 'NÂNG CẤP ĐẶC HUẤN TRẬN ĐẤU',
    'modal.pause': 'TẠM DỪNG TRẬN ĐẤU',
    'modal.save_title': 'MÃ TIẾN TRÌNH LƯU TRỮ GAME',
    'modal.save_copy': 'Sao Chép Mã',
    'modal.save_import': 'Nạp Mã Tiến Trình',
    'modal.save_hint': 'Dán mã lưu (DS_...) vào đây để tiếp tục ván chơi trên máy khác:'
  },

  en: {
    // Top HUD
    'hud.gold': 'Gold',
    'hud.gems': 'Gems',
    'hud.energy': 'Energy',
    'hud.save_code': 'Save Code',
    'hud.save_code_title': 'Copy or Import Cloud Save Code',
    'hud.pause': 'Pause',
    'hud.sound': 'Toggle Audio',
    'hud.tutorial': 'How to Play',
    'hud.lang': 'English',

    // Lobby
    'lobby.milestone_title': 'Stage & Boss Milestones',
    'lobby.claim_reward': 'Claim',
    'lobby.season_title': 'Season 1: Death Desert',
    'lobby.boss_arena': 'DESERT BOSS ARENA',
    'lobby.boss_trait': 'Boss Trait',
    'lobby.boss_locked': 'Stage Locked',
    'lobby.boss_locked_desc': 'Defeat previous stages to unlock this giant boss.',
    'lobby.record_wave': 'RECORD WAVE',
    'lobby.high_score': 'HIGH SCORE',
    'lobby.mode_normal': 'Mode: Normal (Sell Vali)',
    'lobby.mode_hardcore': 'Hardcore (No Selling)',
    'lobby.btn_battle': 'START MISSION',
    'lobby.btn_battle_locked': 'LOCKED',
    'lobby.cost_energy': 'Cost',

    // Nav Tabs
    'tab.battle': 'Battle',
    'tab.equip': 'Arsenal',
    'tab.club': 'Leaderboard',
    'tab.shop': 'Black Market',

    // Backpack View
    'bp.wave': 'Wave',
    'bp.shift_hint': 'Shift suitcase or drag freely:',
    'bp.btn_left': 'Left',
    'bp.btn_up': 'Up',
    'bp.btn_down': 'Down',
    'bp.btn_right': 'Right',
    'bp.stash_title': 'STASH BENCH (5 SLOTS FOR MERGING)',
    'bp.stash_hint': 'Slot 1 Free - Tap locks to expand',
    'bp.stash_empty': 'Empty',
    'bp.shop_title': 'WEAPONS / TILES (3 SHOP SLOTS)',
    'bp.mode_normal': 'Mode: Normal',
    'bp.mode_hardcore': 'Mode: Hardcore',
    'bp.empty_slot': 'Empty / Bought',
    'bp.sell_hint': 'Drag gear here to SELL',
    'bp.sell_drop': 'Drop to SELL',
    'bp.btn_roll': 'Roll (3 Items)',
    'bp.btn_fight': 'Fight',

    // Battle View
    'battle.wave': 'Wave',
    'battle.enemies_left': 'Enemies left:',
    'battle.score': 'Score:',
    'battle.speed': 'Speed:',
    'battle.adjust': 'Adjust Grid',
    'battle.paused': 'PAUSED',
    'battle.resume': 'Resume',

    // Leaderboard
    'lb.title': 'SYNDICATE & MAFIA CLUB LEADERBOARD',
    'lb.subtitle': 'High Score determines your Reputation & Global Rank in the Underworld!',
    'lb.cur_rank': 'Current Rank:',
    'lb.max_score': 'Max High Score:',
    'lb.max_stage': 'Highest Stage:',
    'lb.weekly_claim': '🎁 Claim Weekly Rewards (+50 Gems & +1,000 Gold)',
    'lb.weekly_claimed': '✅ Claimed This Week',
    'lb.col_rank': 'RANK',
    'lb.col_user': 'BOSS / ALLIANCE',
    'lb.col_wave': 'MAX WAVE',
    'lb.col_score': 'MAX SCORE',

    // Gears
    'gear.bow.name': 'Tactical Crossbow',
    'gear.bow.desc': 'Fires piercing high-tech bolts with massive critical damage.',
    'gear.dagger.name': 'Mafia Dagger',
    'gear.dagger.desc': 'Fast melee strike, picks off closest targets.',
    'gear.firearm.name': 'Desert Pistol',
    'gear.firearm.desc': 'High firepower single-target heavy shot.',
    'gear.laser.name': 'Heavy Mega Laser',
    'gear.laser.desc': 'Fires a continuous Mega Laser beam wiping out waves.',
    'gear.cannon.name': 'Desert Cannon',
    'gear.cannon.desc': 'Long-range mortar shell causing 70px explosive damage.',
    'gear.belt.name': 'Ammo Belt',
    'gear.belt.desc': '+12% Damage boost to all adjacent firearms.',
    'gear.vest.name': 'Kevlar Vest',
    'gear.vest.desc': '+60 Outpost Shield, recovers +3.5 Shield & +2 HP/s, reflects 35% damage.',
    'gear.shield.name': 'Energy Shield',
    'gear.shield.desc': 'Grants +100 Reinforced Shield, charges at +7.0 Shield/s.',
    'gear.barrier.name': 'Spike Barrier',
    'gear.barrier.desc': 'Deploys an obstacle blocking and slowing desert beasts.',
    'gear.molotov.name': 'Classic Molotov',
    'gear.molotov.desc': 'Ignites ground into a fiery blaze dealing burn DoT over time.',
    'gear.card.name': 'Mafia ATM Card',
    'gear.card.desc': 'Withdraws bonus run cash upon clearing every enemy wave.',
    'gear.flamethrower.name': 'Flamethrower',
    'gear.flamethrower.desc': 'Spews a cone of intense flames applying stacking burn damage.',
    'gear.cryo_nade.name': 'Cryo Grenade',
    'gear.cryo_nade.desc': 'Freezes enemies for 1.5s and amplifies damage taken by +40%.',
    'gear.landmine.name': 'Claymore Mine',
    'gear.landmine.desc': 'Plants explosive trap detonating on contact.',
    'gear.drone.name': 'Combat Drone',
    'gear.drone.desc': 'Circles base providing sniper fire & +15% Crit Chance to adjacent weapons.',
    'gear.scope.name': 'Sniper Scope',
    'gear.scope.desc': '+30% Critical Damage & +20% Range for adjacent firearms and bows.',
    'gear.tesla_coil.name': 'Tesla Coil',
    'gear.tesla_coil.desc': 'Unleashes chain lightning hitting 4-8 enemies with 0.4s stun.',
    'gear.mortar.name': 'Heavy Mortar',
    'gear.mortar.desc': 'Long-range high-explosive area bombardment.',
    'gear.speed_loader.name': 'Speed Loader',
    'gear.speed_loader.desc': '-25% Cooldown (firing rate increase) for all adjacent weapons.',
    'gear.land.name': 'Expansion Tile',
    'gear.land.desc': 'Expands suitcase inventory space.',

    // Tutorial Modal
    'tut.title': 'HOW TO PLAY - TUTORIAL',
    'tut.btn_skip': 'Skip',
    'tut.btn_prev': 'Prev',
    'tut.btn_next': 'Next',
    'tut.btn_start': 'Start Playing! 🚀',
    'tut.step1_title': '🎒 Suitcase Management',
    'tut.step1_desc': 'Place weapons into the unlocked grid cells. Use the D-pad (Left/Right/Up/Down) or drag freely to reposition. Buy Expansion Tiles to unlock more space!',
    'tut.step2_title': '⭐ Weapon Merging (Merge)',
    'tut.step2_desc': 'Drag two weapons of the SAME TYPE and SAME STAR tier onto each other to upgrade (★1 + ★1 = ★2). Higher tiers deliver massive firepower and abilities!',
    'tut.step3_title': '🛒 Roll Shop & Stash Bench',
    'tut.step3_desc': 'Press "Roll (3 Items)" to draw random weapons with match cash. Store up to 5 items in your Stash Bench, or drag unwanted items to the Sell Zone for 2$.',
    'tut.step4_title': '⚔️ Fight & Defeat Giant Bosses',
    'tut.step4_desc': 'Press "Fight" to start combat! All weapons inside your suitcase will automatically fire at incoming beasts. Survive the waves and slay giant Bosses!',

    // Modals & General
    'modal.victory': 'STAGE CLEAR - VICTORY!',
    'modal.defeat': 'OUTPOST FALLEN!',
    'modal.levelup': 'COMBAT PERK UPGRADE',
    'modal.pause': 'GAME PAUSED',
    'modal.save_title': 'GAME SAVE CODE',
    'modal.save_copy': 'Copy Save Code',
    'modal.save_import': 'Import Save Code',
    'modal.save_hint': 'Paste your save code (DS_...) here to resume on any device:'
  }
};

// Global language state
let currentLang = 'vi';
try {
  const saved = localStorage.getItem('desert_outpost_lang');
  if (saved === 'en' || saved === 'vi') currentLang = saved;
} catch(e) {}

function t(key, fallback = '') {
  const langDict = I18N[currentLang] || I18N['vi'];
  return (langDict && langDict[key]) || (I18N['vi'] && I18N['vi'][key]) || fallback || key;
}

function setLanguage(lang) {
  if (lang !== 'vi' && lang !== 'en') lang = 'vi';
  currentLang = lang;
  try {
    localStorage.setItem('desert_outpost_lang', lang);
  } catch(e) {}
  
  // Update DOM elements with data-i18n
  applyLanguageToDOM();

  // If game app is running, trigger its re-render
  if (window.gameApp && typeof window.gameApp.refreshAllText === 'function') {
    window.gameApp.refreshAllText();
  }
}

function toggleLanguage() {
  const nextLang = currentLang === 'vi' ? 'en' : 'vi';
  setLanguage(nextLang);
  return nextLang;
}

function applyLanguageToDOM() {
  // Update language button display
  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) {
    langBtn.innerHTML = currentLang === 'vi' ? '🇻🇳' : '🇬🇧';
    langBtn.title = currentLang === 'vi' ? 'Chuyển sang English' : 'Switch to Tiếng Việt';
  }

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key, el.textContent);
    }
  });

  // Update elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.title = t(key, el.title);
    }
  });

  // Update elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key, el.placeholder);
    }
  });
}
