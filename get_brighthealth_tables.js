var members = document.querySelectorAll("tbody td:nth-child(2)");
var names = [];
for (var i = 0; i < members.length; i++) {
    names.push(members[i].innerText);
}

console.log(names.join("\n"));

// Get premium amounts

var text = document.querySelector("tbody").innerText;
var regex = /\$\d{1,5}.\d\d/g

console.log(text.match(regex).join("\n"))