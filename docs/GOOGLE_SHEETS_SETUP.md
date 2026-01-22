# Google Sheets Leaderboard Setup Guide

## Bước 1: Tạo Google Sheet

1. Vào [Google Sheets](https://sheets.google.com) → **Tạo spreadsheet mới**
2. Đặt tên: `Game 1848 Leaderboard`
3. Ở **dòng 1**, tạo các header:

| A       | B       | C     | D     | E     | F     | G         |
| ------- | ------- | ----- | ----- | ----- | ----- | --------- |
| PlayerA | PlayerB | Game1 | Game2 | Game3 | Total | Timestamp |

---

## Bước 2: Tạo Apps Script

1. Trong Sheet, vào **Extensions → Apps Script**
2. Xóa code mặc định
3. Paste code sau:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Append new row
    sheet.appendRow([
      data.playerA,
      data.playerB,
      data.game1,
      data.game2,
      data.game3,
      data.total,
      data.timestamp,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    // Skip header row, convert to objects
    const rows = data.slice(1).map((row) => ({
      playerA: row[0],
      playerB: row[1],
      game1: row[2],
      game2: row[3],
      game3: row[4],
      total: row[5],
      timestamp: row[6],
    }));

    // Sort by total time (ascending = fastest first)
    rows.sort((a, b) => a.total - b.total);

    return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(
      ContentService.MimeType.JSON
    );
  }
}
```

4. **Save** (Ctrl+S)

---

## Bước 3: Deploy Web App

1. Click **Deploy → New deployment**
2. Click icon ⚙️ → Chọn **Web app**
3. Cấu hình:
   - **Description**: `Leaderboard API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Lần đầu sẽ yêu cầu cấp quyền → **Authorize**
6. **Copy URL** (dạng `https://script.google.com/macros/s/xxx/exec`)

---

## Bước 4: Cập nhật .env

Thêm vào file `.env`:

```
VITE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## Test

Truy cập `/test-sheets` trong app để test POST/GET

---

## Lưu ý

- Khi sửa code Apps Script, phải vào **Deploy → Manage deployments → Edit** để update
- Nếu gặp lỗi CORS, đảm bảo dùng `mode: 'no-cors'` trong fetch
