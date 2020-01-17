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
        let company = form.company.value;
        let premium = parseFloat(form.premium.value.replace(/\$/, "")).toFixed(2);
        let total = form.total.value || (premium*2).toFixed(2);
        let paid = form.paid.checked;
        let autopay = form.autopay.checked;
        let validPayment = form.validPayment.checked;
        if (company == "Ambetter") {
            var dueDate = "1/31/2020"
        }
        else {
            var dueDate = "1/20/2020"
        }

        //Was premium paid?
        if (!paid) {
            //If not, were the payment credentials invalid?
            if (!validPayment) {
                var notifViet = 
`Chào ${clientGender} ${clientName}, ${company} chưa nhận được tiền ${clientGender}, và Thuy Bell không xài được thẻ nhà băng ${clientGender} (nếu ${clientGender} đã cho). Nếu không trả trước khì ngày hạn chót, bảo hiểm của ${clientGender} sẽ bị hủy bỏ.

Mỗi tháng trả: $${premium}. 
${capitalize(clientGender)} nợ: 2 tháng, là $${total}. 
Ngày hạn chót: ${dueDate}

Nếu ${clientGender} có câu hỏi hay cần giúp, gọi/nhắn tin Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, ${company} has not received your premium payments yet, and your payment details (if given to Thuy Bell) are not valid. If you do not pay by the due date, your policy will be cancelled.

Your monthly premium: $${premium}.
You owe: 2 months, or $${total}. 
Due by: ${dueDate}

If you have questions or need help please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
            else {
                var notifViet = 
`Chào ${clientGender} ${clientName}, ${company} chưa nhận được tiền ${clientGender}. Nếu ${clientGender} không trả trước khì ngày hạn chót, bảo hiểm của ${clientGender} sẽ bị hủy bỏ.

Mỗi tháng trả: $${premium}. 
${capitalize(clientGender)} nợ: 2 tháng, là $${total}. 
Ngày hạn chót: ${dueDate}

**${capitalize(clientGender)} có muốn Thuy Bell trả bằng thẻ nhà băng ${clientGender} đã cho, trả lời YES.

Nếu có câu hỏi, gọi/nhắn tin Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, ${company} has not received your premium payments yet. If you do not pay by the due date, your policy will be cancelled.

Your monthly premium: $${premium}.
You owe: 2 months, or $${total}. 
Due by: ${dueDate}

**If you would like Thuy Bell to pay using your saved payment details, reply YES.

For questions call/text Thuy Bell at 727-280-4563. Thank you!`
            }
        }
        else {
            //If paid, were they enrolled in autopay?
            if (autopay) {
                var notifViet = 
`Chào ${clientGender} ${clientName}, Thuy Bell đã trả tiền còn nợ ($${total}) cho ${company} bằng thẻ nhà băng ${clientGender} đã cho. ${capitalize(clientGender)} có Autopay, là tự động rút $${premium} chên thẻ nhà băng ${clientGender} mỗi tháng ngày 16, bắt đầu Feb 16. Nếu cần thay đổi gì hay bỏ hủy Autopay, thông báo Thuy liền cho tránh phí tiềm năng và mất bảo hiểm. Nếu ${clientGender} có câu hỏi gọi/tin nhắn Thuy Bell 727-280-4563. Cám ơn!`

                var notifEng =
`Hi ${clientName}, Thuy Bell has paid your owed premiums ($${total}) to ${company} with the card details you provided us. We setup Autopay for you, which automatically charges your card $${premium} every month on the 16th, starting Feb 16. If you need to make changes or cancel Autopay, notify Thuy immediately to avoid potential fees and loss of insurance. If you have any questions, please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
            else {
                var notifViet = 
`Chào ${clientGender} ${clientName}, Thuy Bell đã trả tiền còn nợ ($${total}) cho ${company} bằng thẻ nhà băng ${clientGender} đã cho. Mỗi tháng ${clientGender} sẽ nhận thư cho $${premium}. ${capitalize(clientGender)} có trách nhiệm tự trả. Nếu ${clientGender} muốn Autopay (tự động trả) hay có câu hỏi, gọi/tin nhắn Thuy Bell 727-280-4563. Cám ơn!`
                var notifEng =
`Hi ${clientName}, Thuy Bell has paid your owed premiums ($${total}) to ${company} with the card details you provided us. You are responsible for future bills of $${premium} each month, which will arrive by mail. If you want to setup Autopay or have any questions, please call/text Thuy Bell at 727-280-4563. Thank you!`
            }
        }

        let vietSection = document.getElementById("copyViet");
        let engSection = document.getElementById("copyEng");

        insertParagraph(notifViet, vietSection)
        insertParagraph(notifEng, engSection)
    }
}

window.addEventListener("load", initPage)