# [112-1] Web Programming Final 

## (Group 26) Oshi: 推しの美女

## 組員
- B10705035 資管三 許毓庭
- B10705037 資管三 關凱欣
- B10705039 資管三 松浦明日香 

## Demo 影片連結
https://youtu.be/rgoPxYpDF2g

## 描述這個服務在做什麼
大家有看過今年爆紅的「我推的孩子（推しの子）」嗎？相信這個時代每個人都有自己推的孩子「Oshi（Idol）」，我們這次做的系統叫做「Oshi: 推しの美女」，主要目的為讓大家推廣自己的Oshi給大家，促進粉絲之間的交流，並讓大家探索新的Oshi！此系統已有40 筆左右預設資料，大家可以收藏你的Oshi、上傳自己喜歡的Oshi的照片、對照片按讚、探索新的Oshi，跟粉絲之間以匿名的方式進行交流。我們還準備了排名功能，會顯示每個地區的排名，如果有心目中的Oshi的話，不妨登入系統，Oshi不在系統的話也可以新增你的Oshi，並收藏自己的Oshiㄛ，讓你的Oshi的排名up up~ 平台主要設定以女性為主，但還是歡迎留下你對性別的定義😀

## Deployed 連結
https://oshi-deploy-shootings-projects.vercel.app/oshi/explore

## 使用/操作方式(以下以頁面分項說明)
###  Sign in 
- Logo 會轉喔
- 可選擇以google或git hub帳號登入
###  Home
- 首頁，展示東亞地區（日本、韓國、台灣、中國大陸）目前被使用者收藏次數最多的Oshi。
- 每個Oshi以愛心數最多的照片顯示，點擊可跳轉至Oshi主頁。
- 使用者可點擊左下角收藏至My Oshi頁面。
###  Oshi主頁
- 每個Oshi的個人頁面，展示她的個人資料。
- 使用者可對Oshi新增至多10個標籤。
- 照片顯示區可上傳並瀏覽照片、對照片點讚即可收錄至My Picture頁面。
- 匿名留言區，可供使用者盡情吶喊。
###  My Oshi
- 展示使用者目前收藏的Oshi，以及此Oshi總共被收藏的次數。
- 每個Oshi以愛心數最多的照片顯示，點擊可跳轉至Oshi主頁。
###  My Picture
- 展示使用者目前點讚的照片，以及此張照片被按讚的次數。
###  Ranking
- 展示各個地區目前被收藏次數前五名的Oshi。
- 每個Oshi以愛心數最多的照片顯示，點擊可跳轉至Oshi主頁。
###  Explore
- 使用者可以透過名字、標籤搜尋含有此關鍵字的Oshi，也可藉由不同地區進行篩選。
- 每個Oshi以愛心數最多的照片顯示，點擊可跳轉至Oshi主頁。
###  Add
- 新增Oshi，輸入名字、選擇地區、Instagram URL，並且可以選擇添加標籤。
###  Statistics
- 統計截至目前已經存在的使用者人數、Oshi數、照片數和目前添加次數最多的10個標籤。
### Report
- 使用者可以在這裡對於出現的任何問題進行舉報。

## 其他說明
- 由於照片數的關係，現在IO的速度很慢，照片顯示出來的速度可能非常慢，檢視收藏的速度可能超級慢，請大家耐心等候～～（但是為了Oshi等一輩子都是願意的吧💒
- 如果要上傳朋友或私人的照片，請務必取得本人的同意。上傳照片時請記得保護別人的權利，若有任何情況發生，請透過 `Report` 功能舉報，郵差會通知我們><

## 使用與參考之框架/模組/原始碼
WP112-1 HW2 / HW3 / Hack2

## 使用之第三方套件、框架、程式碼
- Frontend : NextJS, React, react-router-dom, Material UI, TypeScript
- Backend : NextJS, Express, bcryptjs, Google Auth Library
- Database : Railway
- 第三方 : NodeMailer, Cloudinary
- Deployment : Vercel
- 參考程式碼 : WP112-1 HW2 / HW3 / Hack2

## 專題製作心得
- B10705035 許毓庭 : 好累，但做出來滿有成就感，終於有點知道之前在幹嘛。寒假快樂！
- B10705037 關凱欣 :個人因為其他科的事情，在這次的專案中比較晚才加入做事，沒有很跟得上進度，沒有做到什麼很有用的東西，感謝非常努力和認真做事的隊友，也對於沒幫上什麼忙對隊友表示深度的抱歉，對於之後與他人協作做專案會有更好的概念和做法。終於放假了耶。
- B10705039 松浦明日香 : Merge的時候常發生conflict，讓我崩潰好幾次了，git分工很難，但同時也有感受到git方便之處。考完試還要熬夜寫程式，很累，但終於可以放寒假了，我要回家，大家新年快樂！


## 如何在 localhost 安裝與測試之詳細步驟
### 1. Install dependencies
```bash
yarn
```

### 2. Set the environment variables
Create a `.env.local` file in the root of the project and add the following variables:

```bash
POSTGRES_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# See the following link to set up: https://developers.google.com/identity/protocols/oauth2
GOOGLE_ID=
GOOGLE_SECRET=

# See the following link to set up: https://blog.stackademic.com/automate-200-emails-daily-nodemailer-next-js-13-integration-c7773ab63d5d
EMAIL_USER=
EMAIL_PASS=

# Create a Cloudinary account, and see the following to set up: https://cloudinary.com/documentation/cloudinary_credentials_tutorial
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_PRESET_NAME=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_API_KEY=

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Start database

```bash
docker compose up -d
```
- 要確定你的docker運作都正常、有真的create database，並且連接在正確的port上（通常為5432）
- 如果無法正確運作，建議使用Neon或Railway比較簡單
### 4. Run migrations

```bash
yarn migrate
```

### 5. Start the server

```bash
yarn dev
```

### 6. Others
- 若發生callback error請重整畫面。
- Max number of connection: 300
- idleTimeoutMillis: 300000


## 每位組員之負責項目(以頁面分工)
- B10705035 許毓庭：Sign in, Home, Oshi主頁, Add, Report
- B10705037 關凱欣：My Oshi
- B10705039 松浦明日香：Ranking, Explore, Statistics
