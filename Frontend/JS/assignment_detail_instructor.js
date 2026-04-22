document.getElementById('editFeedback').addEventListener('click', function() {
    const gradeTd = document.getElementById('grade-val');
    const commentTd = document.getElementById('comment-val');
    const currentUser = localStorage.getItem('username') || "Instructor";
    
    // ดึงค่าปัจจุบันมาเก็บไว้ (ดักกรณีถ้ามีตัวอักษรปนมาด้วย)
    const currentGrade = gradeTd.innerText.split('/')[0].trim();
    const currentComment = commentTd.innerText.trim();

    // เปลี่ยนจาก Text เป็น Input/Textarea
    gradeTd.innerHTML = `<input type="number" id="input-grade" value="${currentGrade}" class="form-control" style="width: 80px; display: inline-block;"> / 50.0`;
    commentTd.innerHTML = `<textarea id="input-comment" class="form-control" rows="3" style="width: 100%;">${currentComment}</textarea>`;
    
    // สลับปุ่ม
    document.getElementById('saveFeedback').style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('saveFeedback').addEventListener('click', async function() {
    const saveBtn = this;
    const newGrade = document.getElementById('input-grade').value;
    const newComment = document.getElementById('input-comment').value;

    // Validation เบื้องต้น
    if (!newGrade || newGrade < 0 || newGrade > 50) {
        alert("กรุณากรอกคะแนนให้ถูกต้อง (0-50)");
        return;
    }

    const feedbackData = {
        grade: parseFloat(newGrade), // ส่งเป็นตัวเลข
        comment: newComment,
        gradedBy: "Nittikhol suksumrong",
        updatedAt: new Date().toISOString() // เพิ่ม Timestamp ให้เพื่อนฝั่ง Java ด้วย
    };

    // เปลี่ยนสถานะปุ่มตอนกำลังบันทึก
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    try {
        console.log("ส่งข้อมูลไป Java:", feedbackData);

        // --- ส่วนเชื่อมต่อกับ Java (Uncomment เมื่อเพื่อนพร้อม) ---
        
        const response = await fetch('http://localhost:8080/api/feedback/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) throw new Error('บันทึกไม่สำเร็จ');
        

        // ถ้าบันทึกสำเร็จ
        alert('บันทึกและส่งคะแนนเรียบร้อยแล้ว!');
        
        // อัปเดตหน้าจอโดยไม่ต้อง Reload (เพื่อให้ดูสมูท)
        document.getElementById('grade-val').innerText = `${newGrade} / 50.0`;
        document.getElementById('comment-val').innerText = newComment;
        
        // สลับปุ่มกลับ
        saveBtn.style.display = 'none';
        saveBtn.disabled = false;
        saveBtn.innerText = "Save";
        document.getElementById('editFeedback').style.display = 'block';

    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        saveBtn.disabled = false;
        saveBtn.innerText = "Save";
    }
});