document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const socket = io();

    const keyMap = {
        '7': 60, // C4
        '2': 61, // C#4
        '9': 62, // D4
        '4': 63, // D#4
        '11': 64, // E4
        '6': 65, // F4
        '1': 66, // F#4
        '8': 67, // G4
        '3': 68, // G#4
        '10': 69, // A4as
        '5': 70, // A#4
        '0': 71, // B4
    };

    const colors = [
        "#FF0000", // セグメント1: 赤
        "#FF7F00", // セグメント2: オレンジ
        "#FFFF00", // セグメント3: 黄色
        "#7FFF00", // セグメント4: 黄緑
        "#00FF00", // セグメント5: 緑
        "#00FF7F", // セグメント6: 青緑
        "#00FFFF", // セグメント7: シアン
        "#007FFF", // セグメント8: 青
        "#0000FF", // セグメント9: 青
        "#7F00FF", // セグメント10: 紫
        "#FF00FF", // セグメント11: マゼンタ
        "#FF007F"  // セグメント12: ピンク
    ];
    

    const texts = [
        '5', 
        '2', 
        '6', 
        '3', 
        '7', 
        '#4', 
        'b2', 
        'b6', 
        'b3', 
        'b7', 
        '4', 
        '1'
    ];

    let activeNote = null;
    let animationFrameId = null;

    function resizeCanvas() {
        const container = document.querySelector('.canvas-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawArcs();
    }

    function drawArcs(excludeIndex = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;

        for (let i = 0; i < 12; i++) {
            const startAngle = ((i - 2.5) * Math.PI) / 6 + 0.015; // 隙間をつける
            const endAngle = (((i - 2.5) + 1) * Math.PI) / 6 - 0.015; // 隙間をつける
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = 5;
            ctx.stroke();

            if (i !== excludeIndex) {
                // 文字を配置
                const textRadius = (radius + radius * 1.25) / 2;
                const textX = centerX + textRadius * Math.cos((startAngle + endAngle) / 2);
                const textY = centerY + textRadius * Math.sin((startAngle + endAngle) / 2);
                ctx.fillStyle = 'lightgray';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(texts[i], textX, textY);
            }
        }
    }

    function drawActiveArc(note, progress, noteName) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = Math.min(canvas.width, canvas.height) / 3;
        const maxRadius = baseRadius * 1.25;
        const radius = baseRadius + (maxRadius - baseRadius) * progress;

        const index = (note - 60) % 12;
        const startAngle = ((index - 2.5) * Math.PI) / 6 + 0.015; // 隙間をつける
        const endAngle = (((index - 2.5) + 1) * Math.PI) / 6 - 0.015; // 隙間をつける

        ctx.beginPath();
        ctx.moveTo(centerX + baseRadius * Math.cos(startAngle), centerY + baseRadius * Math.sin(startAngle));
        ctx.lineTo(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle));
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX + baseRadius * Math.cos(endAngle), centerY + baseRadius * Math.sin(endAngle));
        ctx.arc(centerX, centerY, baseRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (progress === 1) {
            // 文字を白で描画
            const textRadius = (baseRadius + radius) / 2;
            const textX = centerX + textRadius * Math.cos((startAngle + endAngle) / 2);
            const textY = centerY + textRadius * Math.sin((startAngle + endAngle) / 2);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(texts[index], textX, textY);

            // 絶対音の記載
            ctx.fillStyle = '#191919'
            ctx.font = '120px Arial'; // base radios からに変更 
            ctx.fillText(noteName, centerX, centerY);
        }
    }

    function animateArc(note, noteName) {
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / 50, 1); // 50msでアニメーション

            drawArcs((note - 60) % 12);
            drawActiveArc(note, progress, noteName);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    let keyPressed = false;
    document.addEventListener('keydown', function(event) {
        if (!keyPressed) {
            const key = event.key;
            let selectBox = null;

            // idがassign_で始まるセレクトボックスをすべて取得し、valueがkeyと一致するものを探す
            document.querySelectorAll('select[id^="assign_"]').forEach(box => {
                if (box.value === key) {
                    selectBox = box;
                }
            });

            if (selectBox) {
                // 検索したセレクトボックスのdata-keyを取得
                const dataKey = selectBox.getAttribute('data-key');
                // buttonのdata-keyを検索
                const button = document.querySelector(`button[data-key="${dataKey}"]`);
                if (button) {
                    keyPressed = true;
                    button.click();
                    button.classList.add('active')
                }
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        const key = event.key;
        let selectBox = null;

        // idがassign_で始まるセレクトボックスをすべて取得し、valueがkeyと一致するものを探す
        document.querySelectorAll('select[id^="assign_"]').forEach(box => {
            if (box.value === key) {
                selectBox = box;
            }
        });

        if (selectBox) {
            // 検索したセレクトボックスのdata-keyを取得
            const dataKey = selectBox.getAttribute('data-key');
            // buttonのdata-keyを検索
            const button = document.querySelector(`button[data-key="${dataKey}"]`);
            if (button && button.classList.contains('active')) {
                keyPressed = false;
                button.classList.remove('active')
            }
        }
    });

    const buttons = document.querySelectorAll('button[id^="input_"]');
    // 各ボタンに対してアクティブ状態の処理を追加
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(event) {
            event.preventDefault(); //クリック時の::activeを無効化
            if (!keyPressed){
                buttons.forEach(btn => btn.classList.remove('active')); // すべてのボタンからアクティブクラスを削除
                button.classList.add('active');// クリックされたボタンにアクティブクラスを追加
        }});
    
        button.addEventListener('mouseup', function() {
            if (!keyPressed){
                // クリックを外すとアクティブクラスを削除
                button.classList.remove('active');
        }});

        button.addEventListener('mouseleave', function() {
            if (!keyPressed){
                // ボタンからマウスが離れたときにアクティブクラスを削除
                button.classList.remove('active');
        }});
    });

    // アクティブクラスが追加されたときの処理関数を定義
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class' && mutation.target.classList.contains('active')) {
                const selectedValue = document.getElementById('key').value;
                const buttonLabel = mutation.target.textContent;
                const disctance = Tonal.Interval.distance(selectedValue + '4', buttonLabel + '4');
                let interval = Tonal.Interval.semitones(disctance);
                if (interval < 0){
                    interval = 12 + interval;
                }
                console.log('Interval:', disctance, Tonal.Interval.semitones(disctance), interval);
                
                // 図形の描画
                const note = keyMap[String(interval)];
                if (note !== undefined && note !== activeNote) {
                    activeNote = note;
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    animateArc(note, buttonLabel);
                }
            }

            if (mutation.attributeName === 'class' && !mutation.target.classList.contains('active')) {
                const selectedValue = document.getElementById('key').value;
                const buttonLabel = mutation.target.textContent;
                const disctance = Tonal.Interval.distance(selectedValue + '4', buttonLabel + '4');
                let interval = Tonal.Interval.semitones(disctance);
                if (interval < 0){
                    interval = 12 + interval;
                }
                // 図形の再描画
                const note = keyMap[String(interval)];
                if (note !== undefined && note === activeNote) {
                    activeNote = null;
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    drawArcs();
                }
            }
        });
    });

    // idがassign_で始まるセレクトボックスの変更時の処理
    document.querySelectorAll('select[id^="assign_"]').forEach(selectBox => {
        selectBox.addEventListener('change', function() {
            const newValue = this.value;
            let isDuplicate = false;

            // 他のセレクトボックスと値が重複しているか確認
            document.querySelectorAll('select[id^="assign_"]').forEach(otherSelectBox => {
                if (otherSelectBox !== this && otherSelectBox.value === newValue) {
                    isDuplicate = true;
                }
            });

            if (isDuplicate) {
                // 重複があった場合の処理
                alert('選択された値は他のセレクトボックスと重複しています。別の値を選択してください。The selected value is already used in another dropdown. Please choose a different value.');
                this.value = ''; // 値をリセット
            }
        });
    });

    // 各ボタンに対してオブザーバーを設定
    buttons.forEach(button => {
        observer.observe(button, { attributes: true });
    });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // MIDI Web APIのサポート確認
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        // MIDI Web APIがサポートされていない場合の処理
        const header = document.getElementById('header');
        header.innerHTML += '<p>このブラウザはMIDI Web APIに対応していません。別のブラウザを使用してください。</p>';
        alert('このブラウザはMIDI Web APIに対応していません。別のブラウザを使用してください。');
    }

    function onMIDISuccess(midiAccess) {
        // MIDIデバイスの入力を監視
        midiAccess.inputs.forEach(function(input) {
            input.onmidimessage = getMIDIMessage;
        });

        // 新たに接続されたデバイスの状態変化を監視
        midiAccess.onstatechange = function(e) {
            if (e.port.state === 'connected') {
                e.port.onmidimessage = getMIDIMessage;
            }
        };
    }

    function onMIDIFailure() {
        console.log('Failed to access MIDI devices.');
    }

    let keyPressed2 = false;
    function getMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        const noteName = Tonal.Note.fromMidi(note); // MIDIノート番号を音名に変換
        const noteKey = noteName.replace(/[0-9]/g, ''); // 数字部分を削除して音名を取得
        const button = document.querySelector(`button[data-key="${noteKey}"]`);
        if (command === 144 && velocity > 0) { // Note on message
            console.log('a')
            if (!keyPressed2 && button) {
                keyPressed2 = true;
                button.click();
                button.classList.add('active');
            }
        } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off message
            console.log('b')
            if (button) {
                button.classList.remove('active');
                keyPressed2 = false;
            }
        }
    }
});


