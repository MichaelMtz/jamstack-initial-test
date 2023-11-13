

// localStorage.setItem('leadgen-geolocation', JSON.stringify(locationData));

const setupModalDisplay = () => {
  const body = document.querySelector("body");
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-button");
  let isOpened = false;
  
  const openModal = () => {
    modal.classList.add("is-open");
    body.style.overflow = "hidden";
    window.snoUser.displayModal = false;
    //localStorage.setItem('sno-user', JSON.stringify(window.snoUser));
  };
  
  const closeModal = () => {
    modal.classList.remove("is-open");
    body.style.overflow = "initial";
    window.snoUser.displayModal = false;
    localStorage.setItem('sno-user', JSON.stringify(window.snoUser));
  };
  
  const saveUser =  (form) => {
    
    const url = 'http://feeds.snocountry.net/proof-of-concept/ping.php';
    //url = 'http://localhost/zdevelop/templates/modals/ping-sno.php';
    const data = form;
    //   firstName : formData.firstName
    //   lastName : formData.last
    //   email : 'test@email.com',
    //   state : 'NM',
    //   uuid : window.snoUser.uuid
    // };
    console.log('-- data: ',form);
    const user = new URLSearchParams(data);
    fetch(url,{
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        //"Content-Type": "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: user, // body data type must match "Content-Type" header
    }).then(response => {      
      return response.json();
    }).then(data => {
      console.log(data);
      
      //if (data.status) {
      document.querySelector('.signup-result').classList.add('show');
      document.querySelector('.input-container').classList.add('hide');
      window.snoUser.displayModal = false;
      window.snoUser.subscribed = true;
      localStorage.setItem('sno-user', JSON.stringify(window.snoUser));
      //} 
      setTimeout(()=> {
        closeModal();
      },3500);
      
    }).catch( (e) => { console.error('Error waiting for ping :',e);});
    
  };
  
  
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight / 2 && !isOpened) {
      isOpened = true;
      openModal();
    }
  });
  
  closeButton.addEventListener("click", closeModal);
  
  document.onkeydown = evt => {
    evt = evt || window.event;
    evt.keyCode === 27 ? closeModal() : false;
  };
  document.querySelector('#sno-modal').addEventListener('click',(e) => {  
    if (e.target.id === 'sno-modal') {
      closeModal();
    }
  });
  
  const showInputError = (elInput,action = 'show') => {
    if (action === 'show') { 
      elInput.closest('.input-block').classList.add('error');
    } else {
      elInput.closest('.input-block').classList.remove('error');
    }
  };
  
  const validateModalForm = () => {
    const form = {
      status : false,
      data : {
        firstName : 'Michael',
        lastName : 'Martinez',
        email : 'test@email.com',
        state : 'NM',
        uuid: window.snoUser.uuid
      }
    };
    let formStatus = true;
    document.querySelectorAll('#sno-modal input').forEach(iterInput => {
      const iterTempstr = iterInput.value.trim();
      switch (iterInput.id) {
        case 'email'	: 
          if (iterTempstr.length > 0) {
            const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (iterTempstr.match(emailformat)) {
              form.data.email = iterTempstr;
              showInputError(iterInput, 'hide');
            }
          } else {
            showInputError(iterInput,'show');
            formStatus = false;
          }
          break;
      
        default: 
          if (iterTempstr.length > 0) {
            form.data[iterInput.id] = iterTempstr;
            showInputError(iterInput,'hide');
          } else {
            showInputError(iterInput,'show');
            formStatus = false;
          }
          break;
      }
    });
    form.status = formStatus;
    return form;
  };
  
  document.querySelector('#modal-submit').addEventListener('click',(e) => {
    const form = validateModalForm();
    if (form.status) {
      saveUser(form.data);
      
    }
  });
  document.querySelectorAll('#sno-modal input').forEach(iterInput => {
    iterInput.addEventListener('blur',() => {
      validateModalForm();
    });
  });
  //let  validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
};

window.snoUser;
const checkUser = () => {
  let user = localStorage.getItem('sno-user');
  
  if (user) {
    user = JSON.parse(user);
    if (!user.displayModal) {
      const now = new Date();
      if (now.getTime() > user.redisplayDate) {
        user.displayModal = true;
        const threeWeeks = new Date(now);
        threeWeeks.setDate(threeWeeks.getDate() + 21);
        user.redisplayDate = threeWeeks.getTime();
        localStorage.setItem('sno-user', JSON.stringify(user));
      }
    }
    console.info('** user exists:',user);
  } else {
    const now = new Date();
    const threeWeeks = new Date(now);
    threeWeeks.setDate(threeWeeks.getDate() + 21);
    
    user = {
      uuid: crypto.randomUUID(),
      displayModal: true,
      subscribed: false,
      redisplayDate: threeWeeks.getTime()
    };
    localStorage.setItem('sno-user', JSON.stringify(user));
  }
  window.snoUser = user;
  return user;
};

const checkPage = () => {
  const validPagesRegex = /\/snow-report\/(colorado|maine|vermont|new-hampshire|california\/)/;
  return location.pathname.match(validPagesRegex) ? true : false;
};

const setupSnoActions = () => {
  const user = checkUser();
  const validPage = checkPage();
  console.log(`-- vp:${validPage}`,user);
  if (user.displayModal && validPage) {
    setupModalDisplay();
    console.log('** display modal is valid');
  }
  
};




document.addEventListener('DOMContentLoaded',()=> {
  _log('snoModal processing...');
  setupSnoActions();
  //saveUser()
});