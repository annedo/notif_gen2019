Vue.component('family-member', {
    props: {
        member: Object
    },
    methods: {
        createLabel: function(labelBase) { 
            var label = labelBase.replace(/[^A-Za-z0-9_:.-]/g, '')
            return `${this.member.memberId}_${label}`
        },
        checkRequired: function(event) {
            var checkboxes = document.getElementsByClassName(event.target.className)
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    this.removeRequired(checkboxes);
                    return false;
                }
                else {
                    checkboxes[i].setAttribute('required', '');
                }
            }
            return true;
        },
        removeRequired: function(checkboxes) {
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].removeAttribute('required');
            }
        }
    },
    template:`
    <fieldset :id="member.memberId" class="memberInfo">
        <legend>Missing Member {{member.memberIndex}}:</legend>
        <div>
            <label :for="createLabel('name')">Name:</label>
            <input type="text" :id="createLabel('name')" :required="member.memberIndex != 1" v-model="member.name"/>
        </div>
        <fieldset>
            <legend>Documents:</legend>
            <div v-for="(value, req) in member.req_docs">
                <input type="checkbox" 
                       :id="createLabel(req)" 
                       :class="createLabel('checkbox')"
                       :value="req" 
                       v-model="member.req_docs[req]"
                       :required="$root.notifCategory === 'documents'"
                       v-on:change="checkRequired($event)"/>
                <label :for="createLabel(req)">{{req}}</label>
            </div>
            <div>
                <input type="checkbox"
                       :id="createLabel('custom_docs')"
                       :class="createLabel('checkbox')"
                       :value="false"
                       v-model="member.custom_docs"
                       :required="$root.notifCategory === 'documents'"
                       v-on:change="checkRequired($event)" />
                <label :for="createLabel('custom_docs')">Other</label>
            </div>
            <div v-show="member.custom_docs">
                <label :for="createLabel('other_en')">English:</label>
                <input type="text"
                       :id="createLabel('other_en')"
                       v-model="member.custom_values.en" />
            </div>
            <div v-show="member.custom_docs">
                <label :for="createLabel('other_vn')">Vietnamese:</label>
                <input type="text"
                       :id="createLabel('other_vn')"
                       v-model="member.custom_values.vn" />
            </div>
        </fieldset>
        <button v-if="member.memberIndex != 1" type="button" v-on:click="$emit('remove', member.memberIndex)">x Remove Member</button>  
    </fieldset>
    `
});

function defaultFamilyMember(memberIndex = 1) {
    return {
        name: '',
        memberIndex: memberIndex,
        memberId: `member${memberIndex}`,
        req_docs: {
            'income': false,
            'SSN (signed)': false,
            'Naturalization Certificate': false,
            'Greencard (front and back)': false,
            'Health Coverage Letter': false,
        },
        custom_docs: false,
        custom_values: {
            vn: '',
            en: ''
        }
    }
}

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
        dueDate: '',
        newdocsName: '',
        newdocsGender: 'chị',
        newdocsSsn: false,
        newdocsIncome: false,
        familyMembers: [defaultFamilyMember()]
    },
    mounted: function() {
        this.dueDate = this.defaultDueDate
    },
    computed: {
        defaultDueDate: function() {
            var today = new Date();
            var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).toISOString().substring(0,10);
            return lastDayOfMonth;
        },
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
        addFamilyMember: function() {
            var memberIndex = this.familyMembers.length + 1;
            this.familyMembers.push(defaultFamilyMember(memberIndex));
            document.getElementById('member1_name').setAttribute('required', '');
        },
        removeFamilyMember: function(memberIndex) {
            // memberIndex = index + 1 so people don't read "Member 0"
            this.familyMembers.splice(memberIndex - 1, 1);
            // Reset index numbering
            for (var i = 0; i < this.familyMembers.length; i++) {
                this.familyMembers[i].memberIndex = i+1;
                this.familyMembers[i].memberId =  `member${i + 1}`;
            }
            if (this.familyMembers.length == 1) {
                document.getElementById('member1_name').removeAttribute('required');
            }
        },
        normalizeDollars: function(str) {
            return parseFloat(str.replace(/\$/, "")).toFixed(2);
        },
        capitalize: function(str) {
            return str[0].toUpperCase() + str.slice(1);
        },
        copyText: function(copyIdList, event) {
            let button = event.target;
            let form = document.getElementById(button.getAttribute('form'));
            if (form.checkValidity() == false) {
                button.click()
                return;
            }
            else {
                var text = [];
                for (var i = 0; i < copyIdList.length; i++) {
                    text.push(document.getElementById(copyIdList[i]).innerText);
                }
                console.log(printText);
                var printText = text.join('\n---\n\n')
                let tempInput = document.createElement("textarea")
                tempInput.value = printText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
            }
            /*let textId = button.id.replace("Button", "");
            let text = document.getElementById(textId).innerText;
            let tempInput = document.createElement("textarea")
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);*/
        },
        filterReqDocs: function(memberObj, language="EN") {
            var translation = {
                "income": "income",
                "SSN (signed)": "thẻ SSN (ký tên)",
                "Naturalization Certificate": "giấy quốc tịch",
                "Greencard (front and back)": "thẻ xanh (trước và sau)",
                "Health Coverage Letter": "Health Coverage Letter"
            }
            var reqDocs = [];
            for (doc in memberObj.req_docs) {
                if (memberObj.req_docs[doc] === true) {
                    if (language == 'VN') {
                        reqDocs.push(translation[doc]);
                    }
                    else {
                        reqDocs.push(doc)
                    }
                }
            }
            if (memberObj.custom_docs) {
                if (language == 'VN') {
                    reqDocs.push(memberObj.custom_values.vn);
                }
                else {
                    reqDocs.push(memberObj.custom_values.en)
                }
            }
            return reqDocs.join(', ');
        },
        resetForm: function() {
            this.notifCategory = 'documents';
            this.paid = false;
            this.autopay = false;
            this.validPayment = false;
            this.clientName = '';
            this.clientGender = 'chị';
            this.company = 'Ambetter';
            this.premium = '5';
            this.total = '';
            this.dueDate = this.defaultDueDate;
            this.familyMembers = [defaultFamilyMember()]
            document.getElementById('member1_name').removeAttribute('required')
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