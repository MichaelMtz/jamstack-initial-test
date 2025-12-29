document.addEventListener('DOMContentLoaded',()=> {
  
  document.getElementById('copyright-year').innerHTML = new Date().getFullYear();
  const elRights = document.getElementById('rights');
  if (elRights) {    
    const currentYear = new Date().getFullYear(); 
    elRights.content = `Copyright © ${currentYear}. All Rights Reserved.`
  }
});
