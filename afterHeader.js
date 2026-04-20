fetch("afterHeader.html")
    .then(res=>res.text())
    .then(data =>{
        document.getElementById("after-placeholder").innerHTML=data;
    })
    .catch(err=>console.error("Greška",err));