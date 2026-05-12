# Panduan Integrasi Frontend (FE) - Be Chat Golang

Dokumen ini berisi panduan teknis untuk menghubungkan aplikasi Frontend (React/Vue/Mobile) ke Backend Go ini.

## 1. Persiapan Dasar

- **Base URL**: `http://localhost:8080/api`
- **WebSocket URL**: `ws://localhost:8080/ws`
- **Content-Type**: `application/json`

---

## 2. Alur Otentikasi (JWT)

Sistem menggunakan JWT (JSON Web Token) untuk keamanan.

### Langkah Integrasi:
1.  **Register**: Kirim `POST /auth/register`.
2.  **Login**: Kirim `POST /auth/login`. Simpan nilai `token` yang dikembalikan ke dalam `localStorage` atau `SecureStore`.
3.  **Setiap Request Berikutnya**: Masukkan token ke dalam header HTTP:
    ```http
    Authorization: Bearer <YOUR_TOKEN>
    ```

### Endpoint Otentikasi:
- `POST /auth/register`: Mendaftarkan user baru.
- `POST /auth/login`: Mendapatkan token akses.
- `GET /auth/me`: Mengambil profil user yang sedang login (memerlukan token).

---

## 3. Integrasi WebSocket (Real-time Chat)

Backend menggunakan WebSocket untuk pengiriman pesan instan. Otentikasi dilakukan via query parameter.

### Cara Menghubungkan:
```javascript
const token = localStorage.getItem('token');
const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

socket.ononopen = () => {
    console.log("Terhubung ke server pesan");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Pesan baru diterima:", data);
    
    if (data.event === "new_message") {
        // Update UI chat di sini
        const message = data.data;
        appendMessageToUI(message);
    }
};
```

### Event yang Diterima dari Server:
- **`new_message`**: Dikirimkan ketika ada pesan baru masuk ke percakapan Anda.
  ```json
  {
    "event": "new_message",
    "data": {
      "id": "uuid",
      "conversation_id": "uuid",
      "content": "Halo apa kabar?",
      "sender_id": "uuid",
      "status": "sent"
    }
  }
  ```

---

## 4. Alur Manajemen Chat (REST API)

Meskipun menerima pesan via WebSocket, Anda tetap memerlukan REST API untuk operasi lainnya.

### Mengambil Daftar Percakapan
- **`GET /chat/conversations`**: Menampilkan daftar chat user.

### Mengambil Riwayat Pesan
- **`GET /chat/conversations/:id/messages`**: Menampilkan history pesan dalam satu room.

### Mengirim Pesan
- **`POST /chat/messages`**: Mengirim pesan baru.
  - *Payload*: `{ "conversation_id": "uuid", "content": "teks pesan" }`
  - *Note*: Setelah Anda mengirim ini, server akan menyimpannya ke DB dan membroadcast via WebSocket ke penerima.

---

## 5. Dokumentasi API Interaktif (Swagger/RapiDoc)

Anda dapat melihat detail skema JSON (Request/Response) setiap endpoint secara visual di:
- **RapiDoc**: `http://localhost:8080/rapidoc`
- **Swagger**: `http://localhost:8080/swagger/index.html`

> [!TIP]
> Gunakan RapiDoc untuk mencoba (Try Out) API secara langsung di browser sebelum mengimplementasikan fungsinya di kode Frontend.

---

## 6. Tips Integrasi
1. **CORS**: Backend sudah dikonfigurasi untuk menerima request dari semua origin (`*`). Jika di production, pastikan mengubah list origin di `internal/middleware/cors.go`.
2. **Error Handling**: Jika menerima status `401 Unauthorized`, arahkan user kembali ke halaman **Login**.
3. **Reconnection**: Implementasikan logika *Auto-reconnect* pada WebSocket jika koneksi terputus tiba-tiba agar user tetap online.
