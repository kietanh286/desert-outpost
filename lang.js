/**
 * DESERT OUTPOST: MERGE DEFENSE - EXHAUSTIVE MULTI-LANGUAGE SYSTEM (i18n)
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
    'hud.tutorial': 'Hướng Dẫn Gameplay',
    'hud.lang': 'Tiếng Việt',

    // Lobby Top & Header
    'lobby.milestone_title': 'Cột Mốc Vượt Màn & Diệt Quái',
    'lobby.claim_reward': 'Nhận Quà',
    'lobby.season_title': 'Mùa 1: Sa Mạc Tử Thần',
    'lobby.boss_arena': 'TRÙM ĐẠI CHIẾN SA MẠC',
    'lobby.boss_trait': 'Kỹ Năng Boss',
    'lobby.boss_trait_unlocked': '★ Kỹ Năng Boss (Đã Mở)',
    'lobby.boss_locked_badge': '🔒 MÀN CHƯA MỞ KHÓA',
    'lobby.boss_locked': 'Chưa Mở Khóa Màn Này',
    'lobby.boss_locked_desc': 'Vượt qua các màn trước để mở khóa trùm chiến này.',
    'lobby.stage_length': 'Độ Dài Màn',
    'lobby.boss_reward': 'Thưởng Diệt Boss',
    'lobby.record_wave': 'KỶ LỤC WAVE',
    'lobby.high_score': 'ĐIỂM CAO NHẤT',
    'lobby.mode_label': 'CHẾ ĐỘ CHIẾN DỊCH:',
    'lobby.mode_normal': 'Chế độ: Thường (Bán Vali)',
    'lobby.mode_hardcore': 'Hardcore (Cấm Bán Vali)',
    'lobby.mode_normal_badge': 'Thường (Bán Vali: BẬT)',
    'lobby.mode_hardcore_badge': 'Hardcore (Khóa Bán Vali)',
    'lobby.loadout_title': 'BỘ TRANG BỊ VÀO TRẬN:',
    'lobby.btn_choose': 'Chọn Món >',
    'lobby.btn_battle': 'XUẤT TRẬN CHIẾN DỊCH',
    'lobby.btn_battle_locked': 'CHƯA MỞ KHÓA',
    'lobby.cost_energy': 'Tốn',
    'lobby.deploy_stage': 'XUẤT TRẬN MÀN',
    'lobby.deploy_sub': 'Vượt {waves} Waves & Diệt Boss (Tốn 5 Năng Lượng)',
    'lobby.stage_tag': 'MÀN {stage} / 5 • {area}',
    'lobby.stage_locked_tag': 'MÀN {stage} / 5 • VÙNG ĐẤT BÍ ẨN 🔒',
    'lobby.mystery_boss': '??? TRÙM BÍ ẨN ???',
    'lobby.stage_unlock_req': '🔒 Cần vượt qua Màn {prev} và tiêu diệt Boss để mở khóa!',

    // Boss Data
    'boss.chizuru.area': 'TIỀN ĐỒN SA MẠC',
    'boss.chizuru.name': 'CAPO CHIZURU YAMAMOTO',
    'boss.chizuru.trait': 'Phóng chùm tia Mega Laser thiêu đốt & Triệu hồi bọ cạp bọc thép càn quét căn cứ!',
    'boss.mech_titan.area': 'THÀNH PHỐ NGẦM MECH',
    'boss.mech_titan.name': 'CHÚA TỂ CƠ GIỚI MECH GM-X',
    'boss.mech_titan.trait': 'Khiên lượng tử phản xạ đạn & Nã pháo chùm tên lửa hủy diệt diện rộng!',
    'boss.golden_scorpion.area': 'ỐC ĐẢO ĐỘC HOÀNG KIM',
    'boss.golden_scorpion.name': 'ĐỘC HẠT HOÀNG KIM SA MẠC',
    'boss.golden_scorpion.trait': 'Phun nọc độc sa mạc làm tê liệt rào chắn & Càng thép nghiền nát căn cứ!',
    'boss.cyber_dragon.area': 'PHÁO ĐÀI BAY KHÔNG GIAN',
    'boss.cyber_dragon.name': 'RỒNG MÁY CYBER SHENRON',
    'boss.cyber_dragon.trait': 'Hơi thở Plasma hủy diệt toàn màn hình & Phân thân bóng ma né đạn!',
    'boss.godfather_void.area': 'TỬ ĐỊA VÔ TẬN',
    'boss.godfather_void.name': 'BỐ GIÀ HOÀNG KIM SA MẠC',
    'boss.godfather_void.trait': 'Cường hóa toàn bộ quái vật, triệu hồi bão cát sa mạc nuốt chửng căn cứ!',

    // Nav Tabs
    'tab.battle': 'Chiến Trận',
    'tab.equip': 'Kho Đồ',
    'tab.club': 'Xếp Hạng',
    'tab.shop': 'Chợ Đen',

    // Tab 2: Arsenal
    'arsenal.title': 'KHO VŨ KHÍ & BỘ TRANG BỊ RA TRẬN',
    'arsenal.subtitle': 'Chọn tối đa 5-7 món mang vào ván đấu & Tiến hóa nâng cấp vĩnh viễn',
    'arsenal.btn_upgrade': 'Nâng Cấp',
    'arsenal.btn_equip': 'Trang Bị',
    'arsenal.btn_unequip': 'Tháo Ra',
    'arsenal.stat_dmg': 'Sát Thương',
    'arsenal.stat_spd': 'Tốc Độ',
    'arsenal.stat_aoe': 'Phạm Vi',

    // Tab 3: Leaderboard
    'lb.title': 'BẢNG XẾP HẠNG LIÊN MINH & MAFIA CLUB',
    'lb.subtitle': 'Điểm Kỷ Lục (Max Score) xác định Danh Vọng & Bậc Hạng Thế Giới Ngầm!',
    'lb.cur_rank': 'Hạng Hiện Tại:',
    'lb.max_score': 'Kỷ Lục Max Score:',
    'lb.max_stage': 'Màn Cao Nhất:',
    'lb.weekly_claim': '🎁 Nhận Thưởng Tuần (+50 Kim Cương & +1.000 Vàng)',
    'lb.weekly_claimed': '✅ Đã Nhận Thưởng Tuần Này',
    'lb.col_rank': 'Hạng',
    'lb.col_user': 'Trùm / Liên Minh',
    'lb.col_wave': 'Max Wave',
    'lb.col_score': 'Max Score',
    // Extra Leaderboard & Tier Keys
    'lb.tier_godfather': 'GOLDEN GODFATHER',
    'lb.tier_diamond': 'DIAMOND SYNDICATE',
    'lb.tier_gold': 'GOLD UNDERBOSS',
    'lb.tier_silver': 'SILVER CAPO',
    'lb.tier_bronze': 'BRONZE ENFORCER',
    'lb.stage_label': 'Stage',
    'lb.player_you': 'You',
    'shop.btn_wood_buy': '500 Buy Chest',
    'shop.btn_gold_buy': '80 Buy Chest',
    'battle.monsters': 'Beasts:',
    'battle.score': 'Score:',
    'battle.high_score': 'Best:',


    // Tab 4: Shop
    'shop.title': 'CHỢ ĐEN MAFIA - HÒM BÍ ẨN & TIẾP TẾ',
    'shop.subtitle': 'Mở Hòm ngẫu nhiên nhận mảnh vũ khí & Nhận quà miễn phí bằng cách xem Quảng Cáo!',
    'shop.sec_free': 'TIẾP TẾ QUẢNG CÁO MIỄN PHÍ',
    'shop.chest_energy_title': 'Hòm Năng Lượng Miễn Phí',
    'shop.chest_energy_desc': 'Hồi ngay lập tức +10 Năng Lượng để tiếp tục xuất trận cày chiến dịch!',
    'shop.btn_ad_energy': 'Xem QC (+10 Năng Lượng)',
    'shop.chest_gem_title': 'Hòm Kim Cương Miễn Phí',
    'shop.chest_gem_desc': 'Nhận ngay +10 Kim Cương dùng để mở hòm Bố Già hoặc hồi sinh căn cứ!',
    'shop.btn_ad_gem': 'Xem QC (+10 Kim Cương)',
    'shop.sec_chests': 'HÒM VŨ KHÍ & NGUYÊN LIỆU GACHA',
    'shop.chest_wood_title': 'Hòm Gỗ Tiếp Tế',
    'shop.chest_wood_desc': 'Chứa 10 - 25 Mảnh vũ khí thường & phòng thủ ngẫu nhiên.',
    'shop.chest_silver_title': 'Hòm Bạc Tinh Anh',
    'shop.chest_silver_desc': 'Chứa 35 - 75 Mảnh vũ khí & Tăng tỉ lệ rớt Cung Nỏ và Pháo Laser!',
    'shop.chest_gold_title': 'Hòm Hoàng Kim Bố Già',
    'shop.chest_gold_desc': 'Chứa 80 - 160 Mảnh vũ khí cao cấp! Đảm bảo rớt mảnh Cung Nỏ Huyền Thoại & Cơ hội Jackpot!',
    'shop.btn_buy': 'Mua Hòm',

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

    // Interactive Gameplay Tutorial Walkthrough
    'gtut.skip': 'Bỏ qua',
    'gtut.next': 'Tiếp theo 👉',
    'gtut.done': 'Hoàn tất 🎉',
    'gtut.step1_tag': 'BƯỚC 1: VÀO CHIẾN DỊCH',
    'gtut.step1_text': '👉 Bấm nút [XUẤT TRẬN CHIẾN DỊCH] để vào căn cứ vali!',
    'gtut.step2_tag': 'BƯỚC 2: QUAY TRANG BỊ',
    'gtut.step2_text': '🎲 Bấm nút [Roll (3 Món)] để quay nhận 3 trang bị mới bằng tiền ván!',
    'gtut.step3_tag': 'BƯỚC 3: XẾP VÀO VALI',
    'gtut.step3_text': '🖐️ Chạm giữ và Kéo vũ khí từ Shop thả vào ô sáng trong Vali!',
    'gtut.step4_tag': 'BƯỚC 4: HỢP NHẤT & BÁN ĐỒ',
    'gtut.step4_text': '⭐ Kéo 2 vũ khí giống nhau đè lên nhau để Ghép Sao ★! Kéo vào ô đỏ để BÁN lấy 2$.',
    'gtut.step5_tag': 'BƯỚC 5: RA TRẬN',
    'gtut.step5_text': '⚔️ Đội hình đã sẵn sàng! Bấm [Xuất Trận] để bắt đầu bảo vệ căn cứ!',
    'gtut.step6_tag': 'BƯỚC 6: CHIẾN ĐẤU',
    'gtut.step6_text': '🔥 Vũ khí tự động xả đạn! Tiêu diệt quái vật và hạ gục Trùm Boss sa mạc!',
    'gtut.complete_text': '🎉 Tuyệt vời! Bạn đã hoàn thành hướng dẫn gameplay. Chúc bạn chiến thắng!'
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
    'hud.tutorial': 'Gameplay Tutorial',
    'hud.lang': 'English',

    // Lobby Top & Header
    'lobby.milestone_title': 'Stage & Boss Milestones',
    'lobby.claim_reward': 'Claim',
    'lobby.season_title': 'Season 1: Death Desert',
    'lobby.boss_arena': 'DESERT BOSS ARENA',
    'lobby.boss_trait': 'Boss Trait',
    'lobby.boss_trait_unlocked': '★ Boss Trait (Unlocked)',
    'lobby.boss_locked_badge': '🔒 STAGE LOCKED',
    'lobby.boss_locked': 'Stage Locked',
    'lobby.boss_locked_desc': 'Defeat previous stages to unlock this giant boss.',
    'lobby.stage_length': 'Stage Length',
    'lobby.boss_reward': 'Boss Reward',
    'lobby.record_wave': 'RECORD WAVE',
    'lobby.high_score': 'HIGH SCORE',
    'lobby.mode_label': 'CAMPAIGN MODE:',
    'lobby.mode_normal': 'Mode: Normal (Sell Vali)',
    'lobby.mode_hardcore': 'Hardcore (No Selling)',
    'lobby.mode_normal_badge': 'Normal (Sell Vali: ON)',
    'lobby.mode_hardcore_badge': 'Hardcore (No Selling)',
    'lobby.loadout_title': 'EQUIPPED ARSENAL:',
    'lobby.btn_choose': 'Select >',
    'lobby.btn_battle': 'START MISSION',
    'lobby.btn_battle_locked': 'LOCKED',
    'lobby.cost_energy': 'Cost',
    'lobby.deploy_stage': 'DEPLOY STAGE',
    'lobby.deploy_sub': 'Clear {waves} Waves & Defeat Boss (Cost 5 Energy)',
    'lobby.stage_tag': 'STAGE {stage} / 5 • {area}',
    'lobby.stage_locked_tag': 'STAGE {stage} / 5 • MYSTERIOUS LAND 🔒',
    'lobby.mystery_boss': '??? MYSTERIOUS BOSS ???',
    'lobby.stage_unlock_req': '🔒 Clear Stage {prev} and defeat the Boss to unlock!',

    // Boss Data
    'boss.chizuru.area': 'DESERT OUTPOST',
    'boss.chizuru.name': 'CAPO CHIZURU YAMAMOTO',
    'boss.chizuru.trait': 'Fires searing Mega Laser beams & Summons armored scorpions!',
    'boss.mech_titan.area': 'UNDERGROUND MECH CITY',
    'boss.mech_titan.name': 'MECH LORD GM-X TITAN',
    'boss.mech_titan.trait': 'Quantum shield reflects bullets & Fires cluster missile barrages!',
    'boss.golden_scorpion.area': 'GOLDEN POISON OASIS',
    'boss.golden_scorpion.name': 'GOLDEN DESERT SCORPION',
    'boss.golden_scorpion.trait': 'Spews paralyzing venom & Steel pincers crush your outpost!',
    'boss.cyber_dragon.area': 'AERIAL DREADNOUGHT',
    'boss.cyber_dragon.name': 'CYBER SHENRON MECHA-DRAGON',
    'boss.cyber_dragon.trait': 'Screen-wiping Plasma breath & Ghost phase-shifting decoys!',
    'boss.godfather_void.area': 'ENDLESS VOID REALM',
    'boss.godfather_void.name': 'DESERT GOLDEN GODFATHER',
    'boss.godfather_void.trait': 'Empowers all minions & Summons colossal sandstorms devouring your base!',

    // Nav Tabs
    'tab.battle': 'Battle',
    'tab.equip': 'Arsenal',
    'tab.club': 'Rankings',
    'tab.shop': 'Shop',

    // Tab 2: Arsenal
    'arsenal.title': 'ARSENAL & BATTLE LOADOUT',
    'arsenal.subtitle': 'Equip up to 5-7 weapons for battle & Evolve permanent upgrades',
    'arsenal.btn_upgrade': 'Upgrade',
    'arsenal.btn_equip': 'Equip',
    'arsenal.btn_unequip': 'Unequip',
    'arsenal.stat_dmg': 'Damage',
    'arsenal.stat_spd': 'Speed',
    'arsenal.stat_aoe': 'AoE',

    // Tab 3: Leaderboard
    'lb.title': 'SYNDICATE & MAFIA CLUB LEADERBOARD',
    'lb.subtitle': 'High Score determines your Reputation & Global Rank in the Underworld!',
    'lb.cur_rank': 'Current Rank:',
    'lb.max_score': 'Max High Score:',
    'lb.max_stage': 'Highest Stage:',
    'lb.weekly_claim': '🎁 Claim Weekly Rewards (+50 Gems & +1,000 Gold)',
    'lb.weekly_claimed': '✅ Claimed This Week',
    'lb.col_rank': 'Rank',
    'lb.col_user': 'Boss / Alliance',
    'lb.col_wave': 'Max Wave',
    'lb.col_score': 'Max Score',

    // Tab 4: Shop
    'shop.title': 'BLACK MARKET - MYSTERY CHESTS & SUPPLY',
    'shop.subtitle': 'Open random chests for weapon shards & Claim free ad supplies!',
    'shop.sec_free': 'FREE AD SUPPLY',
    'shop.chest_energy_title': 'Free Energy Chest',
    'shop.chest_energy_desc': 'Instantly restores +10 Energy to keep battling in campaign!',
    'shop.btn_ad_energy': 'Watch Ad (+10 Energy)',
    'shop.chest_gem_title': 'Free Diamond Chest',
    'shop.chest_gem_desc': 'Receive +10 Gems to open Godfather chests or revive base!',
    'shop.btn_ad_gem': 'Watch Ad (+10 Gems)',
    'shop.sec_chests': 'WEAPON & MATERIAL CHESTS',
    'shop.chest_wood_title': 'Wooden Supply Chest',
    'shop.chest_wood_desc': 'Contains 10 - 25 Common & Defensive weapon shards.',
    'shop.chest_silver_title': 'Elite Silver Chest',
    'shop.chest_silver_desc': 'Contains 35 - 75 Shards & High chance for Crossbow and Laser!',
    'shop.chest_gold_title': 'Godfather Golden Chest',
    'shop.chest_gold_desc': 'Contains 80 - 160 High-tier shards with guaranteed legendary drops!',
    'shop.btn_buy': 'Buy Chest',

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

    // Interactive Gameplay Tutorial Walkthrough
    'gtut.skip': 'Skip',
    'gtut.next': 'Next 👉',
    'gtut.done': 'Done 🎉',
    'gtut.step1_tag': 'STEP 1: START MISSION',
    'gtut.step1_text': '👉 Tap [START MISSION] to enter your suitcase outpost!',
    'gtut.step2_tag': 'STEP 2: ROLL WEAPONS',
    'gtut.step2_text': '🎲 Tap [Roll (3 Items)] to draw new weapons with match cash!',
    'gtut.step3_tag': 'STEP 3: PLACE IN VALI',
    'gtut.step3_text': '🖐️ Touch & Drag weapon from Shop into the suitcase grid!',
    'gtut.step4_tag': 'STEP 4: MERGE & SELL',
    'gtut.step4_text': '⭐ Drag matching weapons together to Merge ★! Drag to red zone to SELL for 2$.',
    'gtut.step5_tag': 'STEP 5: FIGHT',
    'gtut.step5_text': '⚔️ Formation ready! Tap [Fight] to defend your outpost!',
    'gtut.step6_tag': 'STEP 6: COMBAT',
    'gtut.step6_text': '🔥 Weapons fire automatically! Slay beasts and giant desert Bosses!',
    'gtut.complete_text': '🎉 Great job! You completed the tutorial. Have fun playing!'
  }
};

// Global language state
let currentLang = 'vi';
try {
  const saved = localStorage.getItem('desert_outpost_lang');
  if (saved === 'en' || saved === 'vi') currentLang = saved;
} catch(e) {}

function t(key, fallback = '', vars = null) {
  const langDict = I18N[currentLang] || I18N['vi'];
  let str = (langDict && langDict[key] !== undefined) ? langDict[key] : ((I18N['vi'] && I18N['vi'][key] !== undefined) ? I18N['vi'][key] : (fallback || key));
  if (vars && typeof vars === 'object') {
    Object.keys(vars).forEach(k => {
      str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    });
  }
  return str;
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
  if (typeof window !== 'undefined' && window.gameApp && typeof window.gameApp.refreshAllText === 'function') {
    window.gameApp.refreshAllText();
  }
}

function toggleLanguage() {
  const nextLang = currentLang === 'vi' ? 'en' : 'vi';
  setLanguage(nextLang);
  return nextLang;
}

function applyLanguageToDOM() {
  if (typeof document === 'undefined') return;
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
