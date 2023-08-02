
const message=document.getElementById('msg');
function addNewExpense(e){
    e.preventDefault();
    const expenseDetails = {
        expenseamount: e.target.expenseamount.value,
        description: e.target.description.value,
        category: e.target.category.value,
        
    }
    console.log(expenseDetails)
    const token  = localStorage.getItem('token')
      axios.post('http://localhost:3000/expense/addexpense',expenseDetails,  { headers: {"Authorization" : token} })
        .then((response) => {

           
        addNewExpensetoUI(response.data.expense);

    }).catch(err => showError(err))

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

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`,  { headers: {"Authorization" : token} }).then(() => {

            removeExpensefromUI(expenseid);

    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}
function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

const downloadexpense=document.getElementById('uploadexpense');
downloadexpense.addEventListener('click',upload);

function download() {
    const token = localStorage.getItem('token');
    console.log(" i am upload calling");
    axios.get('http://localhost:3000/expense/upload', { headers: {"Authorization" : token}})
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

const uploadList=document.getElementById("upload-table");

 async function uploadAllFile()
{
    try {
        const token=localStorage.getItem("token");
     const uploadListtb1= await axios.get("http://localhost:3000/expense/downloaddataAllFile",{headers: {"Authorization":token}})
       .then((response)=>{
            if(response.status===200){
                console.log(response);
                for (let index = 0; index < response.data.uploadFileData.length; index++) {
                    console.log('i am upload data11');
                    uploadfiledata(response.data.downloadFileData[index]);
                    uploadListtb1.innerHTML=""
                    
                }
            }
       })

    } catch (error) {
        console.log(error);
    }
}

function uploadfiledata(data)
{
    const tbl=`<tr> 
                <td>${data.uploaddate}</td>
                <td>${data.filename}</td>
                <td><button type="button" onclick=uploadFile('${data.filename}')>Upload</button></td>
              </tr>`
              uploadListtbl.innerHTML+=tbl;
}

function uploadFile(fileUrl) {
    var url = fileUrl; 
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Expense.pdf'; 
    a.click();
  }

  
