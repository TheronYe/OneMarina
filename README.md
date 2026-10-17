# 瑅海 ONE MARINA — 官方風格宣傳網站

以 www.onemarina.hk 的風格與設計語言為基礎搭建的靜態宣傳網站：
深夜海港底色 × 香檳金線條建築畫 × 精緻襯線排版，配繁中／EN 雙語切換。

## 檔案結構

```
OneMarina/
├── index.html              單頁主站（全部區塊 + 內聯 SVG 藝術）
├── assets/
│   ├── css/style.css       設計系統（配色／字體／動效／響應式；尾部 v2/v3 調整區）
│   ├── js/main.js          預載動畫、雙語切換、滾動顯現、數字滾動、標籤頁、聯絡設定
│   └── img/                favicon.svg + scene-*.svg 畫家印象場景圖（画廊後備）
└── README.md
```

## 區塊一覽

| 區塊 | 內容 |
|---|---|
| Preloader | 雙塔線稿描繪動畫 + 「ONE MARINA 瑅海」字標 |
| Hero | 九龍核心·臨海地標／瑅海 ONE MARINA／快將矚目登場，雙塔×歐陸式騎樓×海浪線藝 |
| Marquee | 賣點跑馬燈（臨海維港·土瓜灣站·步行街·451伙…） |
| 項目概覽 | 項目陳述 + 5 項核心數據（451伙／2座／1–3房／340'-700'／2028.9.30） |
| 命名意念 | 「瑅」玉 ×「海」港 × ONE MARINA 釋義（翡翠光暈視覺） |
| 核心賣點 | ①臨海維港 ②鐵路土瓜灣站 ③九龍首個小區式步行購物街 |
| 戶型 | 一房／兩房／三房標籤頁 + 示意平面圖 + 面積資訊（含法定免責註記） |
| 位置交通 | 航海圖風格位置示意圖（屯馬線沿線站點、海心公園、維港）+ 交通／校網／地址 |
| 項目印象 | 六張環境氣氛圖（外部圖床，載入失敗自動回退本地畫家印象 SVG） |
| 品牌系列 | ONE MAYFAIR／ONE SILVERSEA／ONE CENTRAL PLACE／ONE MARINA（2026 臨海壓軸）+ 發展商 |
| 立即聯絡 | 電話／WhatsApp 圖示卡片（`tel:` 與 `wa.me` 直達；號碼不顯示於頁面） |
| 銷售資料 | 樓書／價單／平面圖等文件留位卡 + 720° 虛擬導賞留位（參考 Sterling／Atlas，上載方法見 HTML 內註釋） |
| 浮動按鈕 | 右下角常駐 WhatsApp／致電圓形圖示鈕 |
| 重要聲明 | 《一手住宅物業銷售條例》規定的完整賣方聲明（照官方文字收錄） |

## 本地預覽

```powershell
python -m http.server 8080
# 或
npx serve .
```

瀏覽器打開 `http://localhost:8080`。純靜態站點，任何靜態託管（Nginx／GitHub Pages／S3／虛擬主機）直接上傳即可。

## 聯絡資料設定（電話 / WhatsApp）

號碼集中設定在 `assets/js/main.js` 頂部的 `CONTACT`（**號碼不會顯示於頁面**，僅用於點擊跳轉）：

```js
var CONTACT = {
  phone: "+85284939175",     // 電話（tel: 連結用，點擊即撥號）
  whatsapp: "85284939175",   // WhatsApp（wa.me 連結用，不含 +）
  waText: "NA您好，我想登記 One Marina 示範單位預約。" // 預售文字
};
```

同步生效位置：立即聯絡區的電話／WhatsApp 卡片、右下角浮動圓形圖示鈕。
（`index.html` 內亦有帶真實號碼的靜態 `href` 作無 JS 後備；改號碼時建議兩處同步。）

## 銷售資料上載方法

「銷售資料」區已為樓書、價單、平面圖、銷售安排、成交紀錄、預售樓花同意書及 720° 虛擬導賞留位。
資料刊出後：把對應的 `<div class="doc-card soon">…</div>` 改為
`<a class="doc-card" href="assets/files/檔名.pdf" target="_blank">…</a>`，badge 改為「下載 PDF」即可（HTML 內有註釋標記）。

## 其他說明

- **圖片**：項目印象區使用外部圖床（Unsplash）氣氛圖，載入失敗時自動切換至本地 `assets/img/scene-*.svg` 畫家印象圖；取得官方素材後直接替換 `index.html` 內 `<img src>` 即可。
- **文字放大**：非標題文字已放大 50%，設定集中在 `style.css` 尾部「v2」區塊，日後可統一微調。
- **字體**：使用 Google Fonts（Cormorant Garamond + Noto Serif TC + Noto Sans TC），離線環境自動回退系統字體。

## 雙語機制

各文字節點帶 `data-en` 屬性（EN 版內容），繁中原文保留在 DOM 中；
`main.js` 切換時互換 `innerHTML` 並記憶於 `localStorage`（鍵名 `om-lang`），`<html lang>` 同步更新。

> 資料來源：官方網站 www.onemarina.hk 及公開報道。戶型面積等以售樓說明書為準；本站為宣傳演示用途。
