
const message=document.getElementById('msg');

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', ()=> {
    const token  = localStorage.getItem('token')
    console.log("token"+token);
    console.log("i am window listner");
    const decodeToken = parseJwt(token)
    console.log(">>>>>>>>>>>>",decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }

    const expenses = axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization" : token} })
    .then(response => {
            response.data.expenses.forEach(expense => {

                addNewExpensetoUI(expense);
            })
       
    }).catch(err => {
        showError(err)
    })
});

function display(data){

    const tbl=` 
    <tr id=${data.id}>   
   <td hidden>${data.id}</td>
    <td>${data.expense}</td>
    <td>${data.category}</td>
    <td>${data.description}</td>
    <td><button type="button" onclick=editexpense('${data.id}','${data.expense}','${data.expense}','${data.description}')>Edit</button></td>
    <td><button type="button" onclick=deletexpense('${data.id}')>Delete</button></td>
  <tr/>`
 
     tbl.innerHTML+=tbl;
}


function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

const downloadexpense=document.getElementById('downloadexpense');
downloadexpense.addEventListener('click',download);

function download() {
    const token = localStorage.getItem('token');
    console.log(" i am download calling");
    axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token}})
    .then((response) => {
        if(response.status === 200){
            console.log(response.data.fileurl);
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.txt';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}

const downloadList=document.getElementById("download-table");

 async function downloadAllFile()
{
    try {
        const token=localStorage.getItem("token");
     const downloadListtb1= await axios.get("http://localhost:3000/expense/downloaddataAllFile",{headers: {"Authorization":token}})
       .then((response)=>{
            if(response.status===200){
                console.log(response);
                for (let index = 0; index < response.data.downloadFileData.length; index++) {
                    console.log('i am download data11');
                    downloadfiledata(response.data.downloadFileData[index]);
                    downloadListtb1.innerHTML=""
                    
                }
            }
       })

    } catch (error) {
        console.log(error);
    }
}

function downloadfiledata(data)
{
    const tbl=`<tr> 
                <td>${data.downloaddate}</td>
                <td>${data.filename}</td>
                <td><button type="button" onclick=downloadFile('${data.filename}')>Download</button></td>
              </tr>`
              downloadListtbl.innerHTML+=tbl;
}

function downloadFile(fileUrl) {
    var url = fileUrl; // replace with your file URL
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Expense.pdf'; // replace with your desired file name
    a.click();
  }

  
document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
         .catch(() => {
            alert('Something went wrong. Try Again!!!')
        })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
   
 });
}