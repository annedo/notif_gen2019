function initPage() {
    let paid = document.getElementById("paid");
    paid.addEventListener("click", togglePayOptions);
    togglePayOptions()

    let submit = document.getElementById("notifFormSubmit");
    submit.addEventListener("click", generateNotif);

    let copyButtons = document.getElementsByClassName("copyButton");

    for (var i = copyButtons.length - 1; i >= 0; i--) {
        copyButtons[i].addEventListener("click", copyText)
    }
}

function togglePayOptions() {
    let paid = document.getElementById("paid")
    let autopayEl = document.getElementById("isPaid");
    let validPayment = document.getElementById("isNotPaid")

    if (paid.checked) {
        autopayEl.style.display = "block";
        validPayment.style.display = "none";
    }

    else {
        autopayEl.style.display = "none";
        validPayment.style.display = "block";
    }
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function insertParagraph(text, parentEl) {
    parentEl.innerText = text;
}

function copyText(event) {
    let button = event.target;
    let textId = button.id.replace("Button", "");
    let text = document.getElementById(textId).innerText;
    let tempInput = document.createElement("textarea")
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

}

function generateNotif() {
    let form = document.getElementById("notifForm");
    let formSubmit = document.getElementById("notifFormSubmit");

    if (form.checkValidity() == false) {
        formSubmit.click();
        return;
    }
    else {
        event.preventDefault();
        let clientName = capitalize(form.clientName.value);
        let clientGender = form.clientGender.value;
        let premium = form.premium.value;
        let total = form.total.value || (premium*2).toFixed(2);
        let paid = form.paid.checked;
        let autopay = form.autopay.checked;
        let validPayment = form.validPayment.checked;

        //Was premium paid?
        if (!paid) {
            //If not, were the payment credentials invalid?
            if (!validPayment) {
                var notifViet = 
`Chào ${clientGender} ${clientName}, Bright Health chưa nhận được tiền ${clientGender} trả cho bảo hiểm, và só thẻ/nhà băng (nếu ${clientGender} đã cho) chị Thuy Bell không xài được. Nếu ${clientGender} không trả tiền trước khì ngày đáo hạn, bảo biểm của ${clientGender} sẽ bị hủy bỏ.

Mỗi tháng trả: $${premium}. 
${capitalize(clientGender)} nợ: 2 tháng, là $${total}. 
Ngày đáo hạn: 1/20/2020

Nếu ${clientGender} có câu hỏi hay cần giúp, gọi/nhắn tin Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, Bright Health has not received your premium payments yet, and your payment details (if given to Thuy Bell) are not valid. If you do not pay by the due date, your policy will be cancelled.

Your monthly premium: $${premium}.
You owe: 2 months, or $${total}. 
Due by: 1/20/2020

If you have questions or need help please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
            else {
                var notifViet = 
`Chào ${clientGender} ${clientName}, Bright Health chưa nhận được tiền ${clientGender} trả cho bảo hiểm. Nếu ${clientGender} không trả tiền trước khì ngày đáo hạn, bảo biểm của ${clientGender} sẽ bị hủy bỏ.

Mỗi tháng trả: $${premium}. 
${capitalize(clientGender)} nợ: 2 tháng, là $${total}. 
Ngày đáo hạn: 1/20/2020

Nếu ${capitalize(clientGender)} muón Thuy Bell trả bằng thẻ/nhà băng ${clientGender} đã cho, trả lời YES.

Nếu ${clientGender} có câu hỏi hay cần giúp, gọi/nhắn tin Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, Bright Health has not received your premium payments yet. If you do not pay by the due date, your policy will be cancelled.

Your monthly premium: $${premium}.
You owe: 2 months, or $${total}. 
Due by: 1/20/2020

If you would like Thuy Bell to pay using your saved payment details, reply YES.

If you have questions or need help please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
        }
        else {
            //If paid, were they enrolled in autopay?
            if (autopay) {
                var notifViet = 
`Chào ${clientGender} ${clientName}, Thuy Bell đã trả tiền còn nợ ($${total}) cho Bright Health bằng thẻ/nhà băng anh đã cho. anh có Autopay, là tự động rút $${premium} chên thẻ/nhà băng anh đã cho mỗi tháng ngày 16, bắt đầu Feb 16. Nếu cấn thay đổi thẻ/nhà băng hay bỏ hủy Autopay, thông báo Thuy liền cho tránh phí tiềm năng và mất bảo hiểm. Nếu anh có câu hỏi gọi/tin nhắn Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, Thuy Bell has paid your owed premiums ($${total}) to Bright Health with the card/bank details you previously provided. We setup Autopay for you, which automatically charges your card/bank $${premium} every month on the 16th, starting Feb 16. If you need to change your card/bank or cancel Autopay, notify Thuy immediately to avoid potential fees and loss of insurance. If you have any questions, please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
            else {
                var notifViet = 
`Chào ${clientGender} ${clientName}, Thuy Bell đã trả tiền còn nợ ($${total}) cho Bright Health bằng thẻ/nhà băng anh đã cho. Mỗi tháng anh sẽ nhận thư cho $${premium} anh có trách nhiệm tự trả. Nếu anh muón Autopay (tự động trả) hay có câu hỏi, gọi/tin nhắn Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, Thuy Bell has paid your owed premiums ($${total}) to Bright Health with the details you previously provided. You are responsible for future bills of $${premium} each month, which will arrive by mail. If you want to setup autopay or have any questions, please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
        }

        let vietSection = document.getElementById("copyViet");
        let engSection = document.getElementById("copyEng");

        insertParagraph(notifViet, vietSection)
        insertParagraph(notifEng, engSection)
    }
}

window.addEventListener("load", initPage)