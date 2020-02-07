function initPage() {
    // Set up form events
    window.form = document.forms[0];

    toggleFormType();
    let typeInputs = document.querySelectorAll("[name=notifType]");
    for (var i = typeInputs.length - 1; i >= 0; i--) {
        typeInputs[i].addEventListener("click", toggleFormType);
    }

    form.addMemberButton.addEventListener("click", addMember);

    form.paid.addEventListener("click", togglePayOptions);
    togglePayOptions()

    form.submitButton.addEventListener("click", generateNotif);

    // Set up copy/paste events
    let copyButtons = document.getElementsByClassName("copyButton");
    for (var i = copyButtons.length - 1; i >= 0; i--) {
        copyButtons[i].addEventListener("click", copyText);
    }
}

function toggleFormType() {

    function showSection(section) {
        let inputs = section.getElementsByTagName("input");
        section.removeAttribute("hidden");
        for (var i = inputs.length - 1; i >= 0; i--) {
            inputs[i].removeAttribute("disabled");
        }
    }

    function hideSection(section) {
        let inputs = section.getElementsByTagName("input");
        section.setAttribute("hidden", "");
        for (var i = inputs.length - 1; i >= 0; i--) {
            inputs[i].setAttribute("disabled", "");
        }
    }

    let sectionDocs = document.getElementById("sectionDocs");
    let sectionPayment = document.getElementById("sectionPayment");

    if (form.notifType.value == "documents") {
        showSection(sectionDocs);
        hideSection(sectionPayment);
    }
    else if (form.notifType.value == "payment") {
        showSection(sectionPayment);
        hideSection(sectionDocs);
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

function removeMember(event) {
    event.preventDefault();
    let memberId = event.target.id.replace("_removeButton", "");
    let memberSection = document.getElementById(memberId)
    memberSection.parentNode.removeChild(memberSection);
}

function addMember(event) {
    event.preventDefault();
    try {
        let lastMemberSection = event.target.previousElementSibling;
        var lastId = parseInt(lastMemberSection.id.replace("member", ""));
    }
    catch {
        var lastId = 0;
    }

    let nextId = `member${lastId + 1}`;
    let memberDOM = new DOMParser().parseFromString(`
    <fieldset id="${nextId}" class="memberInfo">
        <legend>Missing Member ${lastId + 1}:</legend>
        <button type="button" id="${nextId}_removeButton">x Remove Member</button>
        <div>
            <label for="${nextId}_name">Name:</label>
            <input type="text" name="${nextId}_name" id="${nextId}_name" required>
        </div>
        <fieldset>
            <legend>Documents:</legend>
            <div>
                <input name="${nextId}_docs" type="checkbox" id="${nextId}_income" value="income"><label for="${nextId}_income">Income</label>
            </div>
            <div>
                <input name="${nextId}_docs" type="checkbox" id="${nextId}_ssn" value="SSN"><label for="${nextId}_ssn">SSN</label>
            </div>
            <div>
                <input name="${nextId}_docs" type="checkbox" id="${nextId}_citizenship" value="Naturalization Certificate"><label for="${nextId}_citizenship">Naturalization Certificate</label>
            </div>
            <div>
                <input name="${nextId}_docs" type="checkbox" id="${nextId}_greencard" value="greencard"><label for="${nextId}_greencard">Greencard</label>
            </div>
            <div>
                <input name="${nextId}_docs" type="checkbox" id="${nextId}_letter" value="health coverage letter"><label for="${nextId}_letter">Health Coverage Letter</label>
            </div>
        </fieldset>
    </fieldset>`, "text/html");
    memberDOM.getElementById(`${nextId}_removeButton`).addEventListener("click", removeMember);
    let memberNode = memberDOM.getElementById(nextId);
    event.target.before(memberNode);
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
    var translation = {
        "income": "income",
        "SSN": "SSN",
        "Naturalization Certificate": "giấy quốc tịch",
        "greencard": "thẻ xanh",
        "health coverage letter": "health coverage letter"

    }
    if (form.checkValidity() == false) {
        form.submitButton.click();
        return;
    }
    else {
        var clientName = capitalize(form.clientName.value);
        var clientGender = form.clientGender.value;
        var clientDate = new Date(form.dueDate.value).toLocaleDateString('en-us', {timeZone: 'UTC'});

        if (form.notifType.value == "documents") {
            event.preventDefault();
            var memberSections = form.getElementsByClassName("memberInfo");

            var reqsListEng = [];
            var reqsListViet = [];

            if (memberSections.length === 1 && form.member1_name.value == "") {
                var docsOptions = form.member1_docs;
                var docsListEng = [];
                var docsListViet = [];

                for (var i = docsOptions.length - 1; i >= 0; i--) {
                    if (docsOptions[i].checked) {
                        docsListEng.push(docsOptions[i].value);
                        docsListViet.push(translation[docsOptions[i].value])
                    }
                }

                reqsListEng.push(`your ${docsListEng.join(", ")}`)
                reqsListViet.push(`${docsListViet.join(", ")} của ${clientGender}`)
            }
            else {
                for (var memberIndex = 0; memberIndex < memberSections.length; memberIndex++) {
                    let memberId = memberSections[memberIndex].id;

                    let memberName = form[`${memberId}_name`];
                    var docsOptions = form[`${memberId}_docs`];
                    var docsListEng = [];
                    var docsListViet = [];

                    for (var i = docsOptions.length - 1; i >= 0; i--) {
                        if (docsOptions[i].checked) {
                            docsListEng.push(docsOptions[i].value);
                            docsListViet.push(translation[docsOptions[i].value])
                        }
                    }

                    if (memberSections.length === 1) {
                        var numbering = '';
                    }
                    else {
                        var numbering = `${memberIndex + 1}) `
                    }
                    var memberReqsEng = `${numbering}${memberName.value}'s ${docsListEng.join(", ")}`
                    var memberReqsViet = `${numbering}${docsListViet.join(", ")} của ${memberName.value}`

                    reqsListEng.push(memberReqsEng);
                    reqsListViet.push(memberReqsViet);
                }
            }

            var reqsStrEng = reqsListEng.join("; ");
            var reqsStrViet = reqsListViet.join("; ");

            var notifViet = `Chào ${clientGender} ${clientName}, Obamacare của ${clientGender} cần bổ sung thêm giấy tờ. Làm ơn nhắn tin hình ${reqsStrViet}. Nếu không gửi trước khì ${clientDate}, giá bảo hiểm của ${clientGender} sẽ tăng lên. Liên lạc Thuy Bell 727-280-4563. Cám ơn!`

            var notifEng = `Hi ${clientName}, we need more documents to verify your Obamacare. Please send us photos of ${reqsStrEng}. If not sent before ${clientDate}, your premium will increase. Contact Thuy Bell at 727-280-4563. Thank you!`
        }

        else if (form.notifType.value == "payment") {
            event.preventDefault();
            let company = form.company.value;
            let premium = parseFloat(form.premium.value.replace(/\$/, "")).toFixed(2);
            let total = form.total.value || (premium*2).toFixed(2);
            let paid = form.paid.checked;
            let autopay = form.autopay.checked;
            let validPayment = form.validPayment.checked;
            if (company == "Ambetter" || company == "Oscar Insurance") {
                var dueDate = "1/31/2020"
            }
            else if (company == "Bright Health") {
                var dueDate = "1/20/2020"
            }
            else {
                var dueDate = "PLEASE ENTER DUE DATE"
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
        }

        let vietSection = document.getElementById("copyViet");
        let engSection = document.getElementById("copyEng");
        let bothSection = document.getElementById("copyBoth");

        var notifBoth = [notifViet, notifEng].join('\n\n');

        insertParagraph(notifViet, vietSection)
        insertParagraph(notifEng, engSection)
        insertParagraph(notifBoth, bothSection)
    }
}

window.addEventListener("load", initPage)