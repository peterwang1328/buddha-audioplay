# 語音導覽單頁網站(掃 QR Code 播放)

掃描 QR Code → 開啟本頁 → 點一下大播放鍵即可聽語音導覽。
純靜態單頁,無建置流程,部署在 GitHub Pages。

## 資料夾結構

```
audio-play/
├── index.html            單頁播放器(由 audio-guide-template.html 改成)
├── audio/
│   └── guide.mp3          正式語音檔(目前 = 小菩提育苗園 0826.MP3)
├── .nojekyll             關掉 GitHub Pages 的 Jekyll 處理
├── generate-qr.mjs       QR Code 產生腳本
├── package.json          相依:qrcode
├── qr/                    產生出來的 QR(guide-qr.svg / guide-qr.png)
├── audio-guide-template.html   原始範本(保留備查,不會被部署使用)
└── README.md
```

## 關於「掃描後自動出聲」

iOS Safari 與 Android Chrome 都禁止頁面載入即自動播放音訊,這是瀏覽器政策,
無法真正繞過。本頁折衷做法:

1. 載入時仍會嘗試 `audio.play()`,用 promise `.catch()` 吞掉錯誤。
2. 自動播放失敗(手機上幾乎必然)時,畫面不變:**大播放鍵維持置中、顯眼**,
   使用者掃描後第一眼就看得到,只需點一次。
3. 播放鍵前不放任何需要閱讀的文字。

iOS Safari 與 Android Chrome 的 fallback 行為一致:兩者的 `audio.play()`
都會 reject,由同一段 `.catch()` 處理,UI 停在「未播放」預設狀態。

## 產生 QR Code

已安裝 Node(透過 Homebrew)與 `qrcode` 套件。若換新電腦:

```bash
brew install node
cd audio-play
npm install
```

產生(帶入最終網址):

```bash
node generate-qr.mjs https://peterwang1328.github.io/buddha-audioplay/
```

輸出:

- `qr/guide-qr.svg` — 向量,**印刷用**(可無限放大)
- `qr/guide-qr.png` — 1024px 點陣,**螢幕預覽用**

容錯等級 H、留白 4 模組,適合印刷後現場掃描。

---

## 接下來要手動做的事

- [x] 把語音檔放進 `audio/guide.mp3`(已用「小菩提育苗園 0826.MP3」複製過去)
- [ ] **確認 `audio/guide.mp3` 是正確的最終版本**。若之後有新版,直接覆蓋這個檔名即可,`index.html` 不用改。
- [ ] **推上 GitHub repo**(repo 已建立:`peterwang1328/buddha-audioplay`):
  ```bash
  cd audio-play
  git init
  git add .
  git commit -m "音頻導覽單頁網站"
  git branch -M main
  git remote add origin https://github.com/peterwang1328/buddha-audioplay.git
  git push -u origin main
  ```
  (`node_modules/` 已被 `.gitignore` 排除)
- [ ] **開啟 GitHub Pages**:repo → Settings → Pages → Source 選 `Deploy from a branch` → Branch `main` / `/ (root)` → Save。等 1–2 分鐘。
- [ ] 最終網址會是 `https://peterwang1328.github.io/buddha-audioplay/`,開起來確認頁面正常。
- [x] **產生正式 QR Code**:已用最終網址跑過 `node generate-qr.mjs https://peterwang1328.github.io/buddha-audioplay/`,產出 `qr/guide-qr.svg`(印刷)與 `qr/guide-qr.png`(預覽)。若網址有變,重跑一次即可。
- [ ] **拿手機實測**:
  - iPhone(Safari)掃一次、Android(Chrome)掃一次
  - 確認:頁面開得起來、點播放鍵會出聲、進度條可拖曳快進倒帶、時間顯示正常
  - 手機自動播放被擋是正常的,只要「點一下就播」即可
  - 建議在 4G/5G(非 Wi-Fi)下測一次,確認 7.5MB 音檔載入速度可接受
- [ ] (選配)若想縮短載入:用 `ffmpeg -i guide.mp3 -b:a 96k guide-96k.mp3` 壓到 96kbps 再換檔;語音內容 96k 幾乎聽不出差別,檔案可小三成。
- [ ] (選配)換更短好記的網址:接上自訂網域,或用轉址服務。換網址後記得重跑 `generate-qr.mjs`。
