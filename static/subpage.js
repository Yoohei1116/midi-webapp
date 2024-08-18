const translations = {
    en: {
        title: "DegreeAnalyzer",
        "guide-link": "User guide",
        "privacy-link": "Privacy policy",
        "contact-link": "Contact",
        "guide-title": "User guide",
        "guide-content": "1. Select a key from the dropdown box.<br>2. Enter a sound (MIDI input or keyboard input are also supported).<br>3. The degree of the entered sound will be displayed.",
        "privacy-title": "Privacy policy",
        "privacy-content": "This privacy policy explains how DegreeAnalyzer collects, uses, and shares information about you when you use our site.<br><br>1. Data Collection<br>DegreeAnalyzer does not require user registration, so we do not retain any personal data of users. However, information provided through the contact form may be temporarily stored for response purposes.<br><br>2. Data Usage<br>Information provided through the contact form is used solely for responding to user inquiries.<br><br>3. Data Sharing<br>DegreeAnalyzer does not share users' personal data with third parties. However, we may disclose information if required by law.<br><br>4. Advertising<br>In the future, DegreeAnalyzer plans to display advertisements through Google AdSense. As a result, Google may collect user data. For more details, please refer to Google's privacy policy.<br><br>5. Changes to Privacy Policy<br>This privacy policy may be updated as necessary. Any changes will be notified on this page.<br>",
        "contact-title": "Contact",
        "name-label": "Name:",
        "email-label": "Email:",
        "message-label": "Message:",
        "submit-button": "Submit"
    },
    ja: {
        title: "DegreeAnalyzer",
        "guide-link": "使い方",
        "privacy-link": "プライバシーポリシー",
        "contact-link": "お問い合わせ",
        "guide-title": "使い方",
        "guide-content": "1. セレクトボックスでキーを選択します<br>2. 音を入力します (MIDIやキーボードによる入力にも対応しています)<br>3. 入力された音の度数が表示されます",
        "privacy-title": "プライバシーポリシー",
        "privacy-content": "このプライバシーポリシーは、DegreeAnalyzerの利用に関する情報の収集、使用、および共有方法について説明します。<br><br>1. データの収集<br>DegreeAnalyzerでは、会員登録などは行わないため、利用者の個人データを保持しません。ただし、お問い合わせフォームを通じて提供された情報は、対応のために一時的に保存されることがあります。<br><br>2. データの使用<br>お問い合わせフォームを通じて提供された情報は、利用者からの問い合わせに対応するためにのみ使用されます。<br><br>3. データの共有<br>DegreeAnalyzerでは、利用者の個人データを第三者と共有することはありません。ただし、法的要請があった場合には、必要に応じて情報を開示することがあります。<br><br>4. 広告<br>将来的に、DegreeAnalyzerではGoogle AdSenseによる広告を表示する予定です。これに伴い、Googleが利用者のデータを収集する場合があります。詳細については、Googleのプライバシーポリシーをご参照ください。<br><br>5. プライバシーポリシーの変更<br>このプライバシーポリシーは、必要に応じて変更されることがあります。変更があった場合は、当ページでお知らせします。<br>",
        "contact-title": "お問い合わせ",
        "name-label": "名前:",
        "email-label": "メールアドレス:",
        "message-label": "メッセージ:",
        "submit-button": "送信"
    }
};

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    const elements = document.querySelectorAll("[id]");
    elements.forEach(element => {
        const key = element.id;
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });

    // 言語切り替えボタンの選択状態を更新
    document.getElementById('ja-button').classList.toggle('selected', lang === 'ja');
    document.getElementById('en-button').classList.toggle('selected', lang === 'en');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'en'; // デフォルトを英語に設定
    setLanguage(savedLanguage);

    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        const headerOffset = 180; // 固定ヘッダーの高さに合わせて調整
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        const headerOffset = 180; // 固定ヘッダーの高さに合わせて調整
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});
