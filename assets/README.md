# HƯỚNG DẪN THAY THẾ TÀI NGUYÊN (GAME ASSETS - HUGGING FACE PIXEL ART)
Toàn bộ tài nguyên đồ họa trong thư mục này đã được trích xuất và tinh chỉnh từ thư viện dataset **Angais/pixel-art-atlas-1.4m** (Hugging Face) với phong cách Pixel Art sắc nét (transparent RGBA, nearest-neighbor scaling). 

Bạn có thể thay thế hoặc chép đè bất kỳ file hình ảnh nào (`.png` hoặc `.svg`) vào các thư mục tương ứng theo đúng quy tắc đặt tên dưới đây, game sẽ tự động nhận diện và hiển thị:

---

## 1. Biểu Tượng Giao Diện & Hòm Báu (Icons & Chests)
* Thư mục `assets/icons/`:
  * `pause.png`: Nút tạm dừng chiến đấu
  * `diamond.png` / `gem.png`: Kim cương Mafia
  * `gold_coin.png`: Tiền vàng Lobby
  * `energy.png`: Năng lượng xuất trận
  * `star.png`: Kinh nghiệm & Điểm EXP
  * `heart.png`: Thanh máu HP
  * `trophy.png`: Cúp chiến dịch & Mốc danh vọng
  * `crown.png`: Vương miện Bố Già
  * `chest_wood.png`: Hòm gỗ tiếp tế
  * `chest_silver.png`: Hòm bạc tinh anh
  * `chest_gold.png`: Hòm hoàng kim Bố Già
  * `chest_energy.png`: Hòm năng lượng miễn phí qua quảng cáo
  * `chest_diamond.png`: Hòm kim cương miễn phí qua quảng cáo

---

## 2. Vũ Khí Nâng Cấp (Weapons: lv1 -> lv7)
* Thư mục `assets/weapons/`:
  * `bow_lv1.png` -> `bow_lv7.png`: Cung nỏ săn bắn (từ nỏ gỗ đến nỏ rồng thần)
  * `dagger_lv1.png` -> `dagger_lv7.png`: Dao găm Mafia (từ dao gọt đến dao song thủ phát sáng)
  * `laser_lv1.png` -> `laser_lv7.png`: Pháo laser (từ đầu phát laser đến siêu pháo đài hạt nhân)
  * `firearm_lv1.png` -> `firearm_lv7.png`: Súng lục / Tiểu liên / Súng trường
  * `molotov_lv1.png` -> `molotov_lv7.png`: Bom lửa / Lựu đạn thiêu đốt

---

## 3. Trang Bị Phòng Thủ, Phụ Trợ & Tiện Ích (Defense, Support & Utility)
* Thư mục `assets/defense/`:
  * `vest_lv1.png` -> `vest_lv7.png`: Áo giáp (giáp da -> giáp lưới -> giáp cơ giới titan)
  * `shield_lv1.png` -> `shield_lv7.png`: Khiên bạo động (khiên sắt -> khiên hiệp sĩ -> khiên lượng tử)
* Thư mục `assets/support/`:
  * `belt_lv1.png` -> `belt_lv7.png`: Thắt lưng đạn tiếp giáp
* Thư mục `assets/utility/`:
  * `card_lv1.png` -> `card_lv7.png`: Thẻ ATM rút tiền tự động
  * `barrier_lv1.png` -> `barrier_lv7.png`: Thanh rào chắn gai cản và làm chậm quái

---

## 4. Trùm & Bóng Đen Màn Chơi (Bosses & Mystery Silhouettes)
* Thư mục `assets/bosses/`:
  * `boss_stage1.png` & `boss_stage1_silhouette.png`: Trùm Màn 1 - Capo Chizuru Yamamoto
  * `boss_stage2.png` & `boss_stage2_silhouette.png`: Trùm Màn 2 - Chúa Tể Cơ Giới Mech GM-X
  * `boss_stage3.png` & `boss_stage3_silhouette.png`: Trùm Màn 3 - Độc Hạt Hoàng Kim Sa Mạc
  * `boss_stage4.png` & `boss_stage4_silhouette.png`: Trùm Màn 4 - Rồng Máy Cyber Shenron
  * `boss_stage5.png` & `boss_stage5_silhouette.png`: Trùm Màn 5 - Don Corleone Black Gold

---

## 5. Quái Vật & Môi Trường Chiến Trường (Monsters & Environment)
* Thư mục `assets/monsters/`:
  * `monster_thug.png`: Côn đồ sa mạc cận chiến
  * `monster_scorpion.png`: Bọ cạp bọc thép
  * `monster_tank.png`: Xe tăng cơ giới nã pháo
  * `monster_healer.png`: Tiểu trùm dược sĩ hồi máu
  * `monster_phantom.png`: Tiểu trùm ảo ảnh né đòn
* Thư mục `assets/environment/`:
  * `desert_tile.png`: Nền sa mạc Pixel Art lặp liền mạch
  * `prop_cactus.png`: Xương rồng sa mạc
  * `prop_rock.png`: Khối đá sa mạc
  * `prop_bunker.png`: Pháo đài cứ điểm căn cứ
