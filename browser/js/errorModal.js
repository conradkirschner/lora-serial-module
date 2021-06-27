
export const showError = (errorMessage) => {
    debugger;
    let isModalShown = false;
    const modal = document.createElement('div');
    modal.classList.add('error-modal-wrapper');
    const closeError = () => {
        modal.innerHTML = '';
        modal.remove();
    }
    const showError = (errorMessage) => {
        modal.innerHTML= '';
        const text = document.createElement('div');
        const closeButton = document.createElement('div');
        closeButton.style.position = 'fixed';
        closeButton.style.top = '0';
        closeButton.style.right = '0';
        closeButton.style.margin = '50px';
        closeButton.style.fontSize = '25px';
        closeButton.style.borderBottom = '1px solid lightgray';
        closeButton.innerHTML = 'Ok, verstanden - close';
        closeButton.addEventListener('click', () => {
            closeError();
        });
        text.innerText = errorMessage;
        modal.appendChild(closeButton);
        modal.appendChild(text);
        document.body.appendChild(modal);
    }
    showError(errorMessage);
}
