document.getElementById('editFeedback').addEventListener('click', function() {
   
    const gradeTd = document.getElementById('grade-val');
    const commentTd = document.getElementById('comment-val');
    
    const currentGrade = gradeTd.innerText.split('/')[0]; // เอาแค่ตัวเลขหน้าเครื่องหมาย /
    const currentComment = commentTd.innerText;

    gradeTd.innerHTML = `<input type="number" id="input-grade" value="${currentGrade}" style="width: 50px;"> / 50.0`;
    commentTd.innerHTML = `<textarea id="input-comment" style="width: 100%;">${currentComment}</textarea>`;
    // แสดงปุ่ม Save และซ่อนปุ่ม Edit
    document.getElementById('saveFeedback').style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('saveFeedback').addEventListener('click', async function() {
    const newGrade = document.getElementById('input-grade').value;
    const newComment = document.getElementById('input-comment').value;

    // เตรียมข้อมูลส่งไปให้เพื่อนฝั่ง Java
    const feedbackData = {
        grade: newGrade,
        comment: newComment,
        gradedBy: "Nittikhol suksumrong" // หรือดึงจากระบบ Login
    };

    console.log("ส่งข้อมูลไป Java:", feedbackData);

    // ส่วนเชื่อมต่อกับ Java (ให้เพื่อนมาเขียนต่อตรงนี้)
    /*
    const response = await fetch('http://localhost:8080/api/feedback/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
    });
    */

    // บันทึกสำเร็จ (จำลอง)
    alert('บันทึกและส่งคะแนนให้นักศึกษาเรียบร้อยแล้ว!');
    location.reload();
});