# Pluffy Studio 上線筆記

## Netlify 部署設定

如果使用 GitHub 連接 Netlify：

1. 將整個專案推到 GitHub repository。
2. 在 Netlify 選擇 Import from Git，連接這個 repository。
3. Build command 留空。
4. Publish directory 填 `.`。
5. Deploy 後，網站首頁會讀取 `index.html`。

## 後台網址

上線後可進入：

```text
/admin
```

後台需要在 Netlify 啟用：

1. Site configuration -> Identity -> Enable Identity
2. Registration preferences 設為 Invite only
3. Services -> Git Gateway -> Enable Git Gateway
4. Invite users 邀請可登入後台的 Email
5. 接受邀請後，回到 `/admin` 編輯內容

## 後台可編輯內容

目前後台使用 Decap CMS，可編輯：

- 基本設定：LINE、Instagram、Threads、Email
- 作品集：作品標題、分類、說明、封面圖片、連結
- 遊戲作品：橫幅、影片連結、介紹文字
- 團隊介紹：標題、Logo、介紹文字
- 剪輯作品：封面、影片連結、簡短說明

## 圖片上傳位置

後台上傳圖片會放在：

```text
assets/uploads
```

主要內容資料存在：

```text
data/site.json
```
