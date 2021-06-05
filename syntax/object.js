var members = ['egoing', 'k8805', 'dudwns'];
console.log(members[1]);    // k8805

var i = 0;
while(i < members.length) {
    console.log('array loop', members[i]);
    i = i + 1;
}

var roles = {
    'programmer':'egoing',
    'designer':'k8805',
    'manager':'dudwns'
}

console.log(roles.designer);    // k8805
console.log(roles['designer']);    // k8805
for(var n in roles) {
    console.log('object => ', n, 'value => ', roles[n]);
}