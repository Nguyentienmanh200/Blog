// Thay thế bằng Token Bot và Chat ID thực tế của bạn
const BOT_TOKEN = '8987934613:AAEn_FPiBdL1gLikUzepFPzXHQSs6snBlX8'; 
const CHAT_ID = '8195111209';

/**
 * Gửi dữ liệu form về Telegram thông qua Fetch API
 * @param {Object} data - Dữ liệu từ form đăng ký
 * @returns {Promise<Response>} 
 */
async function sendToTelegram(data) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    // Định dạng nội dung tin nhắn theo yêu cầu
    const message = `📚 *ĐĂNG KÝ HỌC VIÊN MỚI*
👤 Họ tên: ${data.name}
📞 SĐT: ${data.phone}
📧 Email: ${data.email}
🎂 Ngày sinh: ${data.birthday}
📖 Khóa học: ${data.course}
📝 Ghi chú: ${data.note || 'Không có'}
⏰ Thời gian: ${data.time}`;

    const payload = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
    };

    // Gửi request
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
