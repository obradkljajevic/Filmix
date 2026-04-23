fetch("afterHeader.html")
    .then(res=>res.text())
    .then(data =>{
        document.getElementById("after-placeholder").innerHTML=data;
        document.dispatchEvent(new Event("afterHeaderLoaded"));
    })
    .catch(err=>console.error("Greška",err));