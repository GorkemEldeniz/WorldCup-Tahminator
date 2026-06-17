# 🏆 Dünya Kupası Tahmin Oyunu (Prediction App) - Sistem ve Eşleşme Mantığı Dokümanı

Bu döküman, 48 takımlı yeni turnuva formatına uygun olarak geliştirilecek Dünya Kupası Tahmin Oyunu'nun oyun mekaniklerini, FIFA eleme kurallarını, kullanıcı arayüzü (UI) gereksinimlerini ve veritabanı (DB) mimarisini tanımlar.

---

## 1. OYUN AKIŞI VE KULLANICI DENEYİMİ (UX)

Oyun, kullanıcının adım adım tüm turnuvayı simüle etmesini sağlayan 4 ana aşamadan oluşur:

### A. Aşama 1: Grup Aşaması Sıralama Tahmini (Drag and Drop)
*   **Veri Kaynağı:** Sistem, güncel grupları ve takımları harici bir **API** üzerinden dinamik olarak çeker.
*   **Arayüz:** 12 grup (A'dan L'ye) yan yana veya dikey kartlar halinde listelenir. Her grubun altında dörder takım bulunur.
*   **Mekanik:** Kullanıcı, her grubun içindeki takımları **Sürükle-Bırak (Drag and Drop)** yöntemiyle yukarı/aşağı hareket ettirerek 1., 2., 3. ve 4. sırayı belirler. 

### B. Aşama 2: En İyi Üçüncülerin Seçimi
*   **Mekanik:** Kullanıcı 12 grubun sıralamasını bitirdiğinde, her grubun 3. sırasına yerleştirdiği toplam 12 takım otomatik olarak tek bir havuzda/ekranda listelenir.
*   **Kullanıcı Seçimi:** Kullanıcı bu 12 grup üçüncüsü arasından **en iyi performansı göstereceğini düşündüğü 8 takımı** tıklayarak seçer.
*   **Doğrulama (Validation):** Tam olarak 8 takım seçilmeden bir sonraki aşamaya geçişe izin verilmez.

### C. Aşama 3: Otomatik Eşleştirme Motoru
*   **Mekanik:** Kullanıcı 8 en iyi üçüncüyü seçtiği an, sistem arkada çalışan **FIFA Eşleşme Algoritmasını** tetikler. 
*   Grupları ilk iki sırada bitiren 24 takım ile kullanıcının seçtiği 8 en iyi üçüncü takım, turnuva ağacındaki (Round of 32) ilgili slotlara **otomatik olarak yerleştirilir**.

### D. Aşama 4: Eleme Usulü Turnuva Ağacı (Knockout Bracket Tree)
*   **Arayüz:** Son 32 turundan Finale kadar uzanan klasik, genişletilebilir bir **Turnuva Ağacı (Bracket Tree)** görünümü sunulur.
*   **Mekanik:** Maç kartlarında yan yana veya alt alta duran iki takımdan birine **tıklayan** takım bir üst tura (Son 16 -> Çeyrek Final -> Yarı Final -> Final) yükselir.
*   **Şampiyon Belirleme:** Kullanıcı en son Final maçındaki kazananı seçerek şampiyonu ilan eder ve simülasyonu tamamlar.

### E. Aşama 5: Paylaşım ve Görselleştirme (Social Sharing)
*   **Mekanik:** Tüm seçimler bittiğinde kullanıcıya özel bir **"Özet Turnuva Ağacı"** resmi/grafiği üretilir.
*   **Özellik:** Kullanıcı tek bir butonla bu tahmin ağacını **PNG/JPEG** olarak indirebilir veya benzersiz bir **Paylaşım Linki (Shareable URL)** üreterek sosyal medyada arkadaşlarıyla paylaşabilir.

---

## 2. FIFA ELEME VE EŞLEŞME MANTIĞI (ALGORİTMA)

Simülasyon motorunun hatasız çalışması için kodlanması gereken kurallar bütünü şunlardır:

### A. Üst Tura Yükselme Dağılımı
*   **Toplam Takım Sayısı:** 32 takım eleme turlarına kalır.
*   **Doğrudan Çıkanlar:** 12 grup lideri + 12 grup ikincisi (Toplam 24 takım).
*   **Kontenjanla Çıkanlar:** Kullanıcının seçtiği 8 en iyi grup üçüncüsü.

### B. Son 32 Turu (Round of 32) Çapraz Eşleşme Şeması
FIFA kurallarına göre Son 32 turunda takımlar aşağıdaki kurallara göre torbalara dağıtılır ve eşleşir:
*   En iyi puana/performansa sahip **8 grup lideri**, turnuvaya yükselen **8 en iyi üçüncü takım** ile eşleşir.
*   Kalan **4 grup lideri**, diğer grupların **ikincileriyle** karşılaşır.
*   Geriye kalan **8 grup ikincisi** ise doğrudan birbirleriyle çapraz eşleşir.

*Örnek Sabit Slot Kuralları:*
*   **A Grubu Birincisi:** C, E, F, H veya I gruplarından gelen en iyi üçüncülerden biriyle eşleşir.
*   **B Grubu Birincisi:** A, C, D, F veya I gruplarından gelen en iyi üçüncülerden biriyle eşleşir.
*   **A Grubu İkincisi vs. B Grubu İkincisi** (Doğrudan iki grup ikincisinin karşılaştığı sabit slotlardan biridir).

*Not: Algoritma, kullanıcının seçtiği 8 üçüncünün hangi gruplardan geldiğini girdi (input) olarak alır ve FIFA'nın resmi turnuva rehberinde bulunan 495 kombinasyonlu "Lookup Table" (Arama Tablosu) verisine göre üçüncülere ait boş slotları otomatik doldurur.*

---

## 3. VERİTABANI (DATABASE) MİMARİSİ

Kullanıcının yaptığı her seçimin aşama aşama, kayıpsız tutulması ve daha sonra paylaşım linklerinde tekrar yüklenebilmesi için tasarlanan İlişkisel Veritabanı (RDBMS) şeması aşağıdadır:

### A. `users` Tablosu
Kullanıcı bilgilerini tutar.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. `predictions` Tablosu
Kullanıcının ana tahmin kaydını ve şampiyon tercihini tutar. Paylaşım linkleri bu tablodaki `share_token` üzerinden çalışır.
```sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    champion_team_id INT NOT NULL, -- Şampiyon tahmin edilen takımın ID'si
    share_token VARCHAR(64) UNIQUE NOT NULL, -- Paylaşım linki için benzersiz kod
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### C. `group_predictions` Tablosu
Kullanıcının Sürükle-Bırak (Drag and Drop) ile yaptığı 12 grubun sıralama sonuçlarını tutar.
```sql
CREATE TABLE group_predictions (
    id SERIAL PRIMARY KEY,
    prediction_id INT REFERENCES predictions(id) ON DELETE CASCADE,
    group_letter CHAR(1) NOT NULL, -- 'A', 'B', ... 'L'
    team_id INT NOT NULL, -- Takım ID'si
    predicted_rank INT NOT NULL, -- 1, 2, 3 veya 4. sıra
    CONSTRAINT unique_group_team_pred UNIQUE (prediction_id, group_letter, team_id)
);
```

### D. `best_third_predictions` Tablosu
Kullanıcının havuzdan seçtiği 8 adet en iyi üçüncüyü kaydeder.
```sql
CREATE TABLE best_third_predictions (
    id SERIAL PRIMARY KEY,
    prediction_id INT REFERENCES predictions(id) ON DELETE CASCADE,
    team_id INT NOT NULL
);
```

### E. `knockout_predictions` Tablosu
Turnuva ağacındaki tıklamaları tutar. Son 32, Son 16, Çeyrek Final, Yarı Final ve Final maçlarının her birinde kimin üst tura çıktığını kaydeder.
```sql
CREATE TABLE knockout_predictions (
    id SERIAL PRIMARY KEY,
    prediction_id INT REFERENCES predictions(id) ON DELETE CASCADE,
    stage VARCHAR(20) NOT NULL, -- 'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL'
    match_code VARCHAR(10) NOT NULL, -- Fikstürdeki eşleşme kodu (Örn: 'MATCH_49', 'MATCH_50')
    home_team_id INT NOT NULL, -- O maçtaki sol/üst takım
    away_team_id INT NOT NULL, -- O maçtaki sağ/alt takım
    predicted_winner_id INT NOT NULL -- Kullanıcının tıklayarak bir üst tura çıkardığı takımın ID'si
);
```

---

## 4. TEKNİK NOTLAR VE GELİŞTİRİCİ TAVSİYELERİ

1.  **Frontend State Yönetimi:** Kullanıcı grup aşamasında sürükle bırak yapabilmeli
2.  **Ağaç Yapısı CSS/HTML:** Kullanıcı ağaç yapısında seçimlerini yapabilmeli
3.  **Görüntü Oluşturma (Sharer):** Kullanıcının ağacını resim olarak indirebilmeli 
