Vue.component('notification', {
    props: ['formValues'],
    template: `
        <p>Chào {{formValues.clientName}}</p>`
})

var app = new Vue({
    el: '#app',
    data: {
        formValues: {
            clientName: '',
            notifType: 'documents',
            clientGender: 'female',
            company: 'Ambetter',
            premium: '',
            total: '',
            paid: '',
            autopay: '',
            validPayment: ''
        }
    },
    computed: {
        dueDate: () => {
            var today = new Date();
            var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
            return lastDayOfMonth.toISOString().substring(0,10);
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