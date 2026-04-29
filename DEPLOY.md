# Pluffy Studio 網站上架與後台

## 建議上架方式

使用 Netlify 部署這個資料夾。

1. 建立 GitHub repository，將整個網站資料夾推上去。
2. 到 Netlify 建立新網站，連接該 GitHub repository。
3. Build command 留空。
4. Publish directory 使用 `.`。
5. 部署完成後，網站會有一個 Netlify 網址。

## 開啟後台

後台路徑：

```text
/admin
```

第一次使用需要在 Netlify 後台開啟：

1. Site configuration → Identity → Enable Identity
2. Registration preferences 可先設為 Invite only
3. Services → Git Gateway → Enable Git Gateway
4. Invite users 新增你的 Email
5. 從邀請信設定密碼後，即可登入 `/admin`

## 後台可管理內容

目前 Decap CMS 可管理：

- 聯絡資訊：LINE、IG、Threads、Email
- 主作品集：作品名稱、分類、簡介、封面圖片、作品頁連結
- 遊戲作品：橫幅圖片、影片連結、介紹、類型、負責內容、狀態
- 團隊介紹：團隊 Logo、標題、說明
- 剪輯作品：封面圖片、影片連結、分類、簡介

## 圖片上傳

後台上傳的圖片會放在：

```text
assets/uploads
```

網站前台會讀取：

```text
data/site.json
```

本機直接用 `file://` 開啟時，瀏覽器可能因安全限制無法讀取 JSON；部署到 Netlify 後會正常讀取。
