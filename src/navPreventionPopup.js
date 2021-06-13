const createNavPreventionInfoPopup = (evaluate) => {
  return evaluate(() => {
    const navPopup = document.createElement('aside');
    navPopup.textContent = 'Prevented from navigating outside of YouTube';
    navPopup.style.color = 'white';
    navPopup.style.fontWeight = 'bold';
    navPopup.style.fontSize = '2rem';
    navPopup.style.backgroundColor = 'black';
    navPopup.style.border = '4px solid red';
    navPopup.style.position = 'fixed';
    navPopup.style.top = '0px';
    navPopup.style.left = '50%';
    navPopup.style.transform = 'translate(-50%)';
    navPopup.style.zIndex = '99999';
    navPopup.style.width = '75vw';
    navPopup.style.height = '75px';
    navPopup.style.textAlign = 'center';
    navPopup.style.display = 'flex';
    navPopup.style.justifyContent = 'center';
    navPopup.style.alignItems = 'center';

    document.body.appendChild(navPopup);

    setTimeout(() => navPopup.remove(), 3000);
  });
};

module.exports = createNavPreventionInfoPopup;
