// start setInterval

let teamIndex = 0;

// for team touch slider
let teamDirection = 1;
const teamTouchSliderResultFun = ()=>{
    if(teamDirection === 1){
        teamIndex++;
        if(teamIndex >= teamTouchSliderItems.length - 1) teamDirection = -1;
    }else if(teamDirection === -1){
        teamIndex--;
        if(teamIndex <= 0) teamDirection = 1;
    }

    if(teamIndex >= teamTouchSliderItems.length) teamIndex = teamTouchSliderItems.length - 2;
    if(teamIndex <= -1) teamIndex = 1;

    teamTouchSliderMain(teamIndex);
};
let teamTouchSliderResult = setInterval(teamTouchSliderResultFun,3000);

// end setInterval 

// start clearInterval

const teamTouchSliderCon = document.querySelector('#team-section .touch-slider-con');

const stopFun = (value,result,fun,time) => {
    value.addEventListener('mouseenter',()=>{
        // console.log('moveenter',time);
        clearInterval(result);
    });
    
    value.addEventListener('mouseleave',()=>{
        // console.log('moveleave',time);
        clearInterval(result);
        result = setInterval(fun,time);
    });

    value.addEventListener('touchstart',()=>{
        // console.log('touchstart',time);
        clearInterval(result);
    });

    value.addEventListener('touchend',()=>{
        // console.log('touchend',time);
        clearInterval(result);
        result = setInterval(fun,time);
    });
};

stopFun(teamTouchSliderCon,teamTouchSliderResult,teamTouchSliderResultFun,3000); // for team touch slider

// end clearInterval

// Start Team Section

const teamTouchSliderInner = document.querySelector("#team-section .touch-slider-inner"),
    teamTouchSliderItems = [...document.querySelectorAll("#team-section .touch-slider-item")],
    teamCarouselCards = document.querySelectorAll('#team-section .card');

let galleryCurrentIndex = 0,
    galleryIsPressed = false,
    galleryStartX = 0,
    galleryCurrentTranslate = 0,
    galleryPreviousTranslate = 0,
    galleryAniID = 0;

teamTouchSliderItems.forEach((value,index)=>{
    value.addEventListener('dragstart', e => e.preventDefault());
    value.addEventListener('contextmenu', e => e.preventDefault());

    value.addEventListener('touchstart', galleryTouchStart(index));
    value.addEventListener('touchend', galleryTouchEnd);
    value.addEventListener('touchmove', galleryTouchMove);

    value.addEventListener('mousedown', galleryTouchStart(index));
    value.addEventListener('mouseup', galleryTouchEnd);
    value.addEventListener('mouseleave', galleryTouchEnd);
    value.addEventListener('mousemove', galleryTouchMove);
});

function teamTouchSliderMain(index){
    teamIndex = index;

    galleryCurrentTranslate = index * -teamTouchSliderInner.getBoundingClientRect().width;
    galleryPreviousTranslate = galleryCurrentTranslate;
    gallerySetX();

    const activeTags = document.querySelectorAll('#team-section .touch-slider-con .clicked-active');
    const arr = [
        teamTouchSliderItems[index],
        teamCarouselCards[index]
    ];
    classToggle(activeTags,arr);
};
teamTouchSliderMain(0);

function galleryTouchStart(index){
    return function(event){
        // console.log(teamDirection);
        galleryIsPressed = true;
        galleryCurrentIndex = index;
        galleryStartX = galleryCountX(event);

        galleryAniID = requestAnimationFrame(galleryAni);
        teamTouchSliderInner.classList.add('grabbing');
    };
};

function galleryTouchEnd(){
    galleryIsPressed = false;
    cancelAnimationFrame(galleryAni);
    teamTouchSliderInner.classList.remove('grabbing');
    
    let difference = galleryCurrentTranslate - galleryPreviousTranslate;
    // console.log(difference);
    if(difference < -100 && galleryCurrentIndex < teamTouchSliderItems.length - 1) galleryCurrentIndex++;
    if(difference > 100 && galleryCurrentIndex > 0) galleryCurrentIndex--;
    // console.log(galleryCurrentIndex);

    teamTouchSliderMain(galleryCurrentIndex);
};

function galleryTouchMove(event){
    if(galleryIsPressed){ // for mousemove
        let moveX = galleryCountX(event);
        galleryCurrentTranslate = galleryPreviousTranslate + moveX - galleryStartX; 
    };
};

function galleryCountX(event){
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
};

function galleryAni(){
    gallerySetX();
    if(galleryIsPressed) requestAnimationFrame(galleryAni);
};

function gallerySetX(index){
    teamTouchSliderInner.style.transform = `translate(${galleryCurrentTranslate}px)`;
};

// End Team Section

// Start Galley Section 

const galleryImgCon = document.querySelector("#gallery-section .gallery-img-con"),
    galleryNavItems = [...document.querySelectorAll("#gallery-section .gallery-nav-item")],
    galleryNavBgColors = document.querySelectorAll("#gallery-section .gallery-nav-bg-color");

let filterGalleryArr, currentGalleryIndex, 
    newViewGalleryNumTag, newViewGalleryBackgroundTag, newViewGalleryImgTag, // to change tags
    getGalleryImg; // to select tag

let galleryActiveIndex, galleryResult;
function toToggleGalleryNavItem(index,xValue){
    if(galleryActiveIndex === index){
        galleryNavBgColors[galleryActiveIndex].style.transform = `translateX(0%)`;
    }else{
        galleryNavBgColors[galleryActiveIndex].style.transform = `translateX(${xValue}%)`;
    }

    const activeTags = document.querySelectorAll("#gallery-section .gallery-nav-item.clicked-active");
    const arr = [ galleryNavItems[galleryActiveIndex] ];
    classToggle(activeTags,arr);
}

function toSelectGalleryNavItem(index){
    clearInterval(galleryResult);
    
    const activeTag = document.querySelector("#gallery-section .gallery-nav-item.clicked-active");
    galleryActiveIndex = galleryNavItems.findIndex(value => value === activeTag);
    if(galleryActiveIndex === -1) galleryActiveIndex = 0;

    if(galleryActiveIndex < index){
        galleryResult = setInterval(()=>{
            toToggleGalleryNavItem(index,100);
            galleryActiveIndex++;
            if(galleryActiveIndex > index) clearInterval(galleryResult);
        },100);
    }else if(galleryActiveIndex > index){ 
        galleryResult = setInterval(()=>{
            toToggleGalleryNavItem(index,-100);
            galleryActiveIndex--;
            if(galleryActiveIndex < index) clearInterval(galleryResult);
        },100);
    }else{
        toToggleGalleryNavItem(index,100);
    }
    
    const getDataFilter = galleryNavItems[index].getAttribute('data-filter');
    const getDataGrid = galleryNavItems[index].getAttribute('data-grid');
    
    toAddGalleryImg(getDataFilter, getDataGrid);
};

toSelectGalleryNavItem(0);

galleryNavItems.forEach((value, index) => {
    value.addEventListener('click', () => toSelectGalleryNavItem(index));
});

function toAddGalleryImg(getDataFilter, getDataGrid){
    galleryImgCon.innerHTML = "";
    galleryImgCon.className = "gallery-img-con " + getDataGrid;

    if(getDataFilter === "all"){
        filterGalleryArr = galleryArr;
    }else{
        filterGalleryArr = galleryArr.filter(value => value.type === getDataFilter);
    }

    for(let x = 0; x < filterGalleryArr.length; x++){
        const galleryImgTag = document.createElement("div");
        galleryImgTag.className = "css-img img-hover-effect gallery-img reveal-delay";
        galleryImgTag.setAttribute('onclick', `toViewGalleryImg(${x})`);
        galleryImgTag.style.cssText = `
            background-image: url('${filterGalleryArr[x].src}');
            grid-area: gallery${x+1};
        `;
        galleryImgCon.appendChild(galleryImgTag);
    }
}

function toViewGalleryImg(index){
    currentGalleryIndex = index;

    newViewGalleryBackgroundTag = document.createElement('div');
    newViewGalleryBackgroundTag.className = 'remove-gallery view-gallery-background';
    newViewGalleryBackgroundTag.setAttribute('onclick','closeViewGalleryBackground(event)');

    newViewGalleryNumTag = document.createElement('div');
    newViewGalleryNumTag.className = 'view-gallery-number';

    const newViewGalleryImgBtnConTag = document.createElement("div")
    newViewGalleryImgBtnConTag.className = "view-gallery-img-btn-con";
 
    newViewGalleryImgTag = document.createElement('img');
    newViewGalleryImgTag.className = 'view-gallery-img';
    
    const newViewGalleryBtnConTag = document.createElement('div');
    newViewGalleryBtnConTag.className = 'view-gallery-btn-con';

    const newGalleryPrevBtnTag = document.createElement("button");
    newGalleryPrevBtnTag.className = "btn btn2D btn2D-prev";
    newGalleryPrevBtnTag.setAttribute('onclick','toChangeGalleryIndex(-1)');

    const newGalleryNextBtnTag = document.createElement("button");
    newGalleryNextBtnTag.className = "btn btn2D btn2D-next";
    newGalleryNextBtnTag.setAttribute('onclick','toChangeGalleryIndex(1)');

    newViewGalleryBtnConTag.append(newGalleryPrevBtnTag,newGalleryNextBtnTag);
    newViewGalleryImgBtnConTag.append(newViewGalleryImgTag,newViewGalleryBtnConTag);
    newViewGalleryBackgroundTag.append(newViewGalleryNumTag,newViewGalleryImgBtnConTag);

    document.body.appendChild(newViewGalleryBackgroundTag);

    toChangeGalleryMain(index);
};

function closeViewGalleryBackground(event){
    if(event.target === newViewGalleryBackgroundTag){
        [...document.querySelectorAll('.remove-gallery')].forEach(value => value.remove());
    }
}

function toChangeGalleryMain(index){
    getGalleryImg = document.querySelectorAll('.gallery-img');

    const getElementProperty = window.getComputedStyle(getGalleryImg[index]);
    const getElementValue = getElementProperty.getPropertyValue('background-image');
    const splitValue = getElementValue.split("/img/");
    const replaceValue = splitValue[1].replace('")','');

    newViewGalleryImgTag.setAttribute('src',`./assets/img/${replaceValue}`);

    newViewGalleryNumTag.innerText = index + 1;
}

function toChangeGalleryIndex(direction){
    if(direction == 1){
        currentGalleryIndex = (currentGalleryIndex + 1) % getGalleryImg.length;
    }else{
        currentGalleryIndex = (currentGalleryIndex - 1 + getGalleryImg.length) % getGalleryImg.length;
    }

    toChangeGalleryMain(currentGalleryIndex);
}

// End Gallery Section