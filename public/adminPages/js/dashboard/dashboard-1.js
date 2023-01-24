
window.addEventListener("load",function(){
    const ctx = document.getElementById('myChart');
            
            console.log("fetch");
            fetch('/admin/chart',{
                method:'POST',
                headers:{'Content-Type':'application/json'}
            }).then(res=>res.json()).then(data=>{
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Delivered', 'shipped', 'ordered'],
      datasets: [{
        label: ' of orders',
        data: data.value,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
})
})

function download(){
    const canvas=document.getElementById("myChart")
    const canvasImage=canvas.toDataURL('image/jpeg', 1.0);
    let pdf=new jsPDF()
    pdf.addImage(canvasImage,'JPEG',15,15,150,150);
    pdf.text(10,10, "the order managment list")
    // console.log(imageLink.herf);
    // imageLink.click();
    pdf.save('orderRecord.pdf');
}