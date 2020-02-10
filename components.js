Vue.component('viet-notification', {
    props: ['formValues'],
    computed: {
        templateContent: function() {
            console.log(this.formValues);
            if (this.formValues.notifType === 'documents') {
                return 'documents'
            }
            else if (this.formValues.notifType === 'payment') {
                if (!this.formValues.paid && !this.formValues.validPayment) {
                    return 'unpaid_invalid';
                }
                else if (!this.formValues.paid && this.formValues.validPayment) {
                    return 'unpaid_valid';
                }
                else if (this.formValues.paid && this.formValues.autopay) {
                    return 'paid_autopay';
                }
                else if (this.formValues.paid && !this.formValues.autopay) {
                    return 'paid_manual'
                }
            }
        },
        clientGender: function() {
            return this.$root.clientGender;
        }
    },
    /*<p v-if="templateContent === 'documents'">
        Chào {{clientGender}} {{clientName}}, Obamacare của {{clientGender}} cần bổ sung thêm giấy tờ. Làm ơn nhắn tin hình {{reqsStrViet}}. Nếu không gửi trước khì {{dueDate}}, giá bảo hiểm của {{clientGender}} sẽ tăng lên. Liên lạc Thuy Bell 727-280-4563. Cám ơn!
    </p>*/
    template: `
    <p v-else-if="templateContent === 'unpaid_invalid'">
        Chào {{clientGender}} {{clientName}}, {{company}} chưa nhận được tiền {{clientGender}}, và Thuy Bell không xài được thẻ nhà băng {{clientGender}} (nếu {{clientGender}} đã cho). Nếu không trả trước khì ngày hạn chót, bảo hiểm của {{clientGender}} sẽ bị hủy bỏ.

    <br/><br/>Mỗi tháng trả: \${{premium}}. 
    <br/>{{capitalize(clientGender)}} nợ: 2 tháng, là \${{total}}. 
    <br/>Ngày hạn chót: {{dueDate}}

    <br/><br/>Nếu {{clientGender}} có câu hỏi hay cần giúp, gọi/nhắn tin Thuy Bell 727-280-4563. Cám ơn!
    </p>

    <p v-else-if="templateContent === 'unpaid_valid'">
        Chào {{clientGender}} {{clientName}}, {{company}} chưa nhận được tiền {{clientGender}}. Nếu {{clientGender}} không trả trước khì ngày hạn chót, bảo hiểm của {{clientGender}} sẽ bị hủy bỏ.

    <br/><br/>Mỗi tháng trả: \${{premium}}. 
    <br/>{{capitalize(clientGender)}} nợ: 2 tháng, là \${{total}}. 
    <br/>Ngày hạn chót: {{dueDate}}

    <br/><br/>**{{capitalize(clientGender)}} có muốn Thuy Bell trả bằng thẻ nhà băng {{clientGender}} đã cho, trả lời YES.

    <br/><br/>Nếu có câu hỏi, gọi/nhắn tin Thuy Bell 727-280-4563. Cám ơn!
    </p>

    <p v-else-if="templateContent === 'paid_autopay'">
        Chào {{clientGender}} {{clientName}}, Thuy Bell đã trả tiền còn nợ (\${{total}}) cho {{company}} bằng thẻ nhà băng {{clientGender}} đã cho. {{capitalize(clientGender)}} có Autopay, là tự động rút \${{premium}} chên thẻ nhà băng {{clientGender}} mỗi tháng ngày 16, bắt đầu Feb 16. Nếu cần thay đổi gì hay bỏ hủy Autopay, thông báo Thuy liền cho tránh phí tiềm năng và mất bảo hiểm. Nếu {{clientGender}} có câu hỏi gọi/tin nhắn Thuy Bell 727-280-4563. Cám ơn!
    </p>

    <p v-else-if="templateContent === 'paid_manual'">
        Chào {{clientGender}} {{clientName}}, Thuy Bell đã trả tiền còn nợ (\${{total}}) cho {{company}} bằng thẻ nhà băng {{clientGender}} đã cho. Mỗi tháng {{clientGender}} sẽ nhận thư cho \${{premium}}. {{capitalize(clientGender)}} có trách nhiệm tự trả. Nếu {{clientGender}} muốn Autopay (tự động trả) hay có câu hỏi, gọi/tin nhắn Thuy Bell 727-280-4563. Cám ơn!
    </p>
    `
});

var app = new Vue({
    el: '#app',
    data: {
        clientName: 'NAME',
        notifType: 'payment',
        clientGender: 'chị',
        company: 'Oscar Insurance',
        premium: '5',
        total: '10',
        paid: false,
        autopay: false,
        validPayment: false,
    },
    computed: {
        dueDate: function() {
            var today = new Date();
            var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
            return lastDayOfMonth.toISOString().substring(0,10);
        },
        formValues: function() {
            return {
                notifType: this.notifType,
                paid: this.paid,
                validPayment: this.validPayment,
                autopay: this.autopay
            }
        }
    },
    methods: {
        capitalize: function(str) {
            return str[0].toUpperCase() + str.slice(1);
        },
        copyText: function(event) {
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
    }
})

/*Vue.component('family-member', {
    props: {
        index: Number
    },
    template: 
        `<fieldset id="member{{index}}" class="memberInfo">
            <legend>Missing Member {{index}}:</legend>
            <div>
                <label for="member{{index}}_name">Name:</label>
                <input type="text" name="member{{index}}_name" id="member{{index}}_name">
            </div>
            <fieldset>
                <legend>Documents:</legend>
                <div>
                    <input name="member{{index}}_docs" type="checkbox" id="member{{index}}_income" value="income"><label for="member{{index}}_income">Income</label>
                </div>
                <div>
                    <input name="member{{index}}_docs" type="checkbox" id="member{{index}}_ssn" value="SSN"><label for="member{{index}}_ssn">SSN</label>
                </div>
                <div>
                    <input name="member{{index}}_docs" type="checkbox" id="member{{index}}_citizenship" value="Naturalization Certificate"><label for="member{{index}}_citizenship">Naturalization Certificate</label>
                </div>
                <div>
                    <input name="member{{index}}_docs" type="checkbox" id="member{{index}}_greencard" value="greencard"><label for="member{{index}}_greencard">Greencard</label>
                </div>
                <div>
                    <input name="member{{index}}_docs" type="checkbox" id="member{{index}}_letter" value="health coverage letter"><label for="member{{index}}_letter">Health Coverage Letter</label>
                </div>
            </fieldset>
        </fieldset>`
})*/