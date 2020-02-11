var app = new Vue({
    el: '#app',
    data: {
        notifCategory: 'documents',
        paid: false,
        autopay: false,
        validPayment: false,
        clientName: '',
        clientGender: 'chị',
        company: 'Ambetter',
        premium: '5',
        total: '',
        dueDate: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).toISOString().substring(0,10),
        familyMembers: [{ 
            name: '',
            req_income: false,
            req_ssn: false,
            req_citizenship: false,
            req_greencard: false,
            req_letter: false
        }]
    },
    computed: {
        displayDueDate: function() {
            var displayDate = new Date(this.dueDate).toLocaleDateString('en-us', {timeZone: 'UTC'});

            return displayDate;
        },
        displayPremium: function() {
            return this.normalizeDollars(this.premium);
        },
        displayTotal: function() {
            if (this.total == '') {
                return (this.displayPremium*2).toFixed(2);
            }
            else {
                return this.normalizeDollars(this.total);
            }
        },
    },
    methods: {
        normalizeDollars: function(str) {
            return parseFloat(str.replace(/\$/, "")).toFixed(2);
        },
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
        },
        getMemberId: function(index) {
            return `member${index}`;
        }
    }
})

/*Vue.component('family-member', {
    props: {
        index: Number
    },
    template: 
        `<fieldset id="member{{notifValues.index}}" class="memberInfo">
            <legend>Missing Member {{notifValues.index}}:</legend>
            <div>
                <label for="member{{notifValues.index}}_name">Name:</label>
                <input type="text" name="member{{notifValues.index}}_name" id="member{{notifValues.index}}_name">
            </div>
            <fieldset>
                <legend>Documents:</legend>
                <div>
                    <input name="member{{notifValues.index}}_docs" type="checkbox" id="member{{notifValues.index}}_income" value="income"><label for="member{{notifValues.index}}_income">Income</label>
                </div>
                <div>
                    <input name="member{{notifValues.index}}_docs" type="checkbox" id="member{{notifValues.index}}_ssn" value="SSN"><label for="member{{notifValues.index}}_ssn">SSN</label>
                </div>
                <div>
                    <input name="member{{notifValues.index}}_docs" type="checkbox" id="member{{notifValues.index}}_citizenship" value="Naturalization Certificate"><label for="member{{notifValues.index}}_citizenship">Naturalization Certificate</label>
                </div>
                <div>
                    <input name="member{{notifValues.index}}_docs" type="checkbox" id="member{{notifValues.index}}_greencard" value="greencard"><label for="member{{notifValues.index}}_greencard">Greencard</label>
                </div>
                <div>
                    <input name="member{{notifValues.index}}_docs" type="checkbox" id="member{{notifValues.index}}_letter" value="health coverage letter"><label for="member{{notifValues.index}}_letter">Health Coverage Letter</label>
                </div>
            </fieldset>
        </fieldset>`
})*/