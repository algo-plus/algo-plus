import './Modal.css';

const Modal = () => {
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.style.display = 'flex';
    modalHeader.classList.add('modal-header');
    modalHeader.innerHTML = `<h5 class="modal-title">오답 노트 작성</h5>`;

    const buttonClose = document.createElement('button');
    buttonClose.type = 'button';
    buttonClose.classList.add('close');
    buttonClose.id = 'btn-close';
    buttonClose.setAttribute('data-dismiss', 'modal');
    buttonClose.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(buttonClose);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.innerHTML = `<textarea rows="6" cols="50"></textarea>`;

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancel">취소</button>
                           <button type="button" class="btn btn-primary" id="save">저장</button>`;

    // 모달 요소들 body에 결합
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);

    //  취소 버튼을 누르거나 modalBackdrop을 클릭하면 모달창 닫힘
    modalFooter.querySelector('#cancel')?.addEventListener('click', () => {
        closeModal();
    });

    modalBackdrop.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) {
            closeModal();
        }
    });
};

const closeModal = () => {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.remove();
    }
};

export default Modal;
